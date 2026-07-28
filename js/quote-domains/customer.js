export const defaultCustomer = () => ({
  fullName: '',
  email: '',
  mobile: '',
  preferredContactMethod: 'WHATSAPP'
});

export function normaliseCustomer(customer = {}) {
  return { ...defaultCustomer(), ...customer };
}

export function updateCustomer(state, values = {}) {
  state.customer = { ...normaliseCustomer(state.customer), ...values };
  return state.customer;
}
