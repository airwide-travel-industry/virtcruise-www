import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { startStaticServer } from '../scripts/safe-static-server.mjs';
import {
  enforceOfflineAcceptance, navigateToReadyPage, waitForApplicationReady, waitForGuestReady
} from './helpers/browser-acceptance.mjs';

let browser;
let server;
let baseUrl;

before(async () => {
  server = startStaticServer({ port: 0 });
  await new Promise(resolve => server.listening ? resolve() : server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox']
  });
});

after(async () => {
  await browser?.close();
  await new Promise(resolve => server?.close(resolve));
});

test('mandatory public routes render with loopback-only network access', async () => {
  const context = await browser.newContext();
  const network = await enforceOfflineAcceptance(context, {
    allowedOrigins: [baseUrl, 'https://api.virtcruise.airwide.co.uk']
  });
  const page = await context.newPage();
  await page.route('https://api.virtcruise.airwide.co.uk/**', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ success: true, data: { authenticated: false, refreshable: false } })
  }));

  await navigateToReadyPage(page, `${baseUrl}/`, { ready: waitForGuestReady });
  for (const route of ['/signin/', '/register/', '/packages/victoria-falls-escape.html']) {
    await navigateToReadyPage(page, `${baseUrl}${route}`, { ready: waitForApplicationReady });
  }

  network.assertClean();
  assert.equal(network.violations.some(item => item.resource.includes('fonts.googleapis.com')), false);
  await context.close();
});

test('unexpected public requests are blocked with query-safe diagnostics', async () => {
  const context = await browser.newContext();
  const network = await enforceOfflineAcceptance(context, { allowedOrigins: [baseUrl] });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/signin/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => fetch('https://unexpected.example.test/tracker.js?token=private').catch(() => {}));
  assert.deepEqual(network.violations, [{
    page: `${baseUrl}/signin/`,
    resource: 'https://unexpected.example.test/tracker.js'
  }]);
  assert.doesNotMatch(JSON.stringify(network.violations), /token|private/);
  await context.close();
});
