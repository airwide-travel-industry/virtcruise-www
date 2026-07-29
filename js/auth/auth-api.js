import { authRuntime } from './config.js';
import { tokenManager } from './token-manager.js';

const SAFE_MESSAGES = {
  INVALID_CREDENTIALS: 'The email address or password is incorrect.',
  EMAIL_VERIFICATION_REQUIRED: 'Please verify your email before signing in.',
  INVALID_TOKEN: 'This link is invalid, expired or has already been used.',
  INVALID_REFRESH_TOKEN: 'Your session has expired. Please sign in again.',
  FRESH_AUTHENTICATION_REQUIRED: 'Please sign in again before changing security settings.',
  OAUTH_PROVIDER_UNAVAILABLE: 'This sign-in provider is temporarily unavailable.',
  CONFLICT: 'That request conflicts with an existing account.',
  VALIDATION_FAILED: 'Please review the highlighted information.',
  RATE_LIMIT_EXCEEDED: 'Too many attempts. Please wait a moment and try again.'
};

export class AuthError extends Error {
  constructor(message, { status = 0, code = 'AUTH_REQUEST_FAILED', violations = [], requestId = '' } = {}) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.code = code;
    this.violations = violations;
    this.requestId = requestId;
  }
}

function friendlyError(status, error) {
  if (SAFE_MESSAGES[error?.code]) return SAFE_MESSAGES[error.code];
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to complete this action.';
  if (status === 409) return 'This account request conflicts with existing information.';
  if (status === 422 || status === 400) return 'Please review the highlighted information.';
  if (status >= 500) return 'Virtcruise is temporarily unavailable. Please try again shortly.';
  return 'We could not complete that request. Please try again.';
}

export async function authRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15_000);
  const requestId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  try {
    const response = await fetch(`${authRuntime.apiBaseUrl}${path}`, {
      ...options,
      credentials: 'include',
      signal: options.signal || controller.signal,
      headers: {
        Accept: 'application/json',
        'X-Request-Id': requestId,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.auth !== false && tokenManager.get()
          ? { Authorization: `Bearer ${tokenManager.get()}` }
          : {}),
        ...options.headers
      }
    });
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok || body?.success === false) {
      const error = body?.error || {};
      throw new AuthError(friendlyError(response.status, error), {
        status: response.status,
        code: error.code || `HTTP_${response.status}`,
        violations: error.violations || [],
        requestId: response.headers.get('X-Request-Id') || requestId
      });
    }
    return body?.data ?? body;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    const timeoutError = error?.name === 'AbortError';
    throw new AuthError(
      timeoutError
        ? 'The request timed out. Please try again.'
        : 'We could not reach Virtcruise. Check your connection and try again.',
      { code: timeoutError ? 'TIMEOUT' : 'NETWORK_UNAVAILABLE', requestId }
    );
  } finally {
    window.clearTimeout(timeout);
  }
}
