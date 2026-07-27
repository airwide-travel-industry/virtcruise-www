import { apiClient } from './api-client.js';
import { buildItinerary, dateForDay, formatItineraryDate } from './itinerary-builder.js';
import { addPackageRequest } from './package-quote-adapter.js';
import { readServiceForm, renderServiceForm, serviceFormDefinitions } from './service-form-renderer.js';

export const QUOTE_STORAGE_KEY = 'virtcruise.quoteBuilder.v1';
const LEGACY_KEY = 'virtcruise.enquiry.session';
const SERVICE_ORDER = ['flights', 'car-rental', 'visa-services', 'accommodation', 'holiday-packages', 'cruises'];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const uid = prefix => `${prefix}-${crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;

function blankState() {
  return {
    version: 1,
    quoteId: uid('quote'),
    tripTitle: 'My Virtcruise Trip',
    tripStartDate: '',
    tripEndDate: '',
    origin: '',
    destination: '',
    travellerCounts: { adults: 1, children: 0, infants: 0 },
    selectedServices: [],
    serviceRequests: [],
    itineraryDays: [],
    unallocatedItems: [],
    preTravelRequirements: [],
    itineraryOverrides: {},
    customer: { fullName: '', email: '', mobile: '', preferredContactMethod: 'WHATSAPP' },
    overallNotes: '',
    consent: false,
    draftStatus: 'DRAFT',
    updatedAt: new Date().toISOString()
  };
}

function loadState() {
  try {
    const value = JSON.parse(sessionStorage.getItem(QUOTE_STORAGE_KEY) || 'null');
    if (value?.version === 1 && Array.isArray(value.serviceRequests)) return { ...blankState(), ...value };
  } catch {
    // Start a clean session draft.
  }
  const state = blankState();
  try {
    const legacy = JSON.parse(sessionStorage.getItem(LEGACY_KEY) || 'null');
    (legacy?.items || []).forEach(entry => {
      state.serviceRequests.push({
        id: entry.id || uid('service'),
        serviceType: entry.serviceType,
        serviceSlug: entry.serviceSlug,
        serviceTitle: entry.serviceTitle,
        details: entry.details || {},
        status: 'DRAFT'
      });
    });
    state.customer = { ...state.customer, ...(legacy?.customer || {}) };
    state.overallNotes = legacy?.notes || '';
    state.consent = Boolean(legacy?.consent);
  } catch {
    // Legacy migration is best-effort.
  }
  return state;
}

function itineraryCount(state) {
  return state.itineraryDays.reduce((total, day) => total + day.items.length, 0) + state.unallocatedItems.length + state.preTravelRequirements.length;
}

export function createQuoteBuilder({ root, countButton, statusNode, onRequestOpen, onRequestClose }) {
  let state = loadState();
  let activeSlug = 'flights';
  let activeRequestId = null;
  let mode = 'form';
  let submitting = false;
  let success = null;
  let pendingQuickQuote = null;

  function rebuild() {
    const built = buildItinerary(state.serviceRequests, state.tripStartDate, state.itineraryOverrides);
    state.itineraryDays = built.itineraryDays;
    state.unallocatedItems = built.unallocatedItems;
    state.preTravelRequirements = built.preTravelRequirements;
    state.tripStartDate ||= built.tripStartDate;
    state.tripEndDate = built.tripEndDate;
    state.selectedServices = [...new Set(state.serviceRequests.map(request => request.serviceType))];
    const flight = state.serviceRequests.find(request => request.serviceType === 'FLIGHT')?.details;
    const stay = state.serviceRequests.find(request => request.serviceType === 'ACCOMMODATION')?.details;
    state.origin ||= flight?.departureCity || '';
    state.destination ||= flight?.destinationCity || stay?.destination || '';
    if (flight) state.travellerCounts = { adults: Number(flight.adults || 0), children: Number(flight.children || 0), infants: Number(flight.infants || 0) };
  }

  function persist(message = '') {
    rebuild();
    state.updatedAt = new Date().toISOString();
    let persisted = true;
    try {
      sessionStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(state));
      sessionStorage.removeItem(LEGACY_KEY);
    } catch (error) {
      persisted = false;
      console.error('Virtcruise quote draft could not be persisted:', error);
      announce('Your trip is updated, but this draft may not survive a refresh.');
    }
    countButton.querySelector('[data-cart-count]').textContent = state.serviceRequests.length;
    countButton.querySelector('span').textContent = 'My Trip';
    countButton.setAttribute('aria-label', `My Trip, ${state.serviceRequests.length} service${state.serviceRequests.length === 1 ? '' : 's'}`);
    if (message && persisted) announce(message);
    document.dispatchEvent(new CustomEvent('virtcruise:quote-updated', { detail: { state } }));
  }

  function announce(message) {
    statusNode.textContent = '';
    requestAnimationFrame(() => { statusNode.textContent = message; });
  }

  function serviceRequest(slug) {
    const definition = serviceFormDefinitions[slug];
    return state.serviceRequests.find(request => request.serviceType === definition.serviceType);
  }

  function headerMarkup() {
    const count = state.serviceRequests.length;
    return `<header class="qb-header">
      <p class="qb-kicker">Virtcruise · Quote Builder</p>
      <div class="qb-heading-row"><div><h1 id="appPanelTitle">Build Your Trip</h1><p>Add services, organise your itinerary and send one complete travel enquiry.</p></div><span class="qb-progress">${count} service${count === 1 ? '' : 's'} added</span></div>
      <nav class="qb-service-tabs" aria-label="Travel services">${SERVICE_ORDER.map(slug => {
        const definition = serviceFormDefinitions[slug];
        const added = state.selectedServices.includes(definition.serviceType);
        return `<button type="button" data-qb-service="${slug}" class="${slug === activeSlug && mode === 'form' ? 'active' : ''}${added ? ' added' : ''}" aria-pressed="${slug === activeSlug && mode === 'form'}"><span>${added ? '✓' : definition.icon}</span>${definition.shortTitle}<small>${added ? 'Added' : ''}</small></button>`;
      }).join('')}</nav>
    </header>`;
  }

  function miniItineraryMarkup() {
    const items = state.itineraryDays.flatMap(day => day.items.map(item => ({ ...item, dateLabel: day.date }))).slice(0, 5);
    return `<aside class="qb-summary" aria-labelledby="qbSummaryTitle"><div class="qb-summary-head"><div><p class="qb-kicker">Trip status</p><h2 id="qbSummaryTitle">${escapeHtml(state.tripTitle)}</h2></div><button type="button" data-qb-review>Review all</button></div>
      <dl><div><dt>Dates</dt><dd>${state.tripStartDate ? `${escapeHtml(state.tripStartDate)}${state.tripEndDate && state.tripEndDate !== state.tripStartDate ? ` – ${escapeHtml(state.tripEndDate)}` : ''}` : 'To be arranged'}</dd></div><div><dt>Travellers</dt><dd>${Number(state.travellerCounts.adults || 0) + Number(state.travellerCounts.children || 0) + Number(state.travellerCounts.infants || 0)}</dd></div></dl>
      <div class="qb-mini-items">${items.length ? items.map(item => `<article><time>${escapeHtml(item.dateLabel)}</time><p>${escapeHtml(item.title)}</p></article>`).join('') : '<p class="qb-empty-copy">Save a service to begin your itinerary.</p>'}</div>
      ${state.preTravelRequirements.length ? `<p class="qb-pretravel-count">${state.preTravelRequirements.length} pre-travel requirement${state.preTravelRequirements.length === 1 ? '' : 's'}</p>` : ''}
      ${state.unallocatedItems.length ? `<p class="qb-unallocated-count">${state.unallocatedItems.length} item${state.unallocatedItems.length === 1 ? '' : 's'} to arrange</p>` : ''}
    </aside>`;
  }

  function formView() {
    return `<div class="qb-workspace"><main class="qb-form-area"></main>${miniItineraryMarkup()}</div>
      <div class="qb-actions"><span class="qb-save-status" data-qb-save-status></span><button class="app-secondary" type="button" data-qb-review>Review Itinerary</button><button class="app-primary" type="button" data-qb-save>Save to My Trip</button></div>`;
  }

  function itemControls(item, index, length) {
    return `<div class="qb-item-controls">
      <button type="button" data-edit-request="${item.sourceRequestId}" aria-label="Edit ${escapeHtml(item.title)}">Edit</button>
      <button type="button" data-show-item-edit="${item.id}" aria-label="Edit itinerary wording for ${escapeHtml(item.title)}">Edit Item</button>
      <button type="button" data-move-item="${item.id}" data-direction="-1" aria-label="Move ${escapeHtml(item.title)} up"${index === 0 ? ' disabled' : ''}>↑</button>
      <button type="button" data-move-item="${item.id}" data-direction="1" aria-label="Move ${escapeHtml(item.title)} down"${index === length - 1 ? ' disabled' : ''}>↓</button>
      <span class="qb-move-day">Day <input type="number" min="1" value="${item.dayNumber || 1}" data-move-day="${item.id}" aria-label="Destination day for ${escapeHtml(item.title)}"><button type="button" data-change-day="${item.id}">Move</button></span>
      <label><input type="checkbox" data-optional-item="${item.id}"${item.optional ? ' checked' : ''}> Optional</label>
      <button type="button" data-remove-request="${item.sourceRequestId}" aria-label="Remove ${escapeHtml(item.title)}">Remove</button>
    </div>`;
  }

  function itineraryItem(item, index, length) {
    return `<article class="qb-timeline-item" data-itinerary-item="${item.id}"><time>${escapeHtml(item.startTime || '—')}</time><div><h4>${escapeHtml(item.title)}</h4>${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}${item.location ? `<small>${escapeHtml(item.location)}</small>` : ''}${itemControls(item, index, length)}<form class="qb-inline-edit" data-inline-edit="${item.id}" hidden><label>Item title<input name="title" value="${escapeHtml(item.title)}"></label><label>Description<input name="description" value="${escapeHtml(item.description)}"></label><button type="submit">Save Item</button></form></div></article>`;
  }

  function packageRequestsMarkup() {
    const packages = state.serviceRequests.filter(request => request.serviceType === 'HOLIDAY_PACKAGE' && request.details?.packageId);
    if (!packages.length) return '';
    return `<section class="qb-package-items" aria-labelledby="qbPackagesTitle"><p class="qb-kicker">Package items</p><h2 id="qbPackagesTitle">Selected travel packages</h2><div>${packages.map(request => {
      const details = request.details;
      const price = Number.isFinite(Number(details.price))
        ? `From ${new Intl.NumberFormat('en-US', { style: 'currency', currency: details.currency || 'USD', maximumFractionDigits: 0 }).format(Number(details.price))}${details.priceBasis ? ` ${escapeHtml(details.priceBasis)}` : ''}`
        : 'Price on request';
      return `<article class="qb-package-item">
        ${details.image ? `<img src="${escapeHtml(details.image)}" alt="">` : ''}
        <div><p class="qb-kicker">${escapeHtml(details.source === 'featured-tour' ? 'Featured tour' : 'Travel package')}</p><h3>${escapeHtml(details.packageName)}</h3><p>${escapeHtml(details.description)}</p>
        <ul><li>${escapeHtml(details.destination)}</li><li>${escapeHtml(details.duration || `${details.numberOfNights || '—'} nights`)}</li><li>${escapeHtml(price)}</li><li>${escapeHtml(details.travellers || 1)} traveller${Number(details.travellers || 1) === 1 ? '' : 's'}</li>${details.departureDate ? `<li>${escapeHtml(details.departureDate)}${details.returnDate ? ` – ${escapeHtml(details.returnDate)}` : ''}</li>` : ''}</ul>
        <div class="qb-package-actions"><button type="button" data-edit-request="${request.id}">Edit package</button><button type="button" data-remove-request="${request.id}">Remove</button>${details.detailUrl ? `<a href="${escapeHtml(details.detailUrl)}">View Details</a>` : ''}</div></div>
      </article>`;
    }).join('')}</div></section>`;
  }

  function packageEditorContext(request) {
    const details = request?.details;
    if (!details?.packageId) return '';
    const price = Number.isFinite(Number(details.price))
      ? `Estimated package price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: details.currency || 'USD', maximumFractionDigits: 0 }).format(Number(details.price))}${details.priceBasis ? ` ${escapeHtml(details.priceBasis)}` : ''}`
      : 'Package price confirmed in your final quotation';
    return `<aside class="qb-package-context" aria-label="${escapeHtml(details.packageName)} package information">
      ${details.image ? `<img src="${escapeHtml(details.image)}" alt="">` : ''}<div><p class="qb-kicker">${escapeHtml(details.source === 'featured-tour' ? 'Featured tour' : 'Selected package')}</p><h2>${escapeHtml(details.packageName)}</h2><p>${escapeHtml(details.description)}</p>
      <p class="qb-package-context-meta">${escapeHtml(details.duration)} · ${escapeHtml(price)}</p>
      ${details.inclusions?.length ? `<details><summary>Included services</summary><ul>${details.inclusions.map(inclusion => `<li>${escapeHtml(inclusion)}</li>`).join('')}</ul></details>` : ''}</div>
    </aside>`;
  }

  function reviewView() {
    const travellers = Number(state.travellerCounts.adults || 0) + Number(state.travellerCounts.children || 0) + Number(state.travellerCounts.infants || 0);
    return `<div class="qb-review">
      ${pendingQuickQuote ? `<div class="qb-conflict" role="status"><div><strong>Keep your existing trip details?</strong><p>The Quick Quote contains different destination or date information.</p></div><button type="button" data-quick-keep>Keep Existing</button><button type="button" data-quick-use>Use Quick Quote</button></div>` : ''}
      <section class="qb-trip-editor" aria-labelledby="tripDetailsTitle"><div><p class="qb-kicker">Trip details</p><h2 id="tripDetailsTitle">Your itinerary</h2></div><div class="qb-trip-fields"><label>Trip name<input name="tripTitle" value="${escapeHtml(state.tripTitle)}"></label><label>Trip start date<input name="tripStartDate" type="date" value="${escapeHtml(state.tripStartDate)}"></label></div>
      <div class="qb-trip-facts"><span>${escapeHtml(state.destination || 'Destination to be arranged')}</span><span>${travellers} traveller${travellers === 1 ? '' : 's'}</span><span>${state.selectedServices.length} services</span></div></section>
      ${packageRequestsMarkup()}
      ${state.preTravelRequirements.length ? `<section class="qb-itinerary-group qb-pretravel"><p class="qb-kicker">Pre-travel requirements</p>${state.preTravelRequirements.map((item, index, array) => itineraryItem(item, index, array.length)).join('')}</section>` : ''}
      <div class="qb-days">${state.itineraryDays.map(day => `<section class="qb-day"><header><span>Day ${day.dayNumber || '—'}</span><div><h3>${escapeHtml(formatItineraryDate(day.date))}</h3><small>${escapeHtml(day.date)}</small></div></header>${day.items.map((item, index) => itineraryItem(item, index, day.items.length)).join('')}</section>`).join('')}</div>
      ${state.unallocatedItems.length ? `<section class="qb-itinerary-group qb-unallocated"><p class="qb-kicker">Day to be arranged</p>${state.unallocatedItems.map((item, index, array) => `<div>${itineraryItem(item, index, array.length)}<label class="qb-assign">Assign to day <input type="number" min="1" value="1" data-assign-day="${item.id}"><button type="button" data-assign-item="${item.id}">Assign</button></label></div>`).join('')}</section>` : ''}
      <form class="qb-custom-form" data-custom-form><p class="qb-kicker">Add to itinerary</p><div><label>Custom activity or note<input name="title" required></label><label>Date (optional)<input name="date" type="date"></label><label>Time<input name="startTime" type="time"></label><label class="app-check"><input name="optional" type="checkbox"> Optional</label><button class="app-secondary" type="submit">Add Item</button></div></form>
    </div><div class="qb-actions"><button class="app-secondary" type="button" data-qb-service="${activeSlug}">Add Another Service</button><button class="app-primary" type="button" data-qb-checkout>Request This Quote</button></div>`;
  }

  function checkoutView() {
    return `<div class="qb-final-review"><section><p class="qb-kicker">Final review</p><h2>Request this quote</h2><p>${state.serviceRequests.length} services and ${itineraryCount(state)} itinerary items will be sent to Virtcruise.</p>${miniItineraryMarkup()}</section>
      <form id="qbCheckoutForm" class="qb-customer-form" novalidate><p class="qb-kicker">Your contact details</p><div class="service-form-grid">
        ${customerField('fullName', 'Full name', 'text', state.customer.fullName)}
        ${customerField('email', 'Email address', 'email', state.customer.email)}
        ${customerField('mobile', 'Mobile number', 'tel', state.customer.mobile)}
        <div class="app-field"><label for="qb-contact">Preferred contact method</label><select id="qb-contact" name="preferredContactMethod"><option value="WHATSAPP">WhatsApp</option><option value="EMAIL"${state.customer.preferredContactMethod === 'EMAIL' ? ' selected' : ''}>Email</option><option value="PHONE"${state.customer.preferredContactMethod === 'PHONE' ? ' selected' : ''}>Phone call</option></select><p class="field-error"></p></div>
        <div class="app-field app-field-full"><label for="qb-notes">Overall notes</label><textarea id="qb-notes" name="overallNotes" rows="4">${escapeHtml(state.overallNotes)}</textarea><p class="field-error"></p></div>
        <label class="app-check app-field-full"><input name="consent" type="checkbox"${state.consent ? ' checked' : ''}> I agree that Virtcruise Travels may contact me regarding this enquiry.</label><p class="field-error app-field-full" id="qb-consent-error"></p>
      </div><div class="submission-error" data-qb-error role="alert"></div></form></div>
      <div class="qb-actions"><button class="app-secondary" type="button" data-qb-review>Back to Itinerary</button><button class="app-primary" type="button" data-qb-submit${submitting ? ' disabled' : ''}>${submitting ? 'Sending…' : 'Submit Quote Request'}</button></div>`;
  }

  function customerField(name, label, type, value) {
    return `<div class="app-field"><label for="qb-${name}">${label} <span aria-hidden="true">*</span></label><input id="qb-${name}" name="${name}" type="${type}" value="${escapeHtml(value)}"><p class="field-error" id="qb-${name}-error"></p></div>`;
  }

  function successView() {
    return `<section class="success-panel qb-success"><span class="success-icon" aria-hidden="true">✓</span><p class="qb-kicker">Prototype quote saved</p><h2>Your trip draft is ready</h2><p>${escapeHtml(success.message)}</p><div class="reference-card"><span>Prototype reference</span><strong>${escapeHtml(success.quoteId)}</strong><small>Status: ${escapeHtml(success.status)}</small></div><p>This static prototype has not sent the request to Virtcruise.</p><div class="success-actions"><button class="app-secondary" type="button" data-qb-close>Close</button><button class="app-primary" type="button" data-qb-new>Start New Trip</button></div></section>`;
  }

  function render() {
    rebuild();
    root.innerHTML = success ? successView() : `${headerMarkup()}<div class="qb-body">${mode === 'form' ? formView() : mode === 'review' ? reviewView() : checkoutView()}</div>`;
    if (!success && mode === 'form') {
      const request = activeRequestId ? state.serviceRequests.find(entry => entry.id === activeRequestId) : serviceRequest(activeSlug);
      const formArea = root.querySelector('.qb-form-area');
      renderServiceForm(formArea, activeSlug, request);
      if (request?.details?.packageId) formArea.insertAdjacentHTML('afterbegin', packageEditorContext(request));
    }
    root.closest('.enquiry-app').dataset.mode = 'quote-builder';
  }

  function openService(slug, requestId = null) {
    activeSlug = serviceFormDefinitions[slug] ? slug : 'flights';
    activeRequestId = requestId;
    mode = 'form';
    success = null;
    render();
    onRequestOpen();
    requestAnimationFrame(() => root.querySelector('input,select,textarea')?.focus());
  }

  function openReview() {
    mode = 'review';
    success = null;
    render();
    onRequestOpen();
    requestAnimationFrame(() => root.querySelector('input,button')?.focus());
  }

  function openCheckout() {
    mode = 'checkout';
    render();
    onRequestOpen();
  }

  function saveActive() {
    const values = readServiceForm(root, activeSlug);
    if (!values) return;
    const existing = activeRequestId ? state.serviceRequests.find(request => request.id === activeRequestId) : serviceRequest(activeSlug);
    if (existing) Object.assign(existing, values, { details: { ...(existing.details || {}), ...(values.details || {}) }, status: 'SAVED', updatedAt: new Date().toISOString() });
    else state.serviceRequests.push({ id: uid('service'), ...values, status: 'SAVED', createdAt: new Date().toISOString() });
    activeRequestId = null;
    persist(`${values.serviceTitle} saved to My Trip.`);
    render();
    const saveStatus = root.querySelector('[data-qb-save-status]');
    if (saveStatus) saveStatus.textContent = '✓ Saved';
  }

  function removeRequest(id) {
    state.serviceRequests = state.serviceRequests.filter(request => request.id !== id);
    Object.keys(state.itineraryOverrides).filter(key => key.startsWith(`${id}:`)).forEach(key => delete state.itineraryOverrides[key]);
    persist('Service removed from your trip.');
    render();
  }

  function changeItem(id, changes) {
    state.itineraryOverrides[id] = { ...(state.itineraryOverrides[id] || {}), ...changes };
    persist('Itinerary updated.');
    render();
  }

  function moveItem(id, direction) {
    const groups = [...state.itineraryDays.map(day => day.items), state.unallocatedItems, state.preTravelRequirements];
    const group = groups.find(items => items.some(item => item.id === id));
    if (!group) return;
    const index = group.findIndex(item => item.id === id);
    const target = index + Number(direction);
    if (target < 0 || target >= group.length) return;
    const reordered = [...group];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    reordered.forEach((entry, sortOrder) => {
      state.itineraryOverrides[entry.id] = { ...(state.itineraryOverrides[entry.id] || {}), sortOrder };
    });
    persist('Itinerary order updated.');
    render();
  }

  function captureCustomer() {
    const form = root.querySelector('#qbCheckoutForm');
    const data = new FormData(form);
    state.customer = {
      fullName: String(data.get('fullName') || '').trim(),
      email: String(data.get('email') || '').trim(),
      mobile: String(data.get('mobile') || '').trim(),
      preferredContactMethod: String(data.get('preferredContactMethod') || 'WHATSAPP')
    };
    state.overallNotes = String(data.get('overallNotes') || '');
    state.consent = data.get('consent') === 'on';
    persist();
    return form;
  }

  async function submit() {
    if (submitting) return;
    const form = captureCustomer();
    const errors = {};
    if (!state.customer.fullName) errors.fullName = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.customer.email)) errors.email = 'Enter a valid email address.';
    if (!state.customer.mobile) errors.mobile = 'Mobile number is required.';
    if (!state.consent) errors.consent = 'Consent is required.';
    Object.entries(errors).forEach(([name, message]) => {
      const field = form.elements[name];
      field?.setAttribute('aria-invalid', 'true');
      const error = root.querySelector(`#qb-${name}-error`);
      if (error) error.textContent = message;
    });
    if (Object.keys(errors).length) {
      form.querySelector('[aria-invalid=true]')?.focus();
      return;
    }
    submitting = true;
    render();
    try {
      success = await apiClient.submitQuote({ ...state, source: 'VIRTCRUISE_WWW' });
      state = blankState();
      sessionStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(state));
      persist();
      render();
    } catch (error) {
      submitting = false;
      render();
      root.querySelector('[data-qb-error]').textContent = error.message || 'The quote could not be submitted. Please try again.';
      return;
    }
    submitting = false;
  }

  function applyQuickQuote(values) {
    const conflicts = [];
    if (state.destination && values.destination && state.destination !== values.destination) conflicts.push('destination');
    if (state.tripStartDate && values.departureDate && state.tripStartDate !== values.departureDate) conflicts.push('travel dates');
    if (conflicts.length) pendingQuickQuote = values;
    state.destination ||= values.destination || '';
    state.tripStartDate ||= values.departureDate || '';
    state.tripEndDate ||= values.returnDate || '';
    state.customer.fullName ||= values.fullName || '';
    state.customer.email ||= values.email || '';
    state.customer.mobile ||= values.mobile || '';
    if (!state.serviceRequests.length) {
      state.serviceRequests.push({
        id: uid('service'),
        serviceType: 'HOLIDAY_PACKAGE',
        serviceSlug: 'holiday-packages',
        serviceTitle: 'Holiday Packages',
        status: 'DRAFT',
        details: { destination: values.destination, departureDate: values.departureDate, adults: values.travellers, budgetRange: values.budget, requestSource: 'QUICK_QUOTE' }
      });
    }
    persist(conflicts.length ? `Choose whether to keep your existing ${conflicts.join(' and ')}.` : 'Quick Quote added to your trip draft.');
    openReview();
  }

  function addPackageToTrip(packageData, options = {}) {
    const result = addPackageRequest(state, packageData, { ...options, createId: () => uid('service') });
    persist(result.status === 'added' ? `${packageData.name} added to My Trip.` : `${packageData.name} is already in My Trip.`);
    return result;
  }

  function openPackage(packageData) {
    const result = addPackageToTrip(packageData, { source: 'package-shop' });
    openService('holiday-packages', result.request.id);
    return result;
  }

  function addFeaturedPackage(packageData, activityOption) {
    const activities = activityOption === 'OPTION_B'
      ? ['Game Drive', 'Helicopter Flight']
      : ['Chobe Day Trip', 'Standard Sunset Cruise', 'Guided Rainforest Tour'];
    const result = addPackageRequest(state, packageData, { source: 'victoria-falls-feature', createId: () => uid('service') });
    const existing = result.request;
    const details = {
      ...(existing?.details || {}),
      packageName: 'Victoria Falls Holiday Package',
      preferredPackage: packageData.id,
      destination: packageData.destination,
      numberOfNights: packageData.duration?.nights || 3,
      adults: existing?.details?.adults || 2,
      price: packageData.priceFrom,
      currency: packageData.currency,
      priceUnit: packageData.priceUnit,
      selectedActivityOption: activityOption,
      activityInterests: activities.join(', ')
    };
    Object.assign(existing, { details, status: 'SAVED', updatedAt: new Date().toISOString() });
    state.destination ||= packageData.destination;
    persist('Victoria Falls Holiday Package added to My Trip.');
    openReview();
  }

  root.addEventListener('click', event => {
    const service = event.target.closest('[data-qb-service]');
    if (service) openService(service.dataset.qbService);
    if (event.target.closest('[data-qb-save]')) saveActive();
    if (event.target.closest('[data-qb-review]')) openReview();
    if (event.target.closest('[data-qb-checkout]')) openCheckout();
    if (event.target.closest('[data-qb-submit]')) submit();
    if (event.target.closest('[data-qb-close]')) onRequestClose();
    if (event.target.closest('[data-qb-new]')) {
      success = null;
      state = blankState();
      persist('A new trip draft is ready.');
      openService('flights');
    }
    if (event.target.closest('[data-quick-keep]')) {
      pendingQuickQuote = null;
      announce('Existing trip details kept.');
      render();
    }
    if (event.target.closest('[data-quick-use]')) {
      state.destination = pendingQuickQuote.destination || state.destination;
      state.tripStartDate = pendingQuickQuote.departureDate || state.tripStartDate;
      state.tripEndDate = pendingQuickQuote.returnDate || state.tripEndDate;
      pendingQuickQuote = null;
      persist('Quick Quote trip details applied.');
      render();
    }
    const edit = event.target.closest('[data-edit-request]');
    if (edit) {
      const request = state.serviceRequests.find(entry => entry.id === edit.dataset.editRequest);
      if (request?.serviceSlug) openService(request.serviceSlug, request.id);
    }
    const showItemEdit = event.target.closest('[data-show-item-edit]');
    if (showItemEdit) {
      const form = root.querySelector(`[data-inline-edit="${CSS.escape(showItemEdit.dataset.showItemEdit)}"]`);
      form.hidden = !form.hidden;
      if (!form.hidden) form.elements.title.focus();
    }
    const remove = event.target.closest('[data-remove-request]');
    if (remove) removeRequest(remove.dataset.removeRequest);
    const move = event.target.closest('[data-move-item]');
    if (move) moveItem(move.dataset.moveItem, move.dataset.direction);
    const changeDay = event.target.closest('[data-change-day]');
    if (changeDay) {
      const input = root.querySelector(`[data-move-day="${CSS.escape(changeDay.dataset.changeDay)}"]`);
      const date = dateForDay(state.tripStartDate, input.value);
      if (date) changeItem(changeDay.dataset.changeDay, { date, dayNumber: Number(input.value) });
      else announce('Set a trip start date before moving itinerary items between days.');
    }
    const assign = event.target.closest('[data-assign-item]');
    if (assign) {
      const input = root.querySelector(`[data-assign-day="${CSS.escape(assign.dataset.assignItem)}"]`);
      const date = dateForDay(state.tripStartDate, input.value);
      if (!date) {
        announce('Set a trip start date before assigning an item to a day.');
        input.focus();
      } else changeItem(assign.dataset.assignItem, { date, dayNumber: Number(input.value) });
    }
  });

  root.addEventListener('change', event => {
    if (event.target.matches('[data-optional-item]')) changeItem(event.target.dataset.optionalItem, { optional: event.target.checked });
    if (event.target.name === 'tripTitle') {
      state.tripTitle = event.target.value.trim() || 'My Virtcruise Trip';
      persist('Trip name updated.');
    }
    if (event.target.name === 'tripStartDate') {
      state.tripStartDate = event.target.value;
      persist('Trip start date updated.');
      render();
    }
  });

  root.addEventListener('submit', event => {
    if (event.target.matches('[data-inline-edit]')) {
      event.preventDefault();
      const data = new FormData(event.target);
      changeItem(event.target.dataset.inlineEdit, { title: data.get('title'), description: data.get('description') });
      return;
    }
    if (!event.target.matches('[data-custom-form]')) return;
    event.preventDefault();
    const data = new FormData(event.target);
    state.serviceRequests.push({
      id: uid('custom'),
      serviceType: 'CUSTOM_ACTIVITY',
      serviceSlug: '',
      serviceTitle: 'Custom Activity',
      status: 'SAVED',
      details: { title: data.get('title'), date: data.get('date'), startTime: data.get('startTime'), optional: data.get('optional') === 'on' }
    });
    persist('Custom itinerary item added.');
    render();
  });

  root.addEventListener('input', event => {
    if (event.target.closest('#qbCheckoutForm')) captureCustomer();
  });

  persist();
  return {
    openService,
    openReview,
    openCheckout,
    applyQuickQuote,
    openPackage,
    addPackageToTrip,
    hasPackage: packageId => state.serviceRequests.some(request => request.serviceType === 'HOLIDAY_PACKAGE' && (request.packageId === packageId || request.details?.packageId === packageId || request.details?.preferredPackage === packageId)),
    addFeaturedPackage,
    getState: () => state,
    render,
    close: onRequestClose
  };
}
