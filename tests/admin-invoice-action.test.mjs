import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { canCreateInvoice } from '../js/admin-invoice-eligibility.js';
import { createAdminQuotesRepository } from '../js/admin-quotes-repository.js';

const admin = { accountType: 'STAFF', roles: ['ROLE_ADMIN'] };
const staff = { accountType: 'STAFF', roles: ['ROLE_FINANCE'] };
const customer = { accountType: 'CUSTOMER', roles: ['ROLE_CUSTOMER'] };
const accepted = { status: 'ACCEPTED' };

test('accepted quote without invoice exposes Create Invoice eligibility to admin', () => {
  assert.equal(canCreateInvoice(accepted, admin), true);
});

test('accepted quote with invoice hides Create Invoice', () => {
  assert.equal(canCreateInvoice(accepted, admin, { id: 'invoice-1', status: 'DRAFT' }), false);
});

for (const status of ['SENT', 'SUBMITTED']) {
  test(`${status} quote hides Create Invoice`, () => assert.equal(canCreateInvoice({ status }, admin), false));
}

test('customer and non-admin staff cannot create invoices', () => {
  assert.equal(canCreateInvoice(accepted, customer), false);
  assert.equal(canCreateInvoice(accepted, staff), false);
});

test('admin repository uses the existing conversion endpoint and friendly error path', () => {
  const calls = [];
  const repository = createAdminQuotesRepository({ request: (path, options) => { calls.push({ path, options }); return Promise.resolve({}); } });
  repository.createInvoice('quote/1');
  assert.deepEqual(calls, [{ path: '/api/v1/admin/quotes/quote%2F1/invoice', options: { method: 'POST' } }]);
  const source = readFileSync(new URL('../js/admin-quotes.js', import.meta.url), 'utf8');
  assert.match(source, /canCreateInvoice\(quote, currentUser\)/);
  assert.match(source, /adminQuotes\.createInvoice\(id\)/);
  assert.match(source, /errorText\(error\)/);
});

test('success refreshes detail and renders linked DRAFT invoice without automatic issue', () => {
  const source = readFileSync(new URL('../js/admin-quotes.js', import.meta.url), 'utf8');
  assert.match(source, /await loadDetail\(id\)/);
  assert.match(source, /statusBadge\(linkedInvoice\.status\)/);
  assert.match(source, /View Invoice/);
  assert.match(source, /linkedInvoice\.status === 'DRAFT'/);
});

test('confirmation names the quote, customer, total, and DRAFT outcome', () => {
  const source = readFileSync(new URL('../js/admin-quotes.js', import.meta.url), 'utf8');
  assert.match(source, /Create Invoice\\n\\nQuote:/);
  assert.match(source, /Customer: \$\{customerName\(quote\.customer\)\}/);
  assert.match(source, /This will create a DRAFT invoice/);
});
