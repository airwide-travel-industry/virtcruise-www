const SUBMISSIONS_KEY = 'virtcruise.mock.enquiries';
const COUNTER_KEY = 'virtcruise.mock.counter';

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function validate(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('The enquiry could not be read. Please try again.');
  if (!Array.isArray(payload.items) || payload.items.length === 0) throw new Error('Add at least one travel service before submitting.');
  if (!payload.customer?.fullName?.trim()) throw new Error('Please provide your full name.');
  if (!payload.customer?.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customer.email)) {
    throw new Error('Please provide a valid email address.');
  }
  if (!payload.customer?.mobile?.trim()) throw new Error('Please provide your mobile number.');
  if (payload.consent !== true) throw new Error('Consent is required before we can contact you.');
}

function nextReference() {
  const year = new Date().getFullYear();
  const current = Number(localStorage.getItem(COUNTER_KEY)) || 122;
  const next = current + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return `VCT-${year}-${String(next).padStart(6, '0')}`;
}

export async function submitEnquiry(payload) {
  await delay(700 + Math.floor(Math.random() * 501));
  validate(payload);

  const response = {
    success: true,
    enquiryId: nextReference(),
    status: 'SAVED_LOCALLY',
    receivedAt: new Date().toISOString(),
    message: 'Your quote request has been saved in this browser.'
  };

  try {
    const stored = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    stored.push({ payload, response });
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(stored));
  } catch {
    // Persistence is optional; a successful mock response must not depend on it.
  }
  return response;
}

const quoteDelay = () => delay(350 + Math.floor(Math.random() * 251));
const quoteResponse = quote => ({ success: true, quoteId: quote.quoteId, status: quote.draftStatus || 'DRAFT', updatedAt: new Date().toISOString() });

export async function createQuoteDraft(quote) {
  await quoteDelay();
  if (!quote?.quoteId) throw new Error('A quote ID is required.');
  return quoteResponse(quote);
}

export async function updateQuoteDraft(quote) {
  await quoteDelay();
  if (!quote?.quoteId) throw new Error('The quote draft could not be identified.');
  return quoteResponse(quote);
}

export async function calculateItinerary(quote) {
  await quoteDelay();
  if (!Array.isArray(quote?.serviceRequests)) throw new Error('Quote services are invalid.');
  return { success: true, quoteId: quote.quoteId, itinerary: quote.itinerary, calculatedAt: new Date().toISOString() };
}

export async function submitQuote(quote) {
  await delay(700 + Math.floor(Math.random() * 501));
  if (!quote?.serviceRequests?.length) throw new Error('Add at least one service before requesting a quote.');
  validate({
    customer: quote.customer,
    items: quote.serviceRequests,
    consent: quote.consent
  });
  const response = {
    success: true,
    quoteId: nextReference(),
    status: 'SAVED_LOCALLY',
    receivedAt: new Date().toISOString(),
    message: 'Your quote request has been saved in this browser.'
  };
  try {
    const stored = JSON.parse(localStorage.getItem('virtcruise.mock.quotes') || '[]');
    stored.push({ quote, response });
    localStorage.setItem('virtcruise.mock.quotes', JSON.stringify(stored));
  } catch {
    // Development inspection storage is optional.
  }
  return response;
}
