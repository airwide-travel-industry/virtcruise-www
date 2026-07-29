import { tokenManager } from './token-manager.js';

const SESSION_KEY = 'virtcruise.auth.session.v1';

function readMetadata() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

function writeMetadata(session) {
  const user = session?.user;
  if (!user) return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    user: {
      id: user.id,
      email: user.email,
      givenName: user.givenName,
      familyName: user.familyName,
      emailVerified: Boolean(user.emailVerified),
      accountType: user.accountType
    },
    authenticatedAt: new Date().toISOString()
  }));
}

export function createSessionManager(repository) {
  let refreshPromise = null;
  let bootstrapPromise = null;

  function accept(session) {
    tokenManager.set(session.accessToken, session.accessTokenExpiresAt);
    writeMetadata(session);
    return session.user;
  }

  function clear() {
    tokenManager.clear();
    sessionStorage.removeItem(SESSION_KEY);
  }

  async function refresh() {
    if (refreshPromise) return refreshPromise;
    refreshPromise = repository.refresh()
      .then(accept)
      .catch(error => {
        clear();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
    return refreshPromise;
  }

  async function bootstrap() {
    if (bootstrapPromise) return bootstrapPromise;
    bootstrapPromise = repository.discoverSession()
      .then(discovery => {
        if (!discovery?.refreshable) {
          clear();
          return null;
        }
        return refresh();
      })
      .catch(error => {
        clear();
        throw error;
      })
      .finally(() => {
        bootstrapPromise = null;
      });
    return bootstrapPromise;
  }

  return Object.freeze({
    accept,
    bootstrap,
    clear,
    refresh,
    metadata: readMetadata,
    accessToken: () => tokenManager.get(),
    ensureAccess: async () => tokenManager.isUsable() ? readMetadata()?.user : refresh()
  });
}
