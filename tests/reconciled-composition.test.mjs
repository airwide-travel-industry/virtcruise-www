import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const source = file => readFileSync(`${root}${file}`, 'utf8');
const requiredRoutes = ['/admin/', '/admin/quotes/', '/admin/quotes/details/', '/finance/', '/finance/bank-accounts/', '/financial/invoices/', '/financial/invoices/details/', '/bank-transfer/'];

function packagedRoot() {
  const manifest = `${root}dist/virtcruise-www-0.8.0-beta.3-hotfix-v21-frontend-reconciled-001/DEPLOYMENT-MANIFEST.json`;
  assert.ok(existsSync(manifest), 'reconciled artifact must be built before package tests');
  return 'virtcruise-www-0.8.0-beta.3-hotfix-v21-frontend-reconciled-001/';
}

function artifactFile(path) {
  return execFileSync('unzip', ['-p', `${root}dist/virtcruise-www-0.8.0-beta.3-hotfix-v21-frontend-reconciled-001.zip`, `${packagedRoot()}${path}`], { encoding: 'utf8' });
}

test('same source build composes Create Invoice and Finance payment recovery', () => {
  const quotes = source('js/admin-quotes.js');
  const finance = source('js/financial/financial-page.js');
  const quoteRepository = source('js/admin-quotes-repository.js');
  const financialRepository = source('js/financial/financial-repository.js');
  const navigation = source('js/finance/finance-components.js');
  assert.match(quotes, /Create Invoice/);
  assert.match(quotes, /adminQuotes\.createInvoice/);
  assert.match(quoteRepository, /createInvoice/);
  assert.match(finance, /Issue Payment Instructions/);
  assert.match(finance, /data-legacy-bank-account/);
  assert.match(financialRepository, /issuePaymentInstruction/);
  for (const label of ['Finance Overview', 'Bank Accounts', 'Invoices', 'Review Queue', 'My Assigned Cases', 'Unassigned Cases', 'Overdue Cases', 'Completed Reviews']) assert.match(navigation, new RegExp(label));
});

test('built artifact contains executable coexistence evidence and all routes', () => {
  const listing = execFileSync('unzip', ['-Z1', `${root}dist/virtcruise-www-0.8.0-beta.3-hotfix-v21-frontend-reconciled-001.zip`], { encoding: 'utf8' });
  for (const route of requiredRoutes) {
    const entry = `${packagedRoot()}${route === '/' ? '' : route.slice(1)}index.html`;
    assert.match(listing, new RegExp(`^${entry.replaceAll('/', '\\/')}$`, 'm'), `missing packaged route ${route}`);
  }
  const quotes = artifactFile('js/admin-quotes.js');
  const finance = artifactFile('js/financial/financial-page.js');
  const quoteRepository = artifactFile('js/admin-quotes-repository.js');
  const financialRepository = artifactFile('js/financial/financial-repository.js');
  const navigation = artifactFile('js/navigation.js');
  const featureManifest = JSON.parse(artifactFile('FEATURE-MANIFEST.json'));
  assert.equal(featureManifest.allPresent, true);
  for (const feature of ['CREATE_INVOICE', 'CUSTOMER_QUOTES', 'FINANCE_BANK_ACCOUNTS', 'FINANCE_INVOICES', 'LEGACY_PAYMENT_INSTRUCTIONS', 'DRAFT_BANK_SELECTOR', 'ACCOUNT_OVERLAY', 'PERSONA_BOUNDARY', 'CONTENT_STUDIO', 'OPERATIONS']) assert.equal(featureManifest.features[feature], 'PRESENT', feature);
  assert.match(quotes, /Create Invoice/);
  assert.match(quotes, /adminQuotes\.createInvoice/);
  assert.match(finance, /Issue Payment Instructions/);
  assert.match(finance, /data-legacy-bank-account/);
  assert.match(financialRepository, /issuePaymentInstruction/);
  assert.match(artifactFile('js/finance/bank-accounts-page.js'), /Add Bank Account/);
  assert.match(artifactFile('js/admin-quotes.js'), /Customer Quotes/);
  assert.match(navigation, /account-menu-overlay-root/);
  assert.match(navigation, /portalAccountMenu/);
});
