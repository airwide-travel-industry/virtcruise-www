import { authPageUrl, safeReturnPath } from './config.js';
import { authenticationProvider } from './authentication-provider.js';

const RETURN_KEY = 'virtcruise.auth.returnTo';

export function rememberDestination(path = `${location.pathname}${location.search}${location.hash}`) {
  sessionStorage.setItem(RETURN_KEY, safeReturnPath(path));
}

export function consumeDestination(fallback = '/account/') {
  const destination = safeReturnPath(sessionStorage.getItem(RETURN_KEY), fallback);
  sessionStorage.removeItem(RETURN_KEY);
  return destination;
}

export async function requireAuthentication() {
  const user = await authenticationProvider.initialize();
  if (user) return user;
  rememberDestination();
  location.replace(authPageUrl('/signin/', { returnTo: `${location.pathname}${location.search}${location.hash}` }));
  return null;
}

export function hasFinanceAccess(user) {
  const roles = new Set(Array.isArray(user?.roles) ? user.roles : []);
  const permissions = new Set(Array.isArray(user?.permissions) ? user.permissions : []);
  return roles.has('ROLE_FINANCE') || roles.has('ROLE_ADMIN')
    || permissions.has('BANK_TRANSFER_REVIEW') || permissions.has('BANK_TRANSFER_ADMIN');
}

export async function requireFinanceAccess() {
  const user = await authenticationProvider.initialize();
  if (!user) {
    rememberDestination();
    location.replace(authPageUrl('/signin/', { returnTo: `${location.pathname}${location.search}${location.hash}` }));
    return null;
  }
  if (!hasFinanceAccess(user)) {
    location.replace(authPageUrl('/dashboard/'));
    return null;
  }
  return user;
}
