import { authRequest, AuthError } from './auth/auth-api.js';
import { authenticationProvider } from './auth/authentication-provider.js';
import { authPageUrl } from './auth/config.js';
import { isAdminOrStaff } from './auth/persona.js';
import { canCreateInvoice } from './admin-invoice-eligibility.js';
import { createAdminQuotesRepository } from './admin-quotes-repository.js';
import { escapeHtml, pageHeading, portalShell, portalUrl } from './portal/portal-components.js';
import { finiteAmount, formatQuoteAmount, quoteGrandTotal, quoteLineTotal } from './quote-total.js';

const root = document.querySelector('#portalRoot');
const detailMode = document.body.dataset.adminQuotes === 'detail';
const statusLabels = ['ALL', 'DRAFT', 'SUBMITTED', 'SENT', 'ACCEPTED'];
const badgeTone = { DRAFT: 'draft', SUBMITTED: 'submitted', SENT: 'sent', ACCEPTED: 'accepted' };
let currentStatus = 'ALL';
let currentUser;

const read = (path, options) => authenticationProvider.withAccess(() => authRequest(path, options));
const adminQuotes = createAdminQuotesRepository({ request: read });
const collection = value => Array.isArray(value) ? value : value?.content || value?.items || value?.data || [];
const date = value => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : '—';
const status = value => String(value || '').toUpperCase();
const customerName = customer => [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') || 'Customer';
const errorText = error => error instanceof AuthError && error.status ? `Customer Quotes could not be loaded (HTTP ${error.status}).` : 'Customer Quotes could not be loaded. Please try again.';
const money = formatQuoteAmount;
const maskedAccount = value => { const text = String(value || ''); return text.length > 4 ? `••••${text.slice(-4)}` : '••••'; };
const statusBadge = value => `<span class="vc-badge vc-badge--${badgeTone[status(value)] || 'draft'}">${escapeHtml(status(value))}</span>`;

function setShell(user, active) {
  root.innerHTML = portalShell(user, active);
  document.querySelector('[data-portal-logout]')?.addEventListener('click', async () => { await authenticationProvider.logout(); location.assign(authPageUrl('/signin/')); });
}

function errorPage(error) {
  document.querySelector('#portalPage').innerHTML = `${pageHeading('CUSTOMER QUOTES', 'Customer Quotes', 'Review quote requests submitted by customers.')}<div class="portal-error" role="alert"><strong>${escapeHtml(errorText(error))}</strong><p>Review and manage customer quotation requests.</p><button class="portal-button secondary" type="button" data-retry>Retry</button></div>`;
  document.querySelector('[data-retry]')?.addEventListener('click', () => loadList());
}

function summaryCard(label, count, active) {
  return `<button type="button" class="admin-quote-filter ${active ? 'active' : ''}" data-status="${label}"><strong>${count}</strong><span>${label[0] + label.slice(1).toLowerCase()}</span></button>`;
}

function quoteRow(quote) {
  return `<tr><td><strong>${escapeHtml(quote.quoteNumber || quote.id)}</strong></td><td><strong>${escapeHtml(quote.customerDisplayName || customerName(quote.detail?.customer))}</strong>${quote.customerEmail ? `<small>${escapeHtml(quote.customerEmail)}</small>` : ''}</td><td>${date(quote.travelDate)}</td><td>${escapeHtml(quote.travellerCount ?? '—')}</td><td>${statusBadge(quote.status)}</td><td>${date(quote.createdAt)}</td><td><a class="portal-button secondary" href="${portalUrl('/admin/quotes/details/', { id: quote.id })}">View</a></td></tr>`;
}

function renderList(quotes) {
  const counts = Object.fromEntries(statusLabels.map(label => [label, label === 'ALL' ? quotes.length : quotes.filter(item => status(item.status) === label).length]));
  const visible = currentStatus === 'ALL' ? quotes : quotes.filter(item => status(item.status) === currentStatus);
  document.querySelector('#portalPage').innerHTML = `${pageHeading('CUSTOMER QUOTES', 'Customer Quotes', 'Review and prepare quote requests submitted by customers.')}<div class="admin-quote-live">LIVE · existing quote pricing · staff protected</div><div class="admin-quote-summary">${statusLabels.map(label => summaryCard(label, counts[label], currentStatus === label)).join('')}</div><div class="admin-quote-table-wrap"><table class="admin-quote-table"><caption class="visually-hidden">Customer quote requests</caption><thead><tr><th>Quote</th><th>Customer</th><th>Travel Date</th><th>Travellers</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>${visible.length ? visible.map(quoteRow).join('') : '<tr><td colspan="7">No quotes match this status.</td></tr>'}</tbody></table></div>`;
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

function sectionWrap(label, body) {
  return `<section class="admin-quote-section"><div class="vc-section-title"><h2>${escapeHtml(label)}</h2><span class="vc-hairline"></span></div>${body}</section>`;
}

function detailList(title, items, render) {
  if (!items?.length) return `<section class="portal-panel"><h2>${title}</h2><p>None recorded.</p></section>`;
  return `<section class="portal-panel"><h2>${title}</h2><ul class="admin-quote-detail-list">${items.map(render).join('')}</ul></section>`;
}

function segmentsPanel(segments) {
  if (!segments?.length) return `<section class="portal-panel"><h2>Trip segments</h2><p>None recorded.</p></section>`;
  const items = segments.map((segment, index) => `<li><span aria-hidden="true">${index + 1}</span><div><strong>${escapeHtml(segment.title || segment.type)}</strong><span class="admin-quote-timeline-note">${escapeHtml(segment.location || segment.description || 'Segment')}</span></div></li>`).join('');
  return `<section class="portal-panel"><h2>Trip segments</h2><ul class="admin-quote-timeline">${items}</ul></section>`;
}

function acceptedCommercialSummary(quote) {
  if (status(quote.status) !== 'ACCEPTED') return '';
  const currency = quote.currency || '';
  const amount = value => `${escapeHtml(currency)} ${money(value)}`;
  const lines = (quote.items || []).map(item => `<tr><th scope="row">${escapeHtml(item.description || 'Quote item')}</th><td>${escapeHtml(item.quantity)}</td><td>${amount(item.unitPrice)}</td><td>${amount(item.lineTotal)}</td></tr>`).join('');
  return sectionWrap('Commercial Summary', `<section class="portal-panel admin-commercial-summary"><dl class="admin-quote-dl"><dt>Currency</dt><dd>${escapeHtml(currency)}</dd><dt>Subtotal</dt><dd>${amount(quote.estimatedValue)}</dd><dt>Total accepted</dt><dd><strong>${amount(quote.estimatedValue)}</strong></dd></dl><div class="admin-quote-table-wrap"><table class="admin-quote-table"><caption>Accepted commercial terms</caption><thead><tr><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Unit Price</th><th scope="col">Line Total</th></tr></thead><tbody>${lines}</tbody></table></div><p class="admin-commercial-summary-note">Taxes, fees and discounts are not represented by the current quote model.</p></section>`);
}

function invoicePanel(quote, linkedInvoice, bankAccounts = [], assignment = null, instruction = null) {
  if (linkedInvoice) {
    const eligible = bankAccounts.filter(account => account.active && account.currency === linkedInvoice.total.currency);
    const destination = linkedInvoice.status === 'DRAFT' ? (eligible.length ? `<section class="payment-destination"><h3>Payment Destination</h3><label>Receiving Bank Account<select data-bank-assignment><option value="">Select account</option>${eligible.map(account => `<option value="${account.bankAccountId}" ${assignment?.bankAccountId === account.bankAccountId ? 'selected' : ''}>${escapeHtml(account.displayName)} · ${escapeHtml(account.bankName)} · ${escapeHtml(account.currency)} · ${maskedAccount(account.accountNumber)}</option>`).join('')}</select></label><button class="portal-button secondary" type="button" data-save-bank-account>Save</button></section>` : `<section class="payment-destination"><p>No active ${escapeHtml(linkedInvoice.total.currency)} receiving account is configured.</p><a class="portal-button secondary" href="/finance/bank-accounts/">Manage Bank Accounts</a></section>`) : instruction ? `<section class="payment-destination"><h3>Payment Instructions</h3><dl><div><dt>Bank</dt><dd>${escapeHtml(instruction.bankName)}</dd></div><div><dt>Account Name</dt><dd>${escapeHtml(instruction.accountName)}</dd></div><div><dt>Account</dt><dd>${maskedAccount(instruction.accountNumber)}</dd></div><div><dt>Branch</dt><dd>${escapeHtml(instruction.branchCode)}</dd></div><div><dt>SWIFT/BIC</dt><dd>${escapeHtml(instruction.swift || 'Not required')}</dd></div><div><dt>Currency</dt><dd>${escapeHtml(instruction.currency)}</dd></div><div><dt>Payment Reference</dt><dd>${escapeHtml(instruction.customerReference)}</dd></div></dl></section>` : '';
    return sectionWrap('Invoice', `<section class="portal-panel admin-commercial-summary"><p><strong>${escapeHtml(linkedInvoice.number)}</strong> ${statusBadge(linkedInvoice.status)}</p><p>${escapeHtml(linkedInvoice.total.currency)} ${money(linkedInvoice.total.amount)}</p><a class="portal-button" href="/financial/invoices/details/?id=${encodeURIComponent(linkedInvoice.id)}">View Invoice</a>${destination}${linkedInvoice.status === 'DRAFT' && currentUser?.roles?.includes('ROLE_ADMIN') ? ` <button class="portal-button secondary" type="button" data-issue-invoice>Issue Invoice</button>` : ''}<p role="status" data-invoice-message></p></section>`);
  }
  if (!canCreateInvoice(quote, currentUser)) return '';
  const total = `${escapeHtml(quote.currency || '')} ${money(quote.estimatedValue)}`;
  return sectionWrap('Create Invoice', `<section class="portal-panel admin-commercial-summary"><p>This will create a <strong>DRAFT</strong> invoice from the accepted quotation.</p><dl class="admin-quote-dl"><dt>Quote</dt><dd>${escapeHtml(quote.quoteNumber)}</dd><dt>Customer</dt><dd>${escapeHtml(customerName(quote.customer))}</dd><dt>Currency</dt><dd>${escapeHtml(quote.currency)}</dd><dt>Total</dt><dd>${total}</dd></dl><button class="portal-button" type="button" data-create-invoice>Create Invoice</button><p role="status" data-invoice-message></p></section>`);
}

function pricingRow(item, currency) {
  const quantity = finiteAmount(item.quantity);
  const unitPrice = finiteAmount(item.unitPrice);
  const label = item.description || 'Quote item';
  return `<div class="admin-quote-pricing-row" data-pricing-row><div class="admin-quote-pricing-row-name"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(item.type || 'Quote item')}</small></div><label class="admin-quote-field">Quantity<input value="${escapeHtml(quantity)}" data-quantity-input disabled></label><label class="admin-quote-field">Unit Price<span class="admin-quote-price-input" data-currency="${escapeHtml(currency || '')}"><input required min="0" step="0.01" type="number" data-item-id="${escapeHtml(item.id)}" value="${escapeHtml(unitPrice)}" aria-label="Unit price for ${escapeHtml(label)}"></span></label><div class="admin-quote-line-total"><small>Line Total</small><strong data-line-total-for="${escapeHtml(item.id)}">${escapeHtml(currency || '')} ${money(quoteLineTotal(quantity, unitPrice))}</strong></div></div>`;
}

async function loadDetail(id) {
  try {
    const quote = await read(`/api/v1/quotes/${encodeURIComponent(id)}/details`);
    let linkedInvoice = null;
    let bankAccounts = [];
    let assignment = null;
    let instruction = null;
    if (status(quote.status) === 'ACCEPTED') {
      try { linkedInvoice = await adminQuotes.existingInvoice(id); } catch (error) { if (!(error instanceof AuthError && error.status === 404)) throw error; }
      if (linkedInvoice) {
        if (linkedInvoice.status === 'DRAFT') {
          bankAccounts = collection(await adminQuotes.bankAccounts());
          assignment = await adminQuotes.bankAssignment(linkedInvoice.id);
        } else {
          try { instruction = await adminQuotes.paymentInstructions(linkedInvoice.id); } catch (error) { if (!(error instanceof AuthError && error.status === 404)) throw error; }
        }
      }
    }
    const customer = quote.customer;
    const trip = quote.itinerary;
    const title = `Quote ${escapeHtml(quote.quoteNumber || id)}`;
    const header = pageHeading('CUSTOMER QUOTES', title, '', '<a class="portal-button secondary" href="/admin/quotes/">Back to Customer Quotes</a>');
    const hero = `<div class="admin-quote-hero"><div class="admin-quote-hero-meta">${statusBadge(quote.status)}<span><strong>${escapeHtml(customerName(customer))}</strong></span><span>${escapeHtml(trip?.destination || 'Destination to be confirmed')}</span><span>Submitted ${date(quote.submittedAt || quote.createdAt)}</span></div></div>`;
    const summary = `<section class="portal-panel admin-quote-full"><h2>Quote summary</h2><dl class="admin-quote-dl"><dt>Status</dt><dd>${escapeHtml(status(quote.status))}</dd><dt>Customer</dt><dd>${escapeHtml(customerName(customer))}<br><small>${escapeHtml(customer?.email || '')}</small></dd><dt>Created</dt><dd>${date(quote.createdAt)}</dd><dt>Submitted</dt><dd>${date(quote.submittedAt)}</dd><dt>Trip</dt><dd>${escapeHtml(trip?.title || '—')}</dd><dt>Destination</dt><dd>${escapeHtml(trip?.destination || '—')}</dd></dl></section>`;
    const items = detailList('Quote items', quote.items, item => `<li><strong>${escapeHtml(item.type)}</strong><span>${escapeHtml(item.description || 'Quote item')} · ${escapeHtml(item.quantity)} × ${escapeHtml(item.unitPrice ?? '0')} ${escapeHtml(quote.currency || '')}</span></li>`);
    const travellers = detailList('Travellers', quote.travellers, traveller => `<li><strong>${escapeHtml(customerName(traveller))}</strong><span>${escapeHtml(traveller.type || 'Traveller')}</span></li>`);
    const requestOverview = sectionWrap('Request Overview', `<div class="admin-quote-section-grid">${summary}${items}${travellers}</div>`);
    const commercialSummary = acceptedCommercialSummary(quote);
    const travelPlan = sectionWrap('Travel Plan', segmentsPanel(trip?.segments));
    const canPrepare = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.permissions?.includes('QUOTE_CHANGE_STATUS');
    const quotation = canPrepare && ['SUBMITTED', 'SENT'].includes(status(quote.status)) ? sectionWrap('Prepare Quotation', `<section class="portal-panel admin-quotation"><p class="portal-eyebrow">Staff pricing</p><form data-quotation-form><div class="admin-quote-pricing-grid">${(quote.items || []).map(item => pricingRow(item, quote.currency)).join('')}</div><div class="admin-quote-footer-grid"><label class="admin-quote-field">Quotation Valid Until<input type="date" name="validUntil" value="${escapeHtml(quote.validUntil || '')}"></label><label class="admin-quote-field">Customer-visible Notes<textarea name="notes" rows="3">${escapeHtml(quote.notes || '')}</textarea></label></div><div class="admin-quote-total-row"><span class="vc-eyebrow">Quotation Total</span><strong data-quotation-total>${escapeHtml(quote.currency || '')} ${money(quoteGrandTotal(quote.items))}</strong></div><div class="admin-quote-actions"><button class="portal-button" type="submit">Save Quotation</button>${status(quote.status) === 'SUBMITTED' ? '<button class="portal-button secondary" type="button" data-issue-quotation>Send Quote to Customer</button>' : ''}<p role="status" data-quotation-message></p></div></form></section>`) : '';
    document.querySelector('#portalPage').innerHTML = `${header}${hero}<div class="admin-quote-live">LIVE · existing quote pricing · staff protected</div>${commercialSummary}${invoicePanel(quote, linkedInvoice, bankAccounts, assignment, instruction)}${requestOverview}${travelPlan}${quotation}`;
    bindQuotation(id);
    bindInvoice(id, quote, linkedInvoice);
  } catch (error) { errorPage(error); }
}

function bindInvoice(id, quote, linkedInvoice) {
  const create = document.querySelector('[data-create-invoice]');
  const message = document.querySelector('[data-invoice-message]');
  document.querySelector('[data-save-bank-account]')?.addEventListener('click', async event => {
    const bankAccountId = document.querySelector('[data-bank-assignment]')?.value;
    if (!bankAccountId) { if (message) message.textContent = 'Select a receiving bank account before saving.'; return; }
    event.currentTarget.disabled = true;
    try { await adminQuotes.assignBankAccount(linkedInvoice.id, bankAccountId); await loadDetail(id); }
    catch (error) { if (message) message.textContent = errorText(error); event.currentTarget.disabled = false; }
  });
  create?.addEventListener('click', async () => {
    if (!window.confirm(`Create Invoice\n\nQuote: ${quote.quoteNumber}\nCustomer: ${customerName(quote.customer)}\nCurrency: ${quote.currency}\nTotal: ${quote.currency} ${money(quote.estimatedValue)}\n\nThis will create a DRAFT invoice from the accepted quotation.`)) return;
    create.disabled = true;
    try { await adminQuotes.createInvoice(id); await loadDetail(id); }
    catch (error) { if (message) message.textContent = errorText(error); create.disabled = false; }
  });
  document.querySelector('[data-issue-invoice]')?.addEventListener('click', async event => {
    event.currentTarget.disabled = true;
    try { await adminQuotes.issueInvoice(linkedInvoice.id); await loadDetail(id); }
    catch (error) { if (message) message.textContent = errorText(error); event.currentTarget.disabled = false; }
  });
}

function bindLinePreview(form) {
  form.querySelectorAll('[data-item-id], [data-quantity-input]').forEach(input => {
    input.addEventListener('input', () => {
      const row = input.closest('[data-pricing-row]');
      const currency = row?.querySelector('.admin-quote-price-input')?.dataset.currency || '';
      const priceInput = row?.querySelector('[data-item-id]');
      const target = priceInput && form.querySelector(`[data-line-total-for="${CSS.escape(priceInput.dataset.itemId)}"]`);
      if (!target) return;
      const quantity = finiteAmount(row?.querySelector('[data-quantity-input]')?.value);
      target.textContent = `${currency} ${money(quoteLineTotal(quantity, priceInput.value))}`;
      renderGrandTotal(form);
    });
  });
}

function renderGrandTotal(form) {
  const items = [...form.querySelectorAll('[data-item-id]')].map(input => ({
    quantity: input.closest('[data-pricing-row]')?.querySelector('[data-quantity-input]')?.value,
    unitPrice: input.value
  }));
  const target = form.querySelector('[data-quotation-total]');
  const currency = form.querySelector('.admin-quote-price-input')?.dataset.currency || '';
  if (target) target.textContent = `${currency} ${money(quoteGrandTotal(items))}`;
}

function bindQuotation(id) {
  const form = document.querySelector('[data-quotation-form]');
  if (!form) return;
  bindLinePreview(form);
  renderGrandTotal(form);
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
