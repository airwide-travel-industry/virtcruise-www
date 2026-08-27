import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const quotes = await readFile(new URL('../js/admin-quotes.js', import.meta.url), 'utf8');
const repository = await readFile(new URL('../js/admin-quotes-repository.js', import.meta.url), 'utf8');
const bankAccounts = await readFile(new URL('../js/finance/bank-accounts-page.js', import.meta.url), 'utf8');
const transfer = await readFile(new URL('../js/bank-transfer/bank-transfer-page.js', import.meta.url), 'utf8');

test('DRAFT invoice exposes live compatible bank assignment and safe empty state', () => {
  assert.match(quotes, /account\.active && account\.currency === linkedInvoice\.total\.currency/);
  assert.match(quotes, /data-bank-assignment/);
  assert.match(quotes, /No active .* receiving account is configured/);
  assert.match(quotes, /Manage Bank Accounts/);
  assert.match(repository, /assignBankAccount/);
  assert.match(repository, /payment-instructions\/assignment/);
});

test('issued invoice renders immutable staff instructions and customer page uses invoice snapshot', () => {
  assert.match(quotes, /Payment Instructions/);
  assert.match(quotes, /customerReference/);
  assert.match(transfer, /repository\.instructions\(outstanding\.id\)/);
  assert.match(transfer, /Payment destination/);
  assert.match(transfer, /Amount due/);
  assert.match(transfer, /Uploading proof does not mean payment/);
});

test('Finance Bank Accounts UI masks account numbers and supports lifecycle actions', () => {
  assert.match(bankAccounts, /const mask/);
  assert.match(bankAccounts, /Add Bank Account/);
  assert.match(bankAccounts, /Deactivate/);
  assert.match(bankAccounts, /ACTIVE/);
  assert.match(bankAccounts, /INACTIVE/);
});
