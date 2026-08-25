import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isAdminOrStaff, isCustomerPersona } from '../js/auth/persona.js';

test('persona boundary never treats generic authentication as customer identity', () => {
  assert.equal(isAdminOrStaff({ accountType: 'STAFF', roles: ['ROLE_ADMIN'] }), true);
  assert.equal(isAdminOrStaff({ accountType: 'STAFF', roles: ['ROLE_FINANCE'] }), true);
  assert.equal(isCustomerPersona({ accountType: 'STAFF', roles: ['ROLE_ADMIN', 'ROLE_CUSTOMER'] }), false);
  assert.equal(isCustomerPersona({ accountType: 'CUSTOMER', roles: ['ROLE_CUSTOMER'] }), true);
  assert.equal(isCustomerPersona({ accountType: 'CUSTOMER', roles: [] }), false);
  assert.equal(isCustomerPersona({ roles: ['ROLE_CUSTOMER'] }), false);
});

test('staff workspace uses live v0.8 routes and no demo preview data', async () => {
  const [navigation, shell, dashboard, quotes] = await Promise.all([
    readFile('js/navigation.js', 'utf8'),
    readFile('js/portal/portal-components.js', 'utf8'),
    readFile('js/portal/portal-page.js', 'utf8'),
    readFile('js/admin-quotes.js', 'utf8')
  ]);
  const source = `${navigation}\n${shell}\n${dashboard}\n${quotes}`;
  for (const route of ['/content-studio/', '/admin/quotes/', '/finance/', '/operational-readiness/']) assert.match(source, new RegExp(route.replaceAll('/', '\\/')));
  assert.match(quotes, /\/api\/v1\/quotes\?page=0&size=100/);
  assert.match(quotes, /\/api\/v1\/quotes\/\$\{encodeURIComponent\(id\)\}\/details/);
  assert.doesNotMatch(source, /operations-preview|PREVIEW — v0\.8|LIVE · V14|assignments:\s*12/);
  assert.match(dashboard, /isAdminOrStaff\(user\)/);
});
