const DAY = 86400000;
const asDate = value => {
  if (!value) return null;
  const raw = String(value).trim();
  const displayDate = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const normalized = displayDate
    ? `${displayDate[3]}-${displayDate[1].padStart(2, '0')}-${displayDate[2].padStart(2, '0')}`
    : raw;
  const date = new Date(`${normalized}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};
const iso = date => date.toISOString().slice(0, 10);
const addDays = (value, days) => {
  const date = asDate(value);
  if (!date || !Number.isFinite(days)) return '';
  return iso(new Date(date.getTime() + days * DAY));
};
const difference = (start, end) => {
  const from = asDate(start);
  const to = asDate(end);
  return from && to ? Math.round((to - from) / DAY) : 0;
};

function item(request, suffix, values = {}) {
  return {
    id: `${request.id}:${suffix}`,
    serviceType: request.serviceType,
    sourceRequestId: request.id,
    title: values.title || request.serviceTitle,
    description: values.description || '',
    date: values.date || '',
    startTime: values.startTime || '',
    endTime: values.endTime || '',
    location: values.location || '',
    dayNumber: null,
    sortOrder: values.sortOrder || 0,
    optional: Boolean(values.optional),
    status: values.status || 'PLANNED',
    metadata: values.metadata || {}
  };
}

function requestItems(request) {
  const d = request.details || {};
  switch (request.serviceType) {
    case 'FLIGHT': {
      const items = [item(request, 'outbound', {
        title: `Flight: ${d.departureCity || 'Departure'} to ${d.destinationCity || 'Destination'}`,
        date: d.departureDate,
        location: d.departureCity,
        metadata: { direction: 'OUTBOUND' }
      })];
      if (d.tripType === 'RETURN' && d.returnDate) {
        items.push(item(request, 'return', {
          title: `Flight: ${d.destinationCity || 'Destination'} to ${d.departureCity || 'Departure'}`,
          date: d.returnDate,
          location: d.destinationCity,
          metadata: { direction: 'RETURN' }
        }));
      }
      if (d.tripType === 'MULTI_CITY' && (d.multiCityFrom || d.multiCityDestination || d.multiCityDate)) {
        items.push(item(request, 'multi-city-2', {
          title: `Flight: ${d.multiCityFrom || 'Departure'} to ${d.multiCityDestination || 'Destination'}`,
          date: d.multiCityDate,
          location: d.multiCityFrom,
          metadata: { direction: 'MULTI_CITY', legNumber: 2 }
        }));
      }
      return items;
    }
    case 'ACCOMMODATION': {
      const items = [item(request, 'check-in', { title: `Check in: ${d.destination || 'Accommodation'}`, date: d.checkInDate, location: d.destination })];
      const nights = Math.max(0, Number(d.numberOfNights) || difference(d.checkInDate, d.checkOutDate));
      for (let index = 1; index < nights; index += 1) {
        items.push(item(request, `stay-${index}`, { title: `Stay: ${d.destination || 'Accommodation'}`, date: addDays(d.checkInDate, index), location: d.destination }));
      }
      items.push(item(request, 'check-out', { title: `Check out: ${d.destination || 'Accommodation'}`, date: d.checkOutDate, location: d.destination }));
      return items;
    }
    case 'CAR_RENTAL':
      return [
        item(request, 'pickup', { title: `Car pickup: ${d.pickupLocation || 'Location to be confirmed'}`, date: d.pickupDate, startTime: d.pickupTime, location: d.pickupLocation }),
        item(request, 'return', { title: `Car return: ${d.dropoffLocation || d.pickupLocation || 'Location to be confirmed'}`, date: d.returnDate, startTime: d.returnTime, location: d.dropoffLocation })
      ];
    case 'VISA':
      return [item(request, 'pre-travel', { title: `Visa assistance: ${d.destinationCountry || 'Destination to be confirmed'}`, description: d.assistanceRequired || '', status: 'PRE_TRAVEL' })];
    case 'HOLIDAY_PACKAGE': {
      const start = d.departureDate;
      const nights = Math.max(0, Number(d.numberOfNights) || 0);
      const price = Number.isFinite(Number(d.price)) ? `From ${d.currency || 'USD'} ${Number(d.price).toLocaleString()}${d.priceBasis ? ` ${d.priceBasis}` : ''}` : '';
      const description = [d.duration, price].filter(Boolean).join(' · ');
      const items = [item(request, 'start', {
        title: d.packageName || `Package begins: ${d.destination || 'Destination to be confirmed'}`,
        description,
        date: start,
        location: d.destination,
        metadata: { packageId: d.packageId || d.preferredPackage || '', detailUrl: d.detailUrl || '', source: d.source || '' }
      })];
      for (let index = 1; index <= nights; index += 1) {
        items.push(item(request, `day-${index + 1}`, { title: `Package day ${index + 1}`, date: start ? addDays(start, index) : '', location: d.destination }));
      }
      if (d.activityInterests) items.push(item(request, 'activities', { title: d.activityInterests, description: 'Package activity interests', optional: true }));
      return items;
    }
    case 'CRUISE': {
      const nights = Math.max(0, Number(d.numberOfNights) || 0);
      const start = d.departureDate;
      return [
        item(request, 'embark', { title: `Cruise embarkation: ${d.departurePort || d.cruiseRegion || 'Port to be confirmed'}`, date: start, location: d.departurePort }),
        item(request, 'disembark', { title: 'Cruise disembarkation', date: start && nights ? addDays(start, nights) : '', location: d.departurePort })
      ];
    }
    case 'CUSTOM_ACTIVITY':
      return [item(request, 'custom', {
        title: d.title || 'Custom activity',
        description: d.description || '',
        date: d.date || '',
        startTime: d.startTime || '',
        optional: d.optional
      })];
    default:
      return [item(request, 'request')];
  }
}

export function calculateNumberOfNights(start, end) {
  return Math.max(0, difference(start, end));
}

export function buildItinerary(requests, tripStartDate = '', overrides = {}) {
  const all = requests.flatMap(requestItems).map(entry => ({ ...entry, ...(overrides[entry.id] || {}) }));
  const dated = new Map();
  const unallocatedItems = [];
  const preTravelRequirements = [];

  all.forEach(entry => {
    if (entry.status === 'PRE_TRAVEL') {
      preTravelRequirements.push(entry);
      return;
    }
    if (!entry.date) {
      unallocatedItems.push(entry);
      return;
    }
    if (!dated.has(entry.date)) dated.set(entry.date, []);
    dated.get(entry.date).push(entry);
  });

  const firstDate = tripStartDate || [...dated.keys()].sort()[0] || '';
  const itineraryDays = [...dated.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, entries]) => ({
    id: `day:${date}`,
    date,
    dayNumber: firstDate ? difference(firstDate, date) + 1 : null,
    items: entries.sort((a, b) => (a.sortOrder - b.sortOrder) || a.startTime.localeCompare(b.startTime) || a.id.localeCompare(b.id))
      .map((entry, index) => ({ ...entry, dayNumber: firstDate ? difference(firstDate, date) + 1 : null, sortOrder: index }))
  }));

  return {
    itineraryDays,
    unallocatedItems: unallocatedItems.sort((a, b) => a.sortOrder - b.sortOrder),
    preTravelRequirements,
    tripStartDate: firstDate,
    tripEndDate: itineraryDays.at(-1)?.date || firstDate
  };
}

export function dateForDay(tripStartDate, dayNumber) {
  return tripStartDate && Number(dayNumber) > 0 ? addDays(tripStartDate, Number(dayNumber) - 1) : '';
}

export function formatItineraryDate(value) {
  if (!value) return 'Date to be arranged';
  return new Intl.DateTimeFormat('en-ZW', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(asDate(value));
}
