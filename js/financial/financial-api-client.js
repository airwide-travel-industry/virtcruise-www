import { authRuntime } from '../auth/config.js';
import { authenticationProvider } from '../auth/authentication-provider.js';
import { tokenManager } from '../auth/token-manager.js';

const SAFE_MESSAGES = {
  400: 'Please review the request and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to view this financial information.',
  404: 'We could not find that financial item.',
  409: 'This financial request conflicts with a recent change.',
  422: 'This financial request cannot be completed in its current state.',
  500: 'Financial information is temporarily unavailable. Please try again shortly.'
};

export class FinancialApiError extends Error {
  constructor(message, { status = 0, title = '', requestId = '', retryable = false } = {}) {
    super(message);
    this.name = 'FinancialApiError';
    this.status = status;
    this.title = title;
    this.requestId = requestId;
    this.retryable = retryable;
  }
}

function safeMessage(status) {
  if (status >= 500) return SAFE_MESSAGES[500];
  return SAFE_MESSAGES[status] || 'We could not load your financial information.';
}

export async function financialRequest(path, {
  method = 'GET', body, headers = {}, signal, idempotencyKey
} = {}) {
  const operation = async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    const requestId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    try {
      const csrf = method === 'GET' || method === 'HEAD'
        ? null
        : await authenticationProvider.repository.getCsrf();
      const response = await fetch(`${authRuntime.apiBaseUrl}${path}`, {
        method,
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: 'include',
        signal: signal || controller.signal,
        headers: {
          Accept: 'application/json',
          'X-Request-Id': requestId,
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(tokenManager.get() ? { Authorization: `Bearer ${tokenManager.get()}` } : {}),
          ...(csrf ? { [csrf.headerName || 'X-XSRF-TOKEN']: csrf.token } : {}),
          ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
          ...headers
        }
      });
      const value = response.status === 204 ? null : await response.json().catch(() => null);
      if (!response.ok || value?.success === false) {
        throw new FinancialApiError(safeMessage(response.status), {
          status: response.status,
          title: typeof value?.title === 'string' ? value.title : '',
          requestId: response.headers.get('X-Request-Id') || requestId,
          retryable: response.status >= 500
        });
      }
      return value?.data ?? value;
    } catch (error) {
      if (error instanceof FinancialApiError) throw error;
      const timedOut = error?.name === 'AbortError';
      throw new FinancialApiError(
        timedOut
          ? 'The financial request timed out. Please try again.'
          : 'We could not reach Virtcruise. Check your connection and try again.',
        { requestId, retryable: true }
      );
    } finally {
      window.clearTimeout(timeout);
    }
  };
  return authenticationProvider.withAccess(operation);
}
