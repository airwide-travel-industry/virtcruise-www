// Only the explicitly approved production hosts use same-origin /api routing.
// Keeping this same-origin preserves the Secure, SameSite=Lax refresh cookie.
const APPROVED_SAME_ORIGIN_HOSTS = new Set(['virtcruise.airwide.co.uk', 'www.virtcruisetravels.com']);
const PRODUCTION_API_BASE_URL = APPROVED_SAME_ORIGIN_HOSTS.has(window.location.hostname)
  ? window.location.origin
  : 'https://api.virtcruise.airwide.co.uk';
const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:8080';

const params = new URLSearchParams(window.location.search);
const requestedMode = params.get('api');
const runtimeConfig = globalThis.VIRTCRUISE_CONFIG || {};
const siteBasePath = new URL('../../', import.meta.url).pathname.replace(/\/+$/, '');

export const authRuntime = Object.freeze({
  mode: requestedMode === 'local' ? 'local' : 'production',
  apiBaseUrl: requestedMode === 'local'
    ? String(runtimeConfig.localApiBaseUrl || DEFAULT_LOCAL_API_BASE_URL).replace(/\/+$/, '')
    : PRODUCTION_API_BASE_URL
});

export function authPageUrl(path, parameters = {}) {
  const relativePath = String(path || '/').replace(/^\/+/, '');
  const url = new URL(`${siteBasePath}/${relativePath}`, window.location.origin);
  if (requestedMode === 'local') url.searchParams.set('api', 'local');
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });
  return `${url.pathname}${url.search}${url.hash}`;
}

export function safeReturnPath(value, fallback = '/account/') {
  if (!value) return fallback;
  try {
    const url = new URL(value, window.location.origin);
    return url.origin === window.location.origin && url.pathname.startsWith('/')
      ? `${url.pathname}${url.search}${url.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
