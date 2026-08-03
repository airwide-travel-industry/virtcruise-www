import { apiClient } from './api-client.js';
import { emptyState, errorState, loadingState } from './ui-components.js';

const $ = (selector, root = document) => root.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = (amount, currency = 'USD') => amount == null ? 'Price on request' : new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
const primary = pkg => pkg.packageType !== 'TRIP_ADD_ON';

export async function initPackageShop() {
  const grid = $('#packageGrid');
  if (!grid) return [];
  const form = $('#packageFilters');
  const pagination = $('#packagePagination');
  const state = { page: 0, size: 12, search: '', destination: '', type: '' };
  let packages = [];

  const card = pkg => `<article class="package-shop-card"><div class="package-card-image"><img src="${escapeHtml(pkg.image)}" width="960" height="640" loading="lazy" decoding="async" alt="${escapeHtml(pkg.imageAlt || pkg.name)}"><span class="package-destination">${escapeHtml(pkg.destination)}</span></div><div class="package-card-body"><h3>${escapeHtml(pkg.name)}</h3><div class="package-meta"><span>${escapeHtml(pkg.duration.label)}</span>${pkg.featured ? '<span>Featured tour</span>' : ''}</div><p class="package-summary">${escapeHtml(pkg.summary)}</p><p class="package-price-line">${pkg.priceOnRequest ? '<strong>Price on request</strong>' : `From <strong>${money(pkg.priceFrom, pkg.currency)}</strong> ${escapeHtml(pkg.priceUnit)}`}</p>${pkg.highlights?.length ? `<ul class="package-inclusion-preview">${pkg.highlights.slice(0, 3).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}<div class="package-card-actions"><a class="shop-button shop-button-secondary" href="packages/${escapeHtml(pkg.slug)}.html">View Package</a><button class="shop-button shop-button-primary" type="button" data-add-package="${escapeHtml(pkg.id)}">Add to My Trip</button></div></div></article>`;

  function renderPagination() {
    const page = apiClient.packages.pagination;
    if (!pagination) return;
    pagination.innerHTML = page.totalPages > 1 ? `<button type="button" data-page="${page.number - 1}" ${page.number <= 0 ? 'disabled' : ''}>Previous</button><span>Page ${page.number + 1} of ${page.totalPages}</span><button type="button" data-page="${page.number + 1}" ${page.number + 1 >= page.totalPages ? 'disabled' : ''}>Next</button>` : '';
  }

  async function load({ forceRefresh = false } = {}) {
    grid.setAttribute('aria-busy', 'true');
    grid.innerHTML = loadingState('Loading published travel packages…');
    try {
      const result = await apiClient.packages.list({ ...state, forceRefresh });
      packages = result.filter(primary);
      grid.innerHTML = packages.length ? packages.map(card).join('') : emptyState('No published packages found', 'Try changing your search or filters.');
      const page = apiClient.packages.pagination;
      $('#packageResultCount').textContent = `${page.totalElements || packages.length} published package${(page.totalElements || packages.length) === 1 ? '' : 's'}`;
      renderPagination();
      const destination = $('#destinationFilter');
      const existing = new Set([...destination.options].map(option => option.value));
      [...new Set(result.map(pkg => pkg.destination))].sort().forEach(value => {
        if (!existing.has(value)) destination.add(new Option(value, value));
      });
    } catch {
      packages = [];
      grid.innerHTML = errorState('Published packages are temporarily unavailable. Check your connection and try again.', 'packages');
      $('#packageResultCount').textContent = 'Catalogue unavailable';
      if (pagination) pagination.innerHTML = '';
    } finally { grid.removeAttribute('aria-busy'); }
    return packages;
  }

  form?.addEventListener('submit', event => event.preventDefault());
  form?.addEventListener('input', event => {
    if (!event.target.matches('#packageSearch')) return;
    window.clearTimeout(form.searchTimer);
    form.searchTimer = window.setTimeout(() => { state.search = event.target.value.trim(); state.page = 0; load(); }, 300);
  });
  form?.addEventListener('change', event => {
    if (event.target.id === 'destinationFilter') state.destination = event.target.value === 'all' ? '' : event.target.value;
    if (event.target.id === 'typeFilter') state.type = event.target.value === 'all' ? '' : event.target.value;
    if (['destinationFilter', 'typeFilter'].includes(event.target.id)) { state.page = 0; load(); }
  });
  $('#resetFilters')?.addEventListener('click', () => { form.reset(); Object.assign(state, { page: 0, search: '', destination: '', type: '' }); load(); });
  pagination?.addEventListener('click', event => { const button = event.target.closest('[data-page]'); if (button) { state.page = Number(button.dataset.page); load(); } });
  grid.addEventListener('click', event => {
    if (event.target.closest('[data-retry="packages"]')) { apiClient.packages.clearCache(); load({ forceRefresh: true }); return; }
    const add = event.target.closest('[data-add-package]');
    if (add) document.dispatchEvent(new CustomEvent('virtcruise:add-package', { detail: packages.find(pkg => pkg.id === add.dataset.addPackage) }));
  });
  return load();
}
