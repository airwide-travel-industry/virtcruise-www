import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { launchChromium } from './helpers/playwright-runtime.mjs';
import { startStaticServer } from '../scripts/safe-static-server.mjs';

const apiOrigin = 'https://api.virtcruise.airwide.co.uk';
const artifactRoot = resolve('dist/virtcruise-www-0.8.0-beta.2');
let browser;
let server;
let origin;

before(async () => {
  server = startStaticServer({ root: artifactRoot, port: 0 });
  await new Promise(resolvePromise => server.once('listening', resolvePromise));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await launchChromium({ headless: true, args: ['--no-sandbox'] });
});

after(async () => {
  await browser?.close();
  await new Promise(resolvePromise => server?.close(resolvePromise));
});

async function openAdminQuotes({ listStatus = 200 } = {}) {
  const page = await browser.newPage();
  const pageErrors = [];
  const calls = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route(`${apiOrigin}/**`, route => {
    const request = route.request();
    const url = new URL(request.url());
    calls.push(`${request.method()} ${url.pathname}`);
    const json = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ success: status < 400, data }) });
    if (url.pathname === '/api/v1/auth/session') return json({ authenticated: false, refreshable: true });
    if (url.pathname === '/api/v1/auth/csrf') return json({ token: 'test-csrf', headerName: 'X-XSRF-TOKEN' });
    if (url.pathname === '/api/v1/auth/refresh') return json({ accessToken: 'header.eyJleHAiOjQxMDI0NDQ4MDB9.signature', accessTokenExpiresAt: '2099-01-01T00:00:00Z', user: { id: 'admin-1', email: 'admin@test', givenName: 'Admin', familyName: 'Operator', emailVerified: true, accountType: 'STAFF', roles: ['ROLE_ADMIN'], permissions: [] } });
    if (url.pathname === '/api/v1/quotes') return json({ content: [{ id: 'quote-1', quoteNumber: 'VC-TEST-1', status: 'ACCEPTED', customerDisplayName: 'Test Customer', createdAt: '2026-08-27T00:00:00Z' }] }, listStatus);
    if (url.pathname === '/api/v1/quotes/quote-1/details') return json({ id: 'quote-1', quoteNumber: 'VC-TEST-1', status: 'ACCEPTED', customer: { firstName: 'Test', lastName: 'Customer' }, items: [], estimatedValue: 1230, currency: 'USD' });
    return json({}, 404);
  });
  await page.goto(`${origin}/admin/quotes/`, { waitUntil: 'domcontentloaded' });
  return { page, calls, pageErrors };
}

test('admin quote list resolves, clears loading, and renders accepted customer quote', async () => {
  const { page, calls, pageErrors } = await openAdminQuotes();
  await page.getByRole('heading', { name: 'Customer Quotes' }).waitFor();
  assert.ok(await page.getByText('VC-TEST-1').count() >= 1);
  assert.ok(await page.getByText('Test Customer').count() >= 1);
  assert.ok(await page.getByText('ACCEPTED').count() >= 1);
  assert.equal(await page.locator('[aria-busy="true"]').count(), 0);
  assert.ok(calls.includes('GET /api/v1/quotes'));
  assert.deepEqual(pageErrors, []);
  await page.close();
});

test('admin quote list renders an explicit error instead of infinite loading', async () => {
  const { page, calls, pageErrors } = await openAdminQuotes({ listStatus: 500 });
  await page.getByRole('alert').waitFor();
  assert.match(await page.getByRole('alert').innerText(), /could not be loaded/i);
  assert.equal(await page.locator('text=Loading Customer Quotes…').count(), 0);
  assert.ok(calls.includes('GET /api/v1/quotes'));
  assert.deepEqual(pageErrors, []);
  await page.close();
});
