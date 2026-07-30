import { createMemoryCache } from '../repositories/base-repository.js';
import { financialRequest } from './financial-api-client.js';
import { financialMappers, mapPage } from './financial-model.js';

const cache = createMemoryCache({ ttl: 30_000 });
const pending = new Map();

async function read(key, loader, { refresh = false } = {}) {
  if (!refresh) {
    const stored = cache.get(key);
    if (stored !== undefined) return stored;
    if (pending.has(key)) return pending.get(key);
  }
  const request = Promise.resolve().then(loader);
  pending.set(key, request);
  try {
    const value = await request;
    cache.set(key, value);
    return value;
  } finally {
    if (pending.get(key) === request) pending.delete(key);
  }
}

function pagePath(resource, { page = 0, size = 20 } = {}) {
  const parameters = new URLSearchParams({ page: String(page), size: String(size) });
  return `/api/v1/financial/${resource}?${parameters}`;
}

export function createFinancialRepository() {
  return Object.freeze({
    account(currency, options = {}) {
      const code = String(currency).toUpperCase();
      return read(`account:${code}`, async () =>
        financialMappers.account(await financialRequest(
          `/api/v1/financial/accounts/me?currency=${encodeURIComponent(code)}`
        )), options);
    },
    balance(currency, options = {}) {
      const code = String(currency).toUpperCase();
      return read(`balance:${code}`, async () =>
        financialMappers.account(await financialRequest(
          `/api/v1/financial/balance?currency=${encodeURIComponent(code)}`
        )), options);
    },
    invoices(options = {}) {
      const { page = 0, size = 20 } = options;
      return read(`invoices:${page}:${size}`, async () =>
        mapPage(await financialRequest(pagePath('invoices', options)), financialMappers.invoice), options);
    },
    invoice(id, options = {}) {
      return read(`invoice:${id}`, async () =>
        financialMappers.invoice(await financialRequest(
          `/api/v1/financial/invoices/${encodeURIComponent(id)}`
        )), options);
    },
    payments(options = {}) {
      const { page = 0, size = 20 } = options;
      return read(`payments:${page}:${size}`, async () =>
        mapPage(await financialRequest(pagePath('payments', options)), financialMappers.payment), options);
    },
    receipts(options = {}) {
      const { page = 0, size = 20 } = options;
      return read(`receipts:${page}:${size}`, async () =>
        mapPage(await financialRequest(pagePath('receipts', options)), financialMappers.receipt), options);
    },
    refunds(options = {}) {
      const { page = 0, size = 20 } = options;
      return read(`refunds:${page}:${size}`, async () =>
        mapPage(await financialRequest(pagePath('refunds', options)), financialMappers.refund), options);
    },
    deposits(accountId, options = {}) {
      const { page = 0, size = 20 } = options;
      const parameters = new URLSearchParams({
        accountId,
        page: String(page),
        size: String(size)
      });
      return read(`deposits:${accountId}:${page}:${size}`, async () =>
        mapPage(await financialRequest(
          `/api/v1/financial/deposits?${parameters}`
        ), financialMappers.deposit), options);
    },
    clear() {
      pending.clear();
      cache.clear();
    }
  });
}

document.addEventListener('virtcruise:auth-change', event => {
  if (event.detail?.status === 'guest') {
    pending.clear();
    cache.clear();
  }
});
