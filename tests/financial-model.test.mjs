import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mapAccount, mapDeposit, mapInvoice, mapMoney, mapPage, mapPayment, mapReceipt, mapRefund
} from '../js/financial/financial-model.js';
import {
  account, completedPayment, completedRefund, deposits, failedPayment, invoices, payments,
  receipts, refunds, reversedPayment, page
} from './fixtures/financial-api.mjs';

test('financial response mappers preserve exact amount text and currency', () => {
  assert.deepEqual(mapMoney({ amount: '123456789012345.6700', currency: 'ZAR' }), {
    amount: '123456789012345.6700',
    currency: 'ZAR'
  });
  assert.equal(mapAccount(account).outstanding.amount, '3000');
  assert.equal(mapInvoice(invoices[0]).allocated.currency, 'ZAR');
  assert.equal(mapPayment(payments[0]).status, 'PARTIALLY_ALLOCATED');
  assert.equal(mapReceipt(receipts[0]).number, 'REC-2026-000001');
  assert.equal(mapRefund(refunds[0]).reason, 'Customer requested cancellation');
  assert.equal(mapDeposit(deposits[0]).dueDate, '2026-09-01');
});

test('pagination maps actual backend metadata without client invention', () => {
  const result = mapPage(page(invoices), mapInvoice);
  assert.equal(result.totalElements, 2);
  assert.equal(result.items[1].total.currency, 'USD');
  assert.equal(result.first, true);
  assert.equal(result.last, true);
});

test('mapping rejects unsupported currency and mixed aggregate currencies', () => {
  assert.throws(() => mapMoney({ amount: 1, currency: 'BTC' }), /unsupported/i);
  assert.throws(() => mapInvoice({
    ...invoices[0],
    outstanding: { amount: 3, currency: 'USD' }
  }), /mixed currencies/i);
});

test('fixtures cover empty and paginated customer histories', () => {
  assert.deepEqual(page([]), {
    content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, first: true, last: true
  });
  const paginated = { ...page(invoices.slice(0, 1)), totalElements: 21, totalPages: 3, last: false };
  assert.equal(mapPage(paginated, mapInvoice).totalPages, 3);
  assert.equal(mapPayment(completedPayment).status, 'ALLOCATED');
  assert.equal(mapPayment(failedPayment).status, 'FAILED');
  assert.equal(mapPayment(reversedPayment).status, 'REVERSED');
  assert.equal(mapRefund(completedRefund).status, 'COMPLETED');
});
