import {
  calculateItinerary as calculateMockItinerary,
  createQuoteDraft as createMockQuoteDraft,
  submitEnquiry as submitMockEnquiry,
  submitQuote as submitMockQuote,
  updateQuoteDraft as updateMockQuoteDraft
} from './mock-api.js';

const PRODUCTION_API_BASE_URL = 'https://api.virtcruise.airwide.co.uk';
const LOCAL_API_BASE_URL = 'http://localhost:8080';
const requestedMode = new URLSearchParams(window.location.search).get('api');
const apiMode = requestedMode === 'mock' || requestedMode === 'local' ? requestedMode : 'production';
const apiBaseUrl = apiMode === 'local' ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL;

function splitCustomerName(fullName) {
  const names = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (names.length < 2) {
    throw new Error('Please provide both your first name and surname.');
  }
  return {
    firstName: names.shift(),
    lastName: names.join(' ')
  };
}

function futureDate(daysFromToday) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

function travellerCount(quote) {
  const counts = quote.travellerCounts || {};
  return Math.max(1,
    Number(counts.adults || 0) + Number(counts.children || 0) + Number(counts.infants || 0));
}

function quoteCurrency(quote) {
  const requestWithCurrency = quote.serviceRequests?.find(request => request.details?.currency);
  return String(requestWithCurrency?.details?.currency || 'USD').toUpperCase().slice(0, 3);
}

function quoteNotes(quote) {
  const summary = {
    source: quote.source || 'VIRTCRUISE_WWW',
    tripTitle: quote.tripTitle,
    tripEndDate: quote.tripEndDate || null,
    origin: quote.origin || null,
    destination: quote.destination || null,
    preferredContactMethod: quote.customer?.preferredContactMethod || null,
    consent: quote.consent === true,
    overallNotes: quote.overallNotes || null,
    services: (quote.serviceRequests || []).map(request => ({
      type: request.serviceType,
      title: request.serviceTitle,
      details: request.details
    }))
  };
  const serialized = JSON.stringify(summary);
  if (serialized.length > 5000) {
    throw new Error('Your trip details are too extensive to submit. Please remove some notes and try again.');
  }
  return serialized;
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok || body?.success === false) {
    const message = body?.error?.message || `Virtcruise returned HTTP ${response.status}.`;
    throw new Error(message);
  }
  return body?.data ?? body;
}

async function submitRealQuote(quote) {
  const customerName = splitCustomerName(quote.customer?.fullName);
  let customer;
  try {
    customer = await request('/api/v1/customers', {
      method: 'POST',
      body: JSON.stringify({
        ...customerName,
        email: quote.customer.email,
        phoneNumber: quote.customer.mobile
      })
    });

    const createdQuote = await request('/api/v1/quotes', {
      method: 'POST',
      body: JSON.stringify({
        customerId: customer.id,
        travelDate: quote.tripStartDate || null,
        travellerCount: travellerCount(quote),
        currency: quoteCurrency(quote),
        validUntil: futureDate(14),
        notes: quoteNotes(quote)
      })
    });

    return {
      success: true,
      quoteId: createdQuote.quoteNumber,
      backendQuoteId: createdQuote.id,
      status: createdQuote.status,
      receivedAt: createdQuote.createdAt,
      deliveryMode: 'BACKEND',
      message: 'Your quote request has been sent to Virtcruise. Keep this reference for follow-up.'
    };
  } catch (error) {
    if (customer?.id) {
      await request(`/api/v1/customers/${customer.id}`, { method: 'DELETE' }).catch(() => {});
    }
    throw error;
  }
}

export const apiClient = {
  mode: apiMode,
  baseUrl: apiBaseUrl,
  submitEnquiry(payload) {
    if (apiMode === 'mock') return submitMockEnquiry(payload);
    throw new Error('Please submit this request through the Quote Builder.');
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
    return apiMode === 'mock' ? submitMockQuote(payload) : submitRealQuote(payload);
  }
};
