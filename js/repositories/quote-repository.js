import {
  quoteAggregateToDraft,
  quoteBuilderToAggregateDto,
  quoteDraftToUpdateDto
} from '../quote-api-mapper.js';
import { RepositoryError } from './base-repository.js';

const mockApi = () => import('../mock-api.js');

function confirmedSubmission(response) {
  if (!response?.id || !response?.quoteNumber || !response?.customerId
    || !response?.clientReference || !response?.status) {
    throw new RepositoryError('Virtcruise returned an incomplete quote confirmation. Your trip has not been cleared.', {
      code: 'INVALID_SUBMISSION_RESPONSE',
      retryable: false
    });
  }
  return {
    success: true,
    quoteId: response.quoteNumber,
    backendQuoteId: response.id,
    customerId: response.customerId,
    clientReference: response.clientReference,
    status: response.status,
    receivedAt: response.createdAt,
    estimatedValue: response.estimatedValue,
    currency: response.currency,
    deliveryMode: 'BACKEND',
    message: response.message
  };
}

export function createQuoteRepository({ request, mode, offlineQueue }) {
  const production = mode === 'production';
  let flushPromise = null;
  return {
    async submit(quote) {
      if (mode === 'mock') return mockApi().then(api => api.submitQuote(quote));
      const payload = quoteBuilderToAggregateDto({ ...quote, source: 'VIRTCRUISE_WWW' });
      const clientReference = quote.clientReference || quote.quoteId;
      const idempotencyKey = quote.idempotencyKey;
      if (!clientReference || !idempotencyKey) {
        throw new RepositoryError('This quote is missing its stable submission identity. Start a new trip and try again.', {
          code: 'MISSING_SUBMISSION_IDENTITY',
          retryable: false
        });
      }
      if (production && navigator.onLine === false) {
        const queued = offlineQueue.enqueue({ clientReference, idempotencyKey, payload });
        throw new RepositoryError(
          'You are offline. This quote is queued on this device and has not reached Virtcruise yet.',
          { code: 'OFFLINE_QUEUED', retryable: true, queued }
        );
      }
      const response = await request('/api/v1/quotes', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(payload)
      });
      offlineQueue.clearForQuote(clientReference);
      return confirmedSubmission(response);
    },
    get(backendQuoteId, currentDraft = {}) {
      if (mode === 'mock') return Promise.resolve(null);
      return request(`/api/v1/quotes/${encodeURIComponent(backendQuoteId)}/details`)
        .then(response => quoteAggregateToDraft(response, currentDraft));
    },
    refresh(backendQuoteId, currentDraft = {}) {
      return this.get(backendQuoteId, currentDraft);
    },
    update(quote) {
      if (mode === 'mock') return mockApi().then(api => api.updateQuoteDraft(quote));
      if (!quote.backendQuoteId || !quote.backendCustomerId) {
        throw new RepositoryError('This quote has not been created in Virtcruise yet.', {
          code: 'QUOTE_NOT_CREATED',
          retryable: false
        });
      }
      return request(`/api/v1/quotes/${encodeURIComponent(quote.backendQuoteId)}`, {
        method: 'PUT',
        body: JSON.stringify(quoteDraftToUpdateDto(quote))
      });
    },
    remove(backendQuoteId) {
      if (mode === 'mock') return Promise.resolve(null);
      return request(`/api/v1/quotes/${encodeURIComponent(backendQuoteId)}`, { method: 'DELETE' });
    },
    createDraft(quote) {
      if (mode === 'mock') return mockApi().then(api => api.createQuoteDraft(quote));
      return Promise.resolve({ success: true, quoteId: quote.quoteId, status: 'LOCAL_DRAFT' });
    },
    updateDraft(quote) {
      if (mode === 'mock') return mockApi().then(api => api.updateQuoteDraft(quote));
      return quote.backendQuoteId ? this.update(quote) : Promise.resolve({
        success: true,
        quoteId: quote.quoteId,
        status: 'LOCAL_DRAFT'
      });
    },
    calculateItinerary(quote) {
      if (mode === 'mock') return mockApi().then(api => api.calculateItinerary(quote));
      return Promise.resolve({
        success: true,
        quoteId: quote.quoteId,
        itinerary: quote.itineraryDays,
        source: 'BROWSER_PREVIEW'
      });
    },
    flushOfflineQueue() {
      if (!production || navigator.onLine === false) return Promise.resolve([]);
      if (flushPromise) return flushPromise;
      flushPromise = (async () => {
        const results = [];
        for (const entry of offlineQueue.list()) {
          try {
            const response = await request('/api/v1/quotes', {
              method: 'POST',
              headers: { 'Idempotency-Key': entry.idempotencyKey },
              body: JSON.stringify(entry.payload)
            });
            const confirmed = confirmedSubmission(response);
            offlineQueue.remove(entry.id);
            results.push({ entry, response: confirmed });
          } catch (error) {
            results.push({ entry, error });
            break;
          }
        }
        return results;
      })().finally(() => {
        flushPromise = null;
      });
      return flushPromise;
    }
  };
}
