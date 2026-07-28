import { createId, nowIso } from './shared.js';

export function requestsByType(state, serviceType) {
  return (state.serviceRequests || []).filter(request => request.serviceType === serviceType);
}

export function upsertServiceRequest(state, values, requestId = null) {
  const existing = requestId
    ? state.serviceRequests.find(request => request.id === requestId)
    : state.serviceRequests.find(request => request.serviceType === values.serviceType);
  if (existing) {
    Object.assign(existing, values, {
      details: { ...(existing.details || {}), ...(values.details || {}) },
      status: 'SAVED',
      updatedAt: nowIso()
    });
    return existing;
  }
  const request = { id: createId('service'), ...values, status: 'SAVED', createdAt: nowIso() };
  state.serviceRequests.push(request);
  return request;
}

export function removeServiceRequest(state, requestId) {
  state.serviceRequests = state.serviceRequests.filter(request => request.id !== requestId);
  Object.keys(state.itineraryOverrides || {})
    .filter(key => key.startsWith(`${requestId}:`))
    .forEach(key => delete state.itineraryOverrides[key]);
}

export function moveServiceRequest(state, requestId, direction) {
  const index = state.serviceRequests.findIndex(request => request.id === requestId);
  const target = index + Number(direction);
  if (index < 0 || target < 0 || target >= state.serviceRequests.length) return false;
  [state.serviceRequests[index], state.serviceRequests[target]] =
    [state.serviceRequests[target], state.serviceRequests[index]];
  return true;
}
