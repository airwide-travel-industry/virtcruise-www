import test from 'node:test';
import assert from 'node:assert/strict';
import { safeRequestPath } from '../scripts/safe-static-server.mjs';

test('local static-server logs omit sensitive query values', () => {
  assert.equal(safeRequestPath('/verify-email/?token=one-time-secret'), '/verify-email/');
  assert.equal(safeRequestPath('/reset-password/?token=one-time-secret'), '/reset-password/');
  assert.equal(safeRequestPath('/auth/callback/?code=provider-code'), '/auth/callback/');
  assert.equal(safeRequestPath('/financial/invoices/details/?id=owned-id'), '/financial/invoices/details/');
});
