import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const archive = `${root}dist/virtcruise-www-0.8.0-beta.2.zip`;
const source = file => readFileSync(`${root}${file}`, 'utf8');
const artifact = file => execFileSync('unzip', ['-p', archive, file], { encoding: 'utf8' });

test('recovery production artifact retains every accepted V20 surface', () => {
  const listing = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' });
  for (const route of [
    'virtcruise-www-0.8.0-beta.2/admin/index.html',
    'virtcruise-www-0.8.0-beta.2/admin/quotes/index.html',
    'virtcruise-www-0.8.0-beta.2/admin/quotes/details/index.html',
    'virtcruise-www-0.8.0-beta.2/finance/index.html',
    'virtcruise-www-0.8.0-beta.2/operational-readiness/index.html'
  ]) assert.match(listing, new RegExp(`^${route.replaceAll('/', '\\/')}$`, 'm'), `missing packaged route ${route}`);
  const navigation = artifact('virtcruise-www-0.8.0-beta.2/js/navigation.js');
  const components = artifact('virtcruise-www-0.8.0-beta.2/js/portal/portal-components.js');
  const adminQuotes = artifact('virtcruise-www-0.8.0-beta.2/js/admin-quotes.js');
  const portalPage = artifact('virtcruise-www-0.8.0-beta.2/js/portal/portal-page.js');
  const navigationCss = artifact('virtcruise-www-0.8.0-beta.2/css/navigation.css');
  const manifest = JSON.parse(artifact('virtcruise-www-0.8.0-beta.2/DEPLOYMENT-MANIFEST.json'));

  assert.match(navigation, /portalAccountMenu/);
  assert.match(navigation, /account-menu-overlay-root/);
  assert.match(navigation, /isAdminOrStaff/);
  assert.match(navigation, /Customer Quotes/);
  assert.match(components, /Customer Quotes/);
  assert.match(components, /isAdminOrStaff/);
  assert.match(portalPage, /Administration Dashboard/);
  assert.match(adminQuotes, /Create Invoice/);
  assert.match(adminQuotes, /Commercial Summary/);
  assert.match(navigationCss, /#account-menu-overlay-root/);
  assert.match(navigationCss, /position: fixed/);
  assert.match(source('css/portal.css'), /--navy/);
  assert.equal(manifest.productionRuntime, true);
  assert.equal(manifest.developmentRuntime, false);
  assert.equal(manifest.publicOrigin, 'https://virtcruise.airwide.co.uk');
  assert.equal(manifest.apiOrigin, 'https://api.virtcruise.airwide.co.uk');
});
