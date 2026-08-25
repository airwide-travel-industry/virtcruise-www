import { authPageUrl } from '../auth/config.js';
import { isAdminOrStaff } from '../auth/persona.js';

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

export function portalUrl(path, parameters = {}) {
  return authPageUrl(path, parameters);
}

export function formatDate(value, fallback = 'To be arranged') {
  if (!value) return fallback;
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? fallback
    : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export function formatMoney(value, currency = 'USD') {
  if (value === null || value === undefined || value === '') return 'Estimate pending';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value));
  } catch {
    return `${currency} ${value}`;
  }
}

export function statusBadge(status = 'DRAFT') {
  const value = String(status).toUpperCase();
  return `<span class="portal-status status-${escapeHtml(value.toLowerCase())}">${escapeHtml(value.replaceAll('_', ' '))}</span>`;
}

export function emptyState({ icon = '✦', title, message, action = '' }) {
  return `<div class="portal-empty"><span aria-hidden="true">${icon}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(message)}</p>${action}</div>`;
}

export function errorState(message, retry = true) {
  return `<div class="portal-error" role="alert"><strong>We could not load this section.</strong><p>${escapeHtml(message)}</p>${retry ? '<button class="portal-button secondary" type="button" data-retry>Try again</button>' : ''}</div>`;
}

export function skeleton(count = 3) {
  return `<div class="portal-skeleton-grid" aria-label="Loading" aria-busy="true">${Array.from({ length: count }, () =>
    '<div class="portal-skeleton"><i></i><i></i><i></i></div>'
  ).join('')}</div>`;
}

const navigation = [
  ['dashboard', '/dashboard/', 'Dashboard'],
  ['quotes', '/quotes/', 'My Quotes'],
  ['bookings', '/bookings/', 'My Bookings'],
  ['financial', '/financial/', 'Financial Overview'],
  ['invoices', '/financial/invoices/', 'Invoices'],
  ['payments', '/financial/payments/', 'Payments'],
  ['bank-transfer', '/bank-transfer/', 'Bank Transfer'],
  ['receipts', '/financial/receipts/', 'Receipts'],
  ['refunds', '/financial/refunds/', 'Refunds'],
  ['trips', '/trips/', 'My Trips'],
  ['travellers', '/travellers/', 'Travellers'],
  ['profile', '/profile/', 'Profile'],
  ['notifications', '/notifications/', 'Notifications'],
  ['preferences', '/preferences/', 'Preferences']
];

export function portalShell(user, active) {
  const admin = isAdminOrStaff(user);
  const name = user.givenName || 'Traveller';
  const initials = `${user.givenName?.[0] || ''}${user.familyName?.[0] || ''}`.toUpperCase() || 'VC';
  return `<a class="skip-link" href="#portalContent">Skip to portal content</a>
    <header class="portal-header"><div class="portal-header-inner">
      <a class="portal-brand" href="${portalUrl('/index.html')}" aria-label="Virtcruise home"><img src="${portalUrl('/images/logo-img.png')}" alt=""><img src="${portalUrl('/images/logo-text.png')}" alt="Virtcruise Travels"></a>
      <div class="portal-user"><span class="portal-avatar" aria-hidden="true">${escapeHtml(initials)}</span><span>Welcome, <strong>${escapeHtml(name)}</strong></span><button type="button" data-portal-logout>Logout</button></div>
    </div></header>
    <div class="portal-layout">
      <aside class="portal-sidebar"><button class="portal-menu-toggle" type="button" aria-expanded="false" aria-controls="portalNavigation">${admin ? 'Administration menu' : 'Customer menu'} <span aria-hidden="true">⌄</span></button>
        <nav id="portalNavigation" aria-label="${admin ? 'Administration' : 'Customer portal'}">${(admin ? [['finance', '/finance/', 'Finance Operations']] : navigation).map(([id, href, label]) =>
          `<a href="${portalUrl(href)}" class="${active === id ? 'active' : ''}" ${active === id ? 'aria-current="page"' : ''}>${escapeHtml(label)}</a>`
        ).join('')}</nav>
        ${admin ? '' : `<a class="portal-support" href="${portalUrl('/index.html#footerContact')}"><span aria-hidden="true">✦</span><strong>Need help?</strong><small>Contact Virtcruise support</small></a>`}
      </aside>
      <main class="portal-main" id="portalContent" tabindex="-1"><div id="portalLive" class="visually-hidden" role="status" aria-live="polite"></div><div id="portalPage">${skeleton()}</div></main>
    </div><dialog class="portal-confirmation" id="portalConfirmation" aria-labelledby="confirmationTitle"><form method="dialog"><p class="portal-eyebrow">Please confirm</p><h2 id="confirmationTitle">Confirm this action</h2><p data-confirmation-message></p><div><button class="portal-button secondary" value="cancel">Cancel</button><button class="portal-button" value="confirm">Confirm</button></div></form></dialog>`;
}

export function pageHeading(eyebrow, title, intro, action = '') {
  return `<div class="portal-page-heading"><div><p class="portal-eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(intro)}</p></div>${action}</div>`;
}

export function announce(message) {
  const live = document.getElementById('portalLive');
  if (!live) return;
  live.textContent = '';
  requestAnimationFrame(() => { live.textContent = message; });
}

export function confirmAction(message, title = 'Confirm this action') {
  const dialog = document.getElementById('portalConfirmation');
  dialog.querySelector('h2').textContent = title;
  dialog.querySelector('[data-confirmation-message]').textContent = message;
  dialog.showModal();
  return new Promise(resolve => {
    dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true });
  });
}
