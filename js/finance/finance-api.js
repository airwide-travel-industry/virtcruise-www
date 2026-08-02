import { authRuntime } from '../auth/config.js';
import { authenticationProvider } from '../auth/authentication-provider.js';
import { tokenManager } from '../auth/token-manager.js';

const SAFE = Object.freeze({
  400: 'Review the information supplied and try again.',
  401: 'Your session has expired. Sign in again.',
  403: 'You are not authorized to perform this Finance operation.',
  404: 'This review case or proof is no longer available.',
  409: 'Another operator changed this case, or the request conflicts with an earlier operation.',
  422: 'This action is not allowed in the case’s current state.',
  500: 'Finance Operations is temporarily unavailable.'
});

export class FinanceApiError extends Error {
  constructor(message, { status = 0, title = '', requestId = '', retryable = false, ambiguous = false } = {}) {
    super(message); this.name = 'FinanceApiError'; this.status = status; this.title = title;
    this.requestId = requestId; this.retryable = retryable; this.ambiguous = ambiguous;
  }
}

const safeMessage = status => status >= 500 ? SAFE[500] : (SAFE[status] || 'The Finance operation could not be completed safely.');

export async function financeRequest(path, { method = 'GET', body, signal, idempotencyKey, responseType = 'json' } = {}) {
  const mutation = !['GET', 'HEAD'].includes(method);
  const execute = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const requestId = crypto.randomUUID();
    const relay = () => controller.abort(signal?.reason);
    signal?.addEventListener('abort', relay, { once: true });
    try {
      const csrf = mutation ? await authenticationProvider.repository.getCsrf() : null;
      const response = await fetch(`${authRuntime.apiBaseUrl}${path}`, {
        method, credentials: 'include', signal: controller.signal,
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: {
          Accept: responseType === 'blob' ? 'application/pdf,image/jpeg,image/png' : 'application/json',
          'X-Request-Id': requestId,
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(tokenManager.get() ? { Authorization: `Bearer ${tokenManager.get()}` } : {}),
          ...(csrf ? { [csrf.headerName || 'X-XSRF-TOKEN']: csrf.token } : {}),
          ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {})
        }
      });
      if (!response.ok) {
        const problem = await response.json().catch(() => null);
        throw new FinanceApiError(safeMessage(response.status), {
          status: response.status, title: typeof problem?.title === 'string' ? problem.title : '',
          requestId: response.headers.get('X-Request-Id') || requestId, retryable: response.status >= 500
        });
      }
      if (responseType === 'blob') return { blob: await response.blob(), headers: response.headers };
      if (response.status === 204) return null;
      const value = await response.json();
      return value?.data;
    } catch (error) {
      if (error instanceof FinanceApiError) throw error;
      const abortedByCaller = signal?.aborted;
      throw new FinanceApiError(abortedByCaller ? 'The request was cancelled.' : 'The server response is unknown. Refresh the case before trying this action again.', {
        requestId, retryable: !mutation, ambiguous: mutation && !abortedByCaller
      });
    } finally {
      clearTimeout(timeout); signal?.removeEventListener('abort', relay);
    }
  };
  return authenticationProvider.withAccess(execute);
}
