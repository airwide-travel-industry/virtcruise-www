import {
  calculateItinerary as calculateMockItinerary,
  createQuoteDraft as createMockQuoteDraft,
  submitEnquiry as submitMockEnquiry,
  submitQuote as submitMockQuote,
  updateQuoteDraft as updateMockQuoteDraft
} from './mock-api.js';

export const apiClient = {
  submitEnquiry(payload) {
    return submitMockEnquiry(payload);
  },
  createQuoteDraft(payload) {
    return createMockQuoteDraft(payload);
  },
  updateQuoteDraft(payload) {
    return updateMockQuoteDraft(payload);
  },
  calculateItinerary(payload) {
    return calculateMockItinerary(payload);
  },
  submitQuote(payload) {
    return submitMockQuote(payload);
  }
};
