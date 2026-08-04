import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { launchChromium } from './helpers/playwright-runtime.mjs';
import { waitForApplicationReady } from './helpers/browser-acceptance.mjs';

const root = process.cwd();
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp'
};
const viewports = [
  { name: 'desktop', width: 1920, height: 1080, mobile: false },
  { name: 'tablet', width: 1024, height: 768, mobile: true },
  { name: 'mobile', width: 390, height: 844, mobile: true }
];

let browser;
let server;
let baseUrl;

function localFile(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const relative = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  let path = join(root, relative || 'index.html');
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  return path;
}

async function openNavigation(page, mobile) {
  if (!mobile) return;
  const toggle = page.locator('[data-mobile-navigation-toggle]');
  await assertVisible(toggle, 'mobile navigation toggle');
  await toggle.click();
  await page.waitForFunction(() => {
    const navigation = document.getElementById('mobileNavigation');
    return navigation?.classList.contains('is-open')
      && getComputedStyle(navigation).visibility === 'visible'
      && Number(getComputedStyle(navigation).opacity) >= .99;
  });
  await assertVisible(page.locator('#mobileNavigation'), 'mobile navigation');
}

async function assertVisible(locator, label) {
  assert.equal(await locator.count(), 1, `${label} must occur exactly once`);
  assert.equal(await locator.isVisible(), true, `${label} must be computed visible`);
  const geometry = await locator.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      bottom: rect.bottom,
      height: rect.height,
      left: rect.left,
      opacity: Number(style.opacity),
      pointerEvents: style.pointerEvents,
      right: rect.right,
      top: rect.top,
      visibility: style.visibility,
      width: rect.width,
      viewportHeight: innerHeight,
      viewportWidth: innerWidth
    };
  });
  assert.ok(geometry.width > 0 && geometry.height > 0, `${label} must have a rendered box`);
  assert.ok(geometry.left >= 0 && geometry.right <= geometry.viewportWidth,
    `${label} must not be horizontally clipped`);
  assert.ok(geometry.top >= 0 && geometry.bottom <= geometry.viewportHeight,
    `${label} must not be vertically clipped`);
  assert.equal(geometry.visibility, 'visible', `${label} visibility must be visible`);
  assert.ok(geometry.opacity >= .99, `${label} opacity must be effectively visible`);
  assert.notEqual(geometry.pointerEvents, 'none', `${label} must accept pointer input`);
}

async function mockAuthentication(page, authenticated) {
  await page.route('https://api.virtcruisetravels.com/**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/v1/auth/session') {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { authenticated: false, refreshable: authenticated }
        })
      });
    }
    if (url.pathname === '/api/v1/auth/csrf') {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { token: 'test-csrf', headerName: 'X-XSRF-TOKEN' }
        })
      });
    }
    if (url.pathname === '/api/v1/auth/refresh') {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            accessToken: 'header.eyJleHAiOjMwMDAwMDAwMDB9.signature',
            accessTokenExpiresAt: '2060-01-01T00:00:00.000Z',
            user: {
              id: 'user-1',
              customerId: 'customer-1',
              email: 'traveller@example.test',
              givenName: 'Amina',
              familyName: 'Traveller',
              emailVerified: true,
              accountType: 'CUSTOMER',
              roles: ['ROLE_CUSTOMER'],
              permissions: []
            }
          }
        })
      });
    }
    if (url.pathname.startsWith('/api/v1/catalogue/packages')) {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(url.pathname.endsWith('/featured') ? [] : {
          content: [], page: 0, size: 12, totalElements: 0, totalPages: 0,
          hasNext: false, hasPrevious: false
        })
      });
    }
    return route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
  });
}

before(async () => {
  server = createServer((request, response) => {
    const path = localFile(request.url);
    if (!existsSync(path) || !statSync(path).isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.setHeader('Content-Type', mimeTypes[extname(path)] || 'application/octet-stream');
    createReadStream(path).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await launchChromium({
    headless: true,
    args: ['--no-sandbox']
  });
});

after(async () => {
  await browser?.close();
  await new Promise(resolve => server?.close(resolve));
});

for (const viewport of viewports) {
  test(`guest ${viewport.name} navigation exposes visible, unclipped and operable authentication links`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const consoleErrors = [];
    const unexpectedFailures = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('requestfailed', request => unexpectedFailures.push(request.url()));
    await mockAuthentication(page, false);
    await page.goto(`${baseUrl}/`, { waitUntil:'domcontentloaded' });await waitForApplicationReady(page);
    await openNavigation(page, viewport.mobile);

    const container = viewport.mobile
      ? page.locator('[data-mobile-auth-navigation]')
      : page.locator('[data-auth-navigation]');
    const signIn = container.getByRole('link', { name: 'Sign In', exact: true });
    const register = container.getByRole('link', { name: 'Register', exact: true });
    await assertVisible(signIn, `${viewport.name} Sign In`);
    await assertVisible(register, `${viewport.name} Register`);
    assert.equal(await register.getAttribute('href'), '/register/');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true,
      `${viewport.name} navigation must not create horizontal overflow`);

    await signIn.focus();
    await page.keyboard.press('Tab');
    assert.equal(await register.evaluate(element => element === document.activeElement), true,
      `${viewport.name} Register must follow Sign In in the keyboard tab order`);
    assert.equal(await register.evaluate(element => element.matches(':focus-visible')), true,
      `${viewport.name} Register must receive keyboard-visible focus`);
    assert.notEqual(await register.evaluate(element => getComputedStyle(element).outlineStyle), 'none',
      `${viewport.name} Register must retain a visible focus outline`);
    await page.keyboard.press('Enter');
    await page.waitForURL('**/register/');
    assert.equal(new URL(page.url()).pathname, '/register/');
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(unexpectedFailures, []);
    await context.close();
  });

  test(`authenticated ${viewport.name} navigation preserves account controls and excludes guest links`, async () => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await mockAuthentication(page, true);
    await page.goto(`${baseUrl}/`, { waitUntil:'domcontentloaded' });await waitForApplicationReady(page);
    await openNavigation(page, viewport.mobile);

    const container = viewport.mobile
      ? page.locator('[data-mobile-auth-navigation]')
      : page.locator('[data-auth-navigation]');
    assert.equal(await container.getByRole('link', { name: 'Register', exact: true }).count(), 0);
    assert.equal(await container.getByRole('link', { name: 'Sign In', exact: true }).count(), 0);
    await assertVisible(container.locator('.account-avatar'), `${viewport.name} account avatar`);
    await assertVisible(container.getByText('Amina', { exact: true }), `${viewport.name} customer name`);
    if (!viewport.mobile) await container.locator('.account-menu-toggle').click();
    const logout = container.getByRole('button', { name: 'Logout', exact: true });
    await logout.scrollIntoViewIfNeeded();
    await assertVisible(logout,
      `${viewport.name} Logout`);
    await assertVisible(container.getByRole('link', { name: 'Dashboard', exact: true }),
      `${viewport.name} My Account navigation`);
    await context.close();
  });
}

test('navigation source contains no inline handlers and auth links have no duplicate IDs', async () => {
  const source = await readFile(join(root, 'js/navigation.js'), 'utf8');
  assert.doesNotMatch(source, /\son(?:click|keydown|keyup|keypress)=/i);
  assert.doesNotMatch(source, /id=["'][^"']*(?:sign-in|register)/i);
});
