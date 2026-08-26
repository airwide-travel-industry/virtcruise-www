import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { startStaticServer } from '../scripts/safe-static-server.mjs';
import { launchChromium } from './helpers/playwright-runtime.mjs';

let browser, server, origin;
const apiOrigin = 'https://api.virtcruisetravels.com';
const user = roles => ({ id: 'staff-1', email: 'staff@test.invalid', givenName: 'Casey', familyName: 'Editor', emailVerified: true, accountType: roles.includes('ROLE_CUSTOMER') ? 'CUSTOMER' : 'STAFF', roles, permissions: [] });

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
    const request = route.request(), url = new URL(request.url());
    requests.push({ method: request.method(), path: url.pathname, authorization: request.headers().authorization });
    const ok = data => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data }) });
    if (url.pathname === '/api/v1/auth/session') return ok({ authenticated: false, refreshable: Boolean(roles) });
    if (url.pathname === '/api/v1/auth/csrf') return ok({ token: 'csrf', headerName: 'X-XSRF-TOKEN' });
    if (url.pathname === '/api/v1/auth/refresh') return ok({ accessToken: 'h.eyJleHAiOjMwMDAwMDAwMDB9.s', accessTokenExpiresAt: '2060-01-01T00:00:00Z', user: user(roles) });
    return route.fulfill({ status: 404, contentType: 'application/problem+json', body: '{"title":"Not found","status":404}' });
  });
  return requests;
}

for (const role of ['ROLE_CONTENT_EDITOR', 'ROLE_CONTENT_APPROVER', 'ROLE_ADMIN']) test(`${role} JWT opens Content Studio`, async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage(); const requests = await mock(page, [role]);
  await page.goto(`${origin}/content-studio/`);
  await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
  assert.equal(await page.getByRole('navigation', { name: 'Content Studio' }).isVisible(), true);
  assert.ok(requests.some(entry => entry.path === '/api/v1/auth/refresh'));
  await context.close();
});

test('customer JWT and anonymous session cannot access the staff application', async () => {
  for (const [roles, heading] of [[['ROLE_CUSTOMER'], 'Access denied'], [null, 'Sign-in required']]) {
    const context = await browser.newContext(); const page = await context.newPage(); await mock(page, roles);
    await page.goto(`${origin}/content-studio/`); await page.getByRole('heading', { name: heading }).waitFor();
    assert.equal(await page.getByRole('navigation', { name: 'Content Studio' }).count(), 0); await context.close();
  }
});

for (const viewport of [{ name: 'desktop', width: 1920, height: 1080 }, { name: 'tablet', width: 1024, height: 768 }, { name: 'mobile', width: 390, height: 844 }]) test(`${viewport.name} studio navigation and modules are responsive and keyboard accessible`, async () => {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' }); const page = await context.newPage(); await mock(page, ['ROLE_CONTENT_EDITOR']);
  await page.goto(`${origin}/content-studio/`); await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
  if (viewport.width <= 760) await page.getByRole('button', { name: /Studio navigation/ }).click();
  await page.getByRole('button', { name: 'Packages', exact: true }).click();
  await page.getByRole('heading', { name: 'Packages' }).waitFor();
  assert.equal(await page.getByLabel('Open package ID').isVisible(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
  await page.getByLabel('Open package ID').focus(); assert.equal(await page.getByLabel('Open package ID').evaluate(node => node === document.activeElement), true);
  await context.close();
});
