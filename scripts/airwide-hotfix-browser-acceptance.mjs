import assert from 'node:assert/strict';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:https';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';

const frontendHost = 'virtcruise.airwide.co.uk';
const frontendOrigin = `https://${frontendHost}`;
const apiOrigin = 'https://api.virtcruise.airwide.co.uk';
const root = resolve(process.env.AIRWIDE_HOTFIX_ARTIFACT_ROOT || 'dist/virtcruise-www-airwide-hotfix-e9662ea');
const key = await readFile(process.env.AIRWIDE_HOTFIX_TLS_KEY);
const cert = await readFile(process.env.AIRWIDE_HOTFIX_TLS_CERT);
const types = { '.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.xml':'application/xml' };

function serve(request, response) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, frontendOrigin).pathname); } catch { response.writeHead(400).end(); return; }
  let target = resolve(root, normalize(pathname).replace(/^[/\\]+/, ''));
  if (target !== root && !target.startsWith(`${root}${sep}`)) { response.writeHead(403).end(); return; }
  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
  if (!existsSync(target) || !statSync(target).isFile()) { response.writeHead(404).end('Not found'); return; }
  response.writeHead(200, {
    'Content-Type': types[extname(target)] || 'application/octet-stream',
    'Cache-Control': extname(target) === '.html' ? 'no-cache' : 'public, max-age=3600',
    'Content-Security-Policy': `default-src 'self'; connect-src 'self' ${apiOrigin}; img-src 'self' blob:; frame-src blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`,
    'X-Content-Type-Options': 'nosniff'
  });
  createReadStream(target).pipe(response);
}

const server = createServer({ key, cert }, serve);
await new Promise((resolvePromise, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolvePromise));
const port = server.address().port;
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', `--host-resolver-rules=MAP ${frontendHost}:443 127.0.0.1:${port},EXCLUDE localhost`] });

try {
  const results = [];
  for (const viewport of [{ name:'desktop',width:1920,height:1080 },{ name:'tablet',width:1024,height:768 },{ name:'mobile',width:390,height:844 }]) {
    const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport, reducedMotion: 'reduce' });
    const page = await context.newPage(); const errors = []; const failures = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => failures.push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`));
    await page.goto(frontendOrigin, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelectorAll('#featuredToursGrid .tour-card').length === 3);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    assert.equal(await page.locator('#aboutVirtcruiseTitle').count(), 1);
    assert.equal(await page.evaluate(() => Boolean(document.querySelector('#aboutVirtcruiseTitle').compareDocumentPosition(document.querySelector('#featuredToursTitle')) & Node.DOCUMENT_POSITION_FOLLOWING)), true);
    for (const href of ['tel:+263779680336','tel:+263779656335','mailto:info@virtcruisetravels.com']) assert.ok(await page.locator(`a[href="${href}"]`).count());
    assert.match(await page.locator('.about-principles').innerText(), /Our Mission[\s\S]*Our Vision[\s\S]*Our Core Values/);
    for (const route of ['/signin/','/register/','/dashboard/','/profile/','/bank-transfer/','/packages/victoria-falls-escape.html']) {
      assert.equal(await page.evaluate(async value => (await fetch(value)).status, route), 200, route);
    }
    const auth = await page.evaluate(async origin => {
      const session = await fetch(`${origin}/api/v1/auth/session`, { credentials:'include' });
      const csrf = await fetch(`${origin}/api/v1/auth/csrf`, { credentials:'include' });
      return { session:session.status, csrf:csrf.status, sessionBody:await session.json() };
    }, apiOrigin);
    assert.equal(auth.session, 200); assert.equal(auth.csrf, 200); assert.equal(auth.sessionBody.data.authenticated, false);
    const csrfCookie = (await context.cookies(apiOrigin)).find(cookie => cookie.name === 'XSRF-TOKEN');
    assert.ok(csrfCookie?.secure && csrfCookie.sameSite === 'Lax');
    const storage = await page.evaluate(() => JSON.stringify({ local:{...localStorage}, session:{...sessionStorage} }));
    assert.doesNotMatch(storage, /accessToken|refreshToken|XSRF-TOKEN|proof/i);
    assert.deepEqual(errors, []); assert.deepEqual(failures, []);
    results.push({ viewport:viewport.name, routes:true, session:true, csrf:true, secureLaxCsrf:true, storage:true });
    await context.close();
  }
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
  await new Promise(resolvePromise => server.close(resolvePromise));
}
