import test from 'node:test';
import assert from 'node:assert/strict';
import { safeRequestPath, startStaticServer } from '../scripts/safe-static-server.mjs';

test('local static-server logs omit sensitive query values', () => {
  assert.equal(safeRequestPath('/verify-email/?token=one-time-secret'), '/verify-email/');
  assert.equal(safeRequestPath('/reset-password/?token=one-time-secret'), '/reset-password/');
  assert.equal(safeRequestPath('/auth/callback/?code=provider-code'), '/auth/callback/');
  assert.equal(safeRequestPath('/financial/invoices/details/?id=owned-id'), '/financial/invoices/details/');
});

test('local static server supports isolated ephemeral ports and deterministic cache policy', async () => {
  const server = startStaticServer({ port: 0 });
  await new Promise(resolve => server.listening ? resolve() : server.once('listening', resolve));
  assert.ok(server.address().port > 0);
  const response = await fetch(`http://127.0.0.1:${server.address().port}/images/favicon.png`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/png');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  await new Promise(resolve => server.close(resolve));
});
