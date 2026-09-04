import { authenticationProvider } from '../auth/authentication-provider.js';
import { hasFinanceAccess, requireAuthentication } from '../auth/route-guard.js';
import {
  announce, emptyState, errorState, escapeHtml, formatDate, pageHeading, portalShell, portalUrl
} from '../portal/portal-components.js';
import { confirmAction } from '../portal/portal-components.js';
import { financeShell } from '../finance/finance-components.js';
import { debounce, searchableText } from '../portal/debounced-search.js';
import { createFinancialRepository } from './financial-repository.js';
import {
  amountDescription, bookingLink, financialStatus, formatFinancialMoney, pagination, supportDetails
} from './financial-components.js';

const pageName = document.body.dataset.financialPage;
const root = document.getElementById('portalRoot');
const pageSize = 10;
let repository;
let user;
let currentPage = 0;
let financeMode = false;

function setPage(markup, { focus = true } = {}) {
  const page = document.getElementById('portalPage');
  page.innerHTML = markup;
  if (focus) {
    const heading = page.querySelector('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus();
  }
}

function errorMarkup(error) {
  return `${errorState(error.message)}${supportDetails(error)}`;
}

function filterBar({ searchLabel, placeholder, statuses = [] }) {
  return `<section class="portal-toolbar compact financial-toolbar" aria-label="Financial history filters">
    <label><span>${escapeHtml(searchLabel)}</span><input type="search" data-financial-search placeholder="${escapeHtml(placeholder)}"></label>
    <label><span>Status</span><select data-financial-status><option value="">All statuses</option>${statuses.map(status =>
      `<option value="${escapeHtml(status)}">${escapeHtml(status.replaceAll('_', ' '))}</option>`
    ).join('')}</select></label>
  </section><p class="results-count" data-results-count aria-live="polite"></p>`;
}

function bindListControls(items, render, searchable, page) {
  const update = () => {
    const query = document.querySelector('[data-financial-search]')?.value.trim().toLowerCase() || '';
    const status = document.querySelector('[data-financial-status]')?.value || '';
    const filtered = items.filter(item =>
      searchable(item).includes(query) && (!status || item.status === status)
    );
    render(filtered);
    const count = document.querySelector('[data-results-count]');
    if (count) count.textContent = `${filtered.length} of ${page.totalElements} records shown`;
  };
  document.querySelector('[data-financial-search]')?.addEventListener('input', debounce(update));
  document.querySelector('[data-financial-status]')?.addEventListener('change', update);
  update();
}

function bindPagination(render) {
  document.querySelector('.financial-pagination')?.addEventListener('click', async event => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    currentPage = Number(button.dataset.page);
    await render();
  });
}

function invoiceCard(invoice) {
  return `<article class="financial-card">
    <div class="financial-card-heading"><div><small>Invoice</small><h2>${escapeHtml(invoice.number)}</h2></div>${financialStatus(invoice.status)}</div>
    <dl class="financial-facts">
      <div><dt>Booking</dt><dd>${bookingLink(invoice.bookingReference)}</dd></div>
      <div><dt>Currency</dt><dd>${escapeHtml(invoice.total.currency)}</dd></div>
      <div><dt>Total</dt><dd>${amountDescription(invoice.total, 'Invoice total')}</dd></div>
      <div><dt>Amount paid</dt><dd>${amountDescription(invoice.allocated, 'Amount paid')}</dd></div>
      <div><dt>Outstanding balance</dt><dd>${amountDescription(invoice.outstanding, 'Outstanding balance')}</dd></div>
    </dl>
    <a class="portal-button secondary" href="${portalUrl('/financial/invoices/details/', { id: invoice.id })}">View invoice ${escapeHtml(invoice.number)}</a>
  </article>`;
}

const maskedAccount = value => {
  const text = String(value || '');
  return text.length > 4 ? `••••${text.slice(-4)}` : '••••';
};

function financeInvoiceRow(invoice) {
  return `<tr><th scope="row">${escapeHtml(invoice.number)}</th><td>${escapeHtml(invoice.customerId || 'Customer')}</td><td>${escapeHtml(invoice.sourceQuoteId || '—')}</td><td>${escapeHtml(invoice.status)}</td><td>${escapeHtml(invoice.total.currency)}</td><td>${amountDescription(invoice.total, 'Invoice total')}</td><td>${amountDescription(invoice.allocated, 'Amount paid')}</td><td>${amountDescription(invoice.outstanding, 'Outstanding balance')}</td><td><a class="portal-button secondary" href="${portalUrl('/financial/invoices/details/', { id: invoice.id })}">Open invoice</a></td></tr>`;
}

async function renderFinanceInvoices() {
  const page = await repository.invoices({ page: currentPage, size: pageSize });
  setPage(`${pageHeading('Finance Operations', 'Invoices', 'Manage invoice payment readiness and approved receiving-account instructions.')}
    <div class="finance-table-wrap"><table class="finance-table"><caption>Finance invoices</caption><thead><tr><th>Invoice number</th><th>Customer</th><th>Source Quote</th><th>Status</th><th>Currency</th><th>Total</th><th>Amount Paid</th><th>Outstanding Balance</th><th>Action</th></tr></thead><tbody>${page.items.map(financeInvoiceRow).join('')}</tbody></table></div>${pagination(page, 'Invoice')}`);
  bindPagination(renderFinanceInvoices);
}

function instructionView(instruction) {
  return `<section class="portal-panel payment-destination"><h2>PAYMENT INSTRUCTIONS</h2><dl class="financial-facts"><div><dt>Bank</dt><dd>${escapeHtml(instruction.bankName)}</dd></div><div><dt>Account Name</dt><dd>${escapeHtml(instruction.accountName)}</dd></div><div><dt>Account</dt><dd>${escapeHtml(maskedAccount(instruction.accountNumber))}</dd></div><div><dt>Branch</dt><dd>${escapeHtml(instruction.branchCode || 'Not configured')}</dd></div><div><dt>SWIFT/BIC</dt><dd>${escapeHtml(instruction.swift || 'Not configured')}</dd></div><div><dt>Currency</dt><dd>${escapeHtml(instruction.currency)}</dd></div><div><dt>Reference</dt><dd>${escapeHtml(instruction.customerReference)}</dd></div></dl></section>`;
}

async function renderFinanceInvoiceDetails() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) { renderFinanceInvoices(); return; }
  const invoice = await repository.invoice(id);
  let instruction = null;
  try { instruction = await repository.paymentInstruction(id); } catch (error) { if (error.status !== 404) throw error; }
  const eligible = instruction ? [] : (await repository.receivingAccounts()).filter(account => account.active && String(account.currency).toUpperCase() === invoice.total.currency);
  const blocked = ['PAID', 'PARTIALLY_PAID', 'SETTLED', 'CLEARED'].includes(String(invoice.status).toUpperCase()) || Number(invoice.allocated.amount) > 0;
  const recovery = !instruction && !blocked && invoice.status === 'ISSUED' && eligible.length
    ? `<section class="portal-panel payment-destination"><h2>PAYMENT INSTRUCTIONS</h2><p>No payment instructions have been issued for this invoice.</p><label>Receiving Bank Account<select data-legacy-bank-account required><option value="">Select receiving account</option>${eligible.map(account => `<option value="${escapeHtml(account.bankAccountId)}">${escapeHtml(account.displayName)} · ${escapeHtml(account.currency)} · ${escapeHtml(maskedAccount(account.accountNumber))}</option>`).join('')}</select></label><button class="portal-button" type="button" data-issue-payment>Issue Payment Instructions</button><p role="status" data-invoice-message></p></section>` : '';
  setPage(`${pageHeading('Finance Invoice', invoice.number, 'Finance-controlled invoice detail workspace.', '<button class="portal-button secondary" type="button" data-print-financial>Print invoice view</button>')}
    <section class="financial-invoice-hero"><div>${financialStatus(invoice.status)}<p>Source Quote ${escapeHtml(invoice.sourceQuoteId || 'Not linked')}</p></div><div><small>Outstanding balance</small>${amountDescription(invoice.outstanding, 'Outstanding balance')}</div></section>
    <section class="portal-panel financial-line-items"><h2>Invoice items</h2><div class="financial-table-scroll"><table><caption>Line items for invoice ${escapeHtml(invoice.number)}</caption><thead><tr><th>Description</th><th>Quantity</th><th>Unit amount</th><th>Tax rate</th><th>Tax</th><th>Total</th></tr></thead><tbody>${invoice.lines.map(line => `<tr><th>${escapeHtml(line.description)}</th><td>${escapeHtml(line.quantity)}</td><td>${amountDescription(line.unitPrice, 'Unit amount')}</td><td>${escapeHtml(line.taxRate)}</td><td>${amountDescription(line.tax, 'Tax')}</td><td>${amountDescription(line.total, 'Line total')}</td></tr>`).join('')}</tbody></table></div><dl class="financial-totals"><div><dt>Total</dt><dd>${amountDescription(invoice.total, 'Invoice total')}</dd></div><div><dt>Amount paid</dt><dd>${amountDescription(invoice.allocated, 'Amount paid')}</dd></div><div class="total"><dt>Outstanding balance</dt><dd>${amountDescription(invoice.outstanding, 'Outstanding balance')}</dd></div></dl></section>${instruction ? instructionView(instruction) : recovery}`);
  document.querySelector('[data-print-financial]')?.addEventListener('click', () => window.print());
  document.querySelector('[data-issue-payment]')?.addEventListener('click', async event => {
    const select = document.querySelector('[data-legacy-bank-account]');
    if (!select.value) { document.querySelector('[data-invoice-message]').textContent = 'Select an ACTIVE matching-currency receiving account.'; return; }
    const account = select.selectedOptions[0].textContent;
    const confirmed = await confirmAction(`Invoice: ${invoice.number}\nAmount: ${formatFinancialMoney(invoice.total)}\nReceiving account: ${account}\n\nThis will create immutable payment instructions for this invoice.`, 'Issue bank-transfer instructions?');
    if (!confirmed) return;
    event.currentTarget.disabled = true;
    try { await repository.issuePaymentInstruction(id, select.value); repository.clear(); await renderFinanceInvoiceDetails(); announce('Payment instructions issued.'); }
    catch (error) { document.querySelector('[data-invoice-message]').textContent = error.message; event.currentTarget.disabled = false; }
  });
}

async function renderOverview() {
  const [account, resources] = await Promise.all([
    repository.account('ZAR'),
    Promise.allSettled([
    repository.invoices({ page: 0, size: 5 }),
    repository.payments({ page: 0, size: 5 }),
    repository.receipts({ page: 0, size: 5 }),
    repository.refunds({ page: 0, size: 5 })
    ])
  ]);
  const [invoices, payments, receipts, refunds] = resources.map(result =>
    result.status === 'fulfilled' ? result.value : { items: [] }
  );
  if (resources.some(result => result.status === 'rejected')) {
    throw resources.find(result => result.status === 'rejected').reason;
  }
  const deposits = await repository.deposits(account.id, { page: 0, size: 5 });
  const openInvoices = invoices.items.filter(item => !['PAID', 'CANCELLED', 'CREDITED'].includes(item.status));
  const pendingRefunds = refunds.items.filter(item => !['COMPLETED', 'REJECTED', 'CANCELLED'].includes(item.status));
  const nextDeposit = [...deposits.items]
    .filter(item => !['PAID', 'CANCELLED', 'REFUNDED'].includes(item.status))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const balanceState = account.outstanding.amount !== '0' && !/^0(?:\.0+)?$/.test(account.outstanding.amount)
      ? ['Amount outstanding', formatFinancialMoney(account.outstanding)]
      : account.creditBalance.amount !== '0' && !/^0(?:\.0+)?$/.test(account.creditBalance.amount)
        ? ['Credit balance', formatFinancialMoney(account.creditBalance)]
        : ['No outstanding balance', formatFinancialMoney(account.outstanding)];
  setPage(`${pageHeading('Your finances', 'Financial Overview', 'A clear view of invoices, payments, receipts and refunds linked to your travel.')}
    <section class="financial-summary-grid" aria-label="Financial summary">
      <article class="financial-summary primary"><span>${escapeHtml(balanceState[0])}</span><strong>${escapeHtml(balanceState[1])}</strong><small>ZAR account</small></article>
      <article class="financial-summary"><span>Open invoices</span><strong>${openInvoices.length}</strong><a href="${portalUrl('/financial/invoices/')}">View invoices</a></article>
      <article class="financial-summary"><span>Next deposit due</span><strong>${nextDeposit ? formatFinancialMoney(nextDeposit.outstanding) : 'None due'}</strong><small>${nextDeposit ? `${formatDate(nextDeposit.dueDate)} · ${nextDeposit.bookingReference}` : 'Online payment will be available soon.'}</small></article>
      <article class="financial-summary"><span>Pending refunds</span><strong>${pendingRefunds.length}</strong><a href="${portalUrl('/financial/refunds/')}">Track refunds</a></article>
    </section>
    <div class="portal-columns">
      <section class="portal-panel"><div class="panel-heading"><div><p class="portal-eyebrow">Recent activity</p><h2>Payments and receipts</h2></div></div>
        ${payments.items.length || receipts.items.length ? `<div class="financial-activity">
          ${payments.items.slice(0, 3).map(item => `<article><span aria-hidden="true">↓</span><div><strong>Payment ${escapeHtml(item.reference)}</strong><small>${escapeHtml(item.bookingReference || 'No booking reference')}</small></div>${amountDescription(item.amount, 'Payment amount')}</article>`).join('')}
          ${receipts.items.slice(0, 3).map(item => `<article><span aria-hidden="true">✓</span><div><strong>Receipt ${escapeHtml(item.number)}</strong><small>Payment ${escapeHtml(item.paymentReference)}</small></div>${amountDescription(item.total, 'Receipt amount')}</article>`).join('')}
        </div>` : emptyState({ title: 'No payments recorded', message: 'Payments and issued receipts will appear here.' })}
      </section>
      <aside class="portal-panel"><p class="portal-eyebrow">Quick links</p><h2>Financial records</h2><nav class="financial-quick-links" aria-label="Financial quick links">
        <a href="${portalUrl('/financial/invoices/')}">Invoices <span aria-hidden="true">→</span></a>
        <a href="${portalUrl('/financial/payments/')}">Payments <span aria-hidden="true">→</span></a>
        <a href="${portalUrl('/financial/receipts/')}">Receipts <span aria-hidden="true">→</span></a>
        <a href="${portalUrl('/financial/refunds/')}">Refunds <span aria-hidden="true">→</span></a>
      </nav><p class="financial-payment-note">Online payment will be available soon. Your portal currently records confirmed financial activity only.</p></aside>
    </div>`);
}

async function renderInvoices() {
  const page = await repository.invoices({ page: currentPage, size: pageSize });
  let deposits = [];
  const accountByCurrency = new Map();
  for (const invoice of page.items) {
    if (accountByCurrency.has(invoice.total.currency)) continue;
    try {
      const account = await repository.account(invoice.total.currency);
      accountByCurrency.set(invoice.total.currency, account);
      const result = await repository.deposits(account.id, { page: 0, size: 100 });
      deposits.push(...result.items);
    } catch (error) {
      if (![403, 404].includes(error.status)) throw error;
    }
  }
  const statuses = [...new Set(page.items.map(item => item.status))].sort();
  setPage(`${pageHeading('Financial records', 'Invoices & Deposits', 'Review charges, amounts paid and outstanding balances without combining currencies.')}
    ${filterBar({ searchLabel: 'Search invoices', placeholder: 'Invoice or booking reference', statuses })}
    <div class="financial-list" data-financial-list></div>${pagination(page, 'Invoice')}
    <section class="portal-panel financial-deposits"><div class="panel-heading"><div><p class="portal-eyebrow">Deposit schedule</p><h2>Deposits linked to your bookings</h2></div></div>
      ${deposits.length ? `<div class="financial-list">${deposits.map(deposit => `<article class="deposit-card"><div>${financialStatus(deposit.status)}<h3>${escapeHtml(deposit.bookingReference)}</h3><p>Due ${formatDate(deposit.dueDate)}</p></div><dl><div><dt>Deposit requested</dt><dd>${amountDescription(deposit.required, 'Deposit requested')}</dd></div><div><dt>Amount paid</dt><dd>${amountDescription(deposit.received, 'Deposit amount paid')}</dd></div><div><dt>Amount remaining</dt><dd>${amountDescription(deposit.outstanding, 'Deposit amount remaining')}</dd></div></dl></article>`).join('')}</div>`
        : emptyState({ title: 'No deposits due', message: 'A booking deposit will appear here when one is requested.' })}
      <p class="financial-payment-note">Online payment will be available soon.</p>
    </section>`);
  bindListControls(page.items, items => {
    document.querySelector('[data-financial-list]').innerHTML = items.length
      ? items.map(invoiceCard).join('')
      : emptyState({ title: 'No invoices yet', message: 'Issued booking invoices will appear here.' });
  }, item => searchableText(item.number, item.bookingReference, item.status), page);
  bindPagination(renderInvoices);
}

async function renderInvoiceDetails() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) {
    setPage(`${pageHeading('Invoice detail', 'No invoice selected', 'Choose an invoice from your owned invoice list.')}
      ${emptyState({ title: 'Select an invoice', message: 'No financial information has been loaded.', action: `<a class="portal-button" href="${portalUrl('/financial/invoices/')}">View invoices</a>` })}`);
    return;
  }
  const invoice = await repository.invoice(id);
  setPage(`${pageHeading('Invoice detail', invoice.number, 'Read-only details supplied by the Virtcruise financial service.', `<button class="portal-button secondary" type="button" data-print-financial>Print invoice view</button>`)}
    <section class="financial-invoice-hero"><div>${financialStatus(invoice.status)}<p>Booking ${bookingLink(invoice.bookingReference)}</p></div><div><small>Outstanding balance</small>${amountDescription(invoice.outstanding, 'Outstanding balance')}</div></section>
    <section class="portal-panel financial-line-items"><h2>Invoice items</h2>
      <div class="financial-table-scroll"><table><caption>Line items for invoice ${escapeHtml(invoice.number)}</caption><thead><tr><th scope="col">Description</th><th scope="col">Quantity</th><th scope="col">Unit amount</th><th scope="col">Tax rate</th><th scope="col">Tax</th><th scope="col">Total</th></tr></thead><tbody>
        ${invoice.lines.map(line => `<tr><th scope="row">${escapeHtml(line.description)}</th><td data-label="Quantity">${escapeHtml(line.quantity)}</td><td data-label="Unit amount">${amountDescription(line.unitPrice, 'Unit amount')}</td><td data-label="Tax rate">${escapeHtml(line.taxRate)}</td><td data-label="Tax">${amountDescription(line.tax, 'Tax')}</td><td data-label="Total">${amountDescription(line.total, 'Line total')}</td></tr>`).join('')}
      </tbody></table></div>
      <dl class="financial-totals"><div><dt>Net</dt><dd>${amountDescription(invoice.net, 'Invoice net')}</dd></div><div><dt>Tax</dt><dd>${amountDescription(invoice.tax, 'Invoice tax')}</dd></div><div><dt>Total</dt><dd>${amountDescription(invoice.total, 'Invoice total')}</dd></div><div><dt>Amount paid</dt><dd>${amountDescription(invoice.allocated, 'Amount paid')}</dd></div><div class="total"><dt>Outstanding balance</dt><dd>${amountDescription(invoice.outstanding, 'Outstanding balance')}</dd></div></dl>
      <p class="financial-data-note">Issue dates, due dates, individual payment allocations and credit-note details are not included in the current customer API.</p>
      <div class="form-actions"><a class="portal-button secondary" href="${portalUrl('/financial/invoices/')}">Back to invoices</a>${invoice.bookingReference ? `<a class="portal-button" href="${portalUrl('/bookings/')}">View booking ${escapeHtml(invoice.bookingReference)}</a>` : ''}</div>
    </section>`);
}

function historyCard(type, item) {
  if (type === 'payment') {
    return `<article class="financial-card"><div class="financial-card-heading"><div><small>Payment reference</small><h2>${escapeHtml(item.reference)}</h2></div>${financialStatus(item.status)}</div><dl class="financial-facts"><div><dt>Booking</dt><dd>${bookingLink(item.bookingReference)}</dd></div><div><dt>Method</dt><dd>${escapeHtml(item.method.replaceAll('_', ' '))}</dd></div><div><dt>Payment amount</dt><dd>${amountDescription(item.amount, 'Payment amount')}</dd></div><div><dt>Allocated</dt><dd>${amountDescription(item.allocated, 'Allocated amount')}</dd></div><div><dt>Unallocated</dt><dd>${amountDescription(item.unallocated, 'Unallocated amount')}</dd></div><div><dt>Refunded</dt><dd>${amountDescription(item.refunded, 'Refunded amount')}</dd></div></dl></article>`;
  }
  if (type === 'receipt') {
    return `<article class="financial-card"><div class="financial-card-heading"><div><small>Receipt</small><h2>${escapeHtml(item.number)}</h2></div>${financialStatus(item.status)}</div><dl class="financial-facts"><div><dt>Payment reference</dt><dd>${escapeHtml(item.paymentReference)}</dd></div><div><dt>Booking</dt><dd>${bookingLink(item.bookingReference)}</dd></div><div><dt>Amount received</dt><dd>${amountDescription(item.total, 'Receipt amount')}</dd></div></dl></article>`;
  }
  return `<article class="financial-card"><div class="financial-card-heading"><div><small>Refund for payment</small><h2>${escapeHtml(item.paymentReference)}</h2></div>${financialStatus(item.status)}</div><dl class="financial-facts"><div><dt>Refund amount</dt><dd>${amountDescription(item.amount, 'Refund amount')}</dd></div><div class="wide"><dt>Customer-safe reason</dt><dd>${escapeHtml(item.reason)}</dd></div></dl></article>`;
}

const historyConfig = {
  payments: {
    title: 'Payment History', eyebrow: 'Payments received',
    intro: 'Track confirmed payments, allocation progress and related bookings.',
    search: 'Search payments', placeholder: 'Payment or booking reference',
    empty: ['No payments recorded', 'Confirmed payments will appear here.'],
    loader: options => repository.payments(options), type: 'payment',
    text: item => searchableText(item.reference, item.bookingReference, item.method, item.status)
  },
  receipts: {
    title: 'Receipts', eyebrow: 'Receipts issued',
    intro: 'Review the receipts issued for confirmed payments.',
    search: 'Search receipts', placeholder: 'Receipt, payment or booking reference',
    empty: ['No receipts issued', 'Receipts will appear after eligible payments are recorded.'],
    loader: options => repository.receipts(options), type: 'receipt',
    text: item => searchableText(item.number, item.paymentReference, item.bookingReference, item.status)
  },
  refunds: {
    title: 'Refunds', eyebrow: 'Refund tracking',
    intro: 'Follow requested and completed refunds without exposing internal processing notes.',
    search: 'Search refunds', placeholder: 'Payment reference or reason',
    empty: ['No refunds requested', 'Eligible refund requests and their status will appear here.'],
    loader: options => repository.refunds(options), type: 'refund',
    text: item => searchableText(item.paymentReference, item.reason, item.status)
  }
};

async function renderHistory() {
  const config = historyConfig[pageName];
  const page = await config.loader({ page: currentPage, size: pageSize });
  const statuses = [...new Set(page.items.map(item => item.status))].sort();
  setPage(`${pageHeading(config.eyebrow, config.title, config.intro)}
    ${filterBar({ searchLabel: config.search, placeholder: config.placeholder, statuses })}
    <div class="financial-list" data-financial-list></div>${pagination(page, config.title)}
    <p class="financial-data-note">The current customer API does not provide record dates or a separate detail endpoint for this history.</p>`);
  bindListControls(page.items, items => {
    document.querySelector('[data-financial-list]').innerHTML = items.length
      ? items.map(item => historyCard(config.type, item)).join('')
      : emptyState({ title: config.empty[0], message: config.empty[1] });
  }, config.text, page);
  bindPagination(renderHistory);
}

const renderers = {
  overview: renderOverview,
  invoices: renderInvoices,
  'invoice-details': renderInvoiceDetails,
  payments: renderHistory,
  receipts: renderHistory,
  refunds: renderHistory
};

async function initialize() {
  user = await requireAuthentication();
  if (!user) return;
  financeMode = hasFinanceAccess(user) && ['invoices', 'invoice-details'].includes(pageName);
  repository = createFinancialRepository();
  if (financeMode) root.innerHTML = financeShell(user, 'invoices');
  else root.innerHTML = portalShell(user, pageName === 'overview'
    ? 'financial'
    : pageName === 'invoice-details' ? 'invoices' : pageName);
  root.addEventListener('click', async event => {
    const menu = event.target.closest('.portal-menu-toggle');
    if (menu) {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      document.getElementById('portalNavigation')?.classList.toggle('open', open);
    }
    if (event.target.closest('[data-portal-logout]')) {
      repository.clear();
      await authenticationProvider.logout();
      location.replace(portalUrl('/index.html'));
    }
    if (event.target.closest('[data-print-financial]')) window.print();
    if (event.target.closest('[data-retry]')) {
      repository.clear();
      await (financeMode ? (pageName === 'invoices' ? renderFinanceInvoices() : renderFinanceInvoiceDetails()) : renderers[pageName]());
    }
  });
  try {
    await (financeMode ? (pageName === 'invoices' ? renderFinanceInvoices() : renderFinanceInvoiceDetails()) : renderers[pageName]());
  } catch (error) {
    setPage(`${pageHeading('Your finances', 'Financial information unavailable', 'Your account remains secure.')}
      ${errorMarkup(error)}`);
  }
}

initialize();
