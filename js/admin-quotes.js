import { authRequest, AuthError } from './auth/auth-api.js';
import { authenticationProvider } from './auth/authentication-provider.js';
import { authPageUrl } from './auth/config.js';
import { isAdminOrStaff } from './auth/persona.js';
import { escapeHtml, pageHeading, portalShell, portalUrl } from './portal/portal-components.js';

const root = document.querySelector('#portalRoot');
const detailMode = document.body.dataset.adminQuotes === 'detail';
const statusLabels = ['ALL', 'DRAFT', 'SUBMITTED', 'QUOTED', 'ACCEPTED'];
let currentStatus = 'ALL';
const read = path => authenticationProvider.withAccess(() => authRequest(path));
const status = value => String(value || '').toUpperCase();
const date = value => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : '—';
const collection = value => Array.isArray(value) ? value : value?.content || value?.items || [];
const customerName = customer => [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') || 'Customer';

function denied() {
  root.innerHTML = '<main class="portal-main"><div class="portal-error" role="alert"><strong>Access denied.</strong><p>Customer Quotes is restricted to staff permissions.</p></div></main>';
}

function shell(user) {
  root.innerHTML = portalShell(user, 'admin-quotes');
  document.querySelector('[data-portal-logout]')?.addEventListener('click', async () => { await authenticationProvider.logout(); location.assign(authPageUrl('/signin/')); });
}

function listPage(quotes) {
  const counts = Object.fromEntries(statusLabels.map(label => [label, label === 'ALL' ? quotes.length : quotes.filter(item => status(item.status) === label).length]));
  const visible = currentStatus === 'ALL' ? quotes : quotes.filter(item => status(item.status) === currentStatus);
  document.querySelector('#portalPage').innerHTML = `${pageHeading('STAFF WORKSPACE', 'Customer Quotes', 'Review customer-submitted quote requests without entering the customer persona.')}<div class="admin-quote-summary">${statusLabels.map(label => `<button type="button" class="admin-quote-filter ${currentStatus === label ? 'active' : ''}" data-status="${label}"><strong>${counts[label]}</strong><span>${label === 'ALL' ? 'All requests' : label}</span></button>`).join('')}</div><div class="admin-quote-table-wrap"><table class="admin-quote-table"><caption>Customer quote requests</caption><thead><tr><th>Quote</th><th>Customer</th><th>Travel date</th><th>Travellers</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>${visible.length ? visible.map(quote => `<tr><td><strong>${escapeHtml(quote.quoteNumber || quote.id)}</strong></td><td>${escapeHtml(quote.customerName || 'Customer')}</td><td>${escapeHtml(quote.travelDate || 'To arrange')}</td><td>${escapeHtml(quote.travellerCount)}</td><td><span class="admin-quote-status">${escapeHtml(status(quote.status))}</span></td><td>${date(quote.createdAt)}</td><td><a class="portal-button secondary" href="${portalUrl('/admin/quotes/details/', { id: quote.id })}">View details</a></td></tr>`).join('') : '<tr><td colspan="7">No quote requests match this status.</td></tr>'}</tbody></table></div>`;
  document.querySelectorAll('[data-status]').forEach(button => button.addEventListener('click', () => { currentStatus = button.dataset.status; listPage(quotes); }));
}

function detailList(title, items, render) {
  if (!items?.length) return '';
  return `<section class="portal-panel"><h2>${escapeHtml(title)}</h2><ul class="admin-quote-list">${items.map(render).join('')}</ul></section>`;
}

async function loadDetail(id) {
  const quote = await read(`/api/v1/quotes/${encodeURIComponent(id)}/details`);
  const trip = quote.trip;
  const customer = quote.customer;
  const back = `<a class="portal-button secondary" href="${portalUrl('/admin/quotes/')}">Back to Customer Quotes</a>`;
  const title = `Quote ${quote.quoteNumber || id}`;
  const travellers = detailList('Travellers', quote.travellers, item => `<li><strong>${escapeHtml(customerName(item))}</strong><span>${escapeHtml(item.type || 'Traveller')}</span></li>`);
  const segments = detailList('Trip segments', trip?.segments, item => `<li><strong>${escapeHtml(item.title || item.type || 'Segment')}</strong><span>${escapeHtml(item.location || item.description || '—')}</span></li>`);
  const items = detailList('Quote items', quote.items, item => `<li><strong>${escapeHtml(item.type || 'Item')}</strong><span>${escapeHtml(item.description || '—')}</span></li>`);
  const summary = `<section class="portal-panel"><h2>Request summary</h2><dl class="admin-quote-dl"><dt>Status</dt><dd>${escapeHtml(status(quote.status))}</dd><dt>Customer</dt><dd>${escapeHtml(customerName(customer))}</dd><dt>Email</dt><dd>${escapeHtml(customer?.email || '—')}</dd><dt>Created</dt><dd>${date(quote.createdAt)}</dd><dt>Submitted</dt><dd>${date(quote.submittedAt)}</dd><dt>Destination</dt><dd>${escapeHtml(trip?.destination || '—')}</dd></dl></section>`;
  document.querySelector('#portalPage').innerHTML = `${pageHeading('STAFF WORKSPACE', title, 'Customer quote request details.', back)}<div class="admin-quote-detail-grid">${summary}${travellers}${segments}${items}</div>`;
}

async function start() {
  const user = await authenticationProvider.initialize();
  if (!user) { location.replace(authPageUrl('/signin/', { returnTo: location.pathname })); return; }
  if (!isAdminOrStaff(user)) { denied(); return; }
  shell(user);
  try {
    if (detailMode) await loadDetail(new URLSearchParams(location.search).get('id'));
    else listPage(collection(await read('/api/v1/quotes?page=0&size=100')));
  } catch (error) {
    const message = error instanceof AuthError && error.status === 403 ? 'You do not have permission to review customer quote requests.' : 'Customer Quotes is temporarily unavailable. Please try again.';
    document.querySelector('#portalPage').innerHTML = `${pageHeading('STAFF WORKSPACE', 'Customer Quotes', 'Review customer-submitted quote requests.')}<div class="portal-error" role="alert"><strong>${message}</strong></div>`;
  }
}

start();
