import { authRuntime } from '../auth/config.js';
import { authenticationProvider } from '../auth/authentication-provider.js';
import { tokenManager } from '../auth/token-manager.js';
import { financialRequest } from '../financial/financial-api-client.js';

const reviewPath = '/api/v1/bank-transfer/reviews';

async function uploadRequest(path, file, key) {
  return authenticationProvider.withAccess(async () => {
    const csrf = await authenticationProvider.repository.getCsrf();
    const form = new FormData();
    form.append('file', file, file.name);
    const response = await fetch(`${authRuntime.apiBaseUrl}${path}`, {
      method: 'POST', body: form, credentials: 'include',
      headers: {
        Accept: 'application/json', 'Idempotency-Key': key,
        ...(tokenManager.get() ? { Authorization: `Bearer ${tokenManager.get()}` } : {}),
        ...(csrf ? { [csrf.headerName || 'X-XSRF-TOKEN']: csrf.token } : {})
      }
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || body?.success === false) {
      const error = new Error(response.status === 413 ? 'That file is too large.' : 'Proof upload could not be completed. Please check the file and try again.');
      error.status = response.status;
      throw error;
    }
    return body?.data ?? body;
  });
}

export function createBankTransferRepository() {
  return Object.freeze({
    instructions: () => financialRequest(`${reviewPath}/instructions`),
    reviews: () => financialRequest(`${reviewPath}?page=0&size=100&sort=createdAt&direction=desc`),
    review: id => financialRequest(`${reviewPath}/${encodeURIComponent(id)}`),
    create: value => financialRequest(reviewPath, { method: 'POST', body: value, idempotencyKey: crypto.randomUUID() }),
    proofs: id => financialRequest(`${reviewPath}/${encodeURIComponent(id)}/proofs`),
    upload: (id, file) => uploadRequest(`${reviewPath}/${encodeURIComponent(id)}/proofs`, file, crypto.randomUUID()),
    invoices: () => financialRequest('/api/v1/financial/invoices?page=0&size=100'),
    bookings: () => financialRequest('/api/v1/bookings?page=0&size=100'),
    payments: () => financialRequest('/api/v1/financial/payments?page=0&size=100'),
    receipts: () => financialRequest('/api/v1/financial/receipts?page=0&size=100'),
    async booking(id) {
      const value = await financialRequest(`/api/v1/bookings/${encodeURIComponent(id)}`);
      return value?.booking || value;
    }
  });
}
