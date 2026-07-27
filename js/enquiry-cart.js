// Compatibility adapter for integrations that previously addressed a separate
// enquiry cart. The Quote Builder is now the only active session state model.
import { QUOTE_STORAGE_KEY } from './quote-builder.js';

export function getEnquiryCartSnapshot() {
  try {
    const quote = JSON.parse(sessionStorage.getItem(QUOTE_STORAGE_KEY) || 'null');
    return {
      items: Array.isArray(quote?.serviceRequests) ? quote.serviceRequests : [],
      customer: quote?.customer || {},
      notes: quote?.overallNotes || '',
      consent: Boolean(quote?.consent)
    };
  } catch {
    return { items: [], customer: {}, notes: '', consent: false };
  }
}
