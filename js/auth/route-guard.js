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
