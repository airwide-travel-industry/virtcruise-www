import { apiClient } from './api-client.js';
import { createQuoteBuilder } from './quote-builder.js';
import { setPackageChoices } from './service-form-renderer.js';
import { initPackageShop } from './shop.js';

const track = document.getElementById('servicesTrack');
const shell = document.getElementById('enquiryApp');
const panel = document.getElementById('enquiryPanel');
const content = document.getElementById('enquiryContent');
const closeButton = document.getElementById('closeEnquiryApp');
const tripButton = document.getElementById('myEnquiryButton');
const quoteForm = document.getElementById('quoteForm');
const statusNode = document.getElementById('quoteBuilderStatus');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = (amount, currency = 'USD') => amount == null ? 'Price on request' : new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
const featuredToursGrid = document.getElementById('featuredToursGrid');
const featuredTourStatus = document.getElementById('featuredTourStatus');
const previousServiceButton = document.querySelector('.service-prev');
const nextServiceButton = document.querySelector('.service-next');
let lastFocus = null;
let isOpen = false;
let packageCatalog = [];
let carouselUpdateFrame = 0;

const CAROUSEL_EDGE_TOLERANCE = 3;

function scrollAmount() {
  const card = track?.querySelector('.service-card');
  return card ? card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 14) : 240;
}

function setCarouselArrowAvailable(button, available) {
  if (!button) return;
  button.classList.toggle('is-unavailable', !available);
  button.setAttribute('aria-hidden', String(!available));
  button.toggleAttribute('disabled', !available);
  if (available) button.removeAttribute('tabindex');
  else button.setAttribute('tabindex', '-1');
}

function updateCarouselArrows() {
  carouselUpdateFrame = 0;
  if (!track) return;
  const { scrollWidth, clientWidth, scrollLeft } = track;
  const hasOverflow = scrollWidth > clientWidth + CAROUSEL_EDGE_TOLERANCE;
  const canScrollLeft = hasOverflow && scrollLeft > CAROUSEL_EDGE_TOLERANCE;
  const canScrollRight = hasOverflow
    && scrollLeft + clientWidth < scrollWidth - CAROUSEL_EDGE_TOLERANCE;
  setCarouselArrowAvailable(previousServiceButton, canScrollLeft);
  setCarouselArrowAvailable(nextServiceButton, canScrollRight);
}

function scheduleCarouselArrowUpdate() {
  if (carouselUpdateFrame) return;
  carouselUpdateFrame = requestAnimationFrame(updateCarouselArrows);
}

previousServiceButton?.addEventListener('click', () => track?.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
nextServiceButton?.addEventListener('click', () => track?.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
track?.addEventListener('scroll', scheduleCarouselArrowUpdate, { passive: true });
window.addEventListener('resize', scheduleCarouselArrowUpdate, { passive: true });
window.addEventListener('load', scheduleCarouselArrowUpdate, { once: true });
document.fonts?.ready.then(scheduleCarouselArrowUpdate);

if (track && 'ResizeObserver' in window) {
  const carouselResizeObserver = new ResizeObserver(scheduleCarouselArrowUpdate);
  carouselResizeObserver.observe(track);
  if (track.parentElement) carouselResizeObserver.observe(track.parentElement);
}
if (track && 'MutationObserver' in window) {
  new MutationObserver(scheduleCarouselArrowUpdate).observe(track, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
}
scheduleCarouselArrowUpdate();

document.querySelectorAll('.date-input').forEach(input => input.addEventListener('focus', () => { input.type = 'date'; }));

function openShell() {
  if (isOpen) return;
  lastFocus ||= document.activeElement;
  isOpen = true;
  shell.hidden = false;
  document.body.classList.add('enquiry-open');
  requestAnimationFrame(() => shell.classList.add('is-open'));
  panel.scrollTop = 0;
  requestAnimationFrame(() => closeButton.focus());
}

function closeShell({ restoreFocus = true } = {}) {
  const target = lastFocus;
  isOpen = false;
  shell.classList.remove('is-open');
  shell.hidden = true;
  document.body.classList.remove('enquiry-open');
  lastFocus = null;
  if (restoreFocus && target && document.contains(target)) target.focus();
}

function setHash(hash) {
  history.pushState(null, '', hash || `${location.pathname}${location.search}`);
  applyRoute();
}

function openQuoteBuilderService(service, trigger = document.activeElement) {
  lastFocus = trigger;
  const hash = `#service=${service}`;
  if (location.hash === hash) builder.openService(service);
  else setHash(hash);
}

function closeViaHistory() {
  if (location.hash.startsWith('#service=') || location.hash === '#cart') history.back();
  else closeShell();
}

const builder = createQuoteBuilder({
  root: content,
  countButton: tripButton,
  statusNode,
  onRequestOpen: openShell,
  onRequestClose: closeViaHistory
});

function applyRoute() {
  const service = location.hash.match(/^#service=([a-z0-9-]+)$/);
  if (service) {
    builder.openService(service[1]);
    return;
  }
  if (location.hash === '#cart') {
    builder.openReview();
    return;
  }
  if (isOpen) closeShell();
}

document.querySelectorAll('[data-service]').forEach(action => {
  action.addEventListener('click', event => {
    event.preventDefault();
    openQuoteBuilderService(action.dataset.service, action);
  });
});
document.querySelectorAll('.service-card').forEach(card => {
  const action = card.querySelector('[data-service]');
  if (!action) return;
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Open ${card.querySelector('h3')?.textContent || 'travel service'} in Quote Builder`);
  const open = event => {
    if (event.type === 'click' && event.target.closest('a,button')) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    openQuoteBuilderService(action.dataset.service, card);
  };
  card.addEventListener('click', open);
  card.addEventListener('keydown', open);
});
document.addEventListener('virtcruise:open-service', event => {
  const { service, trigger } = event.detail || {};
  if (service) openQuoteBuilderService(service, trigger);
});
tripButton.addEventListener('click', () => {
  lastFocus = tripButton;
  if (location.hash === '#cart') builder.openReview();
  else setHash('#cart');
});
closeButton.addEventListener('click', closeViaHistory);
shell.addEventListener('click', event => {
  if (event.target === shell) closeViaHistory();
});
window.addEventListener('hashchange', applyRoute);
document.addEventListener('keydown', event => {
  if (!isOpen) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeViaHistory();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = [...shell.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter(node => node.offsetParent !== null);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

quoteForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const required = ['name', 'email', 'mobile', 'destination'];
  quoteForm.querySelectorAll('.quote-error').forEach(node => node.remove());
  let invalid = null;
  required.forEach(name => {
    const input = quoteForm.elements[name];
    const missing = !String(data.get(name) || '').trim();
    input.toggleAttribute('aria-invalid', missing);
    if (missing) invalid ||= input;
  });
  if (data.get('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get('email')))) {
    quoteForm.elements.email.setAttribute('aria-invalid', 'true');
    invalid ||= quoteForm.elements.email;
  }
  if (invalid) {
    const error = document.createElement('p');
    error.className = 'quote-error';
    error.textContent = 'Please complete your name, valid email, mobile number and destination.';
    quoteForm.querySelector('[type=submit]').before(error);
    invalid.focus();
    return;
  }
  builder.populateQuoteBuilderFromQuickQuote({
    fullName: data.get('name'),
    email: data.get('email'),
    mobile: data.get('mobile'),
    destination: data.get('destination'),
    departureDate: data.get('departure'),
    returnDate: data.get('return'),
    travellers: data.get('travellers'),
    budget: data.get('budget')
  });
  lastFocus = quoteForm.querySelector('[type=submit]');
  if (location.hash === '#cart') builder.openReview();
  else setHash('#cart');
});

document.addEventListener('virtcruise:add-package', event => {
  lastFocus = document.activeElement;
  builder.openPackage(event.detail);
  if (location.hash !== '#service=holiday-packages') history.pushState(null, '', '#service=holiday-packages');
});

function syncFeaturedTourButtons() {
  featuredToursGrid?.querySelectorAll('[data-featured-add]').forEach(button => {
    if (button.dataset.feedbackActive === 'true') return;
    const inTrip = builder.hasPackage(button.dataset.featuredAdd);
    button.dataset.action = inTrip ? 'review' : 'add';
    button.textContent = inTrip ? 'View My Trip' : 'Add to My Trip';
  });
}

function hydrateFeaturedTours(featured) {
  if (!featuredToursGrid) return;
  featuredToursGrid.removeAttribute('aria-busy');
  featuredToursGrid.innerHTML = featured.length ? featured.map(pkg => `<article class="tour-card" data-package-id="${escapeHtml(pkg.id)}"><div class="tour-image"><img src="${escapeHtml(pkg.image)}" width="960" height="640" loading="lazy" decoding="async" alt="${escapeHtml(pkg.imageAlt)}"></div><div class="tour-content"><h3>${escapeHtml(pkg.name)}</h3><p>${escapeHtml(pkg.summary)}</p><div class="tour-actions"><a class="tour-button tour-button-secondary" href="packages/${escapeHtml(pkg.slug)}.html">View Details</a><button class="tour-button" type="button" data-featured-add="${escapeHtml(pkg.id)}">Add to My Trip</button></div></div></article>`).join('')
    : '<p class="shop-empty" role="status">No featured tours are available right now. Explore all published packages below.</p>';
}

function hydrateVictoriaFalls() {
  const host = document.getElementById('featuredFallsDynamic');
  if (!host) return;
  const pkg = packageCatalog.find(item => item.packageType === 'VICTORIA_FALLS' || item.slug === 'victoria-falls-escape');
  host.removeAttribute('aria-busy');
  if (!pkg) {
    host.innerHTML = '<p class="shop-empty" role="status">The Victoria Falls package is temporarily unavailable.</p>';
    return;
  }
  const highlights = (pkg.highlights?.length ? pkg.highlights : pkg.inclusions).slice(0, 6);
  const cta = pkg.callToAction?.label || 'Build My Quote';
  host.innerHTML = `<div class="falls-package-image"><img src="${escapeHtml(pkg.image)}" width="1600" height="699" loading="lazy" decoding="async" alt="${escapeHtml(pkg.imageAlt)}"><span class="falls-package-badge">${escapeHtml(pkg.destination)}</span></div><form class="falls-package-content" id="featuredFallsPackage"><p class="falls-summary-label">Featured package</p><h3>${escapeHtml(pkg.name)}</h3><p class="falls-package-summary">${escapeHtml(pkg.summary)}</p>${highlights.length ? `<section class="package-inclusions" aria-labelledby="packageHighlightsTitle"><h4 id="packageHighlightsTitle">Highlights</h4><ul>${highlights.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>` : ''}<div class="package-price" aria-label="${escapeHtml(pkg.priceOnRequest ? 'Price on request' : `From ${money(pkg.priceFrom, pkg.currency)} ${pkg.priceUnit}`)}"><h4>${pkg.priceOnRequest ? '' : 'From'}</h4><p class="price">${escapeHtml(money(pkg.priceFrom, pkg.currency))} <small>${escapeHtml(pkg.priceOnRequest ? '' : pkg.priceUnit)}</small></p></div><button class="package-cta" type="submit">${escapeHtml(cta)}</button><a class="falls-details-link" href="packages/${escapeHtml(pkg.slug)}.html">View Full Details</a></form>`;
}

function featuredTourFeedback(button, message, nextLabel) {
  button.dataset.feedbackActive = 'true';
  button.textContent = message;
  featuredTourStatus.textContent = '';
  requestAnimationFrame(() => { featuredTourStatus.textContent = message; });
  window.setTimeout(() => {
    delete button.dataset.feedbackActive;
    button.textContent = nextLabel;
    button.dataset.action = nextLabel === 'View My Trip' ? 'review' : 'add';
  }, 1500);
}

featuredToursGrid?.addEventListener('click', event => {
  const button = event.target.closest('[data-featured-add]');
  if (!button) return;
  if (button.dataset.action === 'review') {
    lastFocus = button;
    if (location.hash === '#cart') builder.openReview();
    else setHash('#cart');
    return;
  }
  const packageData = packageCatalog.find(pkg => pkg.id === button.dataset.featuredAdd);
  if (!packageData) {
    console.error(`Featured Tour package was not found: ${button.dataset.featuredAdd}`);
    featuredTourFeedback(button, 'Package unavailable', 'Add to My Trip');
    return;
  }
  button.disabled = true;
  button.dataset.feedbackActive = 'true';
  try {
    const result = builder.addPackageToTrip(packageData, { source: 'featured-tour' });
    const alreadyAdded = result.status === 'already-added';
    featuredTourFeedback(button, alreadyAdded ? 'Already in My Trip' : 'Added to My Trip', 'View My Trip');
  } catch (error) {
    console.error('Featured Tour could not be added:', error);
    featuredTourFeedback(button, 'Could not add tour', 'Add to My Trip');
  } finally {
    button.disabled = false;
  }
});
document.addEventListener('virtcruise:quote-updated', syncFeaturedTourButtons);

document.addEventListener('submit', event => {
  if (event.target.id !== 'featuredFallsPackage') return;
  event.preventDefault();
  const pkg = packageCatalog.find(entry =>
    entry.packageType === 'VICTORIA_FALLS' || entry.slug === 'victoria-falls-escape');
  if (!pkg) return;
  lastFocus = event.submitter || event.target.querySelector('[type=submit]');
  const activityOption = new FormData(event.target).get('activityOption') || '';
  builder.addFeaturedPackage(pkg, activityOption);
  if (location.hash !== '#cart') history.pushState(null, '', '#cart');
});

async function init() {
  const [catalog, featured] = await Promise.all([
    initPackageShop(),
    apiClient.packages.featured().catch(error => {
      console.error('Virtcruise featured packages failed to load:', error);
      return [];
    })
  ]);
  packageCatalog = [...catalog];
  featured.forEach(pkg => {
    if (!packageCatalog.some(entry => entry.id === pkg.id)) packageCatalog.push(pkg);
  });
  setPackageChoices(packageCatalog);
  hydrateFeaturedTours(featured);
  hydrateVictoriaFalls();
  syncFeaturedTourButtons();
  applyRoute();
}
init();
