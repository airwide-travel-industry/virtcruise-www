import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { resolve } from 'node:path';
import { launchChromium } from './helpers/playwright-runtime.mjs';
import { startStaticServer } from '../scripts/safe-static-server.mjs';

const apiOrigin = 'https://api.virtcruise.airwide.co.uk';
const artifactRoot = resolve('dist/virtcruise-www-0.8.0-beta.1');
const packages = ['Zimbabwe Safari', 'European City Break', 'Tropical Paradise'].map((title, index) => ({
  id: `published-${index + 1}`, code: `PKG-${index + 1}`,
  slug: title.toLowerCase().replaceAll(' ', '-'), packageType: 'HOLIDAY_PACKAGE', title,
  summary: `Published summary for ${title}`, description: `Published description for ${title}`,
  destination: ['Zimbabwe', 'Europe', 'Zanzibar'][index], durationDays: 7, featured: true,
  highlights: [], seo: {}, callToAction: {}, pricing: [], media: [],
  effectiveFrom: '2026-08-01T00:00:00Z', effectiveUntil: null
}));
let browser;
let origin;
let server;

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

async function intercept(page) {
  const destinations = [];
  await page.route(`${apiOrigin}/**`, route => {
    const url = new URL(route.request().url());
    destinations.push(url.origin);
    if (url.pathname === '/api/v1/catalogue/packages/featured') {
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: packages }) });
    }
    if (url.pathname === '/api/v1/catalogue/packages') {
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: {
        content: packages, page: 0, size: 12, totalElements: 3, totalPages: 1,
        hasNext: false, hasPrevious: false
      } }) });
    }
    if (url.pathname === '/api/v1/auth/csrf') {
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true,
        data: { token: 'browser-acceptance-csrf', headerName: 'X-XSRF-TOKEN' } }) });
    }
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true,
      data: { authenticated: false, refreshable: false } }) });
  });
  return destinations;
}

for (const viewport of [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
]) test(`${viewport.name} production-beta artifact is responsive and production-only`, async () => {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()}`));
  const destinations = await intercept(page);

  await page.goto(origin, { waitUntil: 'load' });
  await page.waitForFunction(() => document.documentElement.dataset.catalogueReady === 'complete');
  assert.equal(await page.locator('#featuredToursGrid .tour-card').count(), 3);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);

  await page.goto(`${origin}/signin/`, { waitUntil: 'load' });
  assert.equal(await page.locator('input[type="password"]').count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);

  await page.goto(`${origin}/content-studio/`, { waitUntil: 'load' });
  await page.getByRole('heading', { name: 'Sign-in required' }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);

  await page.goto(`${origin}/operational-readiness/`, { waitUntil: 'load' });
  await page.getByRole('heading', { name: 'Sign-in required' }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);

  assert.ok(destinations.length > 0);
  assert.deepEqual([...new Set(destinations)], [apiOrigin]);
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(failedRequests, []);
  await page.close();
});
