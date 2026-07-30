import { escapeHtml, portalUrl, statusBadge } from '../portal/portal-components.js';

const LABELS = Object.freeze({
  PARTIALLY_PAID: 'Partially paid',
  PARTIALLY_ALLOCATED: 'Partially allocated',
  ALLOCATED: 'Fully allocated',
  RECEIVED: 'Completed',
  BANK_TRANSFER: 'Bank transfer'
});

export function financialStatus(status) {
  const key = String(status || '').toUpperCase();
  const label = LABELS[key] || key.toLowerCase().replaceAll('_', ' ')
    .replace(/^./, value => value.toUpperCase());
  return statusBadge(label.replaceAll(' ', '_'));
}

export function formatFinancialMoney(money, locale = undefined) {
  if (!money) return 'Not available';
  const code = String(money.currency || '').toUpperCase();
  const source = String(money.amount);
  if (!/^-?\d+(?:\.\d+)?$/.test(source) || !/^[A-Z]{3}$/.test(code)) return 'Not available';
  try {
    const negative = source.startsWith('-');
    const [integer, fraction = ''] = source.replace(/^-/, '').split('.');
    const grouped = new Intl.NumberFormat(locale, {
      useGrouping: true,
      maximumFractionDigits: 0
    }).format(BigInt(integer));
    return `${negative ? '-' : ''}${code} ${grouped}.${fraction.padEnd(2, '0')}`;
  } catch {
    return `${code} ${source}`;
  }
}

export function bookingLink(reference) {
  return reference
    ? `<a href="${portalUrl('/bookings/')}">${escapeHtml(reference)}</a>`
    : '<span>Not linked</span>';
}

export function pagination(page, label) {
  if (page.totalPages <= 1) return '';
  return `<nav class="financial-pagination" aria-label="${escapeHtml(label)} pages">
    <button type="button" data-page="${page.page - 1}" ${page.first ? 'disabled' : ''}>Previous</button>
    <span>Page ${page.page + 1} of ${page.totalPages}</span>
    <button type="button" data-page="${page.page + 1}" ${page.last ? 'disabled' : ''}>Next</button>
  </nav>`;
}

export function supportDetails(error) {
  if (!error?.requestId) return '';
  return `<details class="support-detail"><summary>Support details</summary><p>Request ID: <code>${escapeHtml(error.requestId)}</code></p></details>`;
}

export function amountDescription(money, label) {
  return `<span class="financial-amount" aria-label="${escapeHtml(label)}: ${escapeHtml(formatFinancialMoney(money))}">${escapeHtml(formatFinancialMoney(money))}</span>`;
}
