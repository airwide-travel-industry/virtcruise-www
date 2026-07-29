import { AuthError } from './auth-api.js';
import { authenticationProvider } from './authentication-provider.js';
import { authPageUrl, authRuntime, safeReturnPath } from './config.js';
import { passwordStrength } from './password-strength.js';
import { consumeDestination, rememberDestination, requireAuthentication } from './route-guard.js';

const page = document.body.dataset.authPage;
const root = document.getElementById('authPage');
const live = document.getElementById('authLive');
const repository = authenticationProvider.repository;
const params = new URLSearchParams(location.search);
const REMEMBERED_EMAIL_KEY = 'virtcruise.auth.rememberedEmail';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

const field = (label, name, type = 'text', attributes = '') => `
  <label class="auth-field"><span>${label}</span>
    <span class="auth-input-wrap"><input id="${name}" name="${name}" type="${type}" ${attributes}></span>
    <small class="field-error" id="${name}Error"></small>
  </label>`;

const passwordField = (label, name, autocomplete) => `
  <label class="auth-field"><span>${label}</span>
    <span class="auth-input-wrap"><input id="${name}" name="${name}" type="password" autocomplete="${autocomplete}" required minlength="12" maxlength="128"><button class="password-toggle" type="button" data-password-toggle="${name}" aria-label="Show ${label.toLowerCase()}">Show</button></span>
    <small class="field-error" id="${name}Error"></small>
  </label>`;

function setContent(html, { focus = true } = {}) {
  root.innerHTML = html;
  if (focus) requestAnimationFrame(() => root.querySelector('h1,input,button,a')?.focus());
}

function announce(message) {
  live.textContent = '';
  requestAnimationFrame(() => { live.textContent = message; });
}

function statusPanel(kind, title, message, actions = '') {
  setContent(`<section class="auth-card auth-result auth-result-${kind}" aria-labelledby="resultTitle">
    <span class="result-icon" aria-hidden="true">${kind === 'success' ? '✓' : kind === 'loading' ? '…' : '!'}</span>
    <p class="auth-eyebrow">Virtcruise account</p>
    <h1 id="resultTitle" tabindex="-1">${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>${actions}
  </section>`);
}

function showFormError(form, error) {
  const summary = form.querySelector('[data-error-summary]');
  const messages = error?.violations?.map(item => item.message).filter(Boolean) || [];
  summary.textContent = messages.length ? messages.join(' ') : error.message;
  summary.hidden = false;
  summary.focus();
  announce(summary.textContent);
}

function clearErrors(form) {
  form.querySelector('[data-error-summary]').hidden = true;
  form.querySelectorAll('.field-error').forEach(node => { node.textContent = ''; });
  form.querySelectorAll('[aria-invalid]').forEach(node => {
    node.removeAttribute('aria-invalid');
    node.removeAttribute('aria-describedby');
  });
}

function invalidate(form, name, message) {
  const input = form.elements[name];
  input?.setAttribute('aria-invalid', 'true');
  input?.setAttribute('aria-describedby', `${name}Error`);
  const error = form.querySelector(`#${CSS.escape(name)}Error`);
  if (error) error.textContent = message;
  return input;
}

function submitState(form, loading, label = 'Please wait…') {
  const button = form.querySelector('[type="submit"]');
  if (!button) return;
  button.disabled = loading;
  if (loading) {
    button.dataset.originalLabel = button.textContent;
    button.textContent = label;
    form.setAttribute('aria-busy', 'true');
  } else {
    button.textContent = button.dataset.originalLabel || button.textContent;
    form.removeAttribute('aria-busy');
  }
}

function oauthButtons() {
  const base = authRuntime.apiBaseUrl;
  return `<div class="auth-divider"><span>or continue with</span></div>
    <div class="oauth-actions">
      <a class="oauth-button" href="${base}/oauth2/authorization/google"><span aria-hidden="true">G</span>Continue with Google</a>
      <a class="oauth-button" href="${base}/oauth2/authorization/facebook"><span aria-hidden="true">f</span>Continue with Facebook</a>
    </div>`;
}

function renderSignIn() {
  if (params.get('returnTo')) rememberDestination(params.get('returnTo'));
  setContent(`<section class="auth-card" aria-labelledby="authTitle">
    <p class="auth-eyebrow">Welcome back</p><h1 id="authTitle" tabindex="-1">Sign in to your journey</h1>
    <p class="auth-intro">Continue planning remarkable travel with everything in one place.</p>
    <form class="auth-form" id="signInForm" novalidate>
      <div class="auth-error-summary" data-error-summary role="alert" tabindex="-1" hidden></div>
      ${field('Email address', 'email', 'email', 'autocomplete="email" required')}
      ${passwordField('Password', 'password', 'current-password')}
      <div class="auth-form-row"><label class="auth-check"><input name="remember" type="checkbox"> <span>Remember me</span></label><a href="${authPageUrl('/forgot-password/')}">Forgot password?</a></div>
      <button class="auth-primary" type="submit">Sign in</button>
    </form>${oauthButtons()}
    <p class="auth-switch">New to Virtcruise? <a href="${authPageUrl('/register/')}">Create account</a></p>
  </section>`);
  const form = document.getElementById('signInForm');
  const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
  if (rememberedEmail) {
    form.email.value = rememberedEmail;
    form.remember.checked = true;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    clearErrors(form);
    const data = new FormData(form);
    let firstInvalid;
    if (!form.email.validity.valid) firstInvalid = invalidate(form, 'email', 'Enter a valid email address.');
    if (!form.password.value) firstInvalid ||= invalidate(form, 'password', 'Enter your password.');
    if (firstInvalid) return firstInvalid.focus();
    submitState(form, true, 'Signing in…');
    try {
      await authenticationProvider.login(Object.fromEntries(data));
      if (form.remember.checked) localStorage.setItem(REMEMBERED_EMAIL_KEY, form.email.value.trim());
      else localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      const requested = safeReturnPath(params.get('returnTo'), consumeDestination('/account/'));
      location.replace(authPageUrl(requested));
    } catch (error) {
      showFormError(form, error);
      submitState(form, false);
    }
  });
}

function renderRegister() {
  setContent(`<section class="auth-card auth-card-wide" aria-labelledby="authTitle">
    <p class="auth-eyebrow">Join Virtcruise</p><h1 id="authTitle" tabindex="-1">Create your travel account</h1>
    <p class="auth-intro">Save your details securely and build memorable journeys at your pace.</p>
    <form class="auth-form" id="registerForm" novalidate>
      <div class="auth-error-summary" data-error-summary role="alert" tabindex="-1" hidden></div>
      <div class="auth-grid">${field('First name', 'givenName', 'text', 'autocomplete="given-name" required maxlength="100"')}${field('Last name', 'familyName', 'text', 'autocomplete="family-name" required maxlength="100"')}</div>
      ${field('Email address', 'email', 'email', 'autocomplete="email" required maxlength="320"')}
      <div class="auth-grid">${passwordField('Password', 'password', 'new-password')}${passwordField('Confirm password', 'confirmPassword', 'new-password')}</div>
      <div class="password-meter" data-password-meter aria-live="polite"><span><i></i></span><small>Use at least 12 characters.</small></div>
      <label class="auth-check auth-consent"><input name="termsAccepted" type="checkbox" required> <span>I accept the <a href="/#footerContact">Terms and Conditions</a>.</span></label>
      <label class="auth-check auth-consent"><input name="privacyAccepted" type="checkbox" required> <span>I accept the <a href="/#footerContact">Privacy Policy</a>.</span></label>
      <button class="auth-primary" type="submit">Create account</button>
    </form>
    <p class="auth-switch">Already have an account? <a href="${authPageUrl('/signin/')}">Sign in</a></p>
  </section>`);
  const form = document.getElementById('registerForm');
  const meter = form.querySelector('[data-password-meter]');
  const updateMeter = () => {
    const result = passwordStrength(form.password.value, form.email.value);
    meter.dataset.level = result.level;
    meter.querySelector('small').textContent = form.password.value
      ? `${result.label} password${result.valid ? '' : ' — add length and variety'}`
      : 'Use at least 12 characters.';
  };
  form.password.addEventListener('input', updateMeter);
  form.email.addEventListener('input', updateMeter);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    clearErrors(form);
    let firstInvalid;
    ['givenName', 'familyName'].forEach(name => {
      if (!form[name].value.trim()) firstInvalid ||= invalidate(form, name, `${name === 'givenName' ? 'First' : 'Last'} name is required.`);
    });
    if (!form.email.validity.valid) firstInvalid ||= invalidate(form, 'email', 'Enter a valid email address.');
    if (!passwordStrength(form.password.value, form.email.value).valid) firstInvalid ||= invalidate(form, 'password', 'Use at least 12 characters with a stronger mix.');
    if (form.password.value !== form.confirmPassword.value) firstInvalid ||= invalidate(form, 'confirmPassword', 'Passwords do not match.');
    if (!form.termsAccepted.checked || !form.privacyAccepted.checked) {
      const summary = form.querySelector('[data-error-summary]');
      summary.textContent = 'Accept both the Terms and Privacy Policy to create an account.';
      summary.hidden = false;
      firstInvalid ||= !form.termsAccepted.checked ? form.termsAccepted : form.privacyAccepted;
    }
    if (firstInvalid) return firstInvalid.focus();
    submitState(form, true, 'Creating account…');
    try {
      await repository.register({
        email: form.email.value.trim(),
        password: form.password.value,
        givenName: form.givenName.value.trim(),
        familyName: form.familyName.value.trim(),
        termsAccepted: true,
        privacyAccepted: true,
        customerProfile: null
      });
      statusPanel('success', 'Check your email to verify your account.',
        'We have sent verification instructions if registration can proceed.',
        `<a class="auth-primary auth-link-button" href="${authPageUrl('/signin/')}">Return to sign in</a>`);
    } catch (error) {
      showFormError(form, error);
      submitState(form, false);
    }
  });
}

function renderForgotPassword() {
  setContent(`<section class="auth-card" aria-labelledby="authTitle">
    <p class="auth-eyebrow">Account recovery</p><h1 id="authTitle" tabindex="-1">Reset your password</h1>
    <p class="auth-intro">Enter your email and we’ll send reset instructions if the account is eligible.</p>
    <form class="auth-form" id="forgotForm" novalidate>
      <div class="auth-error-summary" data-error-summary role="alert" tabindex="-1" hidden></div>
      ${field('Email address', 'email', 'email', 'autocomplete="email" required')}
      <button class="auth-primary" type="submit">Send reset instructions</button>
    </form><p class="auth-switch"><a href="${authPageUrl('/signin/')}">Back to sign in</a></p>
  </section>`);
  const form = document.getElementById('forgotForm');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    clearErrors(form);
    if (!form.email.validity.valid) return invalidate(form, 'email', 'Enter a valid email address.').focus();
    submitState(form, true, 'Sending…');
    try {
      await repository.requestPasswordReset(form.email.value.trim());
      statusPanel('success', 'Check your email', 'If the account is eligible, password reset instructions will be sent.',
        `<a class="auth-primary auth-link-button" href="${authPageUrl('/signin/')}">Return to sign in</a>`);
    } catch (error) {
      showFormError(form, error);
      submitState(form, false);
    }
  });
}

function renderResetPassword() {
  const token = params.get('token') || '';
  setContent(`<section class="auth-card" aria-labelledby="authTitle">
    <p class="auth-eyebrow">Secure your account</p><h1 id="authTitle" tabindex="-1">Choose a new password</h1>
    <p class="auth-intro">Create a strong password that you have not used before.</p>
    <form class="auth-form" id="resetForm" novalidate>
      <div class="auth-error-summary" data-error-summary role="alert" tabindex="-1" ${token ? 'hidden' : ''}>${token ? '' : 'This reset link does not contain a valid token.'}</div>
      ${passwordField('New password', 'newPassword', 'new-password')}
      ${passwordField('Confirm password', 'confirmPassword', 'new-password')}
      <div class="password-meter" data-password-meter aria-live="polite"><span><i></i></span><small>Use at least 12 characters.</small></div>
      <button class="auth-primary" type="submit" ${token ? '' : 'disabled'}>Reset password</button>
    </form><p class="auth-switch"><a href="${authPageUrl('/forgot-password/')}">Request another link</a></p>
  </section>`);
  const form = document.getElementById('resetForm');
  form.newPassword.addEventListener('input', () => {
    const result = passwordStrength(form.newPassword.value);
    const meter = form.querySelector('[data-password-meter]');
    meter.dataset.level = result.level;
    meter.querySelector('small').textContent = `${result.label} password${result.valid ? '' : ' — add length and variety'}`;
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    clearErrors(form);
    let invalid;
    if (!passwordStrength(form.newPassword.value).valid) invalid = invalidate(form, 'newPassword', 'Use at least 12 characters with a stronger mix.');
    if (form.newPassword.value !== form.confirmPassword.value) invalid ||= invalidate(form, 'confirmPassword', 'Passwords do not match.');
    if (invalid) return invalid.focus();
    submitState(form, true, 'Updating password…');
    try {
      await repository.resetPassword({ token, newPassword: form.newPassword.value });
      statusPanel('success', 'Password updated', 'Your password has been reset. Sign in with your new password.',
        `<a class="auth-primary auth-link-button" href="${authPageUrl('/signin/')}">Sign in</a>`);
    } catch (error) {
      showFormError(form, error);
      submitState(form, false);
    }
  });
}

async function renderVerifyEmail() {
  const token = params.get('token');
  if (!token) {
    setContent(`<section class="auth-card" aria-labelledby="authTitle"><p class="auth-eyebrow">Email verification</p><h1 id="authTitle" tabindex="-1">Request a new verification link</h1><p class="auth-intro">Enter the email address used for your Virtcruise account.</p><form class="auth-form" id="resendForm" novalidate><div class="auth-error-summary" data-error-summary role="alert" tabindex="-1" hidden></div>${field('Email address', 'email', 'email', 'autocomplete="email" required')}<button class="auth-primary" type="submit">Resend verification</button></form></section>`);
    const form = document.getElementById('resendForm');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.email.validity.valid) return invalidate(form, 'email', 'Enter a valid email address.').focus();
      submitState(form, true, 'Sending…');
      try {
        await repository.resendVerification(form.email.value.trim());
        statusPanel('success', 'Check your email', 'If the account is eligible, new verification instructions will be sent.',
          `<a class="auth-primary auth-link-button" href="${authPageUrl('/signin/')}">Return to sign in</a>`);
      } catch (error) {
        showFormError(form, error);
        submitState(form, false);
      }
    });
    return;
  }
  statusPanel('loading', 'Verifying your email', 'Please wait while we confirm your verification link.');
  try {
    await repository.verifyEmail(token);
    statusPanel('success', 'Your email is verified', 'Your Virtcruise account is ready. You can now sign in.',
      `<a class="auth-primary auth-link-button" href="${authPageUrl('/signin/')}">Continue to sign in</a>`);
  } catch (error) {
    statusPanel('error', 'We could not verify this link', error.message,
      `<a class="auth-primary auth-link-button" href="${authPageUrl('/verify-email/')}">Request a new link</a>`);
  }
}

async function renderOAuthCallback() {
  const code = params.get('code');
  if (params.get('status') === 'verification_required') {
    return statusPanel('error', 'Email verification required', 'Verify your email before completing social sign-in.',
      `<a class="auth-primary auth-link-button" href="${authPageUrl('/verify-email/')}">Resend verification</a>`);
  }
  if (params.get('error') || !code) {
    return statusPanel('error', 'Social sign-in was not completed', 'Return to sign in and try again.',
      `<a class="auth-primary auth-link-button" href="${authPageUrl('/signin/')}">Return to sign in</a>`);
  }
  statusPanel('loading', 'Completing secure sign-in', 'Please wait while we complete your session.');
  try {
    await authenticationProvider.exchangeOAuth(code);
    location.replace(authPageUrl(consumeDestination('/account/')));
  } catch (error) {
    statusPanel('error', 'Social sign-in was not completed', error.message,
      `<a class="auth-primary auth-link-button" href="${authPageUrl('/signin/')}">Return to sign in</a>`);
  }
}

function accountMarkup(user, active = 'account', profile = null) {
  const fullName = `${profile?.firstName || user.givenName || ''} ${profile?.lastName || user.familyName || ''}`.trim();
  const createdAt = profile?.createdAt
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(profile.createdAt))
    : 'Not available from the current account API';
  return `<section class="account-shell" aria-labelledby="accountTitle">
    <aside class="account-sidebar"><div class="account-identity"><span class="account-large-avatar" aria-hidden="true">${escapeHtml(`${user.givenName?.[0] || ''}${user.familyName?.[0] || ''}`.toUpperCase())}</span><div><strong>${escapeHtml(fullName)}</strong><small>${escapeHtml(user.email)}</small></div></div>
      <nav aria-label="Account sections"><a href="${authPageUrl('/dashboard/')}">Dashboard</a><a class="${['account', 'profile'].includes(active) ? 'active' : ''}" href="${authPageUrl('/profile/')}">Profile</a><a href="${authPageUrl('/quotes/')}">My Quotes</a><a href="#security">Security</a></nav>
    </aside>
    <div class="account-content"><p class="auth-eyebrow">My Account</p><h1 id="accountTitle" tabindex="-1">${active === 'profile' ? 'Your profile' : 'Welcome back'}, ${escapeHtml(user.givenName || 'Traveller')}</h1>
      <p class="account-lead">Manage your details and keep your Virtcruise account secure.</p>
      <section class="account-panel" aria-labelledby="profileTitle"><div class="account-panel-heading"><div><p class="auth-eyebrow">Personal details</p><h2 id="profileTitle">Profile</h2></div><span class="status-badge ${user.emailVerified ? 'verified' : ''}">${user.emailVerified ? 'Verified email' : 'Verification required'}</span></div>
        <dl class="profile-list"><div><dt>Name</dt><dd>${escapeHtml(fullName)}</dd></div><div><dt>Email</dt><dd>${escapeHtml(profile?.email || user.email)}</dd></div><div><dt>Account created</dt><dd>${escapeHtml(createdAt)}</dd></div><div><dt>Last login</dt><dd>This session; historical timestamp is not exposed yet</dd></div><div><dt>Linked providers</dt><dd>Provider details will appear when the account API supports them</dd></div></dl>
      </section>
      <section class="account-panel" id="my-quotes" aria-labelledby="quotesTitle"><p class="auth-eyebrow">Your travel</p><h2 id="quotesTitle">Customer Travel Portal</h2><div class="account-empty"><span aria-hidden="true">✦</span><h3>Your journeys in one place</h3><p>Review quotes, trips, saved travellers and travel preferences from your customer dashboard.</p><a class="auth-primary auth-link-button" href="${authPageUrl('/dashboard/')}">Open dashboard</a></div></section>
      <section class="account-panel" id="security" aria-labelledby="securityTitle"><p class="auth-eyebrow">Account protection</p><h2 id="securityTitle">Security</h2>
        <form class="auth-form security-form" id="changePasswordForm" novalidate><div class="auth-error-summary" data-error-summary role="alert" tabindex="-1" hidden></div><input class="visually-hidden" type="email" name="username" value="${escapeHtml(user.email)}" autocomplete="username" tabindex="-1" aria-hidden="true">${passwordField('Current password', 'currentPassword', 'current-password')}${passwordField('New password', 'newPassword', 'new-password')}<button class="auth-secondary" type="submit">Change password</button></form>
        <div class="security-action"><div><h3>Logout all devices</h3><p>Revoke every refresh session linked to your account.</p></div><button class="auth-danger" type="button" data-logout-all>Logout all devices</button></div>
      </section>
    </div>
  </section>`;
}

async function renderAccount() {
  const user = await requireAuthentication();
  if (!user) return;
  let profile = null;
  if (user.customerId) {
    try {
      profile = await authenticationProvider.withAccess(() => repository.getProfile(user.customerId));
    } catch (error) {
      announce(`Profile details could not be refreshed. ${error.message}`);
    }
  }
  setContent(accountMarkup(user, page, profile), { focus: false });
  root.querySelector('h1')?.focus();
  const form = document.getElementById('changePasswordForm');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    clearErrors(form);
    if (!passwordStrength(form.newPassword.value, user.email).valid) return invalidate(form, 'newPassword', 'Use at least 12 characters with a stronger mix.').focus();
    submitState(form, true, 'Updating…');
    try {
      await authenticationProvider.withAccess(() => repository.changePassword({
        currentPassword: form.currentPassword.value,
        newPassword: form.newPassword.value
      }));
      await authenticationProvider.logout();
      location.replace(authPageUrl('/signin/', { message: 'password-changed' }));
    } catch (error) {
      if (error.code === 'INVALID_CREDENTIALS') {
        error = new AuthError('Current password is incorrect.', {
          status: error.status,
          code: error.code,
          requestId: error.requestId
        });
      }
      showFormError(form, error);
      submitState(form, false);
    }
  });
  root.querySelector('[data-logout-all]').addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = 'Logging out…';
    try {
      await authenticationProvider.logout(true);
      location.replace(authPageUrl('/signin/', { message: 'all-devices-logged-out' }));
    } catch (error) {
      announce(error.message);
      button.disabled = false;
      button.textContent = 'Logout all devices';
    }
  });
}

function bindPasswordToggles() {
  root.addEventListener('click', event => {
    const toggle = event.target.closest('[data-password-toggle]');
    if (!toggle) return;
    const input = document.getElementById(toggle.dataset.passwordToggle);
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Show' : 'Hide';
    toggle.setAttribute('aria-label', `${showing ? 'Show' : 'Hide'} ${input.closest('label').querySelector(':scope > span').textContent.toLowerCase()}`);
  });
}

bindPasswordToggles();
const renderers = {
  signin: renderSignIn,
  register: renderRegister,
  'forgot-password': renderForgotPassword,
  'reset-password': renderResetPassword,
  'verify-email': renderVerifyEmail,
  'oauth-callback': renderOAuthCallback,
  account: renderAccount,
  profile: renderAccount
};

Promise.resolve(renderers[page]?.()).catch(error => {
  console.error('Virtcruise authentication page failed:', error);
  statusPanel('error', 'This page could not be loaded',
    error instanceof AuthError ? error.message : 'Please refresh the page or return home.',
    '<a class="auth-primary auth-link-button" href="/">Return home</a>');
});
