import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
import {
  enforceOfflineAcceptance, navigateToReadyPage, waitForFinancialPageReady
} from './helpers/browser-acceptance.mjs';
import {
  account, deposits, invoices, page as pageFixture, payments, receipts, refunds
} from './fixtures/financial-api.mjs';

const root = process.cwd();
const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
];
const mime = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };
let server;
let browser;
let baseUrl;

function fileFor(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const relative = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  let file = join(root, relative || 'index.html');
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  return file;
}

async function mockApi(page, { denyInvoice = false, emptyFinancial = false } = {}) {
  const requests = [];
  await page.route('https://api.virtcruisetravels.com/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    requests.push({
      method: request.method(),
      path: `${url.pathname}${url.search}`,
      authorization: request.headers().authorization || ''
    });
    const json = data => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data }) });
    if (url.pathname === '/api/v1/auth/session') return json({ authenticated: false, refreshable: true });
    if (url.pathname === '/api/v1/auth/csrf') return json({ token: 'csrf-test', headerName: 'X-XSRF-TOKEN' });
    if (url.pathname === '/api/v1/auth/refresh') return json({
      accessToken: 'header.eyJleHAiOjMwMDAwMDAwMDB9.signature',
      accessTokenExpiresAt: '2060-01-01T00:00:00Z',
      user: {
        id: 'user-1', customerId: account.customerId, email: 'customer@example.test',
        givenName: 'Amina', familyName: 'Traveller', emailVerified: true,
        accountType: 'CUSTOMER', roles: ['ROLE_CUSTOMER'], permissions: []
      }
    });
    if (url.pathname === '/api/v1/financial/accounts/me' || url.pathname === '/api/v1/financial/balance') return json(emptyFinancial ? {
      ...account,
      debits: { amount: 0, currency: 'ZAR' }, credits: { amount: 0, currency: 'ZAR' },
      outstanding: { amount: 0, currency: 'ZAR' }, creditBalance: { amount: 0, currency: 'ZAR' }
    } : account);
    if (url.pathname === '/api/v1/financial/invoices') return json(pageFixture(emptyFinancial ? [] : invoices));
    if (url.pathname === `/api/v1/financial/invoices/${invoices[0].id}`) {
      if (denyInvoice) return route.fulfill({
        status: 403,
        contentType: 'application/problem+json',
        body: JSON.stringify({ title: 'Financial access denied', status: 403, detail: 'internal detail' })
      });
      return json(invoices[0]);
    }
    if (url.pathname === '/api/v1/financial/payments') return json(pageFixture(emptyFinancial ? [] : payments));
    if (url.pathname === '/api/v1/financial/receipts') return json(pageFixture(emptyFinancial ? [] : receipts));
    if (url.pathname === '/api/v1/financial/refunds') return json(pageFixture(emptyFinancial ? [] : refunds));
    if (url.pathname === '/api/v1/financial/deposits') return json(pageFixture(emptyFinancial ? [] : deposits));
    return route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
  });
  return requests;
}

before(async () => {
  server = createServer((request, response) => {
    const file = fileFor(request.url);
    if (!existsSync(file) || !statSync(file).isFile()) return response.writeHead(404).end('Not found');
    response.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    createReadStream(file).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
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

for (const viewport of viewports) {
  test(`${viewport.name} financial portal renders owned multi-currency data without overflow`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const network = await enforceOfflineAcceptance(context, {
      allowedOrigins: [baseUrl, 'https://api.virtcruisetravels.com']
    });
    const consoleErrors = [];
    const failed = [];
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('requestfailed', request => failed.push(request.url()));
    const requests = await mockApi(page);
    await navigateToReadyPage(page, `${baseUrl}/financial/invoices/`, {
      ready: current => waitForFinancialPageReady(current, 'Invoices & Deposits')
    });
    assert.equal(await page.getByText('INV-2026-000001', { exact: true }).isVisible(), true);
    assert.equal(await page.getByText('INV-2026-000002', { exact: true }).isVisible(), true);
    assert.equal(await page.getByText('Online payment will be available soon.').isVisible(), true);
    const search = page.getByLabel('Search invoices');
    await search.focus();
    assert.equal(await search.evaluate(element => element === document.activeElement), true);
    await search.fill('INV-2026-000002');
    await page.waitForTimeout(300);
    assert.equal(await page.getByText('INV-2026-000001', { exact: true }).count(), 0);
    assert.equal(await page.getByText('INV-2026-000002', { exact: true }).isVisible(), true);
    await search.fill('');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(failed, []);
    network.assertClean();
    assert.ok(requests.some(request => request.path === '/api/v1/financial/invoices?page=0&size=10'));
    assert.equal(requests.filter(request => request.path === '/api/v1/financial/invoices?page=0&size=10').length, 1);
    assert.ok(requests.filter(request => request.path.startsWith('/api/v1/financial/'))
      .every(request => request.authorization.startsWith('Bearer ')));
    assert.ok(requests.every(request => !request.path.includes('token=')));
    const stored = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
    assert.doesNotMatch(JSON.stringify(stored), /INV-2026|PAY-2026|accessToken|refreshToken/);
    await context.close();
  });
}

test('invoice detail maps line items, booking navigation and safe ownership denial', async () => {
  const context = await browser.newContext({ viewport: viewports[0] });
  const page = await context.newPage();
  const network = await enforceOfflineAcceptance(context, {
    allowedOrigins: [baseUrl, 'https://api.virtcruisetravels.com']
  });
  await mockApi(page);
  await navigateToReadyPage(page, `${baseUrl}/financial/invoices/details/?id=${invoices[0].id}`, {
    ready: current => waitForFinancialPageReady(current, invoices[0].number)
  });
  assert.equal(await page.getByRole('heading', { name: invoices[0].number }).isVisible(), true);
  assert.equal(await page.getByRole('table').isVisible(), true);
  assert.equal(await page.getByRole('link', { name: /View booking/ }).isVisible(), true);
  network.assertClean();
  await context.close();

  const deniedContext = await browser.newContext({ viewport: viewports[0] });
  const denied = await deniedContext.newPage();
  await mockApi(denied, { denyInvoice: true });
  await navigateToReadyPage(denied, `${baseUrl}/financial/invoices/details/?id=${invoices[0].id}`, {
    ready: current => current.getByRole('heading', { name: 'Financial information unavailable' }).waitFor()
  });
  assert.equal(await denied.getByRole('heading', { name: 'Financial information unavailable' }).isVisible(), true);
  assert.equal(await denied.getByText('internal detail').count(), 0);
  assert.equal(await denied.getByText('You do not have permission to view this financial information.').isVisible(), true);
  await deniedContext.close();
});

test('zero-activity overview loads the authoritative default financial account exactly once', async () => {
  const context = await browser.newContext({ viewport: viewports[0] });
  const page = await context.newPage();
  const network = await enforceOfflineAcceptance(context, {
    allowedOrigins: [baseUrl, 'https://api.virtcruisetravels.com']
  });
  const requests = await mockApi(page, { emptyFinancial: true });
  await navigateToReadyPage(page, `${baseUrl}/financial/`, {
    ready: current => waitForFinancialPageReady(current, 'Financial Overview')
  });
  assert.equal(await page.getByRole('heading', { name: 'Financial Overview' }).isVisible(), true);
  assert.equal(await page.getByText('ZAR 0.00', { exact: true }).isVisible(), true);
  assert.equal(requests.filter(request => request.path ===
    '/api/v1/financial/accounts/me?currency=ZAR').length, 1);
  network.assertClean();
  await context.close();
});

test('all history routes expose loading-complete and empty-safe customer views', async () => {
  for (const route of ['financial/', 'financial/payments/', 'financial/receipts/', 'financial/refunds/']) {
    const context = await browser.newContext({ viewport: viewports[0] });
    const page = await context.newPage();
    await mockApi(page);
    await navigateToReadyPage(page, `${baseUrl}/${route}`, {
      ready: current => current.locator('main h1').waitFor()
    });
    assert.equal(await page.locator('main h1').count(), 1);
    assert.equal(await page.locator('[aria-busy="true"]').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await context.close();
  }
});
