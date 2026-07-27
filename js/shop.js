const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = (amount, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

export async function initPackageShop() {
  const grid = $('#packageGrid');
  if (!grid) return [];
  let packages = [];
  const filters = { destination: 'all', budget: 'all', duration: 'all', categories: new Set() };
  try {
    const response = await fetch('data/packages.json');
    if (!response.ok) throw new Error(`Package data returned ${response.status}`);
    packages = await response.json();
  } catch (error) {
    console.error('Virtcruise package data failed to load:', error);
    grid.innerHTML = '<p class="shop-load-error">Packages are temporarily unavailable. Please contact Virtcruise for assistance.</p>';
    return [];
  }

  const bySlug = slug => packages.find(pkg => pkg.slug === slug);
  const matches = pkg => (
    (filters.destination === 'all' || pkg.destination === filters.destination) &&
    (filters.budget === 'all' || (filters.budget === 'under-750' && pkg.priceFrom < 750) || (filters.budget === '750-1200' && pkg.priceFrom >= 750 && pkg.priceFrom <= 1200) || (filters.budget === 'over-1200' && pkg.priceFrom > 1200)) &&
    (filters.duration === 'all' || (filters.duration === 'short' && pkg.duration.days <= 4) || (filters.duration === 'medium' && pkg.duration.days >= 5 && pkg.duration.days <= 6) || (filters.duration === 'long' && pkg.duration.days >= 7)) &&
    (!filters.categories.size || [...filters.categories].every(category => pkg.categories.includes(category)))
  );
  const card = pkg => `<article class="package-shop-card"><div class="package-card-image"><img src="${pkg.image}" width="960" height="640" loading="lazy" alt="${escapeHtml(pkg.name)}"><span class="package-destination">${escapeHtml(pkg.destination)}</span></div><div class="package-card-body"><h3>${escapeHtml(pkg.name)}</h3><div class="package-meta"><span>${escapeHtml(pkg.duration.label)}</span><a href="packages/${pkg.slug}.html">Dedicated page</a></div><p class="package-price-line">From <strong>${money(pkg.priceFrom, pkg.currency)}</strong> ${escapeHtml(pkg.priceUnit)}</p><ul class="package-inclusion-preview">${pkg.inclusions.slice(0, 3).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul><div class="package-card-actions"><button class="shop-button shop-button-secondary" type="button" data-view-package="${pkg.slug}">View Details</button><button class="shop-button shop-button-primary" type="button" data-add-package="${pkg.id}">Add to Enquiry</button></div></div></article>`;
  function render() {
    const result = packages.filter(matches);
    grid.innerHTML = result.length ? result.map(card).join('') : '<p class="shop-empty">No packages match these filters.</p>';
    $('#packageResultCount').textContent = `${result.length} package${result.length === 1 ? '' : 's'}`;
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
    const add = event.target.closest('[data-add-package]');
    const view = event.target.closest('[data-view-package]');
    if (add) document.dispatchEvent(new CustomEvent('virtcruise:add-package', { detail: packages.find(pkg => pkg.id === add.dataset.addPackage) }));
    if (view) openPackage(bySlug(view.dataset.viewPackage));
  });
  const dialog = $('#packageModal');
  function openPackage(pkg) {
    $('#packageModalContent').innerHTML = `<div class="package-modal-layout"><section class="package-gallery"><div class="package-main-image"><img src="${pkg.gallery[0]}" alt="${escapeHtml(pkg.name)}"></div></section><section class="package-detail-content"><p class="modal-destination">${escapeHtml(pkg.destination)}</p><h2 id="packageModalTitle">${escapeHtml(pkg.name)}</h2><p class="modal-summary">${escapeHtml(pkg.summary)}</p><div class="modal-price-row"><p class="modal-price">From ${money(pkg.priceFrom, pkg.currency)}<small>${escapeHtml(pkg.priceUnit)}</small></p><p>${escapeHtml(pkg.duration.label)}</p></div><section class="detail-block"><h3>Inclusions</h3><ul class="detail-list">${pkg.inclusions.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section><div class="modal-actions"><button class="shop-button shop-button-primary" data-dialog-add="${pkg.id}" type="button">Add to Enquiry</button><a class="shop-button shop-button-secondary" href="packages/${pkg.slug}.html">Full package details</a></div></section></div>`;
    dialog.showModal();
  }
  $('#closePackageModal').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
    const add = event.target.closest('[data-dialog-add]');
    if (add) {
      dialog.close();
      document.dispatchEvent(new CustomEvent('virtcruise:add-package', { detail: packages.find(pkg => pkg.id === add.dataset.dialogAdd) }));
    }
  });
  render();
  return packages;
}
