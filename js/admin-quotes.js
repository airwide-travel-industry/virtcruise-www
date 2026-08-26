import { authRequest, AuthError } from './auth/auth-api.js';
import { authenticationProvider } from './auth/authentication-provider.js';
import { authPageUrl } from './auth/config.js';
import { isAdminOrStaff } from './auth/persona.js';
import { escapeHtml, pageHeading, portalShell, portalUrl } from './portal/portal-components.js';

const root = document.querySelector('#portalRoot');
const detailMode = document.body.dataset.adminQuotes === 'detail';
const statusLabels = ['ALL', 'DRAFT', 'SUBMITTED', 'SENT', 'ACCEPTED'];
let currentStatus = 'ALL';
let currentUser;

const read = (path, options) => authenticationProvider.withAccess(() => authRequest(path, options));
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
  return `<tr><td><strong>${escapeHtml(quote.quoteNumber || quote.id)}</strong></td><td><strong>${escapeHtml(quote.customerDisplayName || customerName(quote.detail?.customer))}</strong>${quote.customerEmail ? `<small>${escapeHtml(quote.customerEmail)}</small>` : ''}</td><td>${date(quote.travelDate)}</td><td>${escapeHtml(quote.travellerCount ?? '—')}</td><td><span class="admin-quote-status">${escapeHtml(status(quote.status))}</span></td><td>${date(quote.createdAt)}</td><td><a class="portal-button secondary" href="${portalUrl('/admin/quotes/details/', { id: quote.id })}">View</a></td></tr>`;
}

function renderList(quotes) {
  const counts = Object.fromEntries(statusLabels.map(label => [label, label === 'ALL' ? quotes.length : quotes.filter(item => status(item.status) === label).length]));
  const visible = currentStatus === 'ALL' ? quotes : quotes.filter(item => status(item.status) === currentStatus);
  document.querySelector('#portalPage').innerHTML = `${pageHeading('CUSTOMER QUOTES', 'Customer Quotes', 'Review and prepare quote requests submitted by customers.')}<div class="admin-quote-live">LIVE · existing quote pricing · staff protected</div><div class="admin-quote-summary">${statusLabels.map(label => summaryCard(label, counts[label], currentStatus === label)).join('')}</div><div class="admin-quote-table-wrap"><table class="admin-quote-table"><caption>Customer quote requests</caption><thead><tr><th>Quote</th><th>Customer</th><th>Travel Date</th><th>Travellers</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>${visible.length ? visible.map(quoteRow).join('') : '<tr><td colspan="7">No quotes match this status.</td></tr>'}</tbody></table></div>`;
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
    const items = detailList('Quote items', quote.items, item => `<li><strong>${escapeHtml(item.type)}</strong><span>${escapeHtml(item.description || 'Quote item')} · ${escapeHtml(item.quantity)} × ${escapeHtml(item.unitPrice ?? '0')} ${escapeHtml(quote.currency || '')}</span></li>`);
    const travellers = detailList('Travellers', quote.travellers, traveller => `<li><strong>${escapeHtml(customerName(traveller))}</strong><span>${escapeHtml(traveller.type || 'Traveller')}</span></li>`);
    const segments = detailList('Trip segments', trip?.segments, segment => `<li><strong>${escapeHtml(segment.title || segment.type)}</strong><span>${escapeHtml(segment.location || segment.description || 'Segment')}</span></li>`);
    const canPrepare = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.permissions?.includes('QUOTE_CHANGE_STATUS');
    const quotation = canPrepare && ['SUBMITTED', 'SENT'].includes(status(quote.status)) ? `<section class="portal-panel admin-quotation"><p class="portal-eyebrow">Staff pricing</p><h2>Prepare Quotation</h2><form data-quotation-form><div class="admin-quote-items">${(quote.items || []).map(item => `<label>${escapeHtml(item.description || 'Quote item')}<span>${escapeHtml(item.quantity)} ×</span><input required min="0" step="0.01" type="number" data-item-id="${escapeHtml(item.id)}" value="${escapeHtml(item.unitPrice ?? 0)}" aria-label="Unit price for ${escapeHtml(item.description || 'quote item')}"></label>`).join('')}</div><label>Valid until<input type="date" name="validUntil" value="${escapeHtml(quote.validUntil || '')}"></label><label>Customer-visible notes<textarea name="notes" rows="3">${escapeHtml(quote.notes || '')}</textarea></label><p>Total: <strong data-quotation-total>${escapeHtml(quote.totalAmount ?? 0)} ${escapeHtml(quote.currency || '')}</strong></p><button class="portal-button" type="submit">Save Quotation</button>${status(quote.status) === 'SUBMITTED' ? '<button class="portal-button secondary" type="button" data-issue-quotation>Send Quote to Customer</button>' : ''}<p role="status" data-quotation-message></p></form></section>` : '';
    document.querySelector('#portalPage').innerHTML = `${header}<div class="admin-quote-live">LIVE · existing quote pricing · staff protected</div><section class="admin-quote-detail-grid"><section class="portal-panel"><h2>Quote summary</h2><dl class="admin-quote-dl"><dt>Status</dt><dd>${escapeHtml(status(quote.status))}</dd><dt>Customer</dt><dd>${escapeHtml(customerName(customer))}<br><small>${escapeHtml(customer?.email || '')}</small></dd><dt>Created</dt><dd>${date(quote.createdAt)}</dd><dt>Submitted</dt><dd>${date(quote.submittedAt)}</dd><dt>Trip</dt><dd>${escapeHtml(trip?.title || '—')}</dd><dt>Destination</dt><dd>${escapeHtml(trip?.destination || '—')}</dd></dl></section>${items}${travellers}${segments}${quotation}</section>`;
    bindQuotation(id);
  } catch (error) { errorPage(error); }
}

function bindQuotation(id) {
  const form = document.querySelector('[data-quotation-form]');
  if (!form) return;
  form.addEventListener('submit', async event => {
    event.preventDefault(); const button = form.querySelector('[type="submit"]'); button.disabled = true;
    try { await read(`/api/v1/quotes/${encodeURIComponent(id)}/quotation`, { method: 'PUT', body: JSON.stringify({ items: [...form.querySelectorAll('[data-item-id]')].map(input => ({ id: input.dataset.itemId, unitPrice: input.value })), validUntil: form.validUntil.value || null, notes: form.notes.value.trim() || null }) }); await loadDetail(id); }
    catch (error) { form.querySelector('[data-quotation-message]').textContent = errorText(error); button.disabled = false; }
  });
  form.querySelector('[data-issue-quotation]')?.addEventListener('click', async event => { event.currentTarget.disabled = true; try { await read(`/api/v1/quotes/${encodeURIComponent(id)}/issue`, { method: 'POST' }); await loadDetail(id); } catch (error) { form.querySelector('[data-quotation-message]').textContent = errorText(error); event.currentTarget.disabled = false; } });
}

async function start() {
  const user = await authenticationProvider.initialize();
  if (!user) { location.replace(authPageUrl('/signin/', { returnTo: location.pathname })); return; }
  if (!isAdminOrStaff(user)) { root.innerHTML = '<main class="portal-main"><div class="portal-error" role="alert"><strong>Access denied.</strong><p>Customer Quotes is restricted to administrator/staff users.</p></div></main>'; return; }
  currentUser = user;
  setShell(user, 'admin-quotes');
  if (detailMode) await loadDetail(new URLSearchParams(location.search).get('id')); else await loadList();
}
start();
