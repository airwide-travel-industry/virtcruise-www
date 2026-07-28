const validCurrency = value => /^[A-Z]{3}$/.test(String(value || '').toUpperCase())
  ? String(value).toUpperCase()
  : 'USD';

const nullableNumber = value => {
  if (value === '' || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

const notesForRequest = details =>
  details?.notes || details?.specialRequests || details?.specialRequirements || null;

export function itinerarySegmentToApi(item, fallbackPosition = 0) {
  return {
    type: item.serviceType || item.type || 'CUSTOM',
    title: item.title,
    description: item.description || null,
    location: item.location || null,
    date: item.date || null,
    startTime: item.startTime || null,
    endTime: item.endTime || null,
    dayNumber: item.dayNumber || null,
    position: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : fallbackPosition,
    optional: Boolean(item.optional)
  };
}

function specialRequestsFrom(quote) {
  const requests = [];
  (quote.serviceRequests || []).forEach(request => {
    const description = notesForRequest(request.details);
    if (!description) return;
    requests.push({
      type: `${request.serviceType}_REQUEST`.slice(0, 50),
      description: String(description).slice(0, 2000),
      priority: 'NORMAL'
    });
  });
  return requests;
}

export function quoteBuilderToAggregateDto(quote) {
  return {
    quoteId: quote.clientReference || quote.quoteId,
    source: quote.source || 'VIRTCRUISE_WWW',
    tripTitle: quote.tripTitle || 'My Virtcruise Trip',
    tripStartDate: quote.tripStartDate || null,
    tripEndDate: quote.tripEndDate || null,
    origin: quote.origin || null,
    destination: quote.destination || null,
    travellerCounts: {
      adults: Math.max(1, Number(quote.travellerCounts?.adults || 0)),
      children: Math.max(0, Number(quote.travellerCounts?.children || 0)),
      infants: Math.max(0, Number(quote.travellerCounts?.infants || 0))
    },
    customer: {
      fullName: quote.customer?.fullName || '',
      email: quote.customer?.email || '',
      mobile: quote.customer?.mobile || '',
      preferredContactMethod: quote.customer?.preferredContactMethod || 'EMAIL'
    },
    serviceRequests: (quote.serviceRequests || []).map(request => ({
      serviceType: request.serviceType,
      serviceTitle: request.serviceTitle,
      details: { ...(request.details || {}) },
      estimatedPrice: nullableNumber(request.details?.estimatedPrice ?? request.details?.price),
      currency: validCurrency(request.details?.currency),
      notes: notesForRequest(request.details)
    })),
    travellers: Array.isArray(quote.travellers) && quote.travellers.length
      ? quote.travellers.map(traveller => ({
        firstName: traveller.firstName,
        lastName: traveller.lastName,
        type: traveller.type || 'ADULT',
        dateOfBirth: traveller.dateOfBirth || null,
        nationality: traveller.nationality || null,
        passportNumber: traveller.passportNumber || null,
        leadTraveller: Boolean(traveller.leadTraveller)
      }))
      : null,
    itinerary: null,
    itineraryDays: (quote.itineraryDays || []).map(day => ({
      date: day.date || null,
      dayNumber: day.dayNumber || null,
      items: (day.items || []).map((item, index) => itinerarySegmentToApi(item, index))
    })),
    unallocatedItems: (quote.unallocatedItems || []).map((item, index) =>
      itinerarySegmentToApi(item, index)),
    preTravelRequirements: (quote.preTravelRequirements || []).map((item, index) =>
      itinerarySegmentToApi(item, index)),
    specialRequests: specialRequestsFrom(quote),
    overallNotes: quote.overallNotes || null,
    consent: quote.consent === true
  };
}

export function quoteAggregateToDraft(response, currentDraft) {
  const customer = response.customer || {};
  const itinerary = response.itinerary || {};
  const items = response.items || [];
  return {
    ...currentDraft,
    backendQuoteId: response.id,
    backendCustomerId: customer.id,
    quoteNumber: response.quoteNumber,
    draftStatus: response.status,
    tripTitle: itinerary.title || currentDraft.tripTitle,
    tripStartDate: itinerary.startDate || currentDraft.tripStartDate,
    tripEndDate: itinerary.endDate || currentDraft.tripEndDate,
    origin: itinerary.origin || currentDraft.origin,
    destination: itinerary.destination || currentDraft.destination,
    customer: {
      ...currentDraft.customer,
      fullName: [customer.firstName, customer.lastName].filter(Boolean).join(' '),
      email: customer.email || currentDraft.customer.email,
      mobile: customer.phoneNumber || currentDraft.customer.mobile,
      preferredContactMethod: customer.preferredContactMethod || currentDraft.customer.preferredContactMethod
    },
    travellerCounts: {
      adults: Math.max(1, (response.travellers || []).filter(entry => entry.type === 'ADULT').length),
      children: (response.travellers || []).filter(entry => entry.type === 'CHILD').length,
      infants: (response.travellers || []).filter(entry => entry.type === 'INFANT').length
    },
    serviceRequests: items.map((item, index) => ({
      id: item.id,
      serviceType: item.type === 'HOTEL' ? 'ACCOMMODATION'
        : item.type === 'PACKAGE' ? 'HOLIDAY_PACKAGE'
          : item.type === 'ACTIVITY' ? 'CUSTOM_ACTIVITY'
            : item.type,
      serviceSlug: {
        FLIGHT: 'flights',
        HOTEL: 'accommodation',
        VISA: 'visa-services',
        TRANSFER: 'car-rental',
        PACKAGE: 'holiday-packages',
        ACTIVITY: ''
      }[item.type] || '',
      serviceTitle: item.description,
      status: 'SAVED',
      details: {
        ...(item.requestDetails || {}),
        estimatedPrice: item.lineTotal,
        currency: response.currency,
        notes: item.notes
      },
      sortOrder: item.position ?? index
    })),
    overallNotes: response.notes || '',
    updatedAt: response.updatedAt || new Date().toISOString()
  };
}

export function quoteDraftToUpdateDto(quote) {
  const currencies = (quote.serviceRequests || [])
    .map(request => request.details?.currency)
    .filter(Boolean);
  const validUntil = new Date();
  validUntil.setUTCDate(validUntil.getUTCDate() + 14);
  return {
    customerId: quote.backendCustomerId,
    travelDate: quote.tripStartDate || null,
    travellerCount: Math.max(1,
      Number(quote.travellerCounts?.adults || 0)
      + Number(quote.travellerCounts?.children || 0)
      + Number(quote.travellerCounts?.infants || 0)),
    currency: validCurrency(currencies[0]),
    validUntil: validUntil.toISOString().slice(0, 10),
    notes: quote.overallNotes || null
  };
}
