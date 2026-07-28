import { calculateNumberOfNights } from './itinerary-builder.js';

const opt = (value, label = value) => ({ value, label });
const choices = (...values) => values.map(value => opt(value, value.replaceAll('_', ' ')));

export const serviceFormDefinitions = {
  flights: {
    serviceType: 'FLIGHT', shortTitle: 'Flights', title: 'Flight Reservations', icon: '✈',
    fields: [
      { name: 'tripType', label: 'Trip type', type: 'select', required: true, options: [opt('RETURN', 'Return'), opt('ONE_WAY', 'One way'), opt('MULTI_CITY', 'Multi-city')] },
      { name: 'departureCity', label: 'Departure airport or city', required: true },
      { name: 'destinationCity', label: 'Destination airport or city', required: true },
      { name: 'departureDate', label: 'Departure date', type: 'date', required: true },
      { name: 'returnDate', label: 'Return date', type: 'date', showWhen: values => values.tripType === 'RETURN' },
      { name: 'multiCityFrom', label: 'Next leg departure city', showWhen: values => values.tripType === 'MULTI_CITY' },
      { name: 'multiCityDestination', label: 'Next leg destination city', showWhen: values => values.tripType === 'MULTI_CITY' },
      { name: 'multiCityDate', label: 'Next leg date', type: 'date', showWhen: values => values.tripType === 'MULTI_CITY' },
      { name: 'adults', label: 'Adults', type: 'number', min: 0, value: 1 },
      { name: 'children', label: 'Children', type: 'number', min: 0, value: 0 },
      { name: 'infants', label: 'Infants', type: 'number', min: 0, value: 0 },
      { name: 'cabinClass', label: 'Cabin class', type: 'select', options: choices('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST') },
      { name: 'preferredAirline', label: 'Preferred airline' },
      { name: 'flexibleDates', label: 'My dates are flexible', type: 'checkbox', full: true },
      { name: 'specialRequirements', label: 'Special requirements', type: 'textarea', full: true }
    ],
    validate(d) {
      const errors = {};
      if (d.tripType === 'RETURN' && !d.returnDate) errors.returnDate = 'Return date is required for a return journey.';
      if (d.tripType === 'MULTI_CITY' && !d.multiCityFrom) errors.multiCityFrom = 'Add the next departure city.';
      if (d.tripType === 'MULTI_CITY' && !d.multiCityDestination) errors.multiCityDestination = 'Add the next destination city.';
      if (d.tripType === 'MULTI_CITY' && !d.multiCityDate) errors.multiCityDate = 'Add the next leg date.';
      if (d.returnDate && d.departureDate && d.returnDate < d.departureDate) errors.returnDate = 'Return date cannot be before departure.';
      if (Number(d.adults || 0) + Number(d.children || 0) + Number(d.infants || 0) < 1) errors.adults = 'Add at least one passenger.';
      return errors;
    }
  },
  accommodation: {
    serviceType: 'ACCOMMODATION', shortTitle: 'Accommodation', title: 'Accommodation', icon: '⌂',
    fields: [
      { name: 'destination', label: 'Destination', required: true },
      { name: 'checkInDate', label: 'Check-in date', type: 'date', required: true },
      { name: 'checkOutDate', label: 'Check-out date', type: 'date', required: true },
      { name: 'numberOfNights', label: 'Number of nights', type: 'number', min: 1, readonly: true },
      { name: 'adults', label: 'Adults', type: 'number', min: 1, value: 1, required: true },
      { name: 'children', label: 'Children', type: 'number', min: 0, value: 0 },
      { name: 'rooms', label: 'Number of rooms', type: 'number', min: 1, value: 1, required: true },
      { name: 'accommodationType', label: 'Accommodation type', type: 'select', options: choices('HOTEL', 'RESORT', 'LODGE', 'APARTMENT', 'GUESTHOUSE') },
      { name: 'starRating', label: 'Preferred star rating', type: 'select', options: choices('ANY', '3_STAR', '4_STAR', '5_STAR') },
      { name: 'mealPlan', label: 'Meal plan', type: 'select', options: choices('ROOM_ONLY', 'BREAKFAST', 'HALF_BOARD', 'FULL_BOARD', 'ALL_INCLUSIVE') },
      { name: 'budgetRange', label: 'Budget range' },
      { name: 'specialRequests', label: 'Special requests', type: 'textarea', full: true }
    ],
    validate(d) {
      const errors = {};
      if (d.checkInDate && d.checkOutDate && d.checkOutDate <= d.checkInDate) errors.checkOutDate = 'Check-out must be after check-in.';
      return errors;
    }
  },
  'car-rental': {
    serviceType: 'CAR_RENTAL', shortTitle: 'Car Rental', title: 'Car Rental', icon: '◆',
    fields: [
      { name: 'pickupLocation', label: 'Pickup location', required: true }, { name: 'dropoffLocation', label: 'Drop-off location' },
      { name: 'pickupDate', label: 'Pickup date', type: 'date', required: true }, { name: 'pickupTime', label: 'Pickup time', type: 'time' },
      { name: 'returnDate', label: 'Return date', type: 'date' }, { name: 'returnTime', label: 'Return time', type: 'time' },
      { name: 'vehicleClass', label: 'Vehicle class', type: 'select', options: choices('ECONOMY', 'COMPACT', 'SUV', 'LUXURY', 'VAN') },
      { name: 'passengers', label: 'Number of passengers', type: 'number', min: 1, value: 1 },
      { name: 'bags', label: 'Number of bags', type: 'number', min: 0, value: 0 },
      { name: 'driveType', label: 'Driving option', type: 'select', options: [opt('SELF_DRIVE', 'Self-drive'), opt('CHAUFFEUR', 'Chauffeur')] },
      { name: 'driverAge', label: 'Driver age', type: 'number', min: 18, showWhen: values => values.driveType === 'SELF_DRIVE' },
      { name: 'specialRequirements', label: 'Special requirements', type: 'textarea', full: true }
    ],
    validate(d) {
      const errors = {};
      if (d.returnDate && d.pickupDate && d.returnDate < d.pickupDate) errors.returnDate = 'Return date cannot be before pickup.';
      if (d.driveType === 'SELF_DRIVE' && !d.driverAge) errors.driverAge = 'Driver age is required for self-drive.';
      return errors;
    }
  },
  'visa-services': {
    serviceType: 'VISA', shortTitle: 'Visa', title: 'Visa Services', icon: '▣',
    fields: [
      { name: 'nationality', label: 'Nationality', required: true }, { name: 'countryOfResidence', label: 'Country of residence' },
      { name: 'destinationCountry', label: 'Destination country', required: true }, { name: 'purposeOfTravel', label: 'Purpose of travel' },
      { name: 'intendedTravelDate', label: 'Intended travel date', type: 'date', required: true }, { name: 'lengthOfStay', label: 'Length of stay' },
      { name: 'travellers', label: 'Number of travellers', type: 'number', min: 1, value: 1 }, { name: 'existingVisaStatus', label: 'Existing visa status' },
      { name: 'passportExpiryDate', label: 'Passport expiry date', type: 'date' }, { name: 'assistanceRequired', label: 'Assistance required' },
      { name: 'notes', label: 'Notes', type: 'textarea', full: true }
    ],
    validate(d) {
      const errors = {};
      if (d.passportExpiryDate && d.intendedTravelDate && d.passportExpiryDate <= d.intendedTravelDate) errors.passportExpiryDate = 'Passport expiry must be later than the travel date.';
      return errors;
    }
  },
  'holiday-packages': {
    serviceType: 'HOLIDAY_PACKAGE', shortTitle: 'Packages', title: 'Holiday Packages', icon: '◎',
    fields: [
      { name: 'preferredPackage', label: 'Destination or package', type: 'select', options: [opt('', 'Custom package')] },
      { name: 'destination', label: 'Destination', required: true }, { name: 'departureDate', label: 'Preferred departure date', type: 'date' },
      { name: 'numberOfNights', label: 'Number of nights', type: 'number', min: 1 }, { name: 'adults', label: 'Adults', type: 'number', min: 1, value: 1 },
      { name: 'children', label: 'Children', type: 'number', min: 0, value: 0 }, { name: 'departureCity', label: 'Departure city' },
      { name: 'travelPreference', label: 'Travel preference', type: 'select', options: choices('FLIGHT', 'COACH', 'SELF_DRIVE') },
      { name: 'activityInterests', label: 'Activity interests' }, { name: 'mealPreference', label: 'Meal preference' },
      { name: 'budgetRange', label: 'Budget range' }, { name: 'specialRequests', label: 'Special requests', type: 'textarea', full: true }
    ]
  },
  cruises: {
    serviceType: 'CRUISE', shortTitle: 'Cruises', title: 'Cruises', icon: '≋',
    fields: [
      { name: 'cruiseRegion', label: 'Preferred cruise region', required: true }, { name: 'departurePort', label: 'Departure port' },
      { name: 'departureDate', label: 'Preferred departure date', type: 'date' }, { name: 'numberOfNights', label: 'Number of nights', type: 'number', min: 1 },
      { name: 'adults', label: 'Adults', type: 'number', min: 1, value: 1 }, { name: 'children', label: 'Children', type: 'number', min: 0, value: 0 },
      { name: 'cabinType', label: 'Cabin type', type: 'select', options: choices('INSIDE', 'OCEAN_VIEW', 'BALCONY', 'SUITE') },
      { name: 'cruiseLinePreference', label: 'Cruise-line preference' },
      { name: 'preCruiseAccommodation', label: 'Pre-cruise accommodation', type: 'checkbox' },
      { name: 'postCruiseAccommodation', label: 'Post-cruise accommodation', type: 'checkbox' },
      { name: 'flightAssistance', label: 'Flight assistance required', type: 'checkbox' },
      { name: 'specialRequests', label: 'Special requests', type: 'textarea', full: true }
    ]
  }
};

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

export function setPackageChoices(packages) {
  serviceFormDefinitions['holiday-packages'].fields[0].options = [
    opt('', 'Custom package'),
    ...packages.map(pkg => opt(pkg.id, `${pkg.name} — ${pkg.destination}`))
  ];
}

export function renderServiceForm(root, slug, request = null) {
  const definition = serviceFormDefinitions[slug];
  if (!definition) return false;
  const values = request?.details || {};
  const field = config => {
    const id = `qb-${config.name}`;
    const value = values[config.name] ?? config.value ?? '';
    const attrs = `${config.required ? ' required aria-required="true"' : ''}${config.min !== undefined ? ` min="${config.min}"` : ''}${config.readonly ? ' readonly' : ''} aria-describedby="${id}-error"`;
    let control = '';
    if (config.type === 'select') control = `<select id="${id}" name="${config.name}"${attrs}>${config.options.map(item => `<option value="${escapeHtml(item.value)}"${String(item.value) === String(value) ? ' selected' : ''}>${escapeHtml(item.label)}</option>`).join('')}</select>`;
    else if (config.type === 'textarea') control = `<textarea id="${id}" name="${config.name}" rows="3"${attrs}>${escapeHtml(value)}</textarea>`;
    else if (config.type === 'checkbox') return `<label class="app-check qb-checkbox${config.full ? ' app-field-full' : ''}" data-field="${config.name}"><input id="${id}" name="${config.name}" type="checkbox"${value === true || value === 'on' ? ' checked' : ''}> <span>${escapeHtml(config.label)}</span></label>`;
    else control = `<input id="${id}" name="${config.name}" type="${config.type || 'text'}" value="${escapeHtml(value)}"${attrs}>`;
    return `<div class="app-field${config.full ? ' app-field-full' : ''}" data-field="${config.name}"><label for="${id}">${escapeHtml(config.label)}${config.required ? ' <span aria-hidden="true">*</span>' : ''}</label>${control}<p class="field-error" id="${id}-error" aria-live="polite"></p></div>`;
  };
  root.innerHTML = `<form class="qb-service-form" id="serviceRequestForm" novalidate><div class="qb-form-heading"><span class="app-service-icon" aria-hidden="true">${definition.icon}</span><div><p class="qb-kicker">Currently editing</p><h2>${definition.title}</h2></div></div><div class="service-form-grid">${definition.fields.map(field).join('')}</div></form>`;
  const form = root.querySelector('form');
  const update = () => {
    const valuesNow = Object.fromEntries(new FormData(form));
    definition.fields.forEach(config => {
      if (!config.showWhen) return;
      const wrapper = form.querySelector(`[data-field="${config.name}"]`);
      wrapper.hidden = !config.showWhen(valuesNow);
    });
    if (slug === 'accommodation') {
      form.elements.numberOfNights.value = calculateNumberOfNights(form.elements.checkInDate.value, form.elements.checkOutDate.value) || '';
    }
  };
  form.addEventListener('change', update);
  update();
  return true;
}

export function readServiceForm(root, slug) {
  const definition = serviceFormDefinitions[slug];
  const form = root.querySelector('#serviceRequestForm');
  const details = Object.fromEntries(new FormData(form));
  definition.fields.filter(field => field.type === 'checkbox').forEach(field => { details[field.name] = form.elements[field.name].checked; });
  const errors = {};
  definition.fields.forEach(field => {
    if (field.showWhen && !field.showWhen(details)) return;
    if (field.required && !String(details[field.name] || '').trim()) errors[field.name] = `${field.label} is required.`;
    if (field.type === 'number' && details[field.name] && Number(details[field.name]) < (field.min || 0)) errors[field.name] = `${field.label} must be at least ${field.min}.`;
  });
  Object.assign(errors, definition.validate?.(details) || {});
  form.querySelectorAll('.field-error').forEach(node => { node.textContent = ''; });
  form.querySelectorAll('[aria-invalid]').forEach(node => node.removeAttribute('aria-invalid'));
  Object.entries(errors).forEach(([name, message]) => {
    const input = form.elements[name];
    const error = form.querySelector(`#qb-${name}-error`);
    input?.setAttribute('aria-invalid', 'true');
    if (error) error.textContent = message;
  });
  form.querySelector('[aria-invalid=true]')?.focus();
  if (Object.keys(errors).length) return null;
  return { serviceType: definition.serviceType, serviceSlug: slug, serviceTitle: definition.title, details };
}
