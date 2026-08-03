import { apiRequest } from './api-client.js';
import { authenticationProvider } from './auth/authentication-provider.js';
import { authPageUrl } from './auth/config.js';

const root = document.querySelector('#contentStudio');
const contentRoles = new Set(['ROLE_CONTENT_EDITOR', 'ROLE_CONTENT_APPROVER', 'ROLE_ADMIN']);
const state = { section: 'dashboard', user: null, packages: [], loading: false, error: null };

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

function hasContentAccess(user) {
  return (user?.roles || []).some(role => contentRoles.has(role));
}

function roleLabel(user) {
  if ((user?.roles || []).includes('ROLE_ADMIN')) return 'Administrator';
  if ((user?.roles || []).includes('ROLE_CONTENT_APPROVER')) return 'Content Approver';
  return 'Content Editor';
}

function statusClass(status) {
  return String(status || '').toLowerCase().replace('in_', '').replace('_', '-');
}

function shellMarkup() {
  const items = [
    ['dashboard', 'Dashboard'], ['packages', 'Packages'], ['drafts', 'Drafts'],
    ['review', 'Review Queue'], ['publication', 'Publication Queue'], ['media', 'Media'],
    ['pricing', 'Pricing'], ['seo', 'SEO'], ['versions', 'Version History'],
    ['audit', 'Audit'], ['settings', 'Settings']
  ];
  return `<header class="studio-header"><a class="studio-brand" href="${authPageUrl('/dashboard/')}"><img src="../images/logo-img.png" alt=""><span>Content Studio</span></a><div class="studio-user"><span>${escapeHtml(state.user?.givenName || 'Staff')} · ${roleLabel(state.user)}</span><button type="button" data-action="logout">Sign out</button></div></header><div class="studio-layout"><aside class="studio-sidebar"><button class="studio-menu-button" type="button" data-action="toggle-nav" aria-expanded="false">Studio navigation <span aria-hidden="true">⌄</span></button><h2>Workspace</h2><nav class="studio-nav" aria-label="Content Studio" data-studio-nav>${items.map(([id,label]) => `<button type="button" data-section="${id}" aria-current="${state.section === id}">${label}</button>`).join('')}</nav><p class="studio-sidebar-note">Editorial changes stay private until an independent approver publishes them.</p></aside><main class="studio-main" id="studioMain" tabindex="-1"></main></div>`;
}

function heading(title, description, actions = '') {
  return `<div class="studio-heading"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div><div class="studio-actions">${actions}</div></div>`;
}

function button(label, action, className = 'studio-button') {
  return `<button type="button" class="${className}" data-action="${action}">${escapeHtml(label)}</button>`;
}

function dashboard() {
  const counts = { draft: state.packages.filter(item => item.state === 'DRAFT').length, review: state.packages.filter(item => item.state === 'IN_REVIEW').length, scheduled: state.packages.filter(item => item.state === 'SCHEDULED').length, published: state.packages.filter(item => item.state === 'PUBLISHED').length };
  return `${heading('Dashboard', 'Editorial health at a glance.', button('Create package', 'create-package'))}<section class="studio-grid" aria-label="Content summary"><article class="studio-card studio-stat"><span>Drafts</span><strong>${counts.draft}</strong><span>Private working versions</span></article><article class="studio-card studio-stat"><span>Awaiting review</span><strong>${counts.review}</strong><span>Needs an independent approver</span></article><article class="studio-card studio-stat"><span>Scheduled</span><strong>${counts.scheduled}</strong><span>Future publication actions</span></article><article class="studio-card studio-stat"><span>Published</span><strong>${counts.published}</strong><span>Currently public versions</span></article></section><div class="studio-columns"><section class="studio-card"><h2>Recent activity</h2><ul class="studio-list"><li><div><strong>Content Studio ready</strong><span>Use Packages to open an editorial workspace.</span></div><span class="studio-status approved">Ready</span></li><li><div><strong>Approval separation</strong><span>Authors cannot approve their own submissions.</span></div><span class="studio-status review">Policy</span></li></ul></section><section class="studio-card"><h2>Quick actions</h2><div class="studio-list">${button('Open packages', 'section-packages', 'studio-button secondary')}${button('Review queue', 'section-review', 'studio-button secondary')}${button('Publication queue', 'section-publication', 'studio-button secondary')}</div></section></div>`;
}

function packageRows(items = state.packages) {
  if (!items.length) return '<div class="studio-empty">No packages match the current filters.</div>';
  return `<div class="studio-table-wrap"><table class="studio-table"><caption>Package identities and editorial status</caption><thead><tr><th>Package</th><th>Destination</th><th>Status</th><th>Action</th></tr></thead><tbody>${items.map(item => `<tr><td data-label="Package"><strong>${escapeHtml(item.businessCode)}</strong><small>${escapeHtml(item.slug)}</small></td><td data-label="Destination">${escapeHtml(item.destination || '—')}</td><td data-label="Status"><span class="studio-status ${statusClass(item.state)}">${escapeHtml(item.state || 'UNKNOWN')}</span></td><td data-label="Action">${button('Open', `open-package:${item.id}`, 'studio-button secondary')}</td></tr>`).join('')}</tbody></table></div>`;
}

function packagesSection() {
  return `${heading('Packages', 'Search stable identities and open editorial versions.', button('Create package', 'create-package'))}<div class="studio-toolbar"><label class="studio-field">Search<input type="search" data-filter="search" placeholder="Code, slug or destination"></label><label class="studio-field">Status<select data-filter="status"><option value="">All statuses</option><option>DRAFT</option><option>IN_REVIEW</option><option>APPROVED</option><option>SCHEDULED</option><option>PUBLISHED</option><option>RETIRED</option></select></label><button type="button" class="studio-button secondary" data-action="clear-filters">Clear filters</button></div><div data-package-table>${packageRows()}</div>`;
}

function formSection(title, packageId = '') {
  return `${heading(title, packageId ? 'Edit a draft with optimistic concurrency.' : 'Create a stable package identity.') }<section class="studio-card"><form class="studio-form" data-package-form data-package-id="${escapeHtml(packageId)}"><div class="studio-form-grid"><label class="studio-field">Business code<input name="businessCode" required maxlength="80" placeholder="PKG-VICTORIA-FALLS"></label><label class="studio-field">Canonical slug<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="victoria-falls-escape"></label><label class="studio-field">Package type<select name="packageType" required><option value="HOLIDAY_PACKAGE">Holiday package</option><option value="VICTORIA_FALLS">Victoria Falls</option><option value="CRUISE">Cruise</option><option value="ACCOMMODATION">Accommodation</option><option value="VISA_SERVICE">Visa service</option><option value="TRIP_ADD_ON">Trip add-on</option></select></label><label class="studio-field">Destination<input name="destination" required></label><label class="studio-field">Title<input name="title" required maxlength="200"></label><label class="studio-field">Duration (days)<input name="durationDays" type="number" min="1" required></label><label class="studio-field wide">Summary<textarea name="summary" required maxlength="1000"></textarea></label><label class="studio-field wide">Description<textarea name="description" required></textarea></label><label class="studio-field">Editorial owner<input name="editorialOwner" value="Content Operations" required></label><label class="studio-field">Featured<select name="featured"><option value="false">No</option><option value="true">Yes</option></select></label></div><div class="studio-form-actions">${button('Cancel', 'section-packages', 'studio-button secondary')}<button class="studio-button" type="submit">${packageId ? 'Save draft' : 'Create draft'}</button></div></form></section>`;
}

function queueSection(title, description, status) {
  const items = state.packages.filter(item => !status || item.state === status);
  return `${heading(title, description)}${packageRows(items)}`;
}

function genericSection(title, description, note) {
  return `${heading(title, description)}<section class="studio-card"><div class="studio-empty"><h2>${escapeHtml(note)}</h2><p>This staff workspace is bounded to the existing WEB-003 contracts. Open a package to perform supported actions.</p>${button('Open packages', 'section-packages', 'studio-button secondary')}</div></section>`;
}

function renderSection() {
  const main = document.querySelector('#studioMain');
  if (!main) return;
  const content = state.section === 'dashboard' ? dashboard()
    : state.section === 'packages' ? packagesSection()
      : state.section === 'drafts' ? queueSection('Drafts', 'Private versions still being authored.', 'DRAFT')
        : state.section === 'review' ? queueSection('Review Queue', 'Independent approval is required before publication.', 'IN_REVIEW')
          : state.section === 'publication' ? queueSection('Publication Queue', 'Approved versions ready for immediate or scheduled publication.', 'SCHEDULED')
            : state.section === 'editor' ? formSection('Package editor', state.editorPackageId)
              : state.section === 'create' ? formSection('Create package')
                : genericSection(state.section[0].toUpperCase() + state.section.slice(1), 'Editorial workspace', `${state.section[0].toUpperCase() + state.section.slice(1)} workspace`);
  main.innerHTML = `${state.error ? `<div class="studio-alert" role="alert">${escapeHtml(state.error)}</div>` : ''}${content}`;
  bindSection();
}

async function loadPackages() {
  try {
    const rows = await apiRequest('/api/v1/content/packages');
    state.packages = Array.isArray(rows) ? rows : (rows?.content || []);
  } catch (error) {
    state.packages = [];
    state.error = error.message || 'The Content Management service is unavailable.';
  }
}

function filterPackages() {
  const search = document.querySelector('[data-filter=search]')?.value.trim().toLowerCase() || '';
  const status = document.querySelector('[data-filter=status]')?.value || '';
  const items = state.packages.filter(item => (!status || item.state === status) && (!search || [item.businessCode, item.slug, item.destination].some(value => String(value || '').toLowerCase().includes(search))));
  const table = document.querySelector('[data-package-table]');
  if (table) table.innerHTML = packageRows(items);
  bindActions(table || document);
}

function bindSection() {
  document.querySelectorAll('[data-filter]').forEach(input => input.addEventListener('input', filterPackages));
  bindActions(document.querySelector('#studioMain'));
  document.querySelector('[data-package-form]')?.addEventListener('submit', submitPackage);
}

function bindActions(scope = document) {
  scope.querySelectorAll('[data-action]').forEach(buttonNode => {
    if (buttonNode.dataset.bound) return;
    buttonNode.dataset.bound = 'true';
    buttonNode.addEventListener('click', () => handleAction(buttonNode.dataset.action));
  });
}

async function handleAction(action) {
  if (action === 'toggle-nav') {
    const nav = document.querySelector('[data-studio-nav]');
    const buttonNode = document.querySelector('[data-action=toggle-nav]');
    nav?.classList.toggle('open');
    buttonNode?.setAttribute('aria-expanded', String(nav?.classList.contains('open')));
    return;
  }
  if (action === 'logout') { await authenticationProvider.logout(); location.assign(authPageUrl('/signin/')); return; }
  if (action.startsWith('section-')) { state.section = action.slice(8); state.error = null; renderSection(); return; }
  if (action === 'create-package') { state.section = 'create'; state.error = null; renderSection(); return; }
  if (action.startsWith('open-package:')) { state.section = 'editor'; state.editorPackageId = action.split(':')[1]; state.error = null; renderSection(); return; }
  if (action === 'clear-filters') { document.querySelectorAll('[data-filter]').forEach(node => { node.value = ''; }); filterPackages(); }
}

async function submitPackage(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form).entries());
  const payload = { ...values, durationDays: Number(values.durationDays), featured: values.featured === 'true' };
  try {
    await apiRequest('/api/v1/content/packages', { method: 'POST', body: JSON.stringify(payload) });
    state.error = null;
    await loadPackages();
    state.section = 'packages';
    renderSection();
  } catch (error) {
    state.error = error.message || 'The package could not be saved.';
    renderSection();
  }
}

async function start() {
  const user = await authenticationProvider.initialize();
  if (!user) { root.innerHTML = `<div class="studio-denied"><div><h1>Sign-in required</h1><p>Content Studio is restricted to authorized staff.</p><a class="studio-button" href="${authPageUrl('/signin/', { returnTo: '/content-studio/' })}">Sign in</a></div></div>`; return; }
  if (!hasContentAccess(user)) { root.innerHTML = `<div class="studio-denied"><div><h1>Access denied</h1><p>Your account does not have Content Studio permission.</p><a class="studio-button" href="${authPageUrl('/dashboard/')}">Return to dashboard</a></div></div>`; return; }
  state.user = user;
  root.innerHTML = shellMarkup();
  await loadPackages();
  document.querySelectorAll('[data-section]').forEach(node => node.addEventListener('click', () => { state.section = node.dataset.section; state.error = null; renderSection(); }));
  renderSection();
}

start();
