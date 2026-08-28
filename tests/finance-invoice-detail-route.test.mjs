import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { launchChromium } from './helpers/playwright-runtime.mjs';
import { startStaticServer } from '../scripts/safe-static-server.mjs';

const source = readFileSync(new URL('../js/financial/financial-page.js', import.meta.url), 'utf8');
const artifact = readFileSync(new URL('../js/financial/financial-page.js', import.meta.url), 'utf8');

test('invoice detail route explicitly selects Finance or customer component by persona', () => {
  assert.match(source, /invoiceDetailMode\(user, pageName\)/);
  assert.match(source, /financeMode \? \(pageName === 'invoices' \? renderFinanceInvoices\(\) : renderFinanceInvoiceDetails\(\)\)/);
  assert.match(source, /portalShell\(user/);
  assert.match(source, /Read-only details supplied by the Virtcruise financial service\./);
  assert.match(source, /Finance-controlled invoice detail workspace\./);
});

test('operational and customer detail renderers remain in the exact runtime module', () => {
  assert.match(artifact, /renderFinanceInvoiceDetails/);
  assert.match(artifact, /Issue Payment Instructions/);
  assert.match(artifact, /renderInvoiceDetails/);
  assert.match(artifact, /Read-only details supplied by the Virtcruise financial service\./);
});

test('exact production artifact routes Finance to operational detail and customer to read-only detail', async t => {
  const artifactRoot = resolve('dist/virtcruise-www-0.8.0-beta.3-hotfix-finance-invoice-detail-route-001');
  assert.ok(existsSync(artifactRoot), 'detail-route artifact must be built before runtime test');
  const server = startStaticServer({ root: artifactRoot, port: 0 });
  await new Promise(resolvePromise => server.once('listening', resolvePromise));
  const browser = await launchChromium({ headless: true, args: ['--no-sandbox'] });
  t.after(async () => { await browser.close(); await new Promise(resolvePromise => server.close(resolvePromise)); });
  const invoice = { id: '198b7a78-0025-4c96-9031-fbc43035b0e0', number: 'INV-2026-7F4161CF0502', bookingReference: 'BOOK-2026-001', status: 'ISSUED', lines: [], net: { currency: 'USD', amount: '1230.00' }, tax: { currency: 'USD', amount: '0.00' }, total: { currency: 'USD', amount: '1230.00' }, allocated: { currency: 'USD', amount: '0.00' }, outstanding: { currency: 'USD', amount: '1230.00' } };
  const account = { bankAccountId: 'bank-1', displayName: 'Virtcruise USD', bankName: 'Test Bank', accountNumber: '1234567890', currency: 'USD', active: true };
  async function mock(page, role) {
    await page.route('https://api.virtcruise.airwide.co.uk/**', async route => {
      const request = route.request();
      const url = new URL(request.url());
      const ok = data => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data }) });
      if (url.pathname === '/api/v1/auth/session') return ok({ authenticated: false, refreshable: true });
      if (url.pathname === '/api/v1/auth/refresh') return ok({ accessToken: 'test.token.value', accessTokenExpiresAt: '2060-01-01T00:00:00Z', user: { id: 'user-1', email: 'test@example.com', givenName: 'Test', familyName: role === 'ROLE_CUSTOMER' ? 'Customer' : 'Finance', accountType: role === 'ROLE_CUSTOMER' ? 'CUSTOMER' : 'STAFF', roles: [role], permissions: [] } });
      if (url.pathname === '/api/v1/auth/csrf') return ok({ token: 'csrf', headerName: 'X-XSRF-TOKEN' });
      if (url.pathname === '/api/v1/financial/invoices/198b7a78-0025-4c96-9031-fbc43035b0e0') return ok(invoice);
      if (url.pathname === '/api/v1/finance/invoices/198b7a78-0025-4c96-9031-fbc43035b0e0/payment-instructions') return route.fulfill({ status: 404, contentType: 'application/json', body: '{"status":404}' });
      if (url.pathname === '/api/v1/finance/bank-account-configurations') return ok([account]);
      return route.fulfill({ status: 404, contentType: 'application/json', body: '{"status":404}' });
    });
  }
  const origin = `http://127.0.0.1:${server.address().port}`;
  const financePage = await browser.newPage();
  await mock(financePage, 'ROLE_FINANCE');
  await financePage.goto(`${origin}/financial/invoices/details/?id=${invoice.id}`, { waitUntil: 'domcontentloaded' });
  await financePage.getByRole('heading', { name: invoice.number }).waitFor();
  assert.equal(await financePage.getByText('No payment instructions have been issued for this invoice.').isVisible(), true);
  assert.equal(await financePage.getByRole('button', { name: 'Issue Payment Instructions' }).isVisible(), true);
  assert.equal(await financePage.getByText('Read-only details supplied by the Virtcruise financial service.').count(), 0);
  await financePage.close();
  const customerPage = await browser.newPage();
  await mock(customerPage, 'ROLE_CUSTOMER');
  await customerPage.goto(`${origin}/financial/invoices/details/?id=${invoice.id}`, { waitUntil: 'domcontentloaded' });
  await customerPage.getByRole('heading', { name: invoice.number }).waitFor();
  assert.equal(await customerPage.getByText('Read-only details supplied by the Virtcruise financial service.').isVisible(), true);
  assert.equal(await customerPage.getByRole('button', { name: 'Issue Payment Instructions' }).count(), 0);
  assert.equal(await customerPage.locator('select').count(), 0);
});
