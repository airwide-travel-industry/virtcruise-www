import { createMemoryCache, RepositoryError, withRetry } from './base-repository.js';

const cache = createMemoryCache();
const OFFLINE_CACHE_KEY = 'virtcruise.packageCatalog.v1';

function staticCatalogUrl() {
  return new URL('../../data/packages.json', import.meta.url);
}

function readOfflineCatalog() {
  try {
    const cached = JSON.parse(localStorage.getItem(OFFLINE_CACHE_KEY) || 'null');
    return Array.isArray(cached?.packages) ? cached.packages : null;
  } catch {
    return null;
  }
}

function cacheOfflineCatalog(packages) {
  try {
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify({
      cachedAt: new Date().toISOString(),
      packages
    }));
  } catch {
    // Memory caching still keeps the current page functional.
  }
}

async function fetchJson(url, { signal } = {}) {
  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' }, signal });
  } catch (cause) {
    throw new RepositoryError('The package catalogue is unavailable while you are offline.', {
      cause,
      code: 'NETWORK_UNAVAILABLE',
      retryable: true
    });
  }
  if (!response.ok) {
    throw new RepositoryError(`Package data returned HTTP ${response.status}.`, {
      code: `HTTP_${response.status}`,
      retryable: response.status >= 500
    });
  }
  return response.json();
}

function backendCatalogUrl(apiBaseUrl) {
  return apiBaseUrl ? new URL('api/v1/packages', `${apiBaseUrl.replace(/\/+$/, '')}/`) : null;
}

function validatePackages(packages) {
  if (!Array.isArray(packages)) {
    throw new RepositoryError('The package catalogue response is invalid.', { retryable: false });
  }
  const invalid = packages.find(pkg => !pkg?.id || !pkg?.slug || !pkg?.name || !pkg?.destination);
  if (invalid) {
    throw new RepositoryError('The package catalogue contains an incomplete package.', { retryable: false });
  }
  return packages;
}

function normalisePackage(pkg) {
  if (pkg.destinationName === undefined && pkg.imageUrl === undefined) return pkg;
  return {
    id: pkg.id,
    code: pkg.code,
    slug: pkg.slug,
    name: pkg.name,
    destination: pkg.destinationName || '',
    country: '',
    region: '',
    summary: pkg.summary || pkg.description || '',
    description: pkg.description || pkg.summary || '',
    image: pkg.imageUrl || '',
    gallery: pkg.imageUrl ? [pkg.imageUrl] : [],
    duration: {
      days: Number(pkg.durationDays || 0),
      nights: Math.max(0, Number(pkg.durationDays || 0) - 1),
      label: `${Number(pkg.durationDays || 0)} days`
    },
    priceFrom: Number(pkg.basePrice || 0),
    currency: pkg.currency || 'USD',
    priceUnit: pkg.priceUnit || 'per person',
    categories: pkg.categories || [],
    inclusions: pkg.inclusions || [],
    exclusions: pkg.exclusions || [],
    optionalExtras: [],
    itinerary: [],
    bookingTerms: [],
    faq: [],
    featured: Boolean(pkg.featured)
  };
}

export function createPackageRepository({ apiBaseUrl = '', source = 'production' } = {}) {
  const backendUrl = backendCatalogUrl(apiBaseUrl);
  const primaryUrl = source === 'mock' || !backendUrl ? staticCatalogUrl() : backendUrl;
  let lastSource = source === 'mock' ? 'mock-json' : 'api';
  async function loadUrl(url, {
    forceRefresh = false,
    signal,
    cacheKey = String(url),
    requireContent = false
  } = {}) {
    if (!forceRefresh) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }
    const response = await withRetry(() => fetchJson(url, { signal }));
    const packages = (response?.data || response).map(normalisePackage);
    validatePackages(packages);
    if (requireContent && packages.length === 0) {
      throw new RepositoryError('The production package catalogue does not contain any active packages.', {
        code: 'PACKAGE_CATALOGUE_EMPTY',
        retryable: false
      });
    }
    cache.set(cacheKey, packages);
    cacheOfflineCatalog(packages);
    return packages;
  }
  async function localFallback(signal, cacheKey) {
    try {
      const staticKey = String(staticCatalogUrl());
      const packages = await loadUrl(staticCatalogUrl(), { signal, cacheKey: staticKey });
      lastSource = 'local-fallback';
      cache.set(cacheKey, packages);
      return packages;
    } catch {
      const offline = readOfflineCatalog();
      if (offline) {
        lastSource = 'offline-cache';
        cache.set(cacheKey, offline);
        return offline;
      }
      throw new RepositoryError('Package information is unavailable. Please reconnect and try again.', {
        code: 'PACKAGE_CATALOGUE_UNAVAILABLE',
        retryable: true
      });
    }
  }
  return {
    get source() {
      return lastSource;
    },
    async list({ forceRefresh = false, signal } = {}) {
      const cacheKey = String(primaryUrl);
      if (source === 'mock' || !backendUrl) {
        lastSource = 'mock-json';
        return loadUrl(staticCatalogUrl(), { forceRefresh, signal, cacheKey });
      }
      if (navigator.onLine === false) return localFallback(signal, cacheKey);
      try {
        const packages = await loadUrl(primaryUrl, { forceRefresh, signal, cacheKey, requireContent: true });
        lastSource = 'api';
        return packages;
      } catch (error) {
        return localFallback(signal, cacheKey);
      }
    },
    async featured(options = {}) {
      if (source === 'mock' || !backendUrl) {
        return (await this.list(options)).filter(pkg => pkg.featured);
      }
      const url = new URL('api/v1/packages/featured', `${apiBaseUrl.replace(/\/+$/, '')}/`);
      const cacheKey = String(url);
      if (navigator.onLine === false) {
        return (await localFallback(options.signal, cacheKey)).filter(pkg => pkg.featured);
      }
      try {
        const packages = await loadUrl(url, { ...options, cacheKey, requireContent: true });
        lastSource = 'api';
        return packages;
      } catch {
        return (await localFallback(options.signal, cacheKey)).filter(pkg => pkg.featured);
      }
    },
    async getById(id, options) {
      if (source === 'mock' || !backendUrl || navigator.onLine === false || lastSource === 'local-fallback') {
        return (await this.list(options)).find(pkg => pkg.id === id) || null;
      }
      try {
        const response = await fetchJson(new URL(`api/v1/packages/${encodeURIComponent(id)}`, `${apiBaseUrl}/`), options);
        const pkg = normalisePackage(response?.data || response);
        validatePackages([pkg]);
        return pkg;
      } catch {
        return (await localFallback(options?.signal, `package-id:${id}`)).find(pkg => pkg.id === id) || null;
      }
    },
    async getBySlug(slug, options) {
      if (source === 'mock' || !backendUrl || navigator.onLine === false || lastSource === 'local-fallback') {
        return (await this.list(options)).find(pkg => pkg.slug === slug) || null;
      }
      try {
        const response = await fetchJson(new URL(`api/v1/packages/slug/${encodeURIComponent(slug)}`, `${apiBaseUrl}/`), options);
        const pkg = normalisePackage(response?.data || response);
        validatePackages([pkg]);
        return pkg;
      } catch {
        return (await localFallback(options?.signal, `package-slug:${slug}`)).find(pkg => pkg.slug === slug) || null;
      }
    },
    clearCache() {
      cache.clear();
    }
  };
}
