import { RepositoryError, withRetry } from './repositories/base-repository.js';
import { createCustomerRepository } from './repositories/customer-repository.js';
import { createOfflineQuoteQueue } from './repositories/offline-quote-queue.js';
import { createPackageRepository } from './repositories/package-repository.js';
import { createQuoteRepository } from './repositories/quote-repository.js';
import { tokenManager } from './auth/token-manager.js';
import { runtimeConfig } from './runtime-config.js';

const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:8080';
const requestedMode = new URLSearchParams(window.location.search).get('api');

const apiMode = requestedMode === 'mock'
  ? 'mock'
  : requestedMode === 'local'
    ? 'local'
    : 'production';
const apiBaseUrl = apiMode === 'production'
  ? runtimeConfig.apiOrigin
  : apiMode === 'local'
    ? DEFAULT_LOCAL_API_BASE_URL
    : '';

function userMessage(status, error, path) {
  const violations = error?.violations?.map(entry => entry.message).filter(Boolean) || [];
  if (status === 400 || status === 422) {
    return violations.length
      ? `Please review your quote: ${violations.join(' ')}`
      : 'Please review the highlighted quote details and try again.';
  }
  if (status === 404 && path === '/api/v1/quotes') {
    return 'The Virtcruise quote service is not available. Your trip remains saved in this browser and was not submitted.';
  }
  if (status === 404) return 'The requested Virtcruise record could not be found. It may have been removed.';
  if (status === 409) return error?.message || 'This record changed while you were editing it. Refresh and try again.';
  if (status >= 500) return 'Virtcruise is temporarily unable to process this request. Your trip remains saved in this browser.';
  return error?.message || `Virtcruise returned HTTP ${status}.`;
}

export async function apiRequest(path, options = {}) {
  if (!apiBaseUrl) {
    throw new RepositoryError('The production API is disabled in explicit mock mode.', {
      code: 'MOCK_MODE',
      retryable: false
    });
  }
  const method = String(options.method || 'GET').toUpperCase();
  return withRetry(async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    const requestId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    try {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        credentials: options.credentials || 'include',
        signal: options.signal || controller.signal,
        headers: {
          Accept: 'application/json',
          'X-Request-Id': requestId,
          ...(tokenManager.get() ? { Authorization: `Bearer ${tokenManager.get()}` } : {}),
          ...(options.body ? { 'Content-Type': 'application/json' } : {}),
          ...options.headers
        }
      });
      const body = response.status === 204 ? null : await response.json().catch(() => null);
      if (!response.ok || body?.success === false) {
        const apiError = body?.error || {};
        throw new RepositoryError(userMessage(response.status, apiError, path), {
          code: apiError.code || `HTTP_${response.status}`,
          status: response.status,
          violations: apiError.violations || [],
          requestId: response.headers.get('X-Request-Id') || requestId,
          retryable: method === 'GET' && response.status >= 500
        });
      }
      return body?.data ?? body;
    } catch (cause) {
      if (cause instanceof RepositoryError) throw cause;
      const timedOut = cause?.name === 'AbortError';
      throw new RepositoryError(
        timedOut
          ? 'The request timed out. Your trip remains saved; please try again.'
          : 'The network request could not be completed. Check your connection and try again.',
        {
          cause,
          code: timedOut ? 'TIMEOUT' : 'NETWORK_UNAVAILABLE',
          requestId,
          retryable: method === 'GET'
        }
      );
    } finally {
      window.clearTimeout(timeout);
    }
  }, {
    retries: method === 'GET' ? 2 : 0,
    baseDelay: 300
  });
}

const offlineQueue = createOfflineQuoteQueue();
const packageRepository = createPackageRepository({
  apiBaseUrl,
  source: apiMode === 'mock' ? 'mock' : apiMode,
  dynamicCatalogueEnabled: runtimeConfig.dynamicCatalogueEnabled
});
const quoteRepository = createQuoteRepository({
  request: apiRequest,
  mode: apiMode,
  offlineQueue
});
const customerRepository = createCustomerRepository({
  request: apiRequest,
  mode: apiMode
});

export const apiClient = {
  mode: apiMode,
  baseUrl: apiBaseUrl,
  packages: packageRepository,
  quotes: quoteRepository,
  customers: customerRepository,
  offlineQueue,
  submitEnquiry(payload) {
    if (apiMode !== 'mock') throw new Error('Please submit this request through the Quote Builder.');
    return import('./mock-api.js').then(api => api.submitEnquiry(payload));
  },
  createQuoteDraft(payload) {
    return quoteRepository.createDraft(payload);
  },
  updateQuoteDraft(payload) {
    return quoteRepository.updateDraft(payload);
  },
  calculateItinerary(payload) {
    return quoteRepository.calculateItinerary(payload);
  },
  submitQuote(payload) {
    return quoteRepository.submit(payload);
  },
  loadQuote(backendQuoteId, currentDraft) {
    return quoteRepository.get(backendQuoteId, currentDraft);
  },
  refreshQuote(backendQuoteId, currentDraft) {
    return quoteRepository.refresh(backendQuoteId, currentDraft);
  },
  updateQuote(payload) {
    return quoteRepository.update(payload);
  },
  deleteQuote(backendQuoteId) {
    return quoteRepository.remove(backendQuoteId);
  }
};

window.addEventListener('online', async () => {
  packageRepository.clearCache();
  const results = await quoteRepository.flushOfflineQueue();
  results.forEach(result => {
    document.dispatchEvent(new CustomEvent(
      result.response ? 'virtcruise:offline-quote-sent' : 'virtcruise:offline-quote-failed',
      { detail: result }
    ));
  });
});
