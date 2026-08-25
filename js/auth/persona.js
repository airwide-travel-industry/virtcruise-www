export function isAdminOrStaff(user) {
  const roles = new Set(Array.isArray(user?.roles) ? user.roles : []);
  return roles.has('ROLE_ADMIN') || user?.accountType === 'STAFF';
}

export function isCustomerPersona(user) {
  const roles = new Set(Array.isArray(user?.roles) ? user.roles : []);
  return user?.accountType === 'CUSTOMER' && roles.has('ROLE_CUSTOMER') && !isAdminOrStaff(user);
}
