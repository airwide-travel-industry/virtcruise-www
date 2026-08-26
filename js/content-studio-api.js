import { apiRequest } from './api-client.js';

const base = '/api/v1/content/packages';
const headers = key => ({ 'X-Correlation-ID': crypto.randomUUID(), ...(key ? { 'Idempotency-Key': key } : {}) });
const request = (path, method = 'GET', body, key) => apiRequest(`${base}${path}`, {
  method, ...(body === undefined ? {} : { body: JSON.stringify(body) }), headers: headers(key)
});

export const contentStudioApi = Object.freeze({
  create: body => request('', 'POST', body),
  package: id => request(`/${id}`),
  history: id => request(`/${id}/versions`),
  version: (packageId, versionId) => request(`/${packageId}/versions/${versionId}`),
  derive: (packageId, sourceVersionId) => request(`/${packageId}/versions?sourceVersionId=${encodeURIComponent(sourceVersionId)}`, 'POST'),
  edit: (packageId, versionId, body) => request(`/${packageId}/versions/${versionId}`, 'PUT', body),
  transition: (packageId, versionId, action, body) => request(`/${packageId}/versions/${versionId}/${action}`, 'POST', body, ['schedule', 'publish'].includes(action) ? `content-${action}-${crypto.randomUUID()}` : undefined),
  pricing: (packageId, versionId, body) => request(`/${packageId}/versions/${versionId}/pricing`, 'POST', body),
  media: (packageId, versionId, body) => request(`/${packageId}/versions/${versionId}/media`, 'POST', body),
  audit: packageId => request(`/${packageId}/audit`)
});
