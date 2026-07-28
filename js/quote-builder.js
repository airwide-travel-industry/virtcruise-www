import { apiClient } from './api-client.js';
import { dateForDay, formatItineraryDate } from './itinerary-builder.js';
import { addPackageRequest } from './package-quote-adapter.js';
import { addCustomActivity } from './quote-domains/activities.js';
import { updateCustomer } from './quote-domains/customer.js';
import { estimatedPackagePrice } from './quote-domains/packages.js';
import { moveServiceRequest, removeServiceRequest, upsertServiceRequest } from './quote-domains/service-requests.js';
import { updateSpecialRequests } from './quote-domains/special-requests.js';
import { createId } from './quote-domains/shared.js';
import { totalTravellers, updateTravellers } from './quote-domains/travellers.js';
import { createBlankQuoteState, loadQuoteState, persistQuoteState, QUOTE_STORAGE_KEY, rebuildQuoteState } from './quote-state.js';
import { readServiceForm, renderServiceForm, serviceFormDefinitions } from './service-form-renderer.js';

export { QUOTE_STORAGE_KEY };
const SERVICE_ORDER = ['flights', 'car-rental', 'visa-services', 'accommodation', 'holiday-packages', 'cruises'];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function itineraryCount(state) {
  return state.itineraryDays.reduce((total, day) => total + day.items.length, 0) + state.unallocatedItems.length + state.preTravelRequirements.length;
}

export function createQuoteBuilder({ root, countButton, statusNode, onRequestOpen, onRequestClose }) {
  let state = loadQuoteState();
  let activeSlug = 'flights';
  let activeRequestId = null;
  let mode = 'form';
  let submitting = false;
  let success = null;
  let pendingQuickQuote = null;
  let pendingRemovalId = null;
  let customerPersistTimer = 0;

  function rebuild() {
    rebuildQuoteState(state);
  }

  function persist(message = '') {
    rebuild();
    state.updatedAt = new Date().toISOString();
    let persisted = true;
    try {
      persistQuoteState(state);
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
      <div class="qb-heading-row"><div><h1 id="appPanelTitle">Build Your Trip</h1><p>Add services, organise your itinerary and send one complete travel enquiry.</p></div><span class="qb-progress">${state.draftStatus === 'QUEUED_OFFLINE' ? 'Not sent · queued offline' : `${count} service${count === 1 ? '' : 's'} added`}</span></div>
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

  function serviceRequestsMarkup() {
    if (!state.serviceRequests.length) {
      return '<section class="qb-trip-empty"><h2>Your trip is ready to build</h2><p>Add a package or travel service to create your itinerary.</p><button class="app-primary" type="button" data-qb-service="flights">Add your first service</button></section>';
    }
    const ignoredDetails = new Set(['image', 'availableAddOns', 'inclusions', 'requestSource']);
    const detailLabel = key => key.replace(/([A-Z])/g, ' $1').replace(/^./, value => value.toUpperCase());
    return `<section class="qb-service-review" aria-labelledby="qbServicesTitle">
      <div class="qb-review-section-head"><div><p class="qb-kicker">My Trip</p><h2 id="qbServicesTitle">Packages and services</h2></div><span>${state.serviceRequests.length} item${state.serviceRequests.length === 1 ? '' : 's'}</span></div>
      <div class="qb-service-review-list">${state.serviceRequests.map((request, index) => {
        const details = request.details || {};
        const title = details.packageName || request.serviceTitle;
        const facts = Object.entries(details)
          .filter(([key, value]) => !ignoredDetails.has(key) && value !== '' && value !== false && value != null && !Array.isArray(value))
          .slice(0, 8);
        const price = Number(details.price);
        const estimate = Number.isFinite(price)
          ? `<strong>${new Intl.NumberFormat('en-US', { style: 'currency', currency: details.currency || 'USD', maximumFractionDigits: 0 }).format(price)} <small>estimated</small></strong>`
          : '';
        return `<details class="qb-service-review-item"${index === 0 ? ' open' : ''}>
          <summary><span class="qb-service-order">${index + 1}</span><span><small>${escapeHtml(request.serviceType.replaceAll('_', ' '))}</small><b>${escapeHtml(title)}</b></span>${estimate}<span class="qb-expand-label">Details</span></summary>
          <div class="qb-service-review-body">${details.description ? `<p>${escapeHtml(details.description)}</p>` : ''}
            <dl>${facts.map(([key, value]) => `<div><dt>${escapeHtml(detailLabel(key))}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>
            ${details.notes || details.specialRequests || details.specialRequirements ? `<p class="qb-service-notes"><strong>Notes:</strong> ${escapeHtml(details.notes || details.specialRequests || details.specialRequirements)}</p>` : ''}
            <div class="qb-service-review-actions">
              ${request.serviceSlug ? `<button type="button" data-edit-request="${request.id}">Edit</button>` : ''}
              <button type="button" data-move-request="${request.id}" data-direction="-1"${index === 0 ? ' disabled' : ''} aria-label="Move ${escapeHtml(title)} up">Move up</button>
              <button type="button" data-move-request="${request.id}" data-direction="1"${index === state.serviceRequests.length - 1 ? ' disabled' : ''} aria-label="Move ${escapeHtml(title)} down">Move down</button>
              <button type="button" data-remove-request="${request.id}" aria-label="Remove ${escapeHtml(title)}">Remove</button>
              ${details.detailUrl ? `<a href="${escapeHtml(details.detailUrl)}">View details</a>` : ''}
            </div>
          </div>
        </details>`;
      }).join('')}</div>
    </section>`;
  }

  function packageEditorContext(request) {
    const details = request?.details;
    if (!details?.packageId) return '';
    const price = Number.isFinite(Number(details.price))
      ? `Estimated package price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: details.currency || 'USD', maximumFractionDigits: 0 }).format(Number(details.price))}${details.priceBasis ? ` ${escapeHtml(details.priceBasis)}` : ''}`
      : 'Package price confirmed in your final quotation';
    return `<aside class="qb-package-context" aria-label="${escapeHtml(details.packageName)} package information">
      ${details.image ? `<img src="${escapeHtml(details.image)}" loading="lazy" decoding="async" alt="">` : ''}<div><p class="qb-kicker">${escapeHtml(details.source === 'featured-tour' ? 'Featured tour' : 'Selected package')}</p><h2>${escapeHtml(details.packageName)}</h2><p>${escapeHtml(details.description)}</p>
      <p class="qb-package-context-meta">${escapeHtml(details.duration)} · ${escapeHtml(price)}</p>
      ${details.inclusions?.length ? `<details><summary>Included services</summary><ul>${details.inclusions.map(inclusion => `<li>${escapeHtml(inclusion)}</li>`).join('')}</ul></details>` : ''}</div>
    </aside>`;
  }

  function reviewView() {
    const travellers = totalTravellers(state);
    const estimatedPrice = estimatedPackagePrice(state);
    const estimatedPriceLabel = estimatedPrice?.mixed
      ? 'Estimated package prices in multiple currencies'
      : estimatedPrice
        ? `Estimated package price ${new Intl.NumberFormat('en-US', { style: 'currency', currency: estimatedPrice.currency, maximumFractionDigits: 0 }).format(estimatedPrice.amount)}`
        : '';
    return `<div class="qb-review">
      ${pendingQuickQuote ? `<div class="qb-conflict" role="status"><div><strong>Keep your existing trip details?</strong><p>The Quick Quote contains different destination or date information.</p></div><button type="button" data-quick-keep>Keep Existing</button><button type="button" data-quick-use>Use Quick Quote</button></div>` : ''}
      <section class="qb-trip-editor" aria-labelledby="tripDetailsTitle"><div><p class="qb-kicker">Trip details</p><h2 id="tripDetailsTitle">Your itinerary</h2></div><div class="qb-trip-fields"><label>Trip name<input name="tripTitle" value="${escapeHtml(state.tripTitle)}"></label><label>Trip start date<input name="tripStartDate" type="date" value="${escapeHtml(state.tripStartDate)}"></label></div>
      <div class="qb-trip-facts"><span>${escapeHtml(state.destination || 'Destination to be arranged')}</span><span>${state.tripStartDate ? `${escapeHtml(state.tripStartDate)}${state.tripEndDate ? ` – ${escapeHtml(state.tripEndDate)}` : ''}` : 'Travel dates to be arranged'}</span><span>${travellers} traveller${travellers === 1 ? '' : 's'}</span><span>${state.selectedServices.length} services</span>${estimatedPriceLabel ? `<span>${escapeHtml(estimatedPriceLabel)}</span>` : ''}</div>${state.overallNotes ? `<p class="qb-overall-notes"><strong>Trip notes:</strong> ${escapeHtml(state.overallNotes)}</p>` : ''}</section>
      ${serviceRequestsMarkup()}
      ${state.preTravelRequirements.length ? `<section class="qb-itinerary-group qb-pretravel"><p class="qb-kicker">Pre-travel requirements</p>${state.preTravelRequirements.map((item, index, array) => itineraryItem(item, index, array.length)).join('')}</section>` : ''}
      <div class="qb-days">${state.itineraryDays.map(day => `<section class="qb-day"><header><span>Day ${day.dayNumber || '—'}</span><div><h3>${escapeHtml(formatItineraryDate(day.date))}</h3><small>${escapeHtml(day.date)}</small></div></header>${day.items.map((item, index) => itineraryItem(item, index, day.items.length)).join('')}</section>`).join('')}</div>
      ${state.unallocatedItems.length ? `<section class="qb-itinerary-group qb-unallocated"><p class="qb-kicker">Day to be arranged</p>${state.unallocatedItems.map((item, index, array) => `<div>${itineraryItem(item, index, array.length)}<label class="qb-assign">Assign to day <input type="number" min="1" value="1" data-assign-day="${item.id}"><button type="button" data-assign-item="${item.id}">Assign</button></label></div>`).join('')}</section>` : ''}
      <form class="qb-custom-form" data-custom-form><p class="qb-kicker">Add to itinerary</p><div><label>Custom activity or note<input name="title" required></label><label>Date (optional)<input name="date" type="date"></label><label>Time<input name="startTime" type="time"></label><label class="app-check"><input name="optional" type="checkbox"> Optional</label><button class="app-secondary" type="submit">Add Item</button></div></form>
      ${pendingRemovalId ? `<div class="qb-confirm-backdrop"><section class="qb-confirm" role="alertdialog" aria-modal="true" aria-labelledby="qbConfirmTitle" aria-describedby="qbConfirmDescription"><h2 id="qbConfirmTitle">Remove this trip item?</h2><p id="qbConfirmDescription">The service and its generated itinerary entries will be removed from My Trip.</p><div><button type="button" data-cancel-remove>Keep item</button><button class="app-primary" type="button" data-confirm-remove>Remove item</button></div></section></div>` : ''}
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
    const isMock = success.deliveryMode !== 'BACKEND';
    return `<section class="success-panel qb-success"><span class="success-icon" aria-hidden="true">✓</span><p class="qb-kicker">${isMock ? 'Development preview' : 'Quote request received'}</p><h2>${isMock ? 'Your local mock submission is ready' : 'Thank you — your request is with Virtcruise'}</h2><p>${escapeHtml(success.message)}</p><div class="reference-card"><span>${isMock ? 'Mock reference' : 'Virtcruise reference'}</span><strong>${escapeHtml(success.quoteId)}</strong><small>Status: ${escapeHtml(success.status)}</small></div>${isMock ? '<p>Explicit mock mode is active; this request was not sent to Virtcruise.</p>' : '<p>A Virtcruise consultant will use these details to prepare your quotation.</p>'}<div class="success-actions"><button class="app-secondary" type="button" data-qb-close>Close</button><button class="app-primary" type="button" data-qb-new>Start New Trip</button></div></section>`;
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
    upsertServiceRequest(state, values, activeRequestId);
    activeRequestId = null;
    persist(`${values.serviceTitle} saved to My Trip.`);
    render();
    const saveStatus = root.querySelector('[data-qb-save-status]');
    if (saveStatus) saveStatus.textContent = '✓ Saved';
  }

  function removeRequest(id) {
    removeServiceRequest(state, id);
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

  function captureCustomer(shouldPersist = true) {
    const form = root.querySelector('#qbCheckoutForm');
    const data = new FormData(form);
    updateCustomer(state, {
      fullName: String(data.get('fullName') || '').trim(),
      email: String(data.get('email') || '').trim(),
      mobile: String(data.get('mobile') || '').trim(),
      preferredContactMethod: String(data.get('preferredContactMethod') || 'WHATSAPP')
    });
    updateSpecialRequests(state, data.get('overallNotes'));
    state.consent = data.get('consent') === 'on';
    if (shouldPersist) persist();
    return form;
  }

  async function submit() {
    if (submitting) return;
    clearTimeout(customerPersistTimer);
    const form = captureCustomer();
    const errors = {};
    form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error').forEach(error => { error.textContent = ''; });
    if (state.customer.fullName.trim().split(/\s+/).length < 2) errors.fullName = 'Enter your first name and surname.';
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
      const draftBeingSubmitted = { ...state, source: 'VIRTCRUISE_WWW' };
      success = await apiClient.submitQuote(draftBeingSubmitted);
      state = createBlankQuoteState();
      sessionStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(state));
      persist();
      render();
    } catch (error) {
      submitting = false;
      if (error.code === 'OFFLINE_QUEUED') {
        state.draftStatus = 'QUEUED_OFFLINE';
        persist('Your quote is queued offline and has not reached Virtcruise.');
      }
      render();
      root.querySelector('[data-qb-error]').textContent = error.message || 'The quote could not be submitted. Please try again.';
      return;
    }
    submitting = false;
  }

  function applyQuickQuote(values) {
    return populateQuoteBuilderFromQuickQuote(values);
  }

  function populateQuoteBuilderFromQuickQuote(values) {
    const clean = value => String(value || '').trim();
    const travellerSelection = clean(values.travellers);
    const travellerCount = travellerSelection === '3-4'
      ? 3
      : travellerSelection === '5+'
        ? 5
        : Math.max(1, Number(travellerSelection) || 1);
    const destination = clean(values.destination);
    const departureDate = clean(values.departureDate);
    const returnDate = clean(values.returnDate);
    const budget = clean(values.budget) === 'Budget (USD)' ? '' : clean(values.budget);
    const conflicts = [];
    if (state.destination && destination && state.destination !== destination) conflicts.push('destination');
    if ((state.tripStartDate && departureDate && state.tripStartDate !== departureDate)
      || (state.tripEndDate && returnDate && state.tripEndDate !== returnDate)) conflicts.push('travel dates');
    const mappedValues = {
      ...values,
      destination,
      departureDate,
      returnDate,
      travellers: travellerSelection,
      travellerCount,
      budget
    };
    pendingQuickQuote = conflicts.length ? mappedValues : null;
    state.destination ||= destination;
    state.tripStartDate ||= departureDate;
    state.tripEndDate ||= returnDate;
    state.customer.fullName ||= clean(values.fullName);
    state.customer.email ||= clean(values.email);
    state.customer.mobile ||= clean(values.mobile);
    updateTravellers(state, { adults: travellerCount });
    if (state.tripTitle === 'My Virtcruise Trip' && state.destination) state.tripTitle = `${state.destination} Trip`;

    const effectiveDestination = conflicts.includes('destination') ? state.destination : destination;
    const effectiveDeparture = conflicts.includes('travel dates') ? state.tripStartDate : departureDate;
    const effectiveReturn = conflicts.includes('travel dates') ? state.tripEndDate : returnDate;
    const start = effectiveDeparture ? new Date(`${effectiveDeparture}T12:00:00`) : null;
    const end = effectiveReturn ? new Date(`${effectiveReturn}T12:00:00`) : null;
    const numberOfNights = start && end && end > start
      ? Math.round((end - start) / 86400000)
      : '';
    const quickQuoteRequest = state.serviceRequests.find(request => request.details?.requestSource === 'QUICK_QUOTE');
    const quickQuoteDetails = {
      ...(quickQuoteRequest?.details || {}),
      destination: effectiveDestination,
      departureDate: effectiveDeparture,
      returnDate: effectiveReturn,
      numberOfNights,
      adults: travellerCount,
      travellerSelection,
      budgetRange: budget,
      requestSource: 'QUICK_QUOTE'
    };
    if (quickQuoteRequest) {
      quickQuoteRequest.details = quickQuoteDetails;
      quickQuoteRequest.updatedAt = new Date().toISOString();
    } else {
      state.serviceRequests.push({
        id: createId('service'),
        serviceType: 'HOLIDAY_PACKAGE',
        serviceSlug: 'holiday-packages',
        serviceTitle: 'Holiday Packages',
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        details: quickQuoteDetails
      });
    }
    persist(conflicts.length
      ? `Your trip has been started. Choose whether to keep your existing ${conflicts.join(' and ')}.`
      : 'Your trip has been started. Complete your itinerary below.');
    openReview();
  }

  function addPackageToTrip(packageData, options = {}) {
    const result = addPackageRequest(state, packageData, { ...options, createId: () => createId('service') });
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
    const result = addPackageRequest(state, packageData, { source: 'victoria-falls-feature', createId: () => createId('service') });
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
      state = createBlankQuoteState();
      persist('A new trip draft is ready.');
      openService('flights');
    }
    if (event.target.closest('[data-quick-keep]')) {
      pendingQuickQuote = null;
      announce('Existing trip details kept.');
      render();
    }
    if (event.target.closest('[data-quick-use]')) {
      const previousDestination = state.destination;
      state.destination = pendingQuickQuote.destination || state.destination;
      state.tripStartDate = pendingQuickQuote.departureDate || state.tripStartDate;
      state.tripEndDate = pendingQuickQuote.returnDate || state.tripEndDate;
      if (state.tripTitle === `${previousDestination} Trip` && state.destination !== previousDestination) {
        state.tripTitle = `${state.destination} Trip`;
      }
      const quickQuoteRequest = state.serviceRequests.find(request => request.details?.requestSource === 'QUICK_QUOTE');
      if (quickQuoteRequest) {
        const start = pendingQuickQuote.departureDate ? new Date(`${pendingQuickQuote.departureDate}T12:00:00`) : null;
        const end = pendingQuickQuote.returnDate ? new Date(`${pendingQuickQuote.returnDate}T12:00:00`) : null;
        quickQuoteRequest.details = {
          ...quickQuoteRequest.details,
          destination: pendingQuickQuote.destination || quickQuoteRequest.details.destination,
          departureDate: pendingQuickQuote.departureDate || quickQuoteRequest.details.departureDate,
          returnDate: pendingQuickQuote.returnDate || quickQuoteRequest.details.returnDate,
          numberOfNights: start && end && end > start ? Math.round((end - start) / 86400000) : ''
        };
      }
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
    if (remove) {
      pendingRemovalId = remove.dataset.removeRequest;
      render();
      requestAnimationFrame(() => root.querySelector('[data-cancel-remove]')?.focus());
    }
    if (event.target.closest('[data-cancel-remove]')) {
      pendingRemovalId = null;
      render();
    }
    if (event.target.closest('[data-confirm-remove]') && pendingRemovalId) {
      const requestId = pendingRemovalId;
      pendingRemovalId = null;
      removeRequest(requestId);
    }
    const move = event.target.closest('[data-move-item]');
    if (move) moveItem(move.dataset.moveItem, move.dataset.direction);
    const moveRequest = event.target.closest('[data-move-request]');
    if (moveRequest && moveServiceRequest(state, moveRequest.dataset.moveRequest, moveRequest.dataset.direction)) {
      persist('Trip order updated.');
      render();
    }
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
    addCustomActivity(state, {
      title: data.get('title'),
      date: data.get('date'),
      startTime: data.get('startTime'),
      optional: data.get('optional') === 'on'
    });
    persist('Custom itinerary item added.');
    render();
  });

  root.addEventListener('input', event => {
    if (!event.target.closest('#qbCheckoutForm')) return;
    captureCustomer(false);
    clearTimeout(customerPersistTimer);
    customerPersistTimer = window.setTimeout(() => persist(), 200);
  });

  root.addEventListener('keydown', event => {
    if (!pendingRemovalId) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      pendingRemovalId = null;
      render();
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...root.querySelectorAll('.qb-confirm button:not([disabled])')];
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('virtcruise:offline-quote-sent', event => {
    if (event.detail?.entry?.clientReference !== state.clientReference) return;
    success = event.detail.response;
    state = createBlankQuoteState();
    persist();
    render();
    onRequestOpen();
    announce('Your queued quote has now reached Virtcruise.');
  });

  document.addEventListener('virtcruise:offline-quote-failed', event => {
    if (event.detail?.entry?.clientReference !== state.clientReference) return;
    announce('Your quote is still queued on this device and has not reached Virtcruise.');
  });

  persist();
  return {
    openService,
    openReview,
    openCheckout,
    applyQuickQuote,
    populateQuoteBuilderFromQuickQuote,
    openPackage,
    addPackageToTrip,
    hasPackage: packageId => state.serviceRequests.some(request => request.serviceType === 'HOLIDAY_PACKAGE' && (request.packageId === packageId || request.details?.packageId === packageId || request.details?.preferredPackage === packageId)),
    addFeaturedPackage,
    getState: () => state,
    render,
    close: onRequestClose
  };
}
