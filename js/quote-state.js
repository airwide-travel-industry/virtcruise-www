import { buildItinerary } from './itinerary-builder.js';
import { primaryAccommodation } from './quote-domains/accommodation.js';
import { normaliseCustomer } from './quote-domains/customer.js';
import { primaryFlight } from './quote-domains/flights.js';
import { createId, nowIso } from './quote-domains/shared.js';
import { defaultTravellers, normaliseTravellers } from './quote-domains/travellers.js';
import { defaultTrip } from './quote-domains/trip.js';

export const QUOTE_STORAGE_KEY = 'virtcruise.quoteBuilder.v1';
const LEGACY_KEY = 'virtcruise.enquiry.session';

export function createBlankQuoteState() {
  const quoteId = createId('quote');
  return {
    version: 1,
    quoteId,
    clientReference: quoteId,
    idempotencyKey: `submit-${quoteId}`,
    ...defaultTrip(),
    travellerCounts: defaultTravellers(),
    travellers: [],
    selectedServices: [],
    serviceRequests: [],
    itineraryDays: [],
    unallocatedItems: [],
    preTravelRequirements: [],
    itineraryOverrides: {},
    customer: normaliseCustomer(),
    overallNotes: '',
    consent: false,
    draftStatus: 'DRAFT',
    backendQuoteId: '',
    backendCustomerId: '',
    quoteNumber: '',
    updatedAt: nowIso()
  };
}

function normaliseState(value) {
  const state = { ...createBlankQuoteState(), ...value };
  state.clientReference ||= state.quoteId;
  state.idempotencyKey ||= `submit-${state.clientReference}`;
  state.customer = normaliseCustomer(value?.customer);
  state.travellerCounts = normaliseTravellers(value?.travellerCounts);
  state.serviceRequests = Array.isArray(value?.serviceRequests) ? value.serviceRequests : [];
  state.itineraryOverrides = value?.itineraryOverrides || {};
  return state;
}

export function loadQuoteState(storage = sessionStorage) {
  try {
    const value = JSON.parse(storage.getItem(QUOTE_STORAGE_KEY) || 'null');
    if (value?.version === 1) return normaliseState(value);
  } catch {
    // Fall through to the legacy migration.
  }
  const state = createBlankQuoteState();
  try {
    const legacy = JSON.parse(storage.getItem(LEGACY_KEY) || 'null');
    state.serviceRequests = (legacy?.items || []).map(entry => ({
      id: entry.id || createId('service'),
      serviceType: entry.serviceType,
      serviceSlug: entry.serviceSlug,
      serviceTitle: entry.serviceTitle,
      details: entry.details || {},
      status: 'DRAFT'
    }));
    state.customer = normaliseCustomer(legacy?.customer);
    state.overallNotes = legacy?.notes || '';
    state.consent = Boolean(legacy?.consent);
  } catch {
    // Legacy migration is best-effort.
  }
  return state;
}

export function rebuildQuoteState(state) {
  const built = buildItinerary(state.serviceRequests, state.tripStartDate, state.itineraryOverrides);
  state.itineraryDays = built.itineraryDays;
  state.unallocatedItems = built.unallocatedItems;
  state.preTravelRequirements = built.preTravelRequirements;
  state.tripStartDate ||= built.tripStartDate;
  state.tripEndDate = built.tripEndDate;
  state.selectedServices = [...new Set(state.serviceRequests.map(request => request.serviceType))];
  const flight = primaryFlight(state)?.details;
  const stay = primaryAccommodation(state)?.details;
  state.origin ||= flight?.departureCity || '';
  state.destination ||= flight?.destinationCity || stay?.destination || '';
  if (flight) {
    state.travellerCounts = normaliseTravellers({
      adults: flight.adults,
      children: flight.children,
      infants: flight.infants
    });
  }
  return state;
}

export function persistQuoteState(state, storage = sessionStorage) {
  rebuildQuoteState(state);
  state.updatedAt = nowIso();
  storage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(state));
  storage.removeItem(LEGACY_KEY);
  return state;
}
