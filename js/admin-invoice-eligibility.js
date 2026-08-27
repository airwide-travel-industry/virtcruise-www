export function canCreateInvoice(quote, user, linkedInvoice = null) {
  const accepted = String(quote?.status || '').toUpperCase() === 'ACCEPTED';
  const administrator = Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN');
  return accepted && administrator && !linkedInvoice;
}
