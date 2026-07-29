let accessToken = null;
let expiresAt = 0;

function decodePayload(token) {
  try {
    const encoded = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
    return encoded ? JSON.parse(atob(encoded)) : null;
  } catch {
    return null;
  }
}

export const tokenManager = Object.freeze({
  set(token, expiry) {
    accessToken = token || null;
    const payloadExpiry = decodePayload(token)?.exp;
    expiresAt = expiry ? Date.parse(expiry) : Number(payloadExpiry || 0) * 1000;
  },
  get() {
    return accessToken;
  },
  isUsable(leewayMs = 30_000) {
    return Boolean(accessToken && expiresAt > Date.now() + leewayMs);
  },
  expiresAt() {
    return expiresAt ? new Date(expiresAt).toISOString() : null;
  },
  clear() {
    accessToken = null;
    expiresAt = 0;
  }
});
