import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync('staff/index.html', 'utf8');
const staff = fs.readFileSync('js/admin-staff.js', 'utf8');
const shell = fs.readFileSync('js/portal/portal-components.js', 'utf8');
const quotes = fs.readFileSync('js/admin-quotes.js', 'utf8');

test('administrator staff workspace exposes invitation lifecycle without password fields', () => {
  assert.match(page, /js\/admin-staff\.js/);
  assert.match(staff, /\/api\/v1\/admin\/users\/staff/);
  assert.match(staff, /invitation\/resend/);
  assert.match(staff, /invitation\/revoke/);
  assert.doesNotMatch(staff, /temporaryPassword|password/);
  assert.match(shell, /roles\.has\('ROLE_ADMIN'\).*\/staff\//s);
});

test('admin quote detail exposes consultant assignment through the protected API', () => {
  assert.match(quotes, /\/api\/v1\/admin\/users\/staff/);
  assert.match(quotes, /\/assignment/);
  assert.match(quotes, /QUOTE_ASSIGN|ROLE_ADMIN/);
});
