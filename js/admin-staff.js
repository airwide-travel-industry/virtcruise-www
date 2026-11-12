import { authRequest, AuthError } from './auth/auth-api.js';
import { authenticationProvider } from './auth/authentication-provider.js';
import { authPageUrl } from './auth/config.js';
import { escapeHtml, pageHeading, portalShell } from './portal/portal-components.js';

const root = document.querySelector('#portalRoot');
const read = (path, options) => authenticationProvider.withAccess(() => authRequest(path, options));
const collection = value => Array.isArray(value) ? value : value?.data || value?.content || [];
const errorText = error => error instanceof AuthError ? error.message : 'Staff request failed. Please try again.';

function status(account) {
  if (account.invitationPending) return account.invitationRevoked ? 'Invitation revoked' : 'Invitation pending';
  if (!account.enabled) return 'Disabled';
  return account.emailVerified ? 'Active' : 'Email unverified';
}

function render(accounts, message = '') {
  const rows = accounts.map(account => `<tr><td><strong>${escapeHtml(account.email)}</strong></td><td>${escapeHtml(account.roles?.join(', ') || '—')}</td><td>${escapeHtml(status(account))}</td><td>${account.invitationPending && !account.invitationRevoked ? `<button class="portal-button secondary" type="button" data-resend="${account.id}">Resend</button><button class="portal-button secondary" type="button" data-revoke="${account.id}">Revoke</button>` : '—'}</td></tr>`).join('');
  document.querySelector('#portalPage').innerHTML = `${pageHeading('ADMINISTRATION', 'Staff', 'Invite and manage consultants who handle assigned customer quote requests.')}<section class="portal-panel"><h2>Invite consultant</h2><form data-invite><div class="admin-quote-footer-grid"><label class="admin-quote-field">Given name<input name="givenName" required maxlength="100"></label><label class="admin-quote-field">Family name<input name="familyName" required maxlength="100"></label><label class="admin-quote-field">Email<input name="email" type="email" required maxlength="320"></label></div><button class="portal-button" type="submit">Send invitation</button><p role="status" data-message>${escapeHtml(message)}</p></form></section><section class="portal-panel"><h2>Staff accounts</h2><div class="admin-quote-table-wrap"><table class="admin-quote-table"><thead><tr><th>Email</th><th>Roles</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No staff accounts found.</td></tr>'}</tbody></table></div></section>`;
  document.querySelector('[data-invite]').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); button.disabled = true; try { await read('/api/v1/admin/users/staff', { method: 'POST', body: JSON.stringify({ email: form.email.value.trim(), givenName: form.givenName.value.trim(), familyName: form.familyName.value.trim(), roles: ['ROLE_CONSULTANT'] }) }); await load('Invitation created. Email delivery has not yet been confirmed.'); } catch (error) { button.disabled = false; document.querySelector('[data-message]').textContent = errorText(error); } });
  document.querySelectorAll('[data-resend]').forEach(button => button.addEventListener('click', async () => { try { await read(`/api/v1/admin/users/${button.dataset.resend}/invitation/resend`, { method: 'POST' }); await load('Invitation resend requested. Email delivery has not yet been confirmed.'); } catch (error) { await load(errorText(error)); } }));
  document.querySelectorAll('[data-revoke]').forEach(button => button.addEventListener('click', async () => { if (!window.confirm('Revoke this pending invitation?')) return; try { await read(`/api/v1/admin/users/${button.dataset.revoke}/invitation/revoke`, { method: 'POST' }); await load('Invitation revoked.'); } catch (error) { await load(errorText(error)); } }));
}

async function load(message = '') { try { render(collection(await read('/api/v1/admin/users/staff')), message); } catch (error) { document.querySelector('#portalRoot').innerHTML = `<main class="portal-main"><div class="portal-error" role="alert">${escapeHtml(errorText(error))}</div></main>`; } }

async function start() { const user = await authenticationProvider.initialize(); if (!user) { location.replace(authPageUrl('/signin/', { returnTo: location.pathname })); return; } if (!user.roles?.includes('ROLE_ADMIN')) { root.innerHTML = '<main class="portal-main"><div class="portal-error" role="alert">Access denied.</div></main>'; return; } root.innerHTML = portalShell(user, 'staff'); await load(); }
start();
