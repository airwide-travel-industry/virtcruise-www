import { authenticationProvider } from '../auth/authentication-provider.js';
import { requireAuthentication } from '../auth/route-guard.js';
import { isAdminOrStaff } from '../auth/persona.js';
import { createPortalRepository } from './portal-repository.js';
import {
  announce, confirmAction, emptyState, errorState, escapeHtml, formatDate, formatMoney,
  pageHeading, portalShell, portalUrl, statusBadge
} from './portal-components.js';
import { debounce, searchableText } from './debounced-search.js';

const page = document.body.dataset.portalPage;
const root = document.getElementById('portalRoot');
let repository;
let user;

const quoteId = quote => quote.id || quote.quoteId || quote.backendQuoteId;
const quoteNumber = quote => quote.bookingReference || quote.quoteNumber || quote.reference || 'Quote pending';
const quoteDestination = quote => quote.destination || quote.trip?.destination || quote.tripTitle || 'Destination to be arranged';
const quoteStart = quote => quote.startDate || quote.departureDate || quote.travelDate || quote.tripStartDate || quote.trip?.startDate;
const quoteEnd = quote => quote.endDate || quote.returnDate || quote.tripEndDate || quote.trip?.endDate;
const quoteTravellers = quote => quote.travellerCount || quote.travellers?.length
  || quote.travellerCounts?.total || quote.trip?.travellerCount || 0;
const quoteValue = quote => quote.estimatedValue ?? quote.totalAmount ?? quote.pricing?.estimatedValue;
const quoteCurrency = quote => quote.currency || quote.pricing?.currency || 'USD';

function setPage(markup, { focus = true } = {}) {
  document.getElementById('portalPage').innerHTML = markup;
  if (focus) document.querySelector('#portalPage h1')?.focus();
}

function quoteCard(quote) {
  const id = quoteId(quote);
  const bookingAction = String(quote.status).toUpperCase() === 'ACCEPTED'
    ? `<button class="portal-button" type="button" data-create-booking="${escapeHtml(id)}">Accept quote</button>`
    : '';
  return `<article class="quote-card">
    <div class="quote-card-top"><div><small>Quote number</small><strong>${escapeHtml(quoteNumber(quote))}</strong></div>${statusBadge(quote.status)}</div>
    <h2>${escapeHtml(quoteDestination(quote))}</h2>
    <dl class="quote-meta"><div><dt>Travel</dt><dd>${formatDate(quoteStart(quote))} – ${formatDate(quoteEnd(quote))}</dd></div><div><dt>Travellers</dt><dd>${escapeHtml(quoteTravellers(quote) || 'To confirm')}</dd></div><div><dt>Estimate</dt><dd>${formatMoney(quoteValue(quote), quoteCurrency(quote))}</dd></div><div><dt>Created</dt><dd>${formatDate(quote.createdAt)}</dd></div></dl>
    <div class="quote-actions">${bookingAction}<a class="portal-button secondary" href="${portalUrl('/quotes/details/', { id })}">View details</a><button class="portal-link" type="button" data-print-quote="${escapeHtml(id)}">Print</button><button class="portal-link" type="button" data-placeholder="PDF downloads are planned for Sprint 3.5.">Download PDF</button><button class="portal-link" type="button" data-placeholder="A consultant update request will be available in Sprint 3.6.">Request update</button></div>
  </article>`;
}

async function renderDashboard() {
  const [quotesResult, bookingsResult] = await Promise.all([
    repository.quotes(), repository.bookings()
  ]);
  const quotes = quotesResult.items;
  const bookings = bookingsResult.items;
  const travellers = repository.travellers.list();
  const notifications = repository.notifications.list();
  const count = status => quotes.filter(item => status.includes(String(item.status).toUpperCase())).length;
  const recent = [...quotes].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 4);
  setPage(`${pageHeading('Customer dashboard', `Welcome back, ${user.givenName || 'Traveller'}`, 'Your journeys, quote requests and travel profile in one place.',
    `<a class="portal-button" href="${portalUrl('/index.html#service=holiday-packages')}">Create a quote</a>`)}
    <section class="dashboard-grid" aria-label="Travel overview">
      ${[
        ['Upcoming bookings', bookings.filter(item => !['COMPLETED','CANCELLED','REFUNDED'].includes(String(item.status).toUpperCase())).length, '/bookings/'],
        ['Outstanding deposits', bookings.filter(item => Number(item.payment?.outstanding || 0) > 0).length, '/bookings/'],
        ['Confirmed trips', bookings.filter(item => ['CONFIRMED','DOCUMENTS_PENDING'].includes(String(item.status).toUpperCase())).length, '/bookings/'],
        ['Ready to travel', bookings.filter(item => String(item.status).toUpperCase() === 'READY_TO_TRAVEL').length, '/bookings/'],
        ['Pending quotes', count(['DRAFT', 'SUBMITTED', 'QUOTED']), '/quotes/'],
        ['Saved travellers', travellers.length, '/travellers/'],
        ['Notifications', notifications.filter(item => !item.read).length, '/notifications/']
      ].map(([label, value, href]) => `<a class="dashboard-card" href="${portalUrl(href)}"><span>${value}</span><strong>${label}</strong><small>View details →</small></a>`).join('')}
    </section>
    <div class="portal-columns">
      <section class="portal-panel"><div class="panel-heading"><div><p class="portal-eyebrow">Recent booking activity</p><h2>Your latest travel activity</h2></div></div>
        ${bookings.length ? `<div class="activity-list">${bookings.slice(0, 4).map(item => `<a href="${portalUrl('/bookings/details/', { id: item.id })}"><span aria-hidden="true">✦</span><div><strong>${escapeHtml(item.bookingReference)} · ${escapeHtml(item.destination || 'Journey being arranged')}</strong><small>${formatDate(item.updatedAt || item.createdAt)} · ${escapeHtml(item.status)}</small></div></a>`).join('')}</div>`
          : recent.length ? `<div class="activity-list">${recent.map(item => `<a href="${portalUrl('/quotes/details/', { id: quoteId(item) })}"><span aria-hidden="true">✦</span><div><strong>${escapeHtml(quoteNumber(item))} · ${escapeHtml(quoteDestination(item))}</strong><small>${formatDate(item.createdAt)} · ${escapeHtml(item.status || 'Submitted')}</small></div></a>`).join('')}</div>`
          : emptyState({ title: 'Your travel story starts here', message: 'Create a quote or browse packages to begin planning your first journey.', action: `<a class="portal-button" href="${portalUrl('/index.html#allPackages')}">Browse packages</a>` })}
      </section>
      <aside class="portal-panel"><p class="portal-eyebrow">Quick actions</p><h2>Plan and manage</h2><div class="quick-actions">
        <a href="${portalUrl('/index.html#service=holiday-packages')}">Create quote</a><a href="${portalUrl('/index.html#allPackages')}">Browse packages</a><a href="${portalUrl('/quotes/')}">View quotes</a><a href="${portalUrl('/bookings/')}">View bookings</a><a href="${portalUrl('/travellers/')}">Manage travellers</a><a href="${portalUrl('/profile/')}">Edit profile</a><a href="${portalUrl('/index.html#footerContact')}">Support</a>
      </div><div class="security-summary"><span aria-hidden="true">✓</span><div><strong>Security status</strong><small>${user.emailVerified ? 'Email verified · account protected' : 'Email verification required'}</small></div></div></aside>
    </div>`);
}

function renderAdminDashboard() {
  const roles = new Set(Array.isArray(user?.roles) ? user.roles : []);
  const permissions = new Set(Array.isArray(user?.permissions) ? user.permissions : []);
  const cards = [['Administration', 'Manage staff-facing Virtcruise workspaces and controls.', '/dashboard/']];
  if (roles.has('ROLE_CONTENT_EDITOR') || roles.has('ROLE_CONTENT_APPROVER') || roles.has('ROLE_ADMIN')) cards.push(['Content Studio', 'Manage the versioned public travel catalogue.', '/content-studio/']);
  if (permissions.has('QUOTE_READ_ALL') || roles.has('ROLE_CONSULTANT') || roles.has('ROLE_ADMIN')) cards.push(['Customer Quotes', 'Review customer-submitted quote requests without changing ownership.', '/admin/quotes/']);
  if (roles.has('ROLE_FINANCE') || roles.has('ROLE_ADMIN') || permissions.has('BANK_TRANSFER_REVIEW') || permissions.has('BANK_TRANSFER_ADMIN')) cards.push(['Finance Operations', 'Review bank-transfer cases and finance work queues.', '/finance/']);
  if (roles.has('ROLE_OPERATIONS') || roles.has('ROLE_MANAGER') || roles.has('ROLE_ADMIN')) cards.push(['Operations', 'Open the live API-backed operational readiness workspace.', '/operational-readiness/']);
  setPage(`${pageHeading('STAFF WORKSPACE', 'Administration Dashboard', 'Access the staff workspaces enabled for your assigned roles.')}<section class="dashboard-grid" aria-label="Administration modules">${cards.map(([title, description, href]) => `<a class="dashboard-card" href="${portalUrl(href)}"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small><span>Open workspace →</span></a>`).join('')}</section>`);
}

async function renderQuotes() {
  const result = await repository.quotes();
  if (result.unavailable) {
    return setPage(`${pageHeading('Your travel requests', 'My Quotes', 'Review the quote requests associated with your account.')}
      ${emptyState({ title: 'Quote history is coming online', message: 'Your local My Trip draft remains available. Submitted quote history requires the customer quote-history API permission planned for Sprint 3.4.', action: `<a class="portal-button" href="${portalUrl('/index.html#cart')}">Open My Trip</a>` })}`);
  }
  const source = result.items;
  setPage(`${pageHeading('Your travel requests', 'My Quotes', 'Search, filter and review your Virtcruise quote requests.',
    `<a class="portal-button" href="${portalUrl('/index.html#service=holiday-packages')}">Create quote</a>`)}
    <section class="portal-toolbar" aria-label="Quote controls"><label><span>Search quotes</span><input type="search" data-quote-search placeholder="Destination or quote number"></label><label><span>Status</span><select data-quote-status><option value="">All statuses</option>${['DRAFT','SUBMITTED','QUOTED','ACCEPTED','BOOKED','CANCELLED','COMPLETED'].map(value => `<option>${value}</option>`).join('')}</select></label><label><span>Sort</span><select data-quote-sort><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="departure">Departure date</option><option value="value">Estimated value</option></select></label></section>
    <p class="results-count" data-results-count></p><div class="quote-list" data-quote-list></div><nav class="portal-pagination" aria-label="Quote pagination" data-pagination></nav>`);
  const list = document.querySelector('[data-quote-list]');
  const countNode = document.querySelector('[data-results-count]');
  const pagination = document.querySelector('[data-pagination]');
  let state = { query: '', status: '', sort: 'newest', page: 0 };
  const pageSize = 6;
  function update() {
    let values = source.filter(item => {
      const matchesQuery = searchableText(quoteNumber(item), quoteDestination(item), item.packageName).includes(state.query);
      return matchesQuery && (!state.status || String(item.status).toUpperCase() === state.status);
    });
    values.sort((a, b) => state.sort === 'oldest' ? String(a.createdAt).localeCompare(String(b.createdAt))
      : state.sort === 'departure' ? String(quoteStart(a)).localeCompare(String(quoteStart(b)))
        : state.sort === 'value' ? Number(quoteValue(b) || 0) - Number(quoteValue(a) || 0)
          : String(b.createdAt).localeCompare(String(a.createdAt)));
    const pages = Math.max(1, Math.ceil(values.length / pageSize));
    state.page = Math.min(state.page, pages - 1);
    const visible = values.slice(state.page * pageSize, (state.page + 1) * pageSize);
    countNode.textContent = `${values.length} quote${values.length === 1 ? '' : 's'}`;
    list.innerHTML = visible.length ? visible.map(quoteCard).join('') : emptyState({ title: 'No matching quotes', message: 'Try changing your search or filter.' });
    pagination.innerHTML = pages > 1 ? `<button type="button" data-page="${state.page - 1}" ${state.page === 0 ? 'disabled' : ''}>Previous</button><span>Page ${state.page + 1} of ${pages}</span><button type="button" data-page="${state.page + 1}" ${state.page === pages - 1 ? 'disabled' : ''}>Next</button>` : '';
  }
  document.querySelector('[data-quote-search]').addEventListener('input', debounce(event => { state.query = event.target.value.trim().toLowerCase(); state.page = 0; update(); }));
  document.querySelector('[data-quote-status]').addEventListener('change', event => { state.status = event.target.value; state.page = 0; update(); });
  document.querySelector('[data-quote-sort]').addEventListener('change', event => { state.sort = event.target.value; update(); });
  pagination.addEventListener('click', event => { const button = event.target.closest('[data-page]'); if (button && !button.disabled) { state.page = Number(button.dataset.page); update(); document.querySelector('[data-results-count]').focus(); } });
  update();
}

function detailSection(title, items, render) {
  if (!items?.length) return '';
  return `<details class="detail-group" open><summary><span>${escapeHtml(title)}</span><small>${items.length}</small></summary><div>${items.map(render).join('')}</div></details>`;
}

function bookingSummary(value) {
  return value.booking || value;
}

function bookingCard(value) {
  const booking = bookingSummary(value);
  const payment = booking.payment || {};
  return `<article class="trip-card booking-card" data-booking-id="${escapeHtml(booking.id)}">
    <div class="trip-image" aria-hidden="true"></div><div>
      <div class="trip-card-top">${statusBadge(booking.status)}<span>${escapeHtml(payment.paymentStatus?.replaceAll('_', ' ') || 'Payment summary pending')}</span></div>
      <p class="portal-eyebrow">${escapeHtml(booking.bookingReference || 'Booking pending')}</p>
      <h2>${escapeHtml(booking.destination || 'Journey being arranged')}</h2>
      <p>${formatDate(booking.startDate)} – ${formatDate(booking.endDate)}</p>
      <dl><div><dt>Deposit</dt><dd>${formatMoney(payment.depositDue, payment.currency || booking.currency)}</dd></div><div><dt>Outstanding</dt><dd>${formatMoney(payment.outstanding, payment.currency || booking.currency)}</dd></div><div><dt>Travellers</dt><dd>${escapeHtml(booking.travellerCount || 'To confirm')}</dd></div></dl>
      <div class="quote-actions"><a class="portal-button" href="${portalUrl('/bookings/details/', { id: booking.id })}">View details</a><button class="portal-button secondary" type="button" data-print>Print</button></div>
    </div></article>`;
}

async function renderBookings() {
  const result = await repository.bookings();
  if (result.unavailable) {
    return setPage(`${pageHeading('Confirmed travel', 'My Bookings', 'Review accepted travel arrangements and payment summaries.')}
      ${emptyState({ title: 'Bookings are not available yet', message: 'Your quotes and My Trip draft remain available while booking access is being enabled.', action: `<a class="portal-button" href="${portalUrl('/quotes/')}">View My Quotes</a>` })}`);
  }
  setPage(`${pageHeading('Confirmed travel', 'My Bookings', 'Track accepted journeys from deposit request through travel completion.')}
    <section class="portal-toolbar compact" aria-label="Booking controls"><label><span>Search bookings</span><input type="search" data-booking-search placeholder="Destination or booking reference"></label><label><span>Status</span><select data-booking-status><option value="">All bookings</option>${['ACCEPTED','DEPOSIT_PENDING','DEPOSIT_RECEIVED','CONFIRMED','DOCUMENTS_PENDING','READY_TO_TRAVEL','IN_PROGRESS','COMPLETED','CANCELLED','REFUNDED'].map(value => `<option>${value}</option>`).join('')}</select></label></section>
    <p class="results-count" data-booking-count></p><div class="trip-list" data-booking-list></div>`);
  const update = () => {
    const query = document.querySelector('[data-booking-search]').value.trim().toLowerCase();
    const status = document.querySelector('[data-booking-status]').value;
    const items = result.items.filter(item => {
      const booking = bookingSummary(item);
      return searchableText(booking.bookingReference, booking.destination).includes(query)
        && (!status || String(booking.status).toUpperCase() === status);
    });
    document.querySelector('[data-booking-count]').textContent = `${items.length} booking${items.length === 1 ? '' : 's'}`;
    document.querySelector('[data-booking-list]').innerHTML = items.length
      ? items.map(bookingCard).join('')
      : emptyState({ title: 'No matching bookings', message: 'Accepted quotes become bookings when their operational arrangements begin.', action: `<a class="portal-button" href="${portalUrl('/quotes/')}">View My Quotes</a>` });
  };
  document.querySelector('[data-booking-search]').addEventListener('input', debounce(update));
  document.querySelector('[data-booking-status]').addEventListener('change', update);
  update();
}

async function renderBookingDetails() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return setPage(`${pageHeading('Booking details', 'Booking not selected', 'Return to My Bookings and choose a journey.')}${emptyState({ title: 'No booking selected', message: 'A booking identifier is required.', action: `<a class="portal-button" href="${portalUrl('/bookings/')}">Back to My Bookings</a>` })}`);
  const detail = await repository.booking(id);
  if (!detail) return setPage(`${pageHeading('Booking details', 'Booking unavailable', 'The booking may not exist or may belong to another account.')}${emptyState({ title: 'We could not find this booking', message: 'Return to your booking list and try again.', action: `<a class="portal-button" href="${portalUrl('/bookings/')}">Back to My Bookings</a>` })}`);
  const booking = bookingSummary(detail);
  const quote = booking.quoteId ? await repository.quote(booking.quoteId).catch(() => null) : null;
  const items = quote?.items || quote?.serviceRequests || [];
  const payment = booking.payment || {};
  const terminal = ['COMPLETED','CANCELLED','REFUNDED'].includes(String(booking.status).toUpperCase());
  const services = [
    ['Flights', ['FLIGHT']], ['Accommodation', ['HOTEL','ACCOMMODATION']],
    ['Transfers', ['TRANSFER','CAR_RENTAL']], ['Visa services', ['VISA']],
    ['Activities', ['ACTIVITY','HOLIDAY_PACKAGE','PACKAGE']], ['Insurance', ['INSURANCE']]
  ];
  setPage(`${pageHeading('Booking details', booking.bookingReference || 'Your booking', booking.destination || 'Journey being arranged', `<button class="portal-button secondary" type="button" data-print>Print booking</button>`)}
    <section class="quote-hero-summary"><div>${statusBadge(booking.status)}<h2>${escapeHtml(booking.destination || 'Travel arrangements')}</h2><p>${formatDate(booking.startDate)} – ${formatDate(booking.endDate)}</p></div><div><small>Outstanding balance</small><strong>${formatMoney(payment.outstanding, payment.currency || booking.currency)}</strong><span>${escapeHtml(payment.paymentStatus?.replaceAll('_', ' ') || 'Payment status pending')}</span></div></section>
    <div class="detail-layout"><div>
      <section class="portal-panel"><p class="portal-eyebrow">Status timeline</p><h2>Booking journey</h2>${detail.timeline?.length ? `<div class="trip-timeline">${detail.timeline.map((event, index) => `<article><span>${index + 1}</span><time>${formatDate(event.occurredAt)}</time><div><strong>${escapeHtml(event.title)}</strong><p>${escapeHtml(event.description || '')}</p></div></article>`).join('')}</div>` : emptyState({ title: 'Timeline is being prepared', message: 'Booking milestones will appear here.' })}</section>
      ${detailSection('Travellers', detail.travellers, traveller => `<article class="detail-item"><strong>${escapeHtml(`${traveller.firstName} ${traveller.lastName}`)}</strong><p>${escapeHtml(traveller.travellerType || '')}${traveller.leadTraveller ? ' · Lead traveller' : ''}</p></article>`)}
      ${services.map(([label, types]) => detailSection(label, items.filter(item => types.includes(String(item.type || item.serviceType).toUpperCase())), item => `<article class="detail-item"><div>${statusBadge(item.type || item.serviceType)}<strong>${escapeHtml(item.description || item.serviceTitle || item.title || 'Travel service')}</strong></div><p>${escapeHtml(item.notes || '')}</p></article>`)).join('')}
      ${emptyState({ title: 'Documents', message: 'Booking confirmations and travel documents will be available in Sprint 3.5.', action: '<button class="portal-button secondary" type="button" data-placeholder="Confirmation downloads are planned for Sprint 3.5.">Download confirmation</button>' })}
      <section class="future-grid">${['Important reminders','Support contacts'].map(title => `<article><span aria-hidden="true">✦</span><h2>${title}</h2><p>${title === 'Support contacts' ? 'Virtcruise support remains available throughout your journey.' : 'Deposit, document and travel reminders will appear here.'}</p></article>`).join('')}</section>
    </div><aside class="portal-panel sticky-summary"><p class="portal-eyebrow">Payment summary</p><h2>No online payment required yet</h2><dl class="summary-list"><div><dt>Quoted amount</dt><dd>${formatMoney(payment.quotedAmount, payment.currency)}</dd></div><div><dt>Deposit due</dt><dd>${formatMoney(payment.depositDue, payment.currency)}</dd></div><div><dt>Deposit paid</dt><dd>${formatMoney(payment.depositPaid, payment.currency)}</dd></div><div><dt>Balance due</dt><dd>${formatMoney(payment.balanceDue, payment.currency)}</dd></div><div><dt>Balance paid</dt><dd>${formatMoney(payment.balancePaid, payment.currency)}</dd></div><div><dt>Outstanding</dt><dd>${formatMoney(payment.outstanding, payment.currency)}</dd></div></dl>
      ${String(booking.status).toUpperCase() === 'PENDING_CUSTOMER_ACCEPTANCE' ? '<button class="portal-button" type="button" data-accept-booking>Accept booking</button>' : ''}
      ${!terminal ? `<form class="portal-form compact" data-cancel-booking-form><label><span>Cancellation reason</span><textarea name="reason" rows="3" required maxlength="500"></textarea></label><button class="portal-button secondary" type="submit">Cancel booking</button></form>` : ''}
    </aside></div>`);
  document.querySelector('[data-accept-booking]')?.addEventListener('click', async event => {
    event.currentTarget.disabled = true;
    try {
      await repository.acceptBooking(id);
      announce('Booking acceptance recorded.');
      await renderBookingDetails();
    } catch (error) {
      announce(error.message);
      event.currentTarget.disabled = false;
    }
  });
  document.querySelector('[data-cancel-booking-form]')?.addEventListener('submit', async event => {
    event.preventDefault();
    const reason = new FormData(event.currentTarget).get('reason')?.trim();
    if (!reason) return announce('Enter a cancellation reason.');
    if (!await confirmAction('This records a cancellation request and cannot be undone online.', 'Cancel this booking?')) return;
    const button = event.currentTarget.querySelector('button');
    button.disabled = true;
    try {
      await repository.cancelBooking(id, reason);
      announce('Booking cancelled.');
      await renderBookingDetails();
    } catch (error) {
      announce(error.message);
      button.disabled = false;
    }
  });
}

async function renderQuoteDetails() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return setPage(`${pageHeading('Quote details', 'Quote not selected', 'Return to My Quotes and choose a quote to review.')}${emptyState({ title: 'No quote selected', message: 'A quote identifier is required.', action: `<a class="portal-button" href="${portalUrl('/quotes/')}">Back to My Quotes</a>` })}`);
  const quote = await repository.quote(id);
  if (!quote) return setPage(`${pageHeading('Quote details', 'Quote unavailable', 'The quote may not exist or you may not have permission to view it.')}${emptyState({ title: 'We could not find this quote', message: 'Return to your quote list and try again.', action: `<a class="portal-button" href="${portalUrl('/quotes/')}">Back to My Quotes</a>` })}`);
  const travellers = quote.travellers || [];
  const items = quote.items || quote.serviceRequests || [];
  const itinerary = quote.itinerary?.segments || quote.itineraryDays || [];
  const serviceGroups = [
    ['Flights', ['FLIGHT']], ['Accommodation', ['HOTEL', 'ACCOMMODATION']],
    ['Transfers', ['TRANSFER', 'CAR_RENTAL']], ['Visa services', ['VISA']],
    ['Activities', ['ACTIVITY', 'HOLIDAY_PACKAGE', 'PACKAGE']], ['Insurance', ['INSURANCE']]
  ];
  const acceptAction = String(quote.status).toUpperCase() === 'ACCEPTED'
    ? `<button class="portal-button" type="button" data-create-booking="${escapeHtml(id)}">Accept quote</button>`
    : '';
  setPage(`${pageHeading('Quote details', quote.quoteNumber || 'Your quote', quoteDestination(quote), `${acceptAction}<button class="portal-button secondary" type="button" data-print>Print quote</button>`)}
    <section class="quote-hero-summary"><div>${statusBadge(quote.status)}<h2>${escapeHtml(quoteDestination(quote))}</h2><p>${formatDate(quoteStart(quote))} – ${formatDate(quoteEnd(quote))}</p></div><div><small>Estimated quote value</small><strong>${formatMoney(quoteValue(quote), quoteCurrency(quote))}</strong><span>Subject to availability and final confirmation</span></div></section>
    <div class="detail-layout"><div>
      ${detailSection('Travellers', travellers, traveller => `<article class="detail-item"><strong>${escapeHtml(`${traveller.firstName || ''} ${traveller.lastName || ''}`.trim() || traveller.type || 'Traveller')}</strong><p>${escapeHtml(traveller.type || '')}</p></article>`)}
      ${serviceGroups.map(([label, types]) => detailSection(label, items.filter(item => types.includes(String(item.type || item.serviceType).toUpperCase())), item => `<article class="detail-item"><div>${statusBadge(item.type || item.serviceType || 'SERVICE')}<strong>${escapeHtml(item.description || item.serviceTitle || item.title || 'Travel service')}</strong></div><p>${escapeHtml(item.notes || '')}</p><small>${escapeHtml(item.quantity || 0)} × ${formatMoney(item.unitPrice || 0, quoteCurrency(quote))} · ${formatMoney(item.lineTotal || 0, quoteCurrency(quote))}</small></article>`)).join('')}
      ${detailSection('Other travel services', items.filter(item => !serviceGroups.some(([, types]) => types.includes(String(item.type || item.serviceType).toUpperCase()))), item => `<article class="detail-item"><div>${statusBadge(item.type || item.serviceType || 'SERVICE')}<strong>${escapeHtml(item.description || item.serviceTitle || item.title || 'Travel service')}</strong></div><p>${escapeHtml(item.notes || '')}</p><small>${escapeHtml(item.quantity || 0)} × ${formatMoney(item.unitPrice || 0, quoteCurrency(quote))} · ${formatMoney(item.lineTotal || 0, quoteCurrency(quote))}</small></article>`)}
      ${detailSection('Trip timeline', itinerary, item => `<article class="timeline-item"><time>${formatDate(item.date || item.startDate)}</time><div><strong>${escapeHtml(item.title || item.type || 'Itinerary item')}</strong><p>${escapeHtml(item.description || item.location || '')}</p></div></article>`)}
      ${detailSection('Special requests', quote.specialRequests || [], item => `<article class="detail-item"><strong>${escapeHtml(item.type || item.category || 'Request')}</strong><p>${escapeHtml(item.description || item.notes || '')}</p></article>`)}
      ${quote.notes ? `<section class="portal-panel"><p class="portal-eyebrow">Customer-visible notes</p><h2>Quote notes</h2><p>${escapeHtml(quote.notes)}</p></section>` : ''}
      ${emptyState({ title: 'Conversation', message: 'Secure consultant messaging will be introduced in Sprint 3.4.' })}
    </div><aside class="portal-panel sticky-summary"><p class="portal-eyebrow">Quote summary</p><dl class="summary-list"><div><dt>Quote</dt><dd>${escapeHtml(quote.quoteNumber || id)}</dd></div><div><dt>Travellers</dt><dd>${escapeHtml(quoteTravellers(quote) || travellers.length || 'To confirm')}</dd></div><div><dt>Created</dt><dd>${formatDate(quote.createdAt)}</dd></div><div><dt>Status</dt><dd>${escapeHtml(quote.status)}</dd></div></dl><button class="portal-button" type="button" data-placeholder="Itinerary downloads are being prepared for Sprint 3.4.">Download itinerary</button><button class="portal-button secondary" type="button" data-placeholder="Secure quote conversations are being prepared for Sprint 3.4.">Contact consultant</button></aside></div>`);
}

function tripCard(trip) {
  const start = quoteStart(trip);
  const days = start ? Math.ceil((new Date(`${start}T12:00:00`) - new Date()) / 86400000) : null;
  return `<article class="trip-card"><div class="trip-image" aria-hidden="true"></div><div><div class="trip-card-top">${statusBadge(trip.status)}<span>${days !== null && days > 0 ? `${days} days to go` : 'Travel dates confirmed'}</span></div><h2>${escapeHtml(quoteDestination(trip))}</h2><p>${formatDate(start)} – ${formatDate(quoteEnd(trip))}</p><dl><div><dt>Booking reference</dt><dd>${escapeHtml(quoteNumber(trip))}</dd></div><div><dt>Travellers</dt><dd>${escapeHtml(quoteTravellers(trip) || 'To confirm')}</dd></div></dl><a class="portal-button" href="${portalUrl('/trips/details/', { id: quoteId(trip) })}">View trip</a></div></article>`;
}

async function renderTrips() {
  const result = await repository.bookings();
  const travelStatuses = ['CONFIRMED','DOCUMENTS_PENDING','READY_TO_TRAVEL','IN_PROGRESS','COMPLETED','CANCELLED'];
  result.items = result.items.map(bookingSummary)
    .filter(item => travelStatuses.includes(String(item.status).toUpperCase()));
  setPage(`${pageHeading('Your booked travel', 'My Trips', 'Everything you need for upcoming, current and completed journeys.')}
    <section class="portal-toolbar compact" aria-label="Trip controls"><label><span>Search trips</span><input type="search" data-trip-search placeholder="Destination or reference"></label><label><span>Journey status</span><select data-trip-status><option value="">All trips</option><option>CONFIRMED</option><option>READY_TO_TRAVEL</option><option>IN_PROGRESS</option><option>COMPLETED</option><option>CANCELLED</option></select></label></section><div class="trip-list" data-trip-list></div>`);
  const render = () => {
    const query = document.querySelector('[data-trip-search]').value.trim().toLowerCase();
    const status = document.querySelector('[data-trip-status]').value;
    const items = result.items.filter(item => searchableText(quoteDestination(item), quoteNumber(item)).includes(query) && (!status || String(item.status).toUpperCase() === status));
    document.querySelector('[data-trip-list]').innerHTML = items.length ? items.map(tripCard).join('') : emptyState({ title: 'No booked trips yet', message: 'Accepted quotes will appear here when they become confirmed bookings.', action: `<a class="portal-button" href="${portalUrl('/quotes/')}">View My Quotes</a>` });
  };
  document.querySelector('[data-trip-search]').addEventListener('input', debounce(render));
  document.querySelector('[data-trip-status]').addEventListener('change', render);
  render();
}

async function renderTripDetails() {
  const id = new URLSearchParams(location.search).get('id');
  const detail = id ? await repository.booking(id) : null;
  const trip = detail ? bookingSummary(detail) : null;
  if (!trip) return setPage(`${pageHeading('Trip details', 'Trip unavailable', 'Choose a confirmed journey from My Trips.')}${emptyState({ title: 'No trip selected', message: 'Your confirmed journey could not be loaded.', action: `<a class="portal-button" href="${portalUrl('/trips/')}">Back to My Trips</a>` })}`);
  const quote = trip.quoteId ? await repository.quote(trip.quoteId).catch(() => null) : null;
  const itinerary = quote?.itinerary?.segments || quote?.itineraryDays || detail.timeline || [];
  setPage(`${pageHeading('Your journey', quoteDestination(trip), `${formatDate(quoteStart(trip))} – ${formatDate(quoteEnd(trip))}`, `<button class="portal-button secondary" type="button" data-print>Print itinerary</button>`)}
    <section class="quote-hero-summary"><div>${statusBadge(trip.status)}<h2>${escapeHtml(quote?.trip?.title || quoteDestination(trip))}</h2><p>Booking reference ${escapeHtml(quoteNumber(trip))}</p></div><div><small>Travellers</small><strong>${escapeHtml(trip.travellerCount || detail.travellers?.length || 'To confirm')}</strong><span>Keep this itinerary available while travelling</span></div></section>
    <div class="detail-layout"><div><section class="portal-panel"><p class="portal-eyebrow">Daily timeline</p><h2>Your itinerary</h2>${itinerary.length ? `<div class="trip-timeline">${itinerary.map((item, index) => `<article><span>${index + 1}</span><time>${formatDate(item.date || item.startDate || item.occurredAt)}</time><div><strong>${escapeHtml(item.title || item.type || 'Travel arrangement')}</strong><p>${escapeHtml(item.description || item.location || '')}</p></div></article>`).join('')}</div>` : emptyState({ title: 'Your detailed timeline is being arranged', message: 'Confirmed flight, hotel, transfer and activity times will appear here.' })}</section>
      <section class="future-grid">${['Documents','Weather','Packing checklist','Emergency contacts'].map(title => `<article><span aria-hidden="true">✦</span><h2>${title}</h2><p>Available in a future portal update.</p></article>`).join('')}</section></div>
      <aside class="portal-panel sticky-summary"><p class="portal-eyebrow">Travel support</p><h2>We are here for you</h2><p>Contact Virtcruise if an arrangement changes or you need help during your journey.</p><a class="portal-button" href="${portalUrl('/index.html#footerContact')}">View support contacts</a></aside></div>`);
}

function travellerForm(item = {}) {
  return `<form class="portal-form" id="travellerForm" novalidate><input type="hidden" name="id" value="${escapeHtml(item.id || '')}"><div class="form-grid">
    ${[['title','Title','text'],['firstName','First name','text'],['lastName','Last name','text'],['dateOfBirth','Date of birth','date'],['gender','Gender','text'],['nationality','Nationality','text'],['passportNumber','Passport number','text'],['passportExpiry','Passport expiry','date'],['frequentFlyerNumbers','Frequent flyer numbers','text'],['mealPreference','Meal preference','text'],['specialAssistance','Special assistance','text'],['emergencyContact','Emergency contact','text']].map(([name,label,type]) => `<label><span>${label}${['firstName','lastName'].includes(name) ? ' *' : ''}</span><input name="${name}" type="${type}" value="${escapeHtml(item[name] || '')}" ${['firstName','lastName'].includes(name) ? 'required' : ''}></label>`).join('')}
    </div><div class="form-error-summary" role="alert" tabindex="-1" hidden></div><div class="form-actions"><button class="portal-button" type="submit">${item.id ? 'Save changes' : 'Add traveller'}</button><button class="portal-button secondary" type="button" data-cancel-traveller ${item.id ? '' : 'hidden'}>Cancel</button></div><p class="storage-note">Saved for this browser session only until the secure traveller API is introduced. Passport uploads are not available yet.</p></form>`;
}

function bindTravellerForm() {
  const form = document.getElementById('travellerForm');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const summary = form.querySelector('.form-error-summary');
    const duplicate = repository.travellers.list().find(item => item.id !== values.id
      && `${item.firstName}|${item.lastName}|${item.dateOfBirth}`.toLowerCase() === `${values.firstName}|${values.lastName}|${values.dateOfBirth}`.toLowerCase());
    const expired = values.passportExpiry && new Date(values.passportExpiry) <= new Date();
    const errors = [];
    if (!values.firstName.trim()) errors.push('Enter the traveller’s first name.');
    if (!values.lastName.trim()) errors.push('Enter the traveller’s last name.');
    if (expired) errors.push('Passport expiry must be in the future.');
    if (duplicate) errors.push('This traveller appears to be saved already.');
    if (errors.length) {
      summary.hidden = false; summary.innerHTML = `<strong>Please review this traveller.</strong><ul>${errors.map(error => `<li>${escapeHtml(error)}</li>`).join('')}</ul>`; summary.focus(); return;
    }
    repository.travellers.save(values);
    announce(`${values.firstName} ${values.lastName} saved.`);
    renderTravellers();
  });
  form.querySelector('[data-cancel-traveller]')?.addEventListener('click', () => renderTravellers());
}

function renderTravellers() {
  const items = repository.travellers.list();
  setPage(`${pageHeading('Travel party', 'Saved Travellers', 'Keep reusable traveller preferences ready for future quote requests.', `<button class="portal-button" type="button" data-new-traveller>Add traveller</button>`)}
    <section class="portal-panel traveller-editor" data-traveller-editor hidden><p class="portal-eyebrow">Traveller details</p><h2>Add a traveller</h2>${travellerForm()}</section>
    <section class="portal-toolbar compact"><label><span>Search travellers</span><input type="search" data-traveller-search placeholder="Name, nationality or passport"></label></section><div class="traveller-list" data-traveller-list></div>`);
  const list = document.querySelector('[data-traveller-list]');
  const update = () => {
    const query = document.querySelector('[data-traveller-search]').value.trim().toLowerCase();
    const filtered = repository.travellers.list().filter(item => searchableText(item.firstName, item.lastName, item.nationality, item.passportNumber).includes(query));
    list.innerHTML = filtered.length ? filtered.map(item => `<article class="traveller-card"><span class="traveller-avatar" aria-hidden="true">${escapeHtml(`${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`.toUpperCase())}</span><div><h2>${escapeHtml(`${item.title || ''} ${item.firstName} ${item.lastName}`.trim())}</h2><p>${escapeHtml(item.nationality || 'Nationality not set')} · Passport ${escapeHtml(item.passportNumber ? `ending ${item.passportNumber.slice(-4)}` : 'not added')}</p><small>${item.passportExpiry ? `Expires ${formatDate(item.passportExpiry)}` : 'Passport expiry not set'}</small></div><div><button type="button" data-edit-traveller="${item.id}">Edit</button><button type="button" class="danger-link" data-remove-traveller="${item.id}">Remove</button></div></article>`).join('') : emptyState({ title: 'No saved travellers', message: 'Add family members or regular travel companions to speed up future quote requests.' });
  };
  document.querySelector('[data-new-traveller]').addEventListener('click', () => {
    const panel = document.querySelector('[data-traveller-editor]'); panel.hidden = false; panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); panel.querySelector('input:not([type=hidden])').focus();
  });
  document.querySelector('[data-traveller-search]').addEventListener('input', debounce(update));
  list.addEventListener('click', async event => {
    const edit = event.target.closest('[data-edit-traveller]');
    const remove = event.target.closest('[data-remove-traveller]');
    if (edit) {
      const item = repository.travellers.list().find(value => value.id === edit.dataset.editTraveller);
      const panel = document.querySelector('[data-traveller-editor]'); panel.hidden = false; panel.innerHTML = `<p class="portal-eyebrow">Traveller details</p><h2>Edit traveller</h2>${travellerForm(item)}`; bindTravellerForm(); panel.querySelector('input:not([type=hidden])').focus();
    }
    if (remove && await confirmAction('Remove this saved traveller from this browser session?', 'Remove traveller?')) {
      repository.travellers.remove(remove.dataset.removeTraveller); announce('Traveller removed.'); update();
    }
  });
  bindTravellerForm();
  update();
}

function renderNotifications() {
  const types = ['QUOTE_UPDATE','BOOKING_CREATED','BOOKING_CONFIRMED','BOOKING_CANCELLED','TRAVEL_REMINDER','PASSPORT_REMINDER','PAYMENT_REMINDER','PROMOTION'];
  setPage(`${pageHeading('Stay informed', 'Notification Centre', 'Travel updates and reminders in one calm, organised view.', `<button class="portal-button secondary" type="button" data-mark-all>Mark all read</button>`)}
    <section class="portal-toolbar compact"><label><span>Search notifications</span><input type="search" data-notification-search placeholder="Search messages"></label><label><span>Type</span><select data-notification-type><option value="">All notifications</option>${types.map(type => `<option value="${type}">${type.replaceAll('_',' ')}</option>`).join('')}</select></label></section><div class="notification-list" data-notification-list></div>
    <section class="portal-panel future-note"><span aria-hidden="true">✦</span><div><h2>Push notifications</h2><p>Opt-in browser and mobile push notifications are planned for a future release.</p></div></section>`);
  const update = () => {
    const query = document.querySelector('[data-notification-search]').value.trim().toLowerCase();
    const type = document.querySelector('[data-notification-type]').value;
    const values = repository.notifications.list().filter(item => searchableText(item.title, item.message, item.type).includes(query) && (!type || item.type === type));
    document.querySelector('[data-notification-list]').innerHTML = values.length ? values.map(item => `<article class="notification-card ${item.read ? '' : 'unread'}"><span aria-hidden="true">✦</span><div><div>${statusBadge(item.type || 'UPDATE')}<time>${formatDate(item.createdAt)}</time></div><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.message)}</p></div><button type="button" data-read-notification="${item.id}">${item.read ? 'Mark unread' : 'Mark read'}</button></article>`).join('') : emptyState({ title: 'You are all caught up', message: 'Quote updates, booking confirmations and travel reminders will appear here.' });
  };
  document.querySelector('[data-notification-search]').addEventListener('input', debounce(update));
  document.querySelector('[data-notification-type]').addEventListener('change', update);
  document.querySelector('[data-mark-all]').addEventListener('click', () => { repository.notifications.markAllRead(); announce('All notifications marked as read.'); update(); });
  document.querySelector('[data-notification-list]').addEventListener('click', event => { const button = event.target.closest('[data-read-notification]'); if (!button) return; const item = repository.notifications.list().find(value => value.id === button.dataset.readNotification); repository.notifications.markRead(item.id, !item.read); update(); });
  update();
}

const preferenceFields = [
  ['preferredDepartureAirport','Preferred departure airport'],['preferredAirline','Preferred airline'],
  ['preferredHotelClass','Preferred hotel class'],['preferredSeat','Preferred seat'],
  ['currency','Currency'],['language','Language'],['timeZone','Time zone']
];

function preferencesForm(values, { profile = false } = {}) {
  const interests = ['Adventure','Luxury','Cruise','Safari','Family','Business','Budget'];
  return `<form class="portal-form" id="${profile ? 'profilePreferencesForm' : 'preferencesForm'}"><div class="form-grid">${preferenceFields.map(([name,label]) => `<label><span>${label}</span><input name="${name}" value="${escapeHtml(values[name] || '')}"></label>`).join('')}</div>
    <fieldset><legend>Travel interests</legend><div class="choice-grid">${interests.map(value => `<label><input type="checkbox" name="interests" value="${value}" ${values.interests?.includes(value) ? 'checked' : ''}><span>${value}</span></label>`).join('')}</div></fieldset>
    <fieldset><legend>Communication preferences</legend><label class="form-check"><input type="checkbox" name="newsletter" ${values.newsletter ? 'checked' : ''}>Receive travel inspiration and newsletter updates</label><label class="form-check"><input type="checkbox" name="marketingConsent" ${values.marketingConsent ? 'checked' : ''}>Receive relevant Virtcruise promotions</label></fieldset>
    <button class="portal-button" type="submit">Save preferences</button><p class="storage-note">These preferences are saved on this device until account preference APIs are introduced.</p></form>`;
}

function bindPreferences(form, source = repository.preferences) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    source.save({ ...Object.fromEntries(data), interests: data.getAll('interests'), newsletter: data.has('newsletter'), marketingConsent: data.has('marketingConsent') });
    announce('Your preferences have been saved.');
    const button = form.querySelector('[type=submit]'); const original = button.textContent; button.textContent = 'Saved'; setTimeout(() => { button.textContent = original; }, 1600);
  });
}

function renderPreferences() {
  setPage(`${pageHeading('Personalise your journey', 'Travel Preferences', 'Tell us how you like to travel so future planning starts closer to your needs.')}<section class="portal-panel"><p class="portal-eyebrow">Your travel style</p><h2>Saved preferences</h2>${preferencesForm(repository.preferences.get())}</section>`);
  bindPreferences(document.getElementById('preferencesForm'));
}

async function renderProfile() {
  const profile = await repository.profile().catch(() => null);
  const draft = repository.profileDraft.get();
  const preferences = repository.preferences.get();
  setPage(`${pageHeading('Your account', 'Customer Profile', 'Keep your personal and travel details accurate.')}
    <section class="portal-panel"><div class="panel-heading"><div><p class="portal-eyebrow">Personal details</p><h2>Identity and contact</h2></div>${statusBadge(user.emailVerified ? 'VERIFIED' : 'VERIFICATION_REQUIRED')}</div>
      <form class="portal-form" id="profileForm"><div class="form-grid"><label><span>First name</span><input value="${escapeHtml(profile?.firstName || user.givenName || '')}" disabled></label><label><span>Last name</span><input value="${escapeHtml(profile?.lastName || user.familyName || '')}" disabled></label><label><span>Email</span><input type="email" value="${escapeHtml(profile?.email || user.email)}" disabled></label><label><span>Primary phone</span><input name="phone" type="tel" value="${escapeHtml(draft.phone || profile?.phoneNumber || '')}"></label><label class="full"><span>Address</span><textarea name="address" rows="3">${escapeHtml(draft.address || '')}</textarea></label></div><button class="portal-button" type="submit">Save contact draft</button><p class="storage-note">Name and email come from your verified account. Address and additional phone details remain in this browser session until profile update APIs are introduced.</p></form>
    </section><section class="portal-panel"><p class="portal-eyebrow">Travel profile</p><h2>Comfort and communication</h2>${preferencesForm(preferences, { profile: true })}</section>
    <section class="portal-panel security-link-panel"><div><p class="portal-eyebrow">Account security</p><h2>Password and active sessions</h2><p>Change your password or securely sign out every device from My Account.</p></div><a class="portal-button secondary" href="${portalUrl('/account/#security')}">Manage security</a></section>`);
  document.getElementById('profileForm').addEventListener('submit', event => { event.preventDefault(); repository.profileDraft.save(Object.fromEntries(new FormData(event.currentTarget))); announce('Contact draft saved for this browser session.'); });
  bindPreferences(document.getElementById('profilePreferencesForm'));
}

const renderers = {
  dashboard: renderDashboard,
  quotes: renderQuotes,
  'quote-details': renderQuoteDetails,
  bookings: renderBookings,
  'booking-details': renderBookingDetails,
  trips: renderTrips,
  'trip-details': renderTripDetails,
  travellers: renderTravellers,
  notifications: renderNotifications,
  preferences: renderPreferences,
  profile: renderProfile
};

async function initialize() {
  user = await requireAuthentication();
  if (!user) return;
  root.innerHTML = portalShell(user, page?.replace('-details', ''));
  root.addEventListener('click', async event => {
    const menu = event.target.closest('.portal-menu-toggle');
    if (menu) {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      document.getElementById('portalNavigation').classList.toggle('open', open);
    }
    if (event.target.closest('[data-portal-logout]')) {
      await authenticationProvider.logout();
      location.replace(portalUrl('/index.html'));
    }
    if (event.target.closest('[data-print], [data-print-quote]')) window.print();
    const createBooking = event.target.closest('[data-create-booking]');
    if (createBooking) {
      createBooking.disabled = true;
      try {
        const created = await repository.createBooking(createBooking.dataset.createBooking);
        const booking = bookingSummary(created);
        announce(`Booking ${booking.bookingReference} created.`);
        location.href = portalUrl('/bookings/details/', { id: booking.id });
      } catch (error) {
        announce(error.message);
        createBooking.disabled = false;
      }
    }
    const placeholder = event.target.closest('[data-placeholder]');
    if (placeholder) announce(placeholder.dataset.placeholder);
    if (event.target.closest('[data-retry]')) {
      repository.clearCache();
      await renderers[page]();
    }
  });
  if (isAdminOrStaff(user)) {
    renderAdminDashboard();
    return;
  }
  repository = createPortalRepository(user);
  try {
    await renderers[page]();
  } catch (error) {
    setPage(`${pageHeading('Customer portal', 'Something went wrong', 'Your account remains secure.')} ${errorState(error.message)}`);
  }
}

initialize();
