import { apiClient } from './api-client.js';
import { emptyState, errorState, loadingState } from './ui-components.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = (amount, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

export async function initPackageShop() {
  const grid = $('#packageGrid');
  if (!grid) return [];
  let packages = [];
  const filters = { destination: 'all', budget: 'all', duration: 'all', categories: new Set() };
  grid.innerHTML = loadingState('Loading travel packages…');
  try {
    packages = await apiClient.packages.list();
  } catch (error) {
    console.error('Virtcruise package data failed to load:', error);
    grid.innerHTML = errorState('Packages are temporarily unavailable. Check your connection and try again.', 'packages');
    return [];
  }

  const bySlug = slug => packages.find(pkg => pkg.slug === slug);
  const matches = pkg => (
    (filters.destination === 'all' || pkg.destination === filters.destination) &&
    (filters.budget === 'all' || (filters.budget === 'under-750' && pkg.priceFrom < 750) || (filters.budget === '750-1200' && pkg.priceFrom >= 750 && pkg.priceFrom <= 1200) || (filters.budget === 'over-1200' && pkg.priceFrom > 1200)) &&
    (filters.duration === 'all' || (filters.duration === 'short' && pkg.duration.days <= 4) || (filters.duration === 'medium' && pkg.duration.days >= 5 && pkg.duration.days <= 6) || (filters.duration === 'long' && pkg.duration.days >= 7)) &&
    (!filters.categories.size || [...filters.categories].every(category => pkg.categories.includes(category)))
  );
  const card = pkg => `<article class="package-shop-card"><div class="package-card-image"><img src="${escapeHtml(pkg.image)}" width="960" height="640" loading="lazy" decoding="async" alt="${escapeHtml(pkg.imageAlt || pkg.name)}"><span class="package-destination">${escapeHtml(pkg.destination)}</span></div><div class="package-card-body"><h3>${escapeHtml(pkg.name)}</h3><div class="package-meta"><span>${escapeHtml(pkg.duration.label)}</span>${pkg.featured ? '<span>Featured tour</span>' : ''}</div><p class="package-summary">${escapeHtml(pkg.summary)}</p><p class="package-price-line">From <strong>${money(pkg.priceFrom, pkg.currency)}</strong> ${escapeHtml(pkg.priceUnit)}</p><ul class="package-inclusion-preview">${pkg.inclusions.slice(0, 3).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul><div class="package-card-actions"><a class="shop-button shop-button-secondary" href="packages/${escapeHtml(pkg.slug)}.html">View Package</a><button class="shop-button shop-button-primary" type="button" data-add-package="${escapeHtml(pkg.id)}">Add to My Trip</button></div></div></article>`;
  function render() {
    const result = packages.filter(matches);
    grid.innerHTML = result.length
      ? result.map(card).join('')
      : emptyState('No matching packages', 'Try clearing one or more filters to see other journeys.');
    const catalogueLabel = ['local-fallback', 'offline-cache', 'mock-json'].includes(apiClient.packages.source)
      ? ' · offline/development catalogue'
      : '';
    $('#packageResultCount').textContent = `${result.length} package${result.length === 1 ? '' : 's'}${catalogueLabel}`;
  }
  const destination = $('#destinationFilter');
  [...new Set(packages.map(pkg => pkg.destination))].sort().forEach(value => destination.insertAdjacentHTML('beforeend', `<option>${escapeHtml(value)}</option>`));
  [...new Set(packages.flatMap(pkg => pkg.categories))].sort().forEach(value => $('#categoryFilters').insertAdjacentHTML('beforeend', `<label class="category-chip"><input type="checkbox" value="${escapeHtml(value)}"><span>${escapeHtml(value)}</span></label>`));
  $('#packageFilters').addEventListener('change', event => {
    if (event.target.matches('select')) filters[event.target.id.replace('Filter', '')] = event.target.value;
    filters.categories = new Set($$('#categoryFilters input:checked').map(input => input.value));
    render();
  });
  $('#resetFilters').addEventListener('click', () => {
    filters.destination = filters.budget = filters.duration = 'all';
    filters.categories.clear();
    $('#packageFilters').reset();
    render();
  });
  grid.addEventListener('click', event => {
    if (event.target.closest('[data-retry="packages"]')) {
      apiClient.packages.clearCache();
      initPackageShop();
      return;
    }
    const add = event.target.closest('[data-add-package]');
    const view = event.target.closest('[data-view-package]');
    if (add) document.dispatchEvent(new CustomEvent('virtcruise:add-package', { detail: packages.find(pkg => pkg.id === add.dataset.addPackage) }));
    if (view) openPackage(bySlug(view.dataset.viewPackage));
  });
  const dialog = $('#packageModal');
  function openPackage(pkg) {
    $('#packageModalContent').innerHTML = `<div class="package-modal-layout"><section class="package-gallery" aria-label="${escapeHtml(pkg.name)} gallery"><div class="package-main-image"><img src="${escapeHtml(pkg.gallery[0])}" decoding="async" alt="${escapeHtml(pkg.galleryAlts?.[0] || pkg.imageAlt || pkg.name)}"></div><div class="package-thumbnails">${pkg.gallery.map((src,index)=>`<button class="package-thumbnail" type="button" data-gallery-image="${escapeHtml(src)}" data-gallery-alt="${escapeHtml(pkg.galleryAlts?.[index]||pkg.imageAlt||pkg.name)}" aria-label="Show image ${index+1}" aria-current="${index===0}"><img src="${escapeHtml(src)}" loading="lazy" alt=""></button>`).join('')}</div></section><section class="package-detail-content"><p class="modal-destination">${escapeHtml(pkg.destination)}</p><h2 id="packageModalTitle">${escapeHtml(pkg.name)}</h2><p class="modal-summary">${escapeHtml(pkg.summary)}</p><div class="modal-price-row"><p class="modal-price">From ${money(pkg.priceFrom, pkg.currency)}<small>${escapeHtml(pkg.priceUnit)}</small></p><p class="modal-duration">${escapeHtml(pkg.duration.label)}</p></div><section class="detail-block"><h3>Highlights</h3><ul class="detail-list">${pkg.inclusions.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section><div class="modal-actions"><button class="shop-button shop-button-primary" data-dialog-add="${escapeHtml(pkg.id)}" type="button">Add to My Trip</button><a class="shop-button shop-button-secondary" href="packages/${escapeHtml(pkg.slug)}.html">View Package</a></div></section></div>`;
    dialog.showModal();
  }
  $('#closePackageModal').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
    const add = event.target.closest('[data-dialog-add]');
    const thumbnail = event.target.closest('[data-gallery-image]');
    if (thumbnail) {
      const main = $('.package-main-image img', dialog);
      main.src = thumbnail.dataset.galleryImage;
      main.alt = thumbnail.dataset.galleryAlt;
      $$('.package-thumbnail', dialog).forEach(button => button.setAttribute('aria-current', String(button === thumbnail)));
    }
    if (add) {
      dialog.close();
      document.dispatchEvent(new CustomEvent('virtcruise:add-package', { detail: packages.find(pkg => pkg.id === add.dataset.dialogAdd) }));
    }
  });
  render();
  return packages;
}
