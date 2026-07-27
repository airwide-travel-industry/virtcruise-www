const packages = [
  ['Explore All Packages', 'allPackages'],
  ['Featured Tours', 'featuredToursTitle'],
  ['Victoria Falls Escape', 'packages/victoria-falls-escape.html'],
  ['Zimbabwe Safari', 'packages/zimbabwe-safari.html'],
  ['European City Break', 'packages/european-city-break.html'],
  ['Tropical Paradise', 'packages/tropical-paradise.html'],
  ['Dubai City Break', 'packages/dubai-city-break.html'],
  ['Zanzibar Beach Holiday', 'packages/zanzibar-beach-holiday.html']
];

const visaActions = [
  ['Visa Assistance', 'visa-services'],
  ['Visa Consultation', 'visa-services'],
  ['Document Checklist', 'visa-services'],
  ['Start Visa Enquiry', 'visa-services']
];

const isPackagePage = document.body.dataset.packageSlug !== undefined;
const homePrefix = isPackagePage ? '../index.html' : '';
const pagePrefix = isPackagePage ? '../' : '';
const hrefForSection = id => `${homePrefix}#${id}`;
const hrefForPackage = path => `${pagePrefix}${path}`;
const hrefForService = service => `${homePrefix}#service=${service}`;

const menuItems = [
  { id: 'home', label: 'Home', href: isPackagePage ? '../index.html' : 'index.html' },
  {
    id: 'packages',
    label: 'Packages',
    children: packages.map(([label, target]) => ({
      label,
      href: target.includes('/') ? hrefForPackage(target) : hrefForSection(target)
    }))
  },
  { id: 'flights', label: 'Flights', href: hrefForService('flights'), service: 'flights' },
  { id: 'hotels', label: 'Hotels', href: hrefForService('accommodation'), service: 'accommodation' },
  {
    id: 'visa',
    label: 'Visa Services',
    children: visaActions.map(([label, service]) => ({
      label,
      href: hrefForService(service),
      service
    }))
  },
  { id: 'about', label: 'About Us', href: hrefForSection('aboutVirtcruiseTitle') },
  { id: 'contact', label: 'Contact', href: hrefForSection('footerContact') }
];

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

const desktopNav = document.querySelector('[data-site-navigation], #mainNavigation, .detail-nav-links');
let menuButton = document.querySelector('[data-mobile-navigation-toggle], .mobile-btn');
const dropdowns = new Map();
let openDropdownId = null;
let closeTimer = 0;

function desktopMarkup() {
  return `<ul class="nav-list">${menuItems.map(item => {
    if (item.children) {
      return `<li><button class="nav-menu-toggle" type="button" data-dropdown-toggle="${item.id}" aria-haspopup="true" aria-expanded="false" aria-controls="nav-dropdown-${item.id}">${escapeHtml(item.label)} <span class="nav-chevron" aria-hidden="true">⌄</span></button></li>`;
    }
    return `<li><a class="nav-link" data-nav-id="${item.id}" href="${escapeHtml(item.href)}"${item.service ? ` data-nav-service="${item.service}"` : ''}>${escapeHtml(item.label)}</a></li>`;
  }).join('')}</ul>`;
}

function dropdownMarkup(item) {
  return `<div class="nav-dropdown" id="nav-dropdown-${item.id}" data-nav-dropdown="${item.id}" role="menu" aria-label="${escapeHtml(item.label)} submenu">${item.children.map(child =>
    `<a role="menuitem" href="${escapeHtml(child.href)}"${child.service ? ` data-nav-service="${child.service}"` : ''}>${escapeHtml(child.label)}</a>`
  ).join('')}</div>`;
}

function mobileMarkup() {
  return `<nav class="mobile-navigation" id="mobileNavigation" aria-label="Mobile navigation"><ul>${menuItems.map(item => {
    if (item.children) {
      return `<li><button class="mobile-submenu-toggle" type="button" data-mobile-submenu-toggle="${item.id}" aria-expanded="false" aria-controls="mobile-submenu-${item.id}">${escapeHtml(item.label)} <span class="nav-chevron" aria-hidden="true">⌄</span></button><ul class="mobile-submenu" id="mobile-submenu-${item.id}">${item.children.map(child =>
        `<li><a href="${escapeHtml(child.href)}"${child.service ? ` data-nav-service="${child.service}"` : ''}>${escapeHtml(child.label)}</a></li>`
      ).join('')}</ul></li>`;
    }
    return `<li><a class="mobile-nav-link" data-nav-id="${item.id}" href="${escapeHtml(item.href)}"${item.service ? ` data-nav-service="${item.service}"` : ''}>${escapeHtml(item.label)}</a></li>`;
  }).join('')}</ul></nav>`;
}

function positionDropdown(id) {
  const toggle = desktopNav?.querySelector(`[data-dropdown-toggle="${id}"]`);
  const dropdown = dropdowns.get(id);
  if (!toggle || !dropdown) return;
  const rect = toggle.getBoundingClientRect();
  const width = dropdown.offsetWidth;
  const left = Math.min(Math.max(16, rect.left), window.innerWidth - width - 16);
  dropdown.style.left = `${left}px`;
  dropdown.style.top = `${rect.bottom + 13}px`;
}

function closeDropdown({ restoreFocus = false } = {}) {
  window.clearTimeout(closeTimer);
  if (!openDropdownId) return;
  const id = openDropdownId;
  const toggle = desktopNav?.querySelector(`[data-dropdown-toggle="${id}"]`);
  dropdowns.get(id)?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  openDropdownId = null;
  if (restoreFocus) toggle?.focus();
}

function openDropdown(id) {
  if (openDropdownId && openDropdownId !== id) closeDropdown();
  openDropdownId = id;
  const toggle = desktopNav?.querySelector(`[data-dropdown-toggle="${id}"]`);
  positionDropdown(id);
  dropdowns.get(id)?.classList.add('is-open');
  toggle?.setAttribute('aria-expanded', 'true');
}

function scheduleClose() {
  window.clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => closeDropdown(), 130);
}

function cancelClose() {
  window.clearTimeout(closeTimer);
}

function setMobileTop() {
  const navigation = document.getElementById('mobileNavigation');
  const header = document.querySelector('.nav-shell, .detail-site-header');
  if (!navigation || !header) return;
  const rect = header.getBoundingClientRect();
  document.documentElement.style.setProperty('--mobile-navigation-top', `${Math.max(0, rect.bottom)}px`);
}

function closeMobileNavigation({ restoreFocus = false } = {}) {
  const navigation = document.getElementById('mobileNavigation');
  navigation?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menuButton?.focus();
}

function toggleMobileNavigation() {
  const navigation = document.getElementById('mobileNavigation');
  if (!navigation) return;
  setMobileTop();
  const opening = !navigation.classList.contains('is-open');
  navigation.classList.toggle('is-open', opening);
  menuButton?.setAttribute('aria-expanded', String(opening));
  if (opening) navigation.querySelector('a,button')?.focus();
}

function openService(event, link) {
  if (!link.dataset.navService || isPackagePage) return false;
  event.preventDefault();
  document.dispatchEvent(new CustomEvent('virtcruise:open-service', {
    detail: { service: link.dataset.navService, trigger: link }
  }));
  updateActiveState();
  closeMobileNavigation();
  return true;
}

function updateActiveState() {
  let active = isPackagePage ? 'packages' : 'home';
  const hash = location.hash;
  if (hash === '#allPackages' || hash === '#featuredToursTitle') active = 'packages';
  else if (hash.startsWith('#service=flights')) active = 'flights';
  else if (hash.startsWith('#service=accommodation')) active = 'hotels';
  else if (hash.startsWith('#service=visa-services')) active = 'visa';
  else if (hash === '#aboutVirtcruiseTitle') active = 'about';
  else if (hash === '#footerContact') active = 'contact';
  document.querySelectorAll('[data-nav-id], [data-dropdown-toggle], [data-mobile-submenu-toggle]').forEach(node => {
    const id = node.dataset.navId || node.dataset.dropdownToggle || node.dataset.mobileSubmenuToggle;
    node.classList.toggle('is-active', id === active);
    if (node.matches('a')) {
      if (id === active) node.setAttribute('aria-current', 'page');
      else node.removeAttribute('aria-current');
    }
  });
}

if (desktopNav && menuButton) {
  desktopNav.setAttribute('data-site-navigation', '');
  desktopNav.innerHTML = desktopMarkup();
  menuButton.outerHTML = '<button class="mobile-btn" type="button" data-mobile-navigation-toggle aria-label="Open main navigation" aria-controls="mobileNavigation" aria-expanded="false">☰</button>';
  menuButton = document.querySelector('[data-mobile-navigation-toggle]');

  menuItems.filter(item => item.children).forEach(item => {
    document.body.insertAdjacentHTML('beforeend', dropdownMarkup(item));
    const dropdown = document.getElementById(`nav-dropdown-${item.id}`);
    dropdowns.set(item.id, dropdown);
    dropdown.addEventListener('mouseenter', cancelClose);
    dropdown.addEventListener('mouseleave', scheduleClose);
    dropdown.addEventListener('focusin', cancelClose);
    dropdown.addEventListener('focusout', event => {
      if (!dropdown.contains(event.relatedTarget)) scheduleClose();
    });
  });
  document.body.insertAdjacentHTML('beforeend', mobileMarkup());

  desktopNav.addEventListener('click', event => {
    const toggle = event.target.closest('[data-dropdown-toggle]');
    if (toggle) {
      const id = toggle.dataset.dropdownToggle;
      if (openDropdownId === id) closeDropdown();
      else openDropdown(id);
      return;
    }
    const link = event.target.closest('a');
    if (link) openService(event, link);
  });
  desktopNav.querySelectorAll('[data-dropdown-toggle]').forEach(toggle => {
    toggle.addEventListener('mouseenter', () => openDropdown(toggle.dataset.dropdownToggle));
    toggle.addEventListener('mouseleave', scheduleClose);
    toggle.addEventListener('focus', () => openDropdown(toggle.dataset.dropdownToggle));
    toggle.addEventListener('keydown', event => {
      if ((event.key === 'Tab' && !event.shiftKey) || event.key === 'ArrowDown') {
        event.preventDefault();
        openDropdown(toggle.dataset.dropdownToggle);
        dropdowns.get(toggle.dataset.dropdownToggle)?.querySelector('a')?.focus();
      }
    });
  });

  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link) return;
      openService(event, link);
      closeDropdown();
    });
    dropdown.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const links = [...dropdown.querySelectorAll('a')];
      const index = links.indexOf(document.activeElement);
      const toggle = desktopNav.querySelector(`[data-dropdown-toggle="${dropdown.dataset.navDropdown}"]`);
      if (event.shiftKey && index === 0) {
        event.preventDefault();
        closeDropdown();
        toggle?.focus();
      } else if (!event.shiftKey && index === links.length - 1) {
        event.preventDefault();
        const desktopItems = [...desktopNav.querySelectorAll('.nav-link,.nav-menu-toggle')];
        const next = desktopItems[desktopItems.indexOf(toggle) + 1];
        closeDropdown();
        next?.focus();
      }
    });
  });

  const mobileNavigation = document.getElementById('mobileNavigation');
  menuButton.addEventListener('click', toggleMobileNavigation);
  mobileNavigation.addEventListener('click', event => {
    const toggle = event.target.closest('[data-mobile-submenu-toggle]');
    if (toggle) {
      const opening = toggle.getAttribute('aria-expanded') !== 'true';
      mobileNavigation.querySelectorAll('[data-mobile-submenu-toggle]').forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        document.getElementById(other.getAttribute('aria-controls'))?.classList.remove('is-open');
      });
      toggle.setAttribute('aria-expanded', String(opening));
      document.getElementById(toggle.getAttribute('aria-controls'))?.classList.toggle('is-open', opening);
      return;
    }
    const link = event.target.closest('a');
    if (!link) return;
    openService(event, link);
    closeMobileNavigation();
  });

  document.addEventListener('click', event => {
    if (openDropdownId && !event.target.closest('.nav-dropdown,[data-dropdown-toggle]')) closeDropdown();
    if (document.getElementById('mobileNavigation')?.classList.contains('is-open') &&
        !event.target.closest('#mobileNavigation,[data-mobile-navigation-toggle]')) closeMobileNavigation();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (openDropdownId) closeDropdown({ restoreFocus: true });
    else if (document.getElementById('mobileNavigation')?.classList.contains('is-open')) closeMobileNavigation({ restoreFocus: true });
  });
  window.addEventListener('resize', () => {
    if (openDropdownId) positionDropdown(openDropdownId);
    setMobileTop();
    if (window.innerWidth > 1050) closeMobileNavigation();
  });
  window.addEventListener('scroll', () => {
    if (openDropdownId) positionDropdown(openDropdownId);
    setMobileTop();
  }, { passive: true });
  window.addEventListener('hashchange', updateActiveState);
  setMobileTop();
  updateActiveState();
}
