import { authenticationProvider } from './authentication-provider.js';

export function currentUser() {
  return authenticationProvider.getState().user;
}

export function onCurrentUserChange(listener) {
  return authenticationProvider.subscribe(({ user, status, error }) => listener(user, status, error));
}
