import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const components = await readFile(new URL('../js/finance/finance-components.js', import.meta.url), 'utf8');
const page = await readFile(new URL('../js/financial/financial-page.js', import.meta.url), 'utf8');
const repository = await readFile(new URL('../js/financial/financial-repository.js', import.meta.url), 'utf8');

test('Finance Operations exposes the existing authoritative invoice workspace', () => {
  assert.match(components, /\['invoices','\/financial\/invoices\/','Invoices'\]/);
  assert.match(page, /Finance Operations/);
  assert.match(page, /Source Quote/);
  assert.match(page, /Outstanding Balance/);
});

test('ISSUED invoice recovery is guarded, filtered, confirmed, and reloaded', () => {
  assert.match(repository, /payment-instructions/);
  assert.match(page, /account\.active && String\(account\.currency\)\.toUpperCase\(\) === invoice\.total\.currency/);
  assert.match(page, /invoice\.status === 'ISSUED'/);
  assert.match(page, /confirmAction\(/);
  assert.match(page, /repository\.clear\(\); await renderFinanceInvoiceDetails\(\)/);
  assert.match(page, /Issue Payment Instructions/);
});

test('Finance invoice recovery never appears in the customer shell', () => {
  assert.match(page, /financeMode = hasFinanceAccess\(user\)/);
  assert.match(page, /root\.innerHTML = financeShell\(user, 'invoices'\)/);
  assert.match(page, /portalShell\(user/);
});
