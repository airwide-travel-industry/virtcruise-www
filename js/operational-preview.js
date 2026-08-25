import { authenticationProvider } from './auth/authentication-provider.js';
import { authPageUrl } from './auth/config.js';
import { isAdminOrStaff } from './auth/persona.js';

const root = document.querySelector('#operationalApp');
const state = { section: 'dashboard', release: 'v0.8.0' };
const previewData = { assignments: 12, completed: 7, passed: 6, failed: 1, partiallyPassed: 1, openChangeRequests: 3, criticalChangeRequests: 0, incidents: 2, operationalReadinessPercentage: 82, customerAcceptancePercentage: 76 };
const nav = [['dashboard', 'Operations Dashboard'], ['assignments', 'Assignments'], ['templates', 'Templates'], ['change-requests', 'Change Requests'], ['incidents', 'Incidents'], ['release-dashboard', 'Release Dashboard'], ['customer-sign-off', 'Customer Sign-off'], ['reports', 'Reports'], ['administration', 'Administration']];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const heading = (title, text) => `<div class="or-heading"><div><h1>${title}</h1><p>${text}</p></div></div>`;
const badge = text => `<span class="or-badge">${esc(text)}</span>`;
const unavailable = () => '<button type="button" disabled title="Available after v0.8 deployment">Available after v0.8 deployment</button>';

function shell() {
  return `<header class="or-header"><a href="${authPageUrl('/dashboard/')}" class="or-brand"><img src="../images/logo-img.png" alt=""><span>Operational Readiness</span></a><strong>PREVIEW — v0.8 Operations</strong><button type="button" data-action="logout">Sign out</button></header><div class="or-layout"><aside><button class="or-menu" data-action="menu" aria-expanded="false">Workspace menu</button><nav aria-label="Operational readiness">${nav.map(([id, label]) => `<button data-section="${id}" aria-current="${state.section === id}">${label}</button>`).join('')}</nav><p>Assignment-led acceptance for VirtCruise releases.</p></aside><main id="orMain" tabindex="-1"></main></div>`;
}

function dashboard() {
  const stats = [['Assignments', previewData.assignments], ['Completed', previewData.completed], ['Passed', previewData.passed], ['Failed', previewData.failed], ['Partially passed', previewData.partiallyPassed], ['Open CRs', previewData.openChangeRequests], ['Critical CRs', previewData.criticalChangeRequests], ['Incidents', previewData.incidents]];
  return `${heading('Operational dashboard', 'PREVIEW — v0.8 Operations · Release acceptance at a glance.')}<div class="or-alert" role="note"><strong>PREVIEW — v0.8 Operations</strong><br>Control Tower and operational readiness capabilities scheduled for the v0.8 production release.</div><section class="or-stats" aria-label="Release metrics">${stats.map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join('')}</section><section class="or-panels"><article><h2>Operational readiness</h2><progress max="100" value="${previewData.operationalReadinessPercentage}">${previewData.operationalReadinessPercentage}%</progress><strong>${previewData.operationalReadinessPercentage}%</strong></article><article><h2>Customer acceptance</h2><progress max="100" value="${previewData.customerAcceptancePercentage}">${previewData.customerAcceptancePercentage}%</progress><strong>${previewData.customerAcceptancePercentage}%</strong></article></section>`;
}

function listPage(title, description, items) {
  return `${heading(title, `PREVIEW — v0.8 Operations · ${description}`)}<section class="or-list">${items.map(item => `<article><div><strong>${item[0]}</strong><h2>${item[1]}</h2><p>${item[2]}</p></div>${badge(item[3])}</article>`).join('')}</section>`;
}

function render() {
  const pages = {
    dashboard: dashboard(),
    assignments: listPage('Assignments', 'Execute acceptance work, checklist evidence and results.', [['ASG-012', 'Finance acceptance rehearsal', 'Role-owned checklist and evidence review.', 'IN_PROGRESS'], ['ASG-011', 'Support readiness review', 'Preview assignment record.', 'PASSED']]),
    templates: listPage('Assignment templates', 'Reusable role-specific operational scenarios.', [['FINANCE', 'Finance release acceptance', 'Reusable financial operations checklist.', 'AVAILABLE'], ['SUPPORT', 'Support readiness', 'Customer-facing readiness scenario.', 'AVAILABLE']]),
    'change-requests': listPage('Change Requests', 'Failed assignments requiring controlled engineering and retest.', [['CR-003', 'Receipt reconciliation copy', 'Preview change request.', 'SUBMITTED'], ['CR-002', 'Release evidence wording', 'Preview change request.', 'OPEN']]),
    incidents: listPage('Incidents', 'Operational, training, documentation and other non-software issues.', [['INC-002', 'Training follow-up', 'Demonstration incident record.', 'OPEN'], ['INC-001', 'Documentation review', 'Demonstration incident record.', 'CLOSED']]),
    'release-dashboard': dashboard(),
    'customer-sign-off': listPage('Customer Sign-off', 'Assignment, module and release acceptance decisions.', [['v0.8.0', 'Release readiness sign-off', 'Demonstration sign-off record.', 'PENDING']]),
    reports: `${heading('Reports', 'PREVIEW — v0.8 Operations · Live, release-scoped operational evidence.')}<section class="or-cards">${['Assignment Report', 'Incident Report', 'Change Request Report', 'Release Readiness Report', 'Customer Acceptance Report'].map(title => `<article><h2>${title}</h2><p>Filtered to ${esc(state.release)} with preview data.</p>${unavailable()}</article>`).join('')}</section>`,
    administration: `${heading('Administration', 'PREVIEW — v0.8 Operations · Manager controls and immutable audit history.')}<div class="or-empty">Audit / History is represented in this preview. ${unavailable()}</div>`
  };
  document.querySelector('#orMain').innerHTML = pages[state.section] || pages.dashboard;
  bind();
}

function bind() {
  document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => { state.section = button.dataset.section; render(); }));
  document.querySelector('[data-action="menu"]')?.addEventListener('click', event => { const navElement = document.querySelector('aside nav'); navElement.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', navElement.classList.contains('open')); });
  document.querySelector('[data-action="logout"]')?.addEventListener('click', async () => { await authenticationProvider.logout(); location.assign(authPageUrl('/signin/')); });
}

async function start() {
  const user = await authenticationProvider.initialize();
  if (!user) { root.innerHTML = `<div class="or-denied"><h1>Preview sign-in required</h1><a href="${authPageUrl('/signin/', { returnTo: '/operations-preview/' })}">Sign in</a></div>`; return; }
  if (!isAdminOrStaff(user)) { root.innerHTML = '<div class="or-denied"><h1>Preview unavailable</h1><p>Operations Preview is restricted to administrator/staff users.</p></div>'; return; }
  root.innerHTML = shell();
  render();
}
start();
