import assert from 'node:assert/strict';

const INTERNAL_SCHEMES = new Set(['about:', 'blob:', 'data:']);

function safeUrl(value) {
  const url = new URL(value);
  return `${url.origin}${url.pathname}`;
}

export async function enforceOfflineAcceptance(context, { allowedOrigins = [] } = {}) {
  const allowed = new Set(allowedOrigins);
  const violations = [];
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (INTERNAL_SCHEMES.has(url.protocol) || allowed.has(url.origin)) return route.fallback();
    violations.push({ page: safeUrl(route.request().frame()?.url() || url.href), resource: safeUrl(url.href) });
    await route.abort('blockedbyclient');
  });
  return {
    assertClean() {
      assert.deepEqual(violations, [], `unexpected external requests: ${JSON.stringify(violations)}`);
    },
    violations
  };
}

export async function navigateToReadyPage(page, url, { heading, ready } = {}) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  assert.ok(response?.ok(), `navigation failed: ${response?.status()} ${safeUrl(url)}`);
  if (heading) await page.getByRole('heading', { name: heading }).waitFor();
  if (ready) await ready(page);
  await page.locator('[aria-busy="true"]').waitFor({ state: 'detached' }).catch(async () => {
    assert.equal(await page.locator('[aria-busy="true"]').count(), 0, `loading did not complete for ${safeUrl(url)}`);
  });
}

export async function waitForApplicationReady(page) {
  await page.waitForFunction(() => {
    const renderedState = document.querySelector(
      'main h1, main h2, form, [data-auth-navigation] .account-avatar, [data-auth-navigation] a[href="/signin/"]'
    );
    return Boolean(renderedState) && !document.querySelector('[aria-busy="true"]');
  });
}

export async function waitForGuestReady(page) {
  await page.locator('[data-auth-navigation], [data-mobile-auth-navigation]').first().waitFor();
  await page.getByRole('link', { name: 'Sign In', exact: true }).first().waitFor();
}

export async function waitForAuthenticatedPortalReady(page, heading) {
  await page.getByRole('heading', { name: heading }).waitFor();
  await page.getByRole('button', { name: 'Logout', exact: true }).waitFor();
  assert.equal(await page.locator('[aria-busy="true"]').count(), 0);
}

export async function waitForFinancialPageReady(page, heading) {
  await waitForAuthenticatedPortalReady(page, heading);
  await page.locator('main .portal-panel, main .financial-summary-grid, main .portal-empty, main .portal-alert').first().waitFor();
}

export async function waitForFinanceQueueReady(page) {
  await waitForAuthenticatedPortalReady(page, 'Review Queue');
  await page.locator('.finance-table, .portal-empty, .portal-alert').first().waitFor();
}

export async function waitForBankTransferPageReady(page, heading) {
  await waitForAuthenticatedPortalReady(page, heading);
  await page.locator('.instruction-grid, .transfer-case-list, .transfer-detail-layout, .portal-alert').first().waitFor();
}
