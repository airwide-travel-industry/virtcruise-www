import test from 'node:test';
import assert from 'node:assert/strict';
import { finiteAmount, formatQuoteAmount, quoteGrandTotal, quoteLineTotal } from '../js/quote-total.js';

test('quote line totals calculate from quantity and unit price', () => {
  assert.equal(quoteLineTotal(1, 980), 980);
  assert.equal(quoteLineTotal(1, 250), 250);
  assert.equal(formatQuoteAmount(quoteLineTotal(1, 980)), '980.00');
});

test('grand total sums multiple priced items', () => {
  assert.equal(quoteGrandTotal([{ quantity: 1, unitPrice: 980 }, { quantity: 1, unitPrice: 250 }]), 1230);
});

test('quantity and unit price changes affect line and grand totals', () => {
  assert.equal(quoteLineTotal(2, 980), 1960);
  assert.equal(quoteGrandTotal([{ quantity: 1, unitPrice: 980 }, { quantity: 1, unitPrice: 300 }]), 1280);
});

test('zero, blank, invalid and persisted values are safe', () => {
  assert.equal(quoteLineTotal(0, 980), 0);
  assert.equal(quoteLineTotal('', 980), 0);
  assert.equal(quoteLineTotal(1, 'not-a-number'), 0);
  assert.equal(finiteAmount(Number.NaN), 0);
  assert.equal(quoteGrandTotal([{ quantity: 2, unitPrice: 400 }, { quantity: 1, unitPrice: 50 }]), 850);
});
