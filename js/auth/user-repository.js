import { authRequest } from './auth-api.js';

const post = (path, payload, options = {}) => authRequest(path, {
  method: 'POST',
  body: JSON.stringify(payload),
  ...options
});

export function createUserRepository() {
  let csrf = null;

  async function getCsrf({ refresh = false } = {}) {
    if (csrf && !refresh) return csrf;
    csrf = await authRequest('/api/v1/auth/csrf', { auth: false });
    return csrf;
  }

  async function cookiePost(path, payload = {}) {
    const token = await getCsrf();
    return post(path, payload, {
      headers: { [token.headerName || 'X-XSRF-TOKEN']: token.token },
      auth: path !== '/api/v1/auth/refresh'
    });
  }

  return Object.freeze({
    register: payload => post('/api/v1/auth/register', payload, { auth: false }),
    verifyEmail: token => post('/api/v1/auth/email-verification/confirm', { token }, { auth: false }),
    resendVerification: email => post('/api/v1/auth/email-verification/request', { email }, { auth: false }),
    login: payload => post('/api/v1/auth/login', payload, { auth: false }),
    refresh: () => cookiePost('/api/v1/auth/refresh'),
    logout: () => cookiePost('/api/v1/auth/logout'),
    logoutAll: () => cookiePost('/api/v1/auth/logout-all'),
    requestPasswordReset: email => post('/api/v1/auth/password-reset/request', { email }, { auth: false }),
    resetPassword: payload => post('/api/v1/auth/password-reset/confirm', payload, { auth: false }),
    changePassword: payload => post('/api/v1/auth/password', payload),
    exchangeOAuth: payload => post('/api/v1/auth/oauth/exchange', payload, { auth: false }),
    getProfile: customerId => authRequest(`/api/v1/customers/${encodeURIComponent(customerId)}`),
    getCsrf
  });
}
