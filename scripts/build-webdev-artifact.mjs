import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deploymentProfile } from './deployment-profiles.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
const profileName = process.argv.find(value => value.startsWith('--profile='))?.split('=', 2)[1] || 'webdev';
const profile = deploymentProfile(profileName);
const stage = join(output, profile.stageName);
const zip = `${stage}.zip`;
const publicOrigin = profile.publicOrigin;
const runtimeRoots = ['index.html', 'account', 'admin', 'auth', 'bank-transfer', 'bookings', 'content-studio',
  'css', 'dashboard', 'data', 'finance', 'financial', 'fonts', 'forgot-password', 'images', 'js',
  'notifications', 'operational-readiness', 'packages', 'preferences', 'profile', 'quotes', 'register',
  'reset-password', 'signin', 'travellers', 'trips', 'verify-email', 'robots.txt', 'sitemap.xml'];

function replaceExact(content, before, after, name) {
  if (!content.includes(before)) throw new Error(`Production hardening input changed: ${name}`);
  return content.replace(before, after);
}

async function hardenProductionRuntime() {
  await rm(join(stage, 'data'), { recursive: true, force: true });
  await rm(join(stage, 'js', 'mock-api.js'), { force: true });

  const transform = async (name, operation) => {
    const path = join(stage, name);
    const original = await readFile(path, 'utf8');
    await writeFile(path, operation(original));
  };

  await transform('js/runtime-config.js', content => content.replace(
    '// copies it unchanged; local mode remains an explicit query-selected development path.',
    '// the production-beta build copies it with development runtime paths removed.'
  ));
  await transform('js/api-client.js', content => {
    let result = replaceExact(content,
`const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:8080';
const requestedMode = new URLSearchParams(window.location.search).get('api');

const apiMode = requestedMode === 'mock'
  ? 'mock'
  : requestedMode === 'local'
    ? 'local'
    : 'production';
const apiBaseUrl = apiMode === 'production'
  ? runtimeConfig.apiOrigin
  : apiMode === 'local'
    ? DEFAULT_LOCAL_API_BASE_URL
    : '';`,
`const apiMode = 'production';
const apiBaseUrl = runtimeConfig.apiOrigin;`, 'api-client runtime selection');
    result = replaceExact(result,
`  if (!apiBaseUrl) {
    throw new RepositoryError('The production API is disabled in explicit mock mode.', {
      code: 'MOCK_MODE',
      retryable: false
    });
  }
`, '', 'api-client disabled API branch');
    result = replaceExact(result, `  source: apiMode === 'mock' ? 'mock' : apiMode,`,
      `  source: apiMode,`, 'api-client package source');
    result = replaceExact(result,
`  submitEnquiry(payload) {
    if (apiMode !== 'mock') throw new Error('Please submit this request through the Quote Builder.');
    return import('./mock-api.js').then(api => api.submitEnquiry(payload));
  },`,
`  submitEnquiry() {
    throw new Error('Please submit this request through the Quote Builder.');
  },`, 'api-client development enquiry');
    return result;
  });
  await transform('js/auth/config.js', content => replaceExact(content,
`const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:8080';

const params = new URLSearchParams(window.location.search);
const requestedMode = params.get('api');
const siteBasePath = new URL('../../', import.meta.url).pathname.replace(/\\/+$/, '');

export const authRuntime = Object.freeze({
  mode: requestedMode === 'local' ? 'local' : 'production',
  apiBaseUrl: requestedMode === 'local'
    ? DEFAULT_LOCAL_API_BASE_URL
    : runtimeConfig.apiOrigin
});`,
`const siteBasePath = new URL('../../', import.meta.url).pathname.replace(/\\/+$/, '');

export const authRuntime = Object.freeze({
  mode: 'production',
  apiBaseUrl: runtimeConfig.apiOrigin
});`, 'authentication runtime selection').replace(
    `  if (requestedMode === 'local') url.searchParams.set('api', 'local');\n`, ''
  ));
  await transform('js/repositories/quote-repository.js', content => {
    let result = content.replace(`const mockApi = () => import('../mock-api.js');\n\n`, '');
    result = result.replaceAll(/      if \(mode === 'mock'\).*\n/g, '');
    return result;
  });
  await transform('js/repositories/customer-repository.js', () =>
`export function createCustomerRepository({ request }) {
  return {
    create: payload => request('/api/v1/customers', { method: 'POST', body: JSON.stringify(payload) }),
    get: customerId => request(\`/api/v1/customers/\${encodeURIComponent(customerId)}\`),
    lookupByEmail: email => request(\`/api/v1/customers/lookup?email=\${encodeURIComponent(email)}\`),
    update: (customerId, payload) => request(\`/api/v1/customers/\${encodeURIComponent(customerId)}\`, {
      method: 'PUT', body: JSON.stringify(payload)
    }),
    remove: customerId => request(\`/api/v1/customers/\${encodeURIComponent(customerId)}\`, { method: 'DELETE' })
  };
}
`);
  await transform('js/repositories/package-repository.js', content => {
    let result = content.replace(`const staticCatalogUrl = () => new URL('../../data/packages.json', import.meta.url);\n`, '');
    result = result.replace(`  const dynamic = dynamicCatalogueEnabled && source !== 'mock' && Boolean(apiBaseUrl);`,
      `  const dynamic = dynamicCatalogueEnabled && Boolean(apiBaseUrl);`);
    result = result.replace(/\n  async function legacy\(options = \{\}\) \{[\s\S]*?\n  \}\n/, '\n');
    result = result.replaceAll(/      if \(!dynamic\).*\n/g, '');
    return result;
  });
  await transform('js/quote-builder.js', content => replaceExact(content,
`  function successView() {
    const isMock = success.deliveryMode !== 'BACKEND';
    return \`<section class="success-panel qb-success"><span class="success-icon" aria-hidden="true">✓</span><p class="qb-kicker">\${isMock ? 'Development preview' : 'Quote request received'}</p><h2>\${isMock ? 'Your local mock submission is ready' : 'Thank you — your request is with Virtcruise'}</h2><p>\${escapeHtml(success.message)}</p><div class="reference-card"><span>\${isMock ? 'Mock reference' : 'Virtcruise reference'}</span><strong>\${escapeHtml(success.quoteId)}</strong><small>Status: \${escapeHtml(success.status)}</small></div>\${isMock ? '<p>Explicit mock mode is active; this request was not sent to Virtcruise.</p>' : '<p>A Virtcruise consultant will use these details to prepare your quotation.</p>'}<div class="success-actions"><button class="app-secondary" type="button" data-qb-close>Close</button><button class="app-primary" type="button" data-qb-new>Start New Trip</button></div></section>\`;
  }`,
`  function successView() {
    return \`<section class="success-panel qb-success"><span class="success-icon" aria-hidden="true">✓</span><p class="qb-kicker">Quote request received</p><h2>Thank you — your request is with Virtcruise</h2><p>\${escapeHtml(success.message)}</p><div class="reference-card"><span>Virtcruise reference</span><strong>\${escapeHtml(success.quoteId)}</strong><small>Status: \${escapeHtml(success.status)}</small></div><p>A Virtcruise consultant will use these details to prepare your quotation.</p><div class="success-actions"><button class="app-secondary" type="button" data-qb-close>Close</button><button class="app-primary" type="button" data-qb-new>Start New Trip</button></div></section>\`;
  }`, 'quote success presentation'));
  await transform('js/package-page.js', content => content
    .replaceAll('https://www.virtcruisetravels.com', publicOrigin)
    .replaceAll('https://virtcruisetravels.com', publicOrigin));
  await transform('css/styles.css', content => content.replace(
    '/* Pixel-match refinements for the approved desktop sample */',
    '/* Pixel-match refinements for the approved desktop reference */'
  ));
}

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else result.push(path);
  }
  return result;
}

function canonicalPath(path) {
  const name = relative(stage, path).replaceAll('\\', '/');
  if (name === 'index.html') return '/';
  if (name.startsWith('packages/') && name.endsWith('.html')) return `/${name}`;
  return `/${name.replace(/index\.html$/, '')}`;
}

await mkdir(output, { recursive: true });
await rm(stage, { recursive: true, force: true });
await rm(zip, { force: true });
await rm(`${zip}.sha256`, { force: true });
await mkdir(stage, { recursive: true });
for (const name of runtimeRoots) {
  const source = join(root, name);
  try { await stat(source); } catch { throw new Error(`Required runtime entry is missing: ${name}`); }
  await cp(source, join(stage, name), { recursive: true, preserveTimestamps: false });
}
await rm(join(stage, 'images', '.gitkeep'), { force: true });

if (profile.productionRuntime) await hardenProductionRuntime();

if (['reconciled-v21', 'finance-invoice-detail-route', 'customer-payment-instructions-002', 'payment-proof-upload-001'].includes(profileName)) {
  const featureChecks = {
    CREATE_INVOICE: ['js/admin-quotes.js', /Create Invoice/],
    CUSTOMER_QUOTES: ['js/admin-quotes.js', /Customer Quotes/],
    FINANCE_BANK_ACCOUNTS: ['js/finance/bank-accounts-page.js', /Add Bank Account/],
    FINANCE_INVOICES: ['js/financial/financial-page.js', /renderFinanceInvoices/],
    FINANCE_OPERATIONAL_INVOICE_DETAIL: ['js/financial/financial-page.js', /renderFinanceInvoiceDetails/],
    CUSTOMER_READ_ONLY_INVOICE_DETAIL: ['js/financial/financial-page.js', /Read-only details supplied by the Virtcruise financial service/],
    LEGACY_PAYMENT_INSTRUCTIONS: ['js/financial/financial-page.js', /Issue Payment Instructions/],
    DRAFT_BANK_SELECTOR: ['js/admin-quotes.js', /data-bank-assignment/],
    ACCOUNT_OVERLAY: ['js/navigation.js', /account-menu-overlay-root.*portalAccountMenu|portalAccountMenu.*account-menu-overlay-root/s],
    PERSONA_BOUNDARY: ['js/auth/persona.js', /isAdminOrStaff.*isCustomerPersona/s],
    CONTENT_STUDIO: ['content-studio/index.html', /content-studio\.js/],
    OPERATIONS: ['operational-readiness/index.html', /operational-readiness\.js/]
    ,ADMIN_QUOTE_LIST_ROUTE: ['admin/quotes/index.html', /admin-quotes\.js/]
    ,ADMIN_QUOTE_DETAIL_ROUTE: ['admin/quotes/details/index.html', /admin-quotes\.js/]
    ,CUSTOMER_BANK_TRANSFER: ['bank-transfer/index.html', /bank-transfer-page\.js/]
    ,CUSTOMER_PAYMENT_PROOF: ['js/bank-transfer/proof-upload.js', /openProofUpload/]
    ,RECEIPTS_PROOF_FAB: ['js/financial/financial-page.js', /proof-upload-fab.*Upload Proof of Payment/s]
    ,UI_FACELIFT: ['css/styles.css', /approved desktop/]
  };
  const checks = {};
  for (const [name, [file, pattern]] of Object.entries(featureChecks)) {
    let content = '';
    try { content = await readFile(join(stage, file), 'utf8'); } catch {}
    checks[name] = pattern.test(content) ? 'PRESENT' : 'MISSING';
  }
  const featureManifest = { release: profile.release, artifact: `${stage.slice(output.length + 1)}.zip`, features: checks, allPresent: Object.values(checks).every(value => value === 'PRESENT') };
  await writeFile(join(stage, 'FEATURE-MANIFEST.json'), `${JSON.stringify(featureManifest, null, 2)}\n`);
  if (!featureManifest.allPresent) throw new Error(`Feature composition gate failed: ${JSON.stringify(checks)}`);
}

const runtimeConfigPath = join(stage, 'js', 'runtime-config.js');
let runtimeConfig = await readFile(runtimeConfigPath, 'utf8');
runtimeConfig = runtimeConfig
  .replaceAll('https://www.virtcruisetravels.com', profile.publicOrigin)
  .replaceAll('https://api.virtcruisetravels.com', profile.apiOrigin);
await writeFile(runtimeConfigPath, runtimeConfig);

for (const publicFile of ['robots.txt', 'sitemap.xml']) {
  const path = join(stage, publicFile);
  const content = (await readFile(path, 'utf8'))
    .replaceAll('https://www.virtcruisetravels.com', profile.publicOrigin);
  await writeFile(path, content);
}

for (const path of (await files(stage)).filter(value => extname(value) === '.html')) {
  let html = (await readFile(path, 'utf8'))
    .replaceAll('https://www.virtcruisetravels.com', publicOrigin)
    .replaceAll('https://virtcruisetravels.com', publicOrigin);
  const canonical = `${publicOrigin}${canonicalPath(path)}`;
  if (/<link rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}">`);
  } else html = html.replace(/<\/head>/i, `<link rel="canonical" href="${canonical}"></head>`);
  if (/<meta property="og:url"[^>]*>/i.test(html)) {
    html = html.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  } else html = html.replace(/<\/head>/i, `<meta property="og:url" content="${canonical}"></head>`);
  const metadata = `<meta property="og:site_name" content="Virtcruise Travels">`;
  html = html.replace(/<\/head>/i, `${metadata}</head>`);
  await writeFile(path, html);
}

const runtimeEntryCount = (await files(stage)).length;
await writeFile(join(stage, 'DEPLOYMENT-MANIFEST.json'), `${JSON.stringify({
  release: profile.release, publicOrigin, apiOrigin: profile.apiOrigin,
  upstreamApiOrigin: profile.upstreamApiOrigin, routeStrategy: 'physical-index-files',
  productionRuntime: Boolean(profile.productionRuntime), developmentRuntime: false,
  generatedAt: '1980-01-01T00:00:00.000Z', checksummedEntries: runtimeEntryCount + 1
}, null, 2)}\n`);

const inventory = [];
for (const path of (await files(stage)).sort()) {
  const body = await readFile(path);
  inventory.push(`${createHash('sha256').update(body).digest('hex')}  ${relative(stage, path).replaceAll('\\', '/')}`);
}
await writeFile(join(stage, 'SHA256SUMS'), `${inventory.join('\n')}\n`);

execFileSync('find', [stage, '-exec', 'touch', '-h', '-t', '198001010000.00', '{}', '+']);
execFileSync('zip', ['-X', '-q', '-r', zip, stage.slice(output.length + 1)], { cwd: output });
const zipHash = createHash('sha256').update(await readFile(zip)).digest('hex');
await writeFile(`${zip}.sha256`, `${zipHash}  ${zip.split('/').at(-1)}\n`);
console.log(`${zip}\n${zipHash}\n${inventory.length + 1} staged files`);
