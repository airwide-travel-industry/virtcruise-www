import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const admin = readFileSync(new URL('../js/admin-quotes.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/admin-quotes.css', import.meta.url), 'utf8');

test('accepted staff quote exposes authoritative commercial summary', () => {
  assert.match(admin, /status\(quote\.status\) !== 'ACCEPTED'/);
  assert.match(admin, /Commercial Summary/);
  assert.match(admin, /quote\.estimatedValue/);
  assert.match(admin, /item\.lineTotal/);
  assert.match(admin, /Taxes, fees and discounts are not represented/);
});

test('accepted commercial summary keeps invoice conversion out until V20 support exists', () => {
  assert.doesNotMatch(admin, /Create Invoice/);
  assert.doesNotMatch(admin, /financial\/invoices.*POST/);
  assert.match(css, /admin-commercial-summary/);
});
