import { createMemoryCache, RepositoryError, withRetry } from './base-repository.js';

const cache = createMemoryCache({ ttl: 60_000 });
const OFFLINE_CACHE_KEY = 'virtcruise.publishedPackageCatalog.v2';
const PUBLIC_CATALOGUE_PATH = 'api/v1/catalogue/packages';
const FALLBACK_IMAGE = 'images/hero-victoria-falls-final.jpg';

const staticCatalogUrl = () => new URL('../../data/packages.json', import.meta.url);
const publicUrl = reference => {
  const value = String(reference || '').trim();
  if (!value || value.includes('..') || /(^|\/)(managed|private|storage|uploads?)\//i.test(value)) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return value.slice(1);
  return value;
};
const array = value => Array.isArray(value) ? value : [];

function readOfflineCatalog() {
  try {
    const cached = JSON.parse(localStorage.getItem(OFFLINE_CACHE_KEY) || 'null');
    return Array.isArray(cached?.packages) ? cached.packages : null;
  } catch { return null; }
}

function cacheOfflineCatalog(packages) {
  try {
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify({ cachedAt: new Date().toISOString(), packages }));
  } catch { /* Memory caching remains available. */ }
}

async function fetchJson(url, { signal, etag } = {}) {
  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json', ...(etag ? { 'If-None-Match': etag } : {}) },
      signal
    });
  } catch (cause) {
    throw new RepositoryError('The published package catalogue is unavailable.', {
      cause, code: cause?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_UNAVAILABLE', retryable: true
    });
  }
  if (response.status === 304) return { notModified: true, etag };
  if (!response.ok) throw new RepositoryError('The published package catalogue is unavailable.', {
    code: `HTTP_${response.status}`, status: response.status, retryable: response.status >= 500
  });
  let body;
  try { body = await response.json(); } catch (cause) {
    throw new RepositoryError('The published catalogue response is malformed.', { cause, code: 'MALFORMED_RESPONSE' });
  }
  return { body: body?.data ?? body, etag: response.headers.get('ETag') || '' };
}

function normalisePackage(pkg) {
  if (pkg.title === undefined && pkg.packageType === undefined) return pkg;
  const media = array(pkg.media).map(item => ({
    src: publicUrl(item.reference), role: String(item.role || '').toUpperCase(),
    order: Number(item.order || 0), alt: item.altText || '', caption: item.caption || ''
  })).filter(item => item.src).sort((a, b) => a.order - b.order);
  const cover = media.find(item => ['COVER', 'HERO'].includes(item.role)) || media[0];
  const gallery = media.filter(item => item.role === 'GALLERY');
  const displayed = gallery.length ? gallery : media;
  const prices = array(pkg.pricing);
  const price = prices.find(item => !item.priceOnRequest && Number.isFinite(Number(item.amount))) || prices[0] || {};
  const highlights = array(pkg.highlights);
  return {
    id: String(pkg.id), code: pkg.code || '', slug: pkg.slug, packageType: pkg.packageType || '',
    name: pkg.title, title: pkg.title, destination: pkg.destination || '', summary: pkg.summary || '',
    description: pkg.description || pkg.summary || '', duration: {
      days: Number(pkg.durationDays || 0), nights: Math.max(0, Number(pkg.durationDays || 0) - 1),
      label: `${Number(pkg.durationDays || 0)} day${Number(pkg.durationDays) === 1 ? '' : 's'}`
    },
    featured: Boolean(pkg.featured), highlights, categories: [], inclusions: [], exclusions: [],
    optionalExtras: [], itinerary: [], bookingTerms: [], faq: [], prices,
    priceFrom: price.priceOnRequest ? null : Number(price.amount), currency: price.currency || 'USD',
    priceUnit: price.displayBasis || price.qualifier || 'per person', priceOnRequest: Boolean(price.priceOnRequest || !prices.length),
    image: cover?.src || FALLBACK_IMAGE, imageAlt: cover?.alt || `${pkg.title} in ${pkg.destination}`,
    gallery: displayed.map(item => item.src), galleryAlts: displayed.map(item => item.alt),
    galleryCaptions: displayed.map(item => item.caption), seo: pkg.seo || {}, callToAction: pkg.callToAction || {},
    publishedAt: pkg.publishedAt || ''
  };
}

function validatePackages(value) {
  if (!Array.isArray(value)) throw new RepositoryError('The published catalogue response is malformed.', { code: 'MALFORMED_RESPONSE' });
  if (value.some(pkg => !pkg?.id || !pkg?.slug || !pkg?.name || !pkg?.destination)) {
    throw new RepositoryError('The published catalogue contains an incomplete package.', { code: 'MALFORMED_RESPONSE' });
  }
  return value;
}

export function createPackageRepository({ apiBaseUrl = '', source = 'production', dynamicCatalogueEnabled = true } = {}) {
  const dynamic = dynamicCatalogueEnabled && source !== 'mock' && Boolean(apiBaseUrl);
  let lastSource = dynamic ? 'published-api' : 'legacy-catalogue';
  let lastPage = { number: 0, size: 12, totalElements: 0, totalPages: 0 };
  const etags = new Map();

  async function load(url, options = {}) {
    const key = String(url);
    if (!options.forceRefresh) {
      const hit = cache.get(key);
      if (hit) return hit;
    }
    const result = await withRetry(() => fetchJson(url, { signal: options.signal, etag: etags.get(key) }));
    if (result.notModified) return cache.get(key) || [];
    if (result.etag) etags.set(key, result.etag);
    const payload = result.body;
    const raw = Array.isArray(payload) ? payload : payload?.content;
    const packages = validatePackages(array(raw).map(normalisePackage));
    lastPage = Array.isArray(payload)
      ? { number: Number(options.page || 0), size: packages.length, totalElements: packages.length, totalPages: packages.length ? 1 : 0 }
      : { number: payload.number ?? payload.page ?? 0, size: payload.size ?? packages.length, totalElements: payload.totalElements ?? packages.length, totalPages: payload.totalPages ?? (packages.length ? 1 : 0) };
    cache.set(key, packages);
    cacheOfflineCatalog(packages);
    return packages;
  }

  async function legacy(options = {}) {
    lastSource = 'legacy-catalogue';
    const result = await fetchJson(staticCatalogUrl(), options);
    return validatePackages(array(result.body).map(normalisePackage));
  }

  return {
    get source() { return lastSource; },
    get pagination() { return { ...lastPage }; },
    async list({ page = 0, size = 12, search = '', destination = '', type = '', featured = false, forceRefresh = false, signal } = {}) {
      if (!dynamic) return legacy({ signal });
      if (navigator.onLine === false) {
        const offline = readOfflineCatalog();
        if (offline) { lastSource = 'published-offline-cache'; return offline; }
        throw new RepositoryError('Published packages are unavailable while offline.', { code: 'OFFLINE', retryable: true });
      }
      const url = new URL(PUBLIC_CATALOGUE_PATH, `${apiBaseUrl.replace(/\/+$/, '')}/`);
      if (page) url.searchParams.set('page', page); url.searchParams.set('size', size);
      if (search) url.searchParams.set('search', search); if (destination) url.searchParams.set('destination', destination);
      if (type) url.searchParams.set('type', type); if (featured) url.searchParams.set('featured', 'true');
      lastSource = 'published-api';
      return load(url, { page, forceRefresh, signal });
    },
    async featured(options = {}) {
      if (!dynamic) return (await legacy(options)).filter(pkg => pkg.featured);
      const url = new URL(`${PUBLIC_CATALOGUE_PATH}/featured`, `${apiBaseUrl.replace(/\/+$/, '')}/`);
      lastSource = 'published-api';
      return load(url, options);
    },
    async getBySlug(slug, options = {}) {
      if (!dynamic) return (await legacy(options)).find(pkg => pkg.slug === slug) || null;
      const url = new URL(`${PUBLIC_CATALOGUE_PATH}/${encodeURIComponent(slug)}`, `${apiBaseUrl.replace(/\/+$/, '')}/`);
      const result = await fetchJson(url, options);
      const pkg = normalisePackage(result.body);
      validatePackages([pkg]);
      return pkg;
    },
    async getById(id, options) { return (await this.list(options)).find(pkg => pkg.id === id) || null; },
    clearCache() { cache.clear(); etags.clear(); }
  };
}
