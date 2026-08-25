import { authRequest, AuthError } from './auth/auth-api.js';
import { authenticationProvider } from './auth/authentication-provider.js';
import { authPageUrl } from './auth/config.js';
import { isAdminOrStaff } from './auth/persona.js';
import { escapeHtml, pageHeading, portalShell } from './portal/portal-components.js';

const root = document.querySelector('#portalRoot');
const adminRoles = ['ROLE_ADMIN', 'ROLE_CONSULTANT', 'ROLE_SALES_MANAGER', 'ROLE_OPERATIONS', 'ROLE_FINANCE'];
// V14 compatibility list — replace with role-list API in v0.8.
const roleDescriptions = {
  ROLE_ADMIN: 'Full system administration',
  ROLE_CONSULTANT: 'Assigned enquiry and quotation management',
  ROLE_SALES_MANAGER: 'Sales team management and reporting',
  ROLE_OPERATIONS: 'Accepted travel operations management',
  ROLE_FINANCE: 'Bank transfer finance review operations'
};

function setShell(user) {
  root.innerHTML = portalShell(user, 'create-staff');
  document.querySelector('[data-portal-logout]')?.addEventListener('click', async () => { await authenticationProvider.logout(); location.assign(authPageUrl('/signin/')); });
}

function message(text, kind = 'info') {
  const node = document.querySelector('[data-staff-message]');
  if (node) { node.className = `admin-staff-message ${kind}`; node.textContent = text; }
}

function renderForm() {
  document.querySelector('#portalPage').innerHTML = `${pageHeading('STAFF ACCESS', 'Create Staff User', 'Create a staff account and assign existing VirtCruise access roles.')}<section class="portal-panel admin-staff-panel"><div class="admin-staff-message" data-staff-message role="status"></div><form class="portal-form" data-staff-form novalidate><div class="form-grid"><label>Given name<input name="givenName" required maxlength="100" autocomplete="given-name"></label><label>Family name<input name="familyName" required maxlength="100" autocomplete="family-name"></label><label class="full">Email<input name="email" required type="email" maxlength="320" autocomplete="email"></label><label class="full">Temporary password<input name="temporaryPassword" required type="password" autocomplete="new-password"><small>Required by the existing V14 staff-creation API. It is sent once and never displayed or stored by this page.</small></label></div><fieldset><legend>Existing V14 staff roles</legend><div class="admin-staff-role-grid">${adminRoles.map(role => `<label><input type="checkbox" name="roles" value="${role}"><span><strong>${role}</strong><small>${roleDescriptions[role]}</small></span></label>`).join('')}</div><p class="admin-staff-warning" data-admin-warning hidden>Administrator access grants full system administration privileges.</p></fieldset><div class="form-actions"><button class="portal-button" type="submit">Create Staff User</button></div></form></section>`;
  const form = document.querySelector('[data-staff-form]');
  form.querySelectorAll('input[name="roles"]').forEach(input => input.addEventListener('change', () => { const warning = form.querySelector('[data-admin-warning]'); warning.hidden = !form.querySelector('input[value="ROLE_ADMIN"]:checked'); }));
  form.addEventListener('submit', submit);
}

function success(response, email, roles) {
  document.querySelector('#portalPage').innerHTML = `${pageHeading('STAFF ACCESS', 'Staff user created', 'The existing V14 staff account flow accepted the request.')}<section class="portal-panel admin-staff-success"><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Roles:</strong> ${roles.map(escapeHtml).join(', ')}</p><p class="admin-staff-note">The account was created as STAFF, with the selected roles assigned atomically. Existing verification and temporary-password rules apply.</p><a class="portal-button secondary" href="/admin/staff/create/">Create another staff user</a></section>`;
}

async function submit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const roles = values.getAll('roles');
  if (!roles.length) return message('Select at least one existing staff role.', 'error');
  const email = String(values.get('email') || '').trim();
  const payload = { email, givenName: String(values.get('givenName') || '').trim(), familyName: String(values.get('familyName') || '').trim(), temporaryPassword: String(values.get('temporaryPassword') || ''), roles };
  form.querySelector('button[type="submit"]').disabled = true;
  try {
    const response = await authenticationProvider.withAccess(() => authRequest('/api/v1/admin/users/staff', { method: 'POST', body: JSON.stringify(payload) }));
    form.reset();
    success(response, email, roles);
  } catch (error) {
    form.querySelector('button[type="submit"]').disabled = false;
    if (error instanceof AuthError && error.status === 409) message('Email already exists — no account created.', 'error');
    else if (error instanceof AuthError && error.status) message(`Staff user creation failed (HTTP ${error.status}).`, 'error');
    else message('Staff user creation failed. No account result was confirmed.', 'error');
  }
}

async function start() {
  const user = await authenticationProvider.initialize();
  if (!user) { location.replace(authPageUrl('/signin/', { returnTo: location.pathname })); return; }
  const roles = new Set(Array.isArray(user.roles) ? user.roles : []);
  if (!roles.has('ROLE_ADMIN')) { root.innerHTML = '<main class="portal-main"><div class="portal-error" role="alert"><strong>Access denied.</strong><p>Create Staff User is restricted to ROLE_ADMIN.</p></div></main>'; return; }
  setShell(user);
  renderForm();
}
start();
