export function createCustomerRepository({ request, mode }) {
  const unavailableInMock = () => Promise.resolve(null);
  return {
    create(payload) {
      return mode === 'mock'
        ? unavailableInMock()
        : request('/api/v1/customers', { method: 'POST', body: JSON.stringify(payload) });
    },
    get(customerId) {
      return mode === 'mock' ? unavailableInMock() : request(`/api/v1/customers/${encodeURIComponent(customerId)}`);
    },
    lookupByEmail(email) {
      return mode === 'mock'
        ? unavailableInMock()
        : request(`/api/v1/customers/lookup?email=${encodeURIComponent(email)}`);
    },
    update(customerId, payload) {
      return mode === 'mock'
        ? unavailableInMock()
        : request(`/api/v1/customers/${encodeURIComponent(customerId)}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
    },
    remove(customerId) {
      return mode === 'mock'
        ? unavailableInMock()
        : request(`/api/v1/customers/${encodeURIComponent(customerId)}`, { method: 'DELETE' });
    }
  };
}
