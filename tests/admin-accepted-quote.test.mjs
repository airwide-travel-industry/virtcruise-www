import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../js/admin-quotes.js', import.meta.url), 'utf8');

test('staff quote list accepts and counts ACCEPTED records', () => {
  assert.match(source, /statusLabels = \['ALL', 'DRAFT', 'SUBMITTED', 'SENT', 'ACCEPTED'\]/);
  assert.match(source, /status\(item\.status\) === label/);
  assert.match(source, /statusBadge\(quote\.status\)/);
  assert.match(source, /\/api\/v1\/quotes\?page=0&size=100/);
});

test('accepted staff detail renders existing data without preparation actions', () => {
  assert.match(source, /\/api\/v1\/quotes\/\$\{encodeURIComponent\(id\)\}\/details/);
  assert.match(source, /customerName\(customer\)/);
  assert.match(source, /quote\.items/);
  assert.match(source, /quoteGrandTotal\(quote\.items\)/);
  assert.match(source, /\['SUBMITTED', 'SENT'\]\.includes\(status\(quote\.status\)\)/);
});

test('admin runtime contains no obsolete V14 compatibility label', () => {
  assert.doesNotMatch(source, /V14/);
  assert.match(source, /Review and manage customer quotation requests/);
});

test('customer acceptance action is absent for ACCEPTED status', () => {
  const portal = readFileSync(new URL('../js/portal/portal-page.js', import.meta.url), 'utf8');
  assert.match(portal, /String\(quote\.status\)\.toUpperCase\(\) === 'ACCEPTED'/);
  assert.match(portal, /Quote Accepted/);
  assert.match(portal, /String\(quote\.status\)\.toUpperCase\(\) === 'SENT'/);
});
