import test from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.get(key) ?? null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
  clear() { this.#values.clear(); }
}

globalThis.sessionStorage = new MemoryStorage();
globalThis.localStorage = new MemoryStorage();

const { createSessionManager } = await import('../js/auth/session-manager.js');
const { tokenManager } = await import('../js/auth/token-manager.js');

function encodedToken(expirySeconds = 3_000_000_000) {
  return `header.${Buffer.from(JSON.stringify({ exp: expirySeconds })).toString('base64url')}.signature`;
}

function response() {
  return {
    accessToken: encodedToken(),
    accessTokenExpiresAt: '2060-01-01T00:00:00.000Z',
    user: {
      id: 'user-1',
      email: 'customer@example.test',
      givenName: 'Customer',
      familyName: 'Test',
      accountType: 'CUSTOMER',
      emailVerified: true
    }
  };
}

test.beforeEach(() => {
  tokenManager.clear();
  sessionStorage.clear();
  localStorage.clear();
});

test('guest discovery establishes guest state without calling refresh', async () => {
  let refreshCalls = 0;
  const manager = createSessionManager({
    discoverSession: async () => ({ authenticated: false, refreshable: false }),
    refresh: async () => {
      refreshCalls += 1;
      return response();
    }
  });

  assert.equal(await manager.bootstrap(), null);
  assert.equal(refreshCalls, 0);
  assert.equal(tokenManager.get(), null);
  assert.equal(sessionStorage.length, undefined);
  assert.equal(localStorage.getItem('virtcruise.auth.session.v1'), null);
});

test('returning session performs one refresh for concurrent bootstrap calls', async () => {
  let discoveryCalls = 0;
  let refreshCalls = 0;
  const manager = createSessionManager({
    discoverSession: async () => {
      discoveryCalls += 1;
      return { authenticated: false, refreshable: true };
    },
    refresh: async () => {
      refreshCalls += 1;
      await new Promise(resolve => setTimeout(resolve, 5));
      return response();
    }
  });

  const [first, second] = await Promise.all([manager.bootstrap(), manager.bootstrap()]);
  assert.equal(first.id, 'user-1');
  assert.equal(second.id, 'user-1');
  assert.equal(discoveryCalls, 1);
  assert.equal(refreshCalls, 1);
  assert.ok(tokenManager.get());
  assert.equal(localStorage.getItem('virtcruise.auth.session.v1'), null);
  const metadata = JSON.parse(sessionStorage.getItem('virtcruise.auth.session.v1'));
  assert.equal(metadata.user.id, 'user-1');
  assert.equal(JSON.stringify(metadata).includes(encodedToken()), false);
});

test('failed restoration clears metadata and does not loop', async () => {
  sessionStorage.setItem('virtcruise.auth.session.v1', '{"user":{"id":"stale"}}');
  let refreshCalls = 0;
  const manager = createSessionManager({
    discoverSession: async () => ({ authenticated: false, refreshable: true }),
    refresh: async () => {
      refreshCalls += 1;
      throw new Error('revoked');
    }
  });

  await assert.rejects(manager.bootstrap(), /revoked/);
  assert.equal(refreshCalls, 1);
  assert.equal(sessionStorage.getItem('virtcruise.auth.session.v1'), null);
  assert.equal(tokenManager.get(), null);
});
