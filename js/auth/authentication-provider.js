import { AuthError } from './auth-api.js';
import { createSessionManager } from './session-manager.js';
import { createUserRepository } from './user-repository.js';

const repository = createUserRepository();
const session = createSessionManager(repository);
const listeners = new Set();
let state = {
  status: 'checking',
  user: session.metadata()?.user || null,
  error: null
};
let initialization;

function publish(next) {
  state = { ...state, ...next };
  listeners.forEach(listener => listener({ ...state }));
  document.dispatchEvent(new CustomEvent('virtcruise:auth-change', { detail: { ...state } }));
}

async function initialize() {
  if (initialization) return initialization;
  initialization = session.refresh()
    .then(user => {
      publish({ status: 'authenticated', user, error: null });
      return user;
    })
    .catch(error => {
      const expectedGuest = error instanceof AuthError
        && ['INVALID_REFRESH_TOKEN', 'HTTP_401', 'HTTP_403'].includes(error.code);
      publish({ status: 'guest', user: null, error: expectedGuest ? null : error });
      return null;
    });
  return initialization;
}

async function login(values) {
  publish({ status: 'loading', error: null });
  try {
    const response = await repository.login({
      email: values.email,
      password: values.password,
      deviceName: `${navigator.platform || 'Browser'} · Virtcruise web`
    });
    const user = session.accept(response);
    publish({ status: 'authenticated', user, error: null });
    return user;
  } catch (error) {
    publish({ status: 'guest', user: null, error });
    throw error;
  }
}

async function exchangeOAuth(code) {
  const response = await repository.exchangeOAuth({
    code,
    deviceName: `${navigator.platform || 'Browser'} · Virtcruise web`
  });
  const user = session.accept(response);
  publish({ status: 'authenticated', user, error: null });
  return user;
}

async function logout(allDevices = false) {
  try {
    if (allDevices) {
      await session.ensureAccess();
      await repository.logoutAll();
    }
    else await repository.logout();
  } finally {
    session.clear();
    publish({ status: 'guest', user: null, error: null });
  }
}

export const authenticationProvider = Object.freeze({
  initialize,
  login,
  exchangeOAuth,
  logout,
  getState: () => ({ ...state }),
  subscribe(listener) {
    listeners.add(listener);
    listener({ ...state });
    return () => listeners.delete(listener);
  },
  ensureAccess: () => session.ensureAccess(),
  async withAccess(operation) {
    await session.ensureAccess();
    return operation();
  },
  repository
});
