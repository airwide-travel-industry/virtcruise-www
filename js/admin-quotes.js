import { authRequest, AuthError } from './auth/auth-api.js';
import { authenticationProvider } from './auth/authentication-provider.js';
import { authPageUrl } from './auth/config.js';
import { isAdminOrStaff } from './auth/persona.js';
import { escapeHtml, pageHeading, portalShell, portalUrl } from './portal/portal-components.js';

const root = document.querySelector('#portalRoot');
const detailMode = document.body.dataset.adminQuotes === 'detail';
const statusLabels = ['ALL', 'DRAFT', 'SUBMITTED'];
let currentStatus = 'ALL';

const read = path => authenticationProvider.withAccess(() => authRequest(path));
const collection = value => Array.isArray(value) ? value : value?.content || value?.items || [];
const date = value => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : '—';
const status = value => String(value || '').toUpperCase();
const customerName = customer => [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') || 'Customer';
const errorText = error => error instanceof AuthError && error.status ? `Customer Quotes could not be loaded (HTTP ${error.status}).` : 'Customer Quotes could not be loaded. Please try again.';

function setShell(user, active) {
  root.innerHTML = portalShell(user, active);
  document.querySelector('[data-portal-logout]')?.addEventListener('click', async () => { await authenticationProvider.logout(); location.assign(authPageUrl('/signin/')); });
}

function errorPage(error) {
  document.querySelector('#portalPage').innerHTML = `${pageHeading('CUSTOMER QUOTES', 'Customer Quotes', 'Review quote requests submitted by customers.')}<div class="portal-error" role="alert"><strong>${escapeHtml(errorText(error))}</strong><p>This read-only admin view uses the V14 quote service.</p><button class="portal-button secondary" type="button" data-retry>Retry</button></div>`;
  document.querySelector('[data-retry]')?.addEventListener('click', () => loadList());
}

function summaryCard(label, count, active) {
  return `<button type="button" class="admin-quote-filter ${active ? 'active' : ''}" data-status="${label}"><strong>${count}</strong><span>${label[0] + label.slice(1).toLowerCase()}</span></button>`;
}

function quoteRow(quote) {
  const detail = quote.detail;
  const customer = detail?.customer;
  const destination = detail?.itinerary?.destination || detail?.itinerary?.title || '—';
  return `<tr><td><strong>${escapeHtml(quote.quoteNumber || quote.id)}</strong></td><td>${escapeHtml(customerName(customer))}</td><td>${escapeHtml(destination)}</td><td><span class="admin-quote-status">${escapeHtml(status(quote.status))}</span></td><td>${date(quote.createdAt)}</td><td>${date(detail?.submittedAt)}</td><td><a class="portal-button secondary" href="${portalUrl('/admin/quotes/details/', { id: quote.id })}">View</a></td></tr>`;
}

function renderList(quotes) {
  const counts = { ALL: quotes.length, DRAFT: quotes.filter(item => status(item.status) === 'DRAFT').length, SUBMITTED: quotes.filter(item => status(item.status) === 'SUBMITTED').length };
  const visible = currentStatus === 'ALL' ? quotes : quotes.filter(item => status(item.status) === currentStatus);
  document.querySelector('#portalPage').innerHTML = `${pageHeading('CUSTOMER QUOTES', 'Customer Quotes', 'Review quote requests submitted by customers.')}<div class="admin-quote-live">LIVE · V14 quote data · read-only</div><div class="admin-quote-summary">${statusLabels.map(label => summaryCard(label, counts[label], currentStatus === label)).join('')}</div><div class="admin-quote-table-wrap"><table class="admin-quote-table"><caption>Customer quote requests</caption><thead><tr><th>Quote</th><th>Customer</th><th>Trip / Destination</th><th>Status</th><th>Created</th><th>Submitted</th><th>Action</th></tr></thead><tbody>${visible.length ? visible.map(quoteRow).join('') : '<tr><td colspan="7">No quotes match this status.</td></tr>'}</tbody></table></div>`;
  document.querySelectorAll('[data-status]').forEach(button => button.addEventListener('click', () => { currentStatus = button.dataset.status; renderList(quotes); }));
}

async function loadList() {
  try {
    const response = await read('/api/v1/quotes?page=0&size=100');
    const quotes = collection(response);
    const detailed = await Promise.all(quotes.map(async quote => ({ ...quote, detail: await read(`/api/v1/quotes/${encodeURIComponent(quote.id)}/details`) })));
    renderList(detailed);
  } catch (error) { errorPage(error); }
}

function detailList(title, items, render) {
  if (!items?.length) return `<section class="portal-panel"><h2>${title}</h2><p>None recorded.</p></section>`;
  return `<section class="portal-panel"><h2>${title}</h2><ul class="admin-quote-detail-list">${items.map(render).join('')}</ul></section>`;
}

async function loadDetail(id) {
  try {
    const quote = await read(`/api/v1/quotes/${encodeURIComponent(id)}/details`);
    const customer = quote.customer;
    const trip = quote.itinerary;
    const title = `Quote ${escapeHtml(quote.quoteNumber || id)}`;
    const header = pageHeading('CUSTOMER QUOTES', title, '<a class="portal-button secondary" href="/admin/quotes/">Back to Customer Quotes</a>');
    const items = detailList('Quote items', quote.items, item => `<li><strong>${escapeHtml(item.type)}</strong><span>${escapeHtml(item.description || 'Quote item')}</span></li>`);
    const travellers = detailList('Travellers', quote.travellers, traveller => `<li><strong>${escapeHtml(customerName(traveller))}</strong><span>${escapeHtml(traveller.type || 'Traveller')}</span></li>`);
    const segments = detailList('Trip segments', trip?.segments, segment => `<li><strong>${escapeHtml(segment.title || segment.type)}</strong><span>${escapeHtml(segment.location || segment.description || 'Segment')}</span></li>`);
    document.querySelector('#portalPage').innerHTML = `${header}<div class="admin-quote-live">LIVE · V14 quote data · read-only</div><section class="admin-quote-detail-grid"><section class="portal-panel"><h2>Quote summary</h2><dl class="admin-quote-dl"><dt>Status</dt><dd>${escapeHtml(status(quote.status))}</dd><dt>Customer</dt><dd>${escapeHtml(customerName(customer))}</dd><dt>Created</dt><dd>${date(quote.createdAt)}</dd><dt>Submitted</dt><dd>${date(quote.submittedAt)}</dd><dt>Trip</dt><dd>${escapeHtml(trip?.title || '—')}</dd><dt>Destination</dt><dd>${escapeHtml(trip?.destination || '—')}</dd></dl></section>${items}${travellers}${segments}</section>`;
  } catch (error) { errorPage(error); }
}

async function start() {
  const user = await authenticationProvider.initialize();
  if (!user) { location.replace(authPageUrl('/signin/', { returnTo: location.pathname })); return; }
  if (!isAdminOrStaff(user)) { root.innerHTML = '<main class="portal-main"><div class="portal-error" role="alert"><strong>Access denied.</strong><p>Customer Quotes is restricted to administrator/staff users.</p></div></main>'; return; }
  setShell(user, detailMode ? 'admin-quotes' : 'admin-quotes');
  if (detailMode) await loadDetail(new URLSearchParams(location.search).get('id')); else await loadList();
}
start();
