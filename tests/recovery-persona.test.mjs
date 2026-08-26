import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isAdminOrStaff, isCustomerPersona } from '../js/auth/persona.js';

test('persona boundary separates staff and customer identities', () => {
  assert.equal(isAdminOrStaff({ accountType: 'STAFF', roles: ['ROLE_ADMIN'] }), true);
  assert.equal(isAdminOrStaff({ accountType: 'STAFF', roles: ['ROLE_FINANCE'] }), true);
  assert.equal(isCustomerPersona({ accountType: 'STAFF', roles: ['ROLE_ADMIN', 'ROLE_CUSTOMER'] }), false);
  assert.equal(isCustomerPersona({ accountType: 'CUSTOMER', roles: ['ROLE_CUSTOMER'] }), true);
  assert.equal(isCustomerPersona({ roles: ['ROLE_CUSTOMER'] }), false);
});

test('staff surfaces retain V20 routes without demo preview code', async () => {
  const files = await Promise.all([
    readFile('js/navigation.js', 'utf8'), readFile('js/portal/portal-components.js', 'utf8'),
    readFile('js/portal/portal-page.js', 'utf8'), readFile('js/admin-quotes.js', 'utf8')
  ]);
  const source = files.join('\n');
  for (const route of ['/content-studio/', '/admin/quotes/', '/finance/', '/operational-readiness/']) {
    assert.match(source, new RegExp(route.replaceAll('/', '\\/')));
  }
  assert.match(source, /isAdminOrStaff\(user\)/);
  assert.match(source, /Create Invoice/);
  assert.doesNotMatch(source, /operations-preview|PREVIEW — v0\.8|LIVE · V14/);
});
