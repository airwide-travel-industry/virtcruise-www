import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { startStaticServer } from '../scripts/safe-static-server.mjs';
import { launchChromium } from './helpers/playwright-runtime.mjs';

let browser, server, origin;
const apiOrigin = 'https://api.virtcruisetravels.com';
const makeUser = roles => ({ id: 'staff-1', email: 'staff@test.invalid', givenName: 'Casey', familyName: 'Operator', emailVerified: true, accountType: roles.includes('ROLE_CUSTOMER') ? 'CUSTOMER' : 'STAFF', roles, permissions: roles.includes('ROLE_ADMIN') ? ['QUOTE_READ_ALL'] : [] });

before(async () => {
  server = startStaticServer({ port: 0 });
  await new Promise(resolve => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await launchChromium({ headless: true, args: ['--no-sandbox'] });
});
after(async () => { await browser?.close(); await new Promise(resolve => server?.close(resolve)); });

async function mock(page, roles) {
  const requests = [];
  await page.route(`${apiOrigin}/**`, route => {
    const url = new URL(route.request().url());
    requests.push(url.pathname);
    const ok = data => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data }) });
    if (url.pathname === '/api/v1/auth/session') return ok({ authenticated: false, refreshable: true });
    if (url.pathname === '/api/v1/auth/csrf') return ok({ token: 'csrf', headerName: 'X-XSRF-TOKEN' });
    if (url.pathname === '/api/v1/auth/refresh') return ok({ accessToken: 'h.eyJleHAiOjMwMDAwMDAwMDB9.s', accessTokenExpiresAt: '2060-01-01T00:00:00Z', user: makeUser(roles) });
    return route.fulfill({ status: 404, contentType: 'application/problem+json', body: '{"title":"Not found","status":404}' });
  });
  return requests;
}

test('admin dashboard renders staff modules without customer repository calls', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const requests = await mock(page, ['ROLE_ADMIN']);
  await page.goto(`${origin}/dashboard/`);
  await page.getByRole('heading', { name: 'Administration Dashboard' }).waitFor();
  for (const label of ['Content Studio', 'Customer Quotes', 'Finance Operations', 'Operations']) assert.ok(await page.getByText(label, { exact: true }).count() >= 1);
  assert.equal(requests.some(path => /bookings|trips|travellers|financial/.test(path)), false);
  await context.close();
});

test('customer dashboard retains customer navigation and persona', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await mock(page, ['ROLE_CUSTOMER']);
  await page.goto(`${origin}/dashboard/`);
  await page.getByRole('heading', { name: /Welcome back/ }).waitFor();
  assert.equal(await page.getByRole('link', { name: 'My Quotes', exact: true }).count(), 1);
  assert.equal(await page.getByText('Administration Dashboard', { exact: true }).count(), 0);
  await context.close();
});
