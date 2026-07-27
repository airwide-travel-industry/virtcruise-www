const option = (value, label = value) => ({ value, label });
const SERVICES = {
  flights: {
    type: 'FLIGHT', title: 'Flight Reservations', icon: '✈', intro: 'Tell us where and how you would like to fly.',
    fields: [
      { name: 'tripType', label: 'Trip type', type: 'select', required: true, options: [option('RETURN', 'Return'), option('ONE_WAY', 'One Way'), option('MULTI_CITY', 'Multi-city')] },
      { name: 'departureCity', label: 'Departure city', required: true },
      { name: 'destinationCity', label: 'Destination city', required: true },
      { name: 'departureDate', label: 'Departure date', type: 'date', required: true },
      { name: 'returnDate', label: 'Return date', type: 'date', conditional: values => values.tripType === 'RETURN' },
      { name: 'adults', label: 'Adults', type: 'number', min: 0, value: 1, required: true },
      { name: 'children', label: 'Children', type: 'number', min: 0, value: 0 },
      { name: 'infants', label: 'Infants', type: 'number', min: 0, value: 0 },
      { name: 'cabinClass', label: 'Cabin class', type: 'select', options: ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'].map(v => option(v, v.replaceAll('_', ' '))) },
      { name: 'preferredAirline', label: 'Preferred airline' },
      { name: 'flexibleDates', label: 'My dates are flexible', type: 'checkbox', full: true },
      { name: 'additionalNotes', label: 'Additional notes', type: 'textarea', full: true }
    ],
    validate(values) {
      const errors = {};
      if (values.tripType === 'RETURN' && !values.returnDate) errors.returnDate = 'Return date is required for a return trip.';
      if ((Number(values.adults) + Number(values.children) + Number(values.infants)) < 1) errors.adults = 'At least one passenger is required.';
      return errors;
    }
  },
  'car-rental': {
    type: 'CAR_RENTAL', title: 'Car Rental', icon: '◆', intro: 'Share your route and preferred vehicle arrangement.',
    fields: [
      { name: 'pickupLocation', label: 'Pickup location', required: true }, { name: 'dropoffLocation', label: 'Drop-off location', required: true },
      { name: 'pickupDate', label: 'Pickup date', type: 'date', required: true }, { name: 'pickupTime', label: 'Pickup time', type: 'time', required: true },
      { name: 'returnDate', label: 'Return date', type: 'date', required: true }, { name: 'returnTime', label: 'Return time', type: 'time', required: true },
      { name: 'vehicleCategory', label: 'Vehicle category', type: 'select', options: ['ECONOMY', 'COMPACT', 'SUV', 'LUXURY', 'VAN'].map(v => option(v, v)) },
      { name: 'driveType', label: 'Driving option', type: 'select', options: [option('SELF_DRIVE', 'Self-drive'), option('CHAUFFEUR', 'Chauffeur')] },
      { name: 'passengers', label: 'Number of passengers', type: 'number', min: 1, value: 1, required: true },
      { name: 'additionalNotes', label: 'Additional notes', type: 'textarea', full: true }
    ]
  },
  'visa-services': {
    type: 'VISA', title: 'Visa Services', icon: '▣', intro: 'Request guidance for your visa application and travel plans.',
    fields: [
      { name: 'nationality', label: 'Nationality', required: true }, { name: 'countryOfResidence', label: 'Country of residence', required: true },
      { name: 'destinationCountry', label: 'Destination country', required: true }, { name: 'visaType', label: 'Visa type', type: 'select', options: ['TOURIST', 'BUSINESS', 'TRANSIT', 'STUDY', 'OTHER'].map(v => option(v, v)) },
      { name: 'intendedTravelDate', label: 'Intended travel date', type: 'date', required: true }, { name: 'applicants', label: 'Number of applicants', type: 'number', min: 1, value: 1, required: true },
      { name: 'passportExpiryDate', label: 'Passport expiry date', type: 'date', required: true },
      { name: 'previousVisaRefusal', label: 'Previous visa refusal', type: 'select', options: [option('NO', 'No'), option('YES', 'Yes')] },
      { name: 'additionalNotes', label: 'Additional notes', type: 'textarea', full: true }
    ]
  },
  accommodation: {
    type: 'ACCOMMODATION', title: 'Accommodation', icon: '⌂', intro: 'Let us find a stay that fits your trip and budget.',
    fields: [
      { name: 'destination', label: 'Destination', required: true }, { name: 'checkInDate', label: 'Check-in date', type: 'date', required: true },
      { name: 'checkOutDate', label: 'Check-out date', type: 'date', required: true }, { name: 'adults', label: 'Adults', type: 'number', min: 1, value: 1, required: true },
      { name: 'children', label: 'Children', type: 'number', min: 0, value: 0 }, { name: 'rooms', label: 'Number of rooms', type: 'number', min: 1, value: 1, required: true },
      { name: 'accommodationType', label: 'Accommodation type', type: 'select', options: ['HOTEL', 'RESORT', 'LODGE', 'APARTMENT', 'GUESTHOUSE'].map(v => option(v, v)) },
      { name: 'starRating', label: 'Preferred star rating', type: 'select', options: ['ANY', '3_STAR', '4_STAR', '5_STAR'].map(v => option(v, v.replace('_', ' '))) },
      { name: 'budgetPerNight', label: 'Budget per night (USD)', type: 'number', min: 0 },
      { name: 'additionalNotes', label: 'Additional notes', type: 'textarea', full: true }
    ]
  },
  'holiday-packages': {
    type: 'HOLIDAY_PACKAGE', title: 'Holiday Packages', icon: '◎', intro: 'Build a complete escape or begin with one of our curated packages.',
    fields: [
      { name: 'destination', label: 'Destination', required: true },
      { name: 'preferredPackage', label: 'Preferred package', type: 'select', options: [] },
      { name: 'departureDate', label: 'Departure date', type: 'date', required: true }, { name: 'duration', label: 'Duration', placeholder: 'e.g. 7 days', required: true },
      { name: 'travellers', label: 'Travellers', type: 'number', min: 1, value: 1, required: true }, { name: 'budget', label: 'Total budget (USD)', type: 'number', min: 0 },
      { name: 'accommodationPreference', label: 'Accommodation preference' }, { name: 'activitiesInterests', label: 'Activities / interests' },
      { name: 'transportPreference', label: 'Transport preference' }, { name: 'additionalNotes', label: 'Additional notes', type: 'textarea', full: true }
    ]
  },
  cruises: {
    type: 'CRUISE', title: 'Cruises', icon: '≋', intro: 'Describe the voyage you have in mind and we will source suitable sailings.',
    fields: [
      { name: 'cruiseRegion', label: 'Preferred cruise region', required: true }, { name: 'departurePort', label: 'Departure port' },
      { name: 'departureMonth', label: 'Preferred departure month', type: 'month', required: true }, { name: 'duration', label: 'Duration', required: true },
      { name: 'adults', label: 'Adults', type: 'number', min: 1, value: 1, required: true }, { name: 'children', label: 'Children', type: 'number', min: 0, value: 0 },
      { name: 'cabinType', label: 'Cabin type', type: 'select', options: ['INSIDE', 'OCEAN_VIEW', 'BALCONY', 'SUITE'].map(v => option(v, v.replace('_', ' '))) },
      { name: 'cruiseLinePreference', label: 'Cruise line preference' }, { name: 'budget', label: 'Budget (USD)', type: 'number', min: 0 },
      { name: 'additionalNotes', label: 'Additional notes', type: 'textarea', full: true }
    ]
  }
};

const SERVICE_DETAILS = {
  flights: {
    about: 'From simple regional journeys to complex international itineraries, our consultants compare practical routes, schedules and fare conditions around the way you want to travel.',
    arrangements: ['Return, one-way and multi-city itineraries', 'Economy through first-class cabins', 'Preferred airlines and flexible-date options', 'Connections, baggage guidance and special requests'],
    required: ['Departure and destination cities', 'Travel dates and flexibility', 'Number and ages of travellers', 'Preferred cabin and airline'],
    extras: ['Seat and meal requests', 'Airport transfers', 'Travel insurance guidance']
  },
  'car-rental': {
    about: 'We source dependable vehicles for airport collections, business travel, family holidays and longer self-drive journeys.',
    arrangements: ['Self-drive and chauffeur services', 'Economy, SUV, luxury and group vehicles', 'One-way and return rentals', 'Airport and hotel pickup'],
    required: ['Pickup and drop-off locations', 'Dates and collection times', 'Passenger numbers', 'Preferred vehicle category'],
    extras: ['Additional drivers', 'Child seats', 'Cross-border rental guidance']
  },
  'visa-services': {
    about: 'Our team helps you understand application requirements, prepare documentation and approach appointments with confidence. Decisions remain with the relevant authority.',
    arrangements: ['Tourist, business and transit guidance', 'Application checklist preparation', 'Appointment preparation', 'Destination-specific requirement guidance'],
    required: ['Nationality and country of residence', 'Destination and visa type', 'Intended travel date', 'Passport expiry and applicant count'],
    extras: ['Flight and accommodation reservations', 'Travel itinerary planning', 'Travel insurance guidance']
  },
  accommodation: {
    about: 'We match your destination, travel style and budget with well-located hotels, resorts, lodges, apartments and guesthouses.',
    arrangements: ['City hotels and serviced apartments', 'Beach and leisure resorts', 'Safari lodges and boutique stays', 'Family and group room configurations'],
    required: ['Destination and stay dates', 'Adults, children and rooms', 'Preferred property type', 'Star rating and nightly budget'],
    extras: ['Breakfast or meal plans', 'Airport transfers', 'Special occasion arrangements']
  },
  'holiday-packages': {
    about: 'Choose a curated Virtcruise escape or let us combine flights, stays, transfers and experiences into a holiday designed around you.',
    arrangements: ['Tailor-made and curated packages', 'Flights, accommodation and transfers', 'City, beach, safari and family escapes', 'Multi-destination itineraries'],
    required: ['Destination and departure date', 'Trip duration and traveller count', 'Approximate budget', 'Accommodation and activity preferences'],
    extras: ['Private tours and excursions', 'Celebration experiences', 'Visa and insurance guidance']
  },
  cruises: {
    about: 'We help narrow thousands of sailings into the regions, ships, cabins and departure dates that best suit your travel plans.',
    arrangements: ['Ocean and river cruises', 'Inside, ocean-view, balcony and suite cabins', 'Regional and repositioning sailings', 'Pre- and post-cruise stays'],
    required: ['Preferred region and departure port', 'Departure month and duration', 'Adults and children', 'Cabin, cruise line and budget preferences'],
    extras: ['Flights and port transfers', 'Pre-cruise accommodation', 'Shore excursion planning']
  }
};

const WHY_VIRTCRUISE = [
  'One trusted consultant across your journey',
  'Independent, practical travel guidance',
  'Careful coordination of every confirmed service'
];

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const toValues = form => Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value]));

export function getService(slug) {
  return SERVICES[slug] || null;
}

export function setPackageOptions(packages) {
  SERVICES['holiday-packages'].fields.find(field => field.name === 'preferredPackage').options = [
    option('', 'Custom package'),
    ...packages.map(pkg => option(pkg.id, `${pkg.name} — ${pkg.destination}`))
  ];
}

function fieldMarkup(field, values) {
  const id = `service-${field.name}`;
  const value = values[field.name] ?? field.value ?? '';
  const required = field.required ? ' required aria-required="true"' : '';
  let control;
  if (field.type === 'select') {
    control = `<select id="${id}" name="${field.name}"${required}>${(field.options || []).map(item => `<option value="${escapeHtml(item.value)}"${item.value === value ? ' selected' : ''}>${escapeHtml(item.label)}</option>`).join('')}</select>`;
  } else if (field.type === 'textarea') {
    control = `<textarea id="${id}" name="${field.name}" rows="4"${required}>${escapeHtml(value)}</textarea>`;
  } else if (field.type === 'checkbox') {
    return `<label class="app-check app-field-full"><input id="${id}" name="${field.name}" type="checkbox"${value === true || value === 'on' ? ' checked' : ''}> <span>${escapeHtml(field.label)}</span></label>`;
  } else {
    control = `<input id="${id}" name="${field.name}" type="${field.type || 'text'}" value="${escapeHtml(value)}"${field.min !== undefined ? ` min="${field.min}"` : ''}${field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : ''}${required}>`;
  }
  return `<div class="app-field${field.full ? ' app-field-full' : ''}" data-field="${field.name}"><label for="${id}">${escapeHtml(field.label)}${field.required ? ' <span aria-hidden="true">*</span>' : ''}</label>${control}<p class="field-error" id="${id}-error"></p></div>`;
}

export function renderServiceDetail(root, slug) {
  const service = SERVICES[slug];
  const detail = SERVICE_DETAILS[slug];
  if (!service || !detail) return false;
  const section = (title, content) => `<section class="service-doc-section"><p class="service-doc-label">${title}</p>${Array.isArray(content) ? `<ul>${content.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : `<p>${escapeHtml(content)}</p>`}</section>`;
  root.innerHTML = `<article class="service-document">
    <header class="service-doc-hero">
      <p class="service-doc-category">Virtcruise <span aria-hidden="true">·</span> Service</p>
      <span class="app-service-icon" aria-hidden="true">${service.icon}</span>
      <h2 id="appPanelTitle">${service.title}</h2>
      <p class="service-doc-summary">${service.intro}</p>
    </header>
    <div class="service-doc-body">
      ${section('About this service', detail.about)}
      ${section('What we can arrange', detail.arrangements)}
      ${section('Information required', detail.required)}
      ${section('Optional extras', detail.extras)}
      ${section('Why book through Virtcruise', WHY_VIRTCRUISE)}
    </div>
    <div class="service-doc-actions" aria-label="${escapeHtml(service.title)} actions">
      <button class="app-primary" type="button" data-add-current-service>Add to My Trip</button>
      <button class="app-secondary" type="button" data-request-current-service>Request a Quote</button>
    </div>
  </article>`;
  return true;
}

export function renderServiceForm(root, slug, existing = null) {
  const service = SERVICES[slug];
  if (!service) return false;
  root.innerHTML = `<header class="app-panel-header"><span class="app-service-icon" aria-hidden="true">${service.icon}</span><div><p class="app-eyebrow">Virtcruise · Enquiry details</p><h2 id="appPanelTitle">${service.title}</h2><p>${service.intro}</p></div></header>
    <form id="serviceRequestForm" class="service-form" novalidate>
      <div class="service-form-grid">${service.fields.map(field => fieldMarkup(field, existing?.details || {})).join('')}</div>
      <div class="app-sticky-actions"><button class="app-primary" type="submit">${existing ? 'Save Changes' : 'Add to Enquiry'}</button></div>
    </form>`;

  const form = root.querySelector('#serviceRequestForm');
  function updateConditionalFields() {
    const values = toValues(form);
    service.fields.forEach(field => {
      if (!field.conditional) return;
      const container = form.querySelector(`[data-field="${field.name}"]`);
      const visible = field.conditional(values);
      container.hidden = !visible;
      container.querySelector('input,select,textarea').required = visible;
    });
  }
  form.addEventListener('change', updateConditionalFields);
  updateConditionalFields();
  return true;
}

export function readAndValidateService(root, slug) {
  const service = SERVICES[slug];
  const form = root.querySelector('#serviceRequestForm');
  const details = toValues(form);
  service.fields.filter(field => field.type === 'checkbox').forEach(field => { details[field.name] = form.elements[field.name].checked; });
  const errors = {};
  service.fields.forEach(field => {
    if (field.conditional && !field.conditional(details)) return;
    if (field.required && !String(details[field.name] ?? '').trim()) errors[field.name] = `${field.label} is required.`;
    if (field.type === 'number' && details[field.name] !== '' && Number(details[field.name]) < (field.min ?? 0)) errors[field.name] = `${field.label} must be at least ${field.min ?? 0}.`;
  });
  Object.assign(errors, service.validate?.(details) || {});
  root.querySelectorAll('.field-error').forEach(element => { element.textContent = ''; });
  root.querySelectorAll('[aria-invalid]').forEach(element => element.removeAttribute('aria-invalid'));
  Object.entries(errors).forEach(([name, message]) => {
    const input = form.elements[name];
    const error = root.querySelector(`#service-${name}-error`);
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', `service-${name}-error`);
    }
    if (error) error.textContent = message;
  });
  const first = form.querySelector('[aria-invalid="true"]');
  if (first) {
    first.focus();
    return null;
  }
  return { serviceType: service.type, serviceSlug: slug, serviceTitle: service.title, details };
}
