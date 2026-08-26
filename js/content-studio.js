import { contentStudioApi as api } from './content-studio-api.js';
import { authenticationProvider } from './auth/authentication-provider.js';
import { authPageUrl } from './auth/config.js';

const root = document.querySelector('#contentStudio');
const contentRoles = new Set(['ROLE_CONTENT_EDITOR', 'ROLE_CONTENT_APPROVER', 'ROLE_ADMIN']);
const state = { section: 'dashboard', user: null, packages: [], history: [], activePackage: null, activeVersion: null, loading: false, error: null };

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
  return `${heading('Packages', 'Search stable identities and open editorial versions.', button('Create package', 'create-package'))}<form class="studio-toolbar" data-open-package-form><label class="studio-field">Open package ID<input name="packageId" required placeholder="UUID"></label><button class="studio-button" type="submit">Open package</button></form><div class="studio-toolbar"><label class="studio-field">Search<input type="search" data-filter="search" placeholder="Code, slug or destination"></label><label class="studio-field">Status<select data-filter="status"><option value="">All statuses</option><option>DRAFT</option><option>IN_REVIEW</option><option>APPROVED</option><option>SCHEDULED</option><option>PUBLISHED</option><option>RETIRED</option></select></label><button type="button" class="studio-button secondary" data-action="clear-filters">Clear filters</button></div><div data-package-table>${packageRows()}</div>`;
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

function requireVersion(title) {
  if (!state.activeVersion) return genericSection(title, 'Select an authoritative package version.', 'Open a package first');
  return null;
}

function editorSection() {
  const missing = requireVersion('Package editor'); if (missing) return missing;
  const v = state.activeVersion;
  const json = value => escapeHtml(JSON.stringify(value || [], null, 2));
  return `${heading('Package editor', `Version ${v.versionNumber} · ${v.state}`, lifecycleActions(v))}<section class="studio-card"><form class="studio-form" data-draft-form><div class="studio-form-grid"><label class="studio-field">Title<input name="title" required maxlength="200" value="${escapeHtml(v.title)}"></label><label class="studio-field">Destination<input name="destination" required maxlength="200" value="${escapeHtml(v.destination)}"></label><label class="studio-field">Duration (days)<input name="durationDays" type="number" min="1" required value="${v.durationDays}"></label><label class="studio-field">Featured<select name="featured"><option value="false">No</option><option value="true" ${v.featured ? 'selected' : ''}>Yes</option></select></label><label class="studio-field wide">Summary<textarea name="summary" required maxlength="1000">${escapeHtml(v.summary)}</textarea></label><label class="studio-field wide">Description<textarea name="description" required>${escapeHtml(v.description)}</textarea></label><label class="studio-field wide">Highlights (JSON)<textarea name="highlights">${json(v.highlights)}</textarea></label><label class="studio-field wide">Inclusions (JSON)<textarea name="inclusions">${json(v.inclusions)}</textarea></label><label class="studio-field wide">Exclusions (JSON)<textarea name="exclusions">${json(v.exclusions)}</textarea></label><label class="studio-field wide">CTA (JSON)<textarea name="callToAction">${json(v.callToAction)}</textarea></label></div><div class="studio-form-actions"><button class="studio-button" type="submit" ${v.state !== 'DRAFT' ? 'disabled' : ''}>Save draft</button></div></form></section>`;
}

function lifecycleActions(v) {
  const approver = state.user.roles.some(role => ['ROLE_CONTENT_APPROVER', 'ROLE_ADMIN'].includes(role));
  const actions = [button('Preview', 'preview', 'studio-button secondary')];
  if (v.state === 'DRAFT') actions.push(button('Submit', 'transition:submit'));
  if (approver && v.state === 'IN_REVIEW') actions.push(button('Approve', 'transition:approve'), button('Reject', 'transition:reject', 'studio-button danger'));
  if (approver && v.state === 'APPROVED') actions.push(button('Schedule', 'transition:schedule'), button('Publish now', 'transition:publish'));
  if (approver && v.state === 'PUBLISHED') actions.push(button('Retire', 'transition:retire', 'studio-button danger'));
  if (approver && ['RETIRED', 'REJECTED'].includes(v.state)) actions.push(button('Restore draft', 'transition:restore'));
  return actions.join('');
}

function pricingSection() {
  const missing = requireVersion('Pricing'); if (missing) return missing;
  return `${heading('Pricing', 'Version-scoped catalogue presentation pricing.')}<section class="studio-card"><form class="studio-form" data-pricing-form><div class="studio-form-grid"><label class="studio-field">Currency<input name="currency" required pattern="[A-Z]{3}" value="ZAR"></label><label class="studio-field">Amount<input name="amount" type="number" min="0" step="0.01"></label><label class="studio-field">Display text / basis<input name="displayBasis" required placeholder="per person sharing"></label><label class="studio-field">Selection key<input name="selectionKey" required placeholder="standard"></label><label class="studio-field">Effective from<input name="validFrom" type="datetime-local"></label><label class="studio-field">Effective until<input name="validUntil" type="datetime-local"></label><label class="studio-field wide">Pricing notes<input name="qualifier" maxlength="500"></label></div><button class="studio-button" type="submit">Add pricing</button></form>${packageRows([])}<ul class="studio-list">${state.activeVersion.pricing.map(p => `<li><strong>${escapeHtml(p.currency)} ${escapeHtml(p.amount ?? 'On request')}</strong><span>${escapeHtml(p.displayBasis)} · ${escapeHtml(p.qualifier || '')}</span></li>`).join('')}</ul></section>`;
}

function mediaSection() {
  const missing = requireVersion('Media'); if (missing) return missing;
  return `${heading('Media', 'Register validated cover, gallery and thumbnail metadata.')}<section class="studio-card"><form class="studio-form" data-media-form><div class="studio-form-grid"><label class="studio-field">Public image reference<input name="publicReference" required></label><label class="studio-field">Object key<input name="objectKey" required></label><label class="studio-field">SHA-256 checksum<input name="checksumSha256" required pattern="[a-fA-F0-9]{64}"></label><label class="studio-field">Content type<input name="contentType" required value="image/jpeg"></label><label class="studio-field">Byte size<input name="byteSize" type="number" min="1" required></label><label class="studio-field">Role<select name="role"><option>COVER</option><option>GALLERY</option><option>THUMBNAIL</option></select></label><label class="studio-field">Ordering<input name="displayOrder" type="number" min="0" value="0"></label><label class="studio-field">Width<input name="width" type="number" min="1"></label><label class="studio-field">Height<input name="height" type="number" min="1"></label><label class="studio-field wide">Alt text<input name="altText" required maxlength="500"></label><label class="studio-field wide">Caption / rights<input name="rights" required maxlength="500"></label></div><button class="studio-button" type="submit">Add media</button></form><ul class="studio-list">${state.activeVersion.media.map(m => `<li><strong>${escapeHtml(m.role)} · ${escapeHtml(m.altText)}</strong><span>${escapeHtml(m.validationStatus)} · order ${m.displayOrder}</span></li>`).join('')}</ul></section>`;
}

function seoSection() {
  const missing = requireVersion('SEO'); if (missing) return missing;
  const seo = state.activeVersion.seo || {};
  return `${heading('SEO', 'Search and social presentation for this draft.')}<section class="studio-card"><form class="studio-form" data-seo-form><div class="studio-form-grid"><label class="studio-field">SEO title<input name="title" value="${escapeHtml(seo.title || '')}"></label><label class="studio-field">Slug (stable package identity)<input value="${escapeHtml(state.activePackage?.slug || '')}" disabled></label><label class="studio-field wide">SEO description<textarea name="description">${escapeHtml(seo.description || '')}</textarea></label><label class="studio-field wide">Canonical<input name="canonical" type="url" value="${escapeHtml(seo.canonical || '')}"></label><label class="studio-field wide">Open Graph image<input name="openGraphImage" value="${escapeHtml(seo.openGraphImage || '')}"></label></div><button class="studio-button" type="submit">Save SEO</button></form><div class="studio-preview-frame"><strong>${escapeHtml(seo.title || state.activeVersion.title)}</strong><span>${escapeHtml(seo.description || state.activeVersion.summary)}</span></div></section>`;
}

function versionsSection() {
  const missing = requireVersion('Version History'); if (missing) return missing;
  return `${heading('Version History', 'Immutable lifecycle history; restoration creates a new draft.')}<section class="studio-card"><ul class="studio-list">${state.history.map(v => `<li><div><strong>Version ${v.versionNumber} · ${escapeHtml(v.state)}</strong><span>${escapeHtml(v.title)}</span></div><div>${button('Compare', `compare:${v.id}`, 'studio-button secondary')}${button('Restore', `transition-version:restore:${v.id}`, 'studio-button secondary')}</div></li>`).join('')}</ul></section>`;
}

function auditSection() {
  if (!state.activePackage) return genericSection('Audit', 'Open a package to inspect its audit trail.', 'Open a package first');
  const rows = state.audit || [];
  return `${heading('Audit', 'Actor, roles, state changes, reasons and correlations—never content bodies.')}<section class="studio-card"><button class="studio-button secondary" data-action="load-audit">Refresh audit</button><ul class="studio-list">${rows.map(row => `<li><div><strong>${escapeHtml(row.action)} · ${escapeHtml(row.actor)}</strong><span>${escapeHtml(row.beforeState || '—')} → ${escapeHtml(row.afterState || '—')} · ${escapeHtml(row.reason || '')}</span></div><span>${escapeHtml(row.occurredAt)}</span></li>`).join('') || '<li>No audit rows loaded.</li>'}</ul></section>`;
}

function previewSection() {
  const missing = requireVersion('Preview'); if (missing) return missing;
  return `${heading('Package preview', 'Private staff preview; nothing is published.', `<label class="studio-field">Viewport<select data-preview-size><option value="desktop">Desktop</option><option value="tablet">Tablet</option><option value="mobile">Mobile</option></select></label>`)}<section class="studio-preview-frame" data-preview><div class="studio-preview-hero"><h2>${escapeHtml(state.activeVersion.title)}</h2><p>${escapeHtml(state.activeVersion.summary)}</p></div><p>${escapeHtml(state.activeVersion.description)}</p></section>`;
}

function renderSection() {
  const main = document.querySelector('#studioMain');
  if (!main) return;
  const content = state.section === 'dashboard' ? dashboard()
    : state.section === 'packages' ? packagesSection()
      : state.section === 'drafts' ? queueSection('Drafts', 'Private versions still being authored.', 'DRAFT')
        : state.section === 'review' ? queueSection('Review Queue', 'Independent approval is required before publication.', 'IN_REVIEW')
          : state.section === 'publication' ? queueSection('Publication Queue', 'Approved versions ready for immediate or scheduled publication.', 'SCHEDULED')
            : state.section === 'editor' ? editorSection()
              : state.section === 'create' ? formSection('Create package')
                : state.section === 'pricing' ? pricingSection()
                  : state.section === 'media' ? mediaSection()
                    : state.section === 'seo' ? seoSection()
                      : state.section === 'versions' ? versionsSection()
                        : state.section === 'audit' ? auditSection()
                        : state.section === 'preview' ? previewSection()
                          : genericSection(state.section[0].toUpperCase() + state.section.slice(1), 'Editorial workspace', `${state.section[0].toUpperCase() + state.section.slice(1)} workspace`);
  main.innerHTML = `${state.error ? `<div class="studio-alert" role="alert">${escapeHtml(state.error)}</div>` : ''}${content}`;
  bindSection();
}

async function loadPackages() {
  // WEB-003 intentionally has no collection endpoint. Packages created or opened by ID
  // form the session working set; authoritative details always come from the backend.
  state.packages = [];
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
  document.querySelector('[data-draft-form]')?.addEventListener('submit', submitDraft);
  document.querySelector('[data-pricing-form]')?.addEventListener('submit', submitPricing);
  document.querySelector('[data-media-form]')?.addEventListener('submit', submitMedia);
  document.querySelector('[data-seo-form]')?.addEventListener('submit', submitSeo);
  document.querySelector('[data-open-package-form]')?.addEventListener('submit', event => { event.preventDefault(); openPackage(new FormData(event.currentTarget).get('packageId')); });
  document.querySelector('[data-preview-size]')?.addEventListener('change', event => { document.querySelector('[data-preview]').dataset.size = event.target.value; });
}

async function openPackage(id) {
  try {
    const [item, history] = await Promise.all([api.package(id), api.history(id)]);
    state.activePackage = item; state.history = history;
    state.activeVersion = history.find(version => version.state === 'DRAFT') || history.at(-1) || null;
    state.packages = [{ ...item, state: state.activeVersion?.state, destination: state.activeVersion?.destination }, ...state.packages.filter(row => row.id !== item.id)];
    state.section = 'editor'; state.error = null; renderSection();
  } catch (error) { state.error = error.message || 'Package could not be opened.'; renderSection(); }
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
  if (action.startsWith('open-package:')) { await openPackage(action.split(':')[1]); return; }
  if (action === 'preview') { state.section = 'preview'; renderSection(); return; }
  if (action.startsWith('transition:')) { await transition(action.split(':')[1], state.activeVersion.id); return; }
  if (action.startsWith('transition-version:')) { const [, operation, versionId] = action.split(':'); await transition(operation, versionId); return; }
  if (action.startsWith('compare:')) { state.error = 'Comparison uses the selected version and current version summaries; content remains read-only.'; renderSection(); return; }
  if (action === 'load-audit') { try { state.audit = await api.audit(state.activePackage.id); state.error = null; } catch (error) { state.error = error.message; } renderSection(); return; }
  if (action === 'clear-filters') { document.querySelectorAll('[data-filter]').forEach(node => { node.value = ''; }); filterPackages(); }
}

async function submitPackage(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form).entries());
  const payload = { ...values, durationDays: Number(values.durationDays), featured: values.featured === 'true' };
  try {
    const created = await api.create(payload);
    state.packages = [created, ...state.packages.filter(item => item.id !== created.id)];
    state.activePackage = created;
    state.error = null;
    await openPackage(created.id);
  } catch (error) {
    state.error = error.message || 'The package could not be saved.';
    renderSection();
  }
}

const parseJson = (value, fallback) => value?.trim() ? JSON.parse(value) : fallback;
const instant = value => value ? new Date(value).toISOString() : null;

async function submitDraft(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  try {
    state.activeVersion = await api.edit(state.activePackage.id, state.activeVersion.id, {
      title: values.title, summary: values.summary, description: values.description,
      destination: values.destination, durationDays: Number(values.durationDays), featured: values.featured === 'true',
      highlights: parseJson(values.highlights, []), inclusions: parseJson(values.inclusions, []),
      exclusions: parseJson(values.exclusions, []), itinerary: state.activeVersion.itinerary || [],
      terms: state.activeVersion.terms || [], faq: state.activeVersion.faq || [],
      seo: state.activeVersion.seo || {}, callToAction: parseJson(values.callToAction, {}), lockVersion: state.activeVersion.lockVersion
    });
    state.error = null; renderSection();
  } catch (error) { state.error = error.message || 'Draft could not be saved.'; renderSection(); }
}

async function submitSeo(event) {
  event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget));
  const v = state.activeVersion;
  try { state.activeVersion = await api.edit(state.activePackage.id, v.id, { ...v, seo: values, lockVersion: v.lockVersion }); state.error = null; renderSection(); }
  catch (error) { state.error = error.message || 'SEO could not be saved.'; renderSection(); }
}

async function submitPricing(event) {
  event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget));
  try { state.activeVersion = await api.pricing(state.activePackage.id, state.activeVersion.id, { currency: values.currency.toUpperCase(), amount: values.amount ? Number(values.amount) : null, priceOnRequest: !values.amount, displayBasis: values.displayBasis, selectionKey: values.selectionKey, qualifier: values.qualifier || null, validFrom: instant(values.validFrom), validUntil: instant(values.validUntil), displayOrder: state.activeVersion.pricing.length }); state.error = null; renderSection(); }
  catch (error) { state.error = error.message || 'Pricing could not be added.'; renderSection(); }
}

async function submitMedia(event) {
  event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget));
  try { state.activeVersion = await api.media(state.activePackage.id, state.activeVersion.id, { objectKey: values.objectKey, publicReference: values.publicReference, checksumSha256: values.checksumSha256, contentType: values.contentType, byteSize: Number(values.byteSize), width: values.width ? Number(values.width) : null, height: values.height ? Number(values.height) : null, role: values.role, displayOrder: Number(values.displayOrder), altText: values.altText, rights: values.rights, privateMedia: false }); state.error = null; renderSection(); }
  catch (error) { state.error = error.message || 'Media could not be added.'; renderSection(); }
}

async function transition(action, versionId) {
  const version = state.history.find(item => item.id === versionId) || state.activeVersion;
  const reason = window.prompt(`Reason for ${action}`)?.trim(); if (!reason) return;
  const body = action === 'schedule' ? { reason, lockVersion: version.lockVersion, effectiveAt: new Date(Date.now() + 3600000).toISOString(), effectiveUntil: null } : { reason, lockVersion: version.lockVersion };
  try { state.activeVersion = await api.transition(state.activePackage.id, versionId, action, body); state.history = await api.history(state.activePackage.id); state.error = null; renderSection(); }
  catch (error) { state.error = error.message || `${action} failed.`; renderSection(); }
}

async function start() {
  const user = await authenticationProvider.initialize();
  if (!user) { root.innerHTML = `<div class="studio-denied"><div><h1>Sign-in required</h1><p>Content Studio is restricted to authorized staff.</p><a class="studio-button" href="${authPageUrl('/signin/', { returnTo: '/content-studio/' })}">Sign in</a></div></div>`; return; }
  if (!hasContentAccess(user)) { root.innerHTML = `<div class="studio-denied"><div><h1>Access denied</h1><p>Your account does not have Content Studio permission.</p><a class="studio-button" href="${authPageUrl('/dashboard/')}">Return to dashboard</a></div></div>`; return; }
  state.user = user;
  root.innerHTML = shellMarkup();
  await loadPackages();
  document.querySelectorAll('[data-section]').forEach(node => node.addEventListener('click', () => { state.section = node.dataset.section; state.error = null; renderSection(); }));
  bindActions(document);
  renderSection();
}

start();
