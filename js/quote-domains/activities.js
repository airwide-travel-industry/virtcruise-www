import { requestsByType } from './service-requests.js';
import { createId, nowIso } from './shared.js';
export const activityRequests = state => requestsByType(state, 'CUSTOM_ACTIVITY');

export function addCustomActivity(state, details) {
  const request = {
    id: createId('custom'),
    serviceType: 'CUSTOM_ACTIVITY',
    serviceSlug: '',
    serviceTitle: 'Custom Activity',
    status: 'SAVED',
    details,
    createdAt: nowIso()
  };
  state.serviceRequests.push(request);
  return request;
}
