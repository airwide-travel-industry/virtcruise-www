import { authRequest } from '../auth/auth-api.js';
import { authenticationProvider } from '../auth/authentication-provider.js';
import { createMemoryCache } from '../repositories/base-repository.js';

const cache = createMemoryCache({ ttl: 60_000 });
const pendingReads = new Map();
const STORAGE_PREFIX = 'virtcruise.portal.v1';

function scopedKey(user, resource) {
  return `${STORAGE_PREFIX}.${user.id}.${resource}`;
}

function storageFor(resource) {
  return ['travellers', 'profileDraft'].includes(resource) ? sessionStorage : localStorage;
}

function readLocal(user, resource, fallback) {
  try {
    return JSON.parse(storageFor(resource).getItem(scopedKey(user, resource))) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(user, resource, value) {
  storageFor(resource).setItem(scopedKey(user, resource), JSON.stringify(value));
  cache.clear(resource);
  return value;
}

function collection(value) {
  if (Array.isArray(value)) return value;
  return value?.content || value?.items || value?.data || [];
}

async function protectedRequest(path, options) {
  return authenticationProvider.withAccess(() => authRequest(path, options));
}

async function cachedRead(key, loader, { refresh = false } = {}) {
  if (!refresh) {
    const existing = cache.get(key);
    if (existing !== undefined) return existing;
    if (pendingReads.has(key)) return pendingReads.get(key);
  }
  const request = Promise.resolve().then(loader);
  pendingReads.set(key, request);
  try {
    return cache.set(key, await request);
  } finally {
    if (pendingReads.get(key) === request) pendingReads.delete(key);
  }
}

function unavailable(error, capability) {
  if ([403, 404].includes(error?.status)) {
    return { items: [], unavailable: true, capability, error: null };
  }
  throw error;
}

export function createPortalRepository(user) {
  const readOwned = (key, loader, options) =>
    cachedRead(`${user.id}:${key}`, loader, options);

  async function profile({ refresh = false } = {}) {
    if (!user.customerId) return null;
    return readOwned(
      'profile',
      () => protectedRequest(`/api/v1/customers/${encodeURIComponent(user.customerId)}`),
      { refresh }
    );
  }

  async function quotes({ page = 0, size = 100, refresh = false } = {}) {
    const key = `quotes:${page}:${size}`;
    if (!user.customerId) return { items: [], unavailable: true, capability: 'quotes' };
    try {
      return await readOwned(key, async () => {
        const value = await protectedRequest(
          `/api/v1/customers/${encodeURIComponent(user.customerId)}/quotes?page=${page}&size=${size}`
        );
        return { items: collection(value), page: value?.page ?? page, total: value?.totalElements ?? collection(value).length };
      }, { refresh });
    } catch (error) {
      return unavailable(error, 'quotes');
    }
  }

  async function quote(id, { refresh = false } = {}) {
    const key = `quote:${id}`;
    try {
      return await readOwned(
        key,
        () => protectedRequest(`/api/v1/quotes/${encodeURIComponent(id)}/details`),
        { refresh }
      );
    } catch (error) {
      if ([403, 404].includes(error?.status)) return null;
      throw error;
    }
  }

  async function acceptQuote(id) {
    const value = await protectedRequest(`/api/v1/quotes/${encodeURIComponent(id)}/accept`, {
      method: 'POST'
    });
    cache.clear();
    return value;
  }

  const localCollection = resource => ({
    list: () => readLocal(user, resource, []),
    save(item) {
      const values = readLocal(user, resource, []);
      const now = new Date().toISOString();
      const saved = {
        ...item,
        id: item.id || crypto.randomUUID(),
        createdAt: item.createdAt || now,
        updatedAt: now
      };
      const index = values.findIndex(value => value.id === saved.id);
      if (index >= 0) values[index] = saved;
      else values.unshift(saved);
      writeLocal(user, resource, values);
      return saved;
    },
    remove(id) {
      return writeLocal(user, resource, readLocal(user, resource, []).filter(value => value.id !== id));
    }
  });

  const travellers = localCollection('travellers');
  const notifications = localCollection('notifications');

  return Object.freeze({
    profile,
    quotes,
    quote,
    acceptQuote,
    async trips() {
      const result = await quotes();
      const booked = result.items.filter(item => ['BOOKED', 'COMPLETED', 'CANCELLED'].includes(String(item.status).toUpperCase()));
      const items = await Promise.all(booked.map(async item => {
        try {
          return { ...item, ...(await quote(item.id || item.quoteId) || {}) };
        } catch {
          return item;
        }
      }));
      return {
        ...result,
        items
      };
    },
    async trip(id) {
      return quote(id);
    },
    async bookings({ page = 0, size = 100, refresh = false } = {}) {
      const key = `bookings:${page}:${size}`;
      try {
        return await readOwned(key, async () => {
          const value = await protectedRequest(`/api/v1/bookings?page=${page}&size=${size}`);
          const result = {
            items: collection(value),
            page: value?.page ?? page,
            total: value?.totalElements ?? collection(value).length
          };
          syncBookingNotifications(result.items);
          return result;
        }, { refresh });
      } catch (error) {
        return unavailable(error, 'bookings');
      }
    },
    async booking(id, { refresh = false } = {}) {
      try {
        return await readOwned(
          `booking:${id}`,
          () => protectedRequest(`/api/v1/bookings/${encodeURIComponent(id)}`),
          { refresh }
        );
      } catch (error) {
        if ([403, 404].includes(error?.status)) return null;
        throw error;
      }
    },
    async createBooking(quoteId) {
      const value = await protectedRequest('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Idempotency-Key': `booking-create-${quoteId}` },
        body: JSON.stringify({ quoteId })
      });
      cache.clear();
      syncBookingNotifications([value.booking || value]);
      return value;
    },
    async acceptBooking(id) {
      const value = await protectedRequest(`/api/v1/bookings/${encodeURIComponent(id)}/accept`, {
        method: 'POST'
      });
      cache.clear();
      syncBookingNotifications([value.booking || value]);
      return value;
    },
    async cancelBooking(id, reason) {
      const value = await protectedRequest(`/api/v1/bookings/${encodeURIComponent(id)}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
      cache.clear();
      syncBookingNotifications([value.booking || value]);
      return value;
    },
    travellers,
    notifications: {
      ...notifications,
      markRead(id, read = true) {
        const item = notifications.list().find(value => value.id === id);
        return item ? notifications.save({ ...item, read }) : null;
      },
      markAllRead() {
        return writeLocal(user, 'notifications', notifications.list().map(item => ({ ...item, read: true })));
      }
    },
    preferences: {
      get: () => readLocal(user, 'preferences', {
        interests: [], newsletter: false, marketingConsent: false,
        currency: 'USD', language: 'English', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }),
      save: value => writeLocal(user, 'preferences', { ...value, updatedAt: new Date().toISOString() })
    },
    profileDraft: {
      get: () => readLocal(user, 'profileDraft', {}),
      save: value => writeLocal(user, 'profileDraft', { ...value, updatedAt: new Date().toISOString() })
    },
    clearCache: () => cache.clear()
  });

  function syncBookingNotifications(values) {
    const supported = {
      DEPOSIT_PENDING: ['PAYMENT_REMINDER', 'Deposit requested', 'Your booking deposit is ready for review.'],
      CONFIRMED: ['BOOKING_CONFIRMED', 'Booking confirmed', 'Your Virtcruise booking is confirmed.'],
      READY_TO_TRAVEL: ['TRAVEL_REMINDER', 'Ready to travel', 'Your journey is ready. Review your itinerary.'],
      CANCELLED: ['BOOKING_CANCELLED', 'Booking cancelled', 'Your booking cancellation has been recorded.']
    };
    const existing = notifications.list();
    let changed = false;
    values.forEach(value => {
      const status = String(value?.status || '').toUpperCase();
      const definition = supported[status];
      const bookingId = value?.id;
      if (!bookingId) return;
      const add = (id, type, title, message) => {
        if (existing.some(item => item.id === id)) return;
        existing.unshift({
          id, type, title, message, bookingId, read: false,
          createdAt: value.createdAt || new Date().toISOString()
        });
        changed = true;
      };
      add(`booking-${bookingId}-created`, 'BOOKING_CREATED',
        'Booking created', `${value.bookingReference || 'Your booking'} is now in My Bookings.`);
      if (definition) {
        add(`booking-${bookingId}-${status}`, ...definition);
      }
    });
    if (changed) writeLocal(user, 'notifications', existing);
  }
}
