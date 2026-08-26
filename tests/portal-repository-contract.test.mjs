import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { launchChromium } from './helpers/playwright-runtime.mjs';

const root = process.cwd();
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
let browser;
let server;
let baseUrl;

function localFile(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const relative = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  return join(root, relative || 'index.html');
}

before(async () => {
  server = createServer((request, response) => {
    const path = localFile(request.url);
    if (!existsSync(path) || !statSync(path).isFile()) return response.writeHead(404).end();
    response.setHeader('Content-Type', mimeTypes[extname(path)] || 'application/octet-stream');
    createReadStream(path).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await launchChromium({ headless: true, args: ['--no-sandbox'] });
});

after(async () => {
  await browser?.close();
  await new Promise(resolve => server?.close(resolve));
});

test('production portal repository factory exposes customer acceptance action', async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
  const contract = await page.evaluate(async () => {
    const { createPortalRepository } = await import('/js/portal/portal-repository.js');
    const repository = createPortalRepository({ id: 'contract-user', customerId: 'contract-customer' });
    return { acceptQuote: typeof repository.acceptQuote, frozen: Object.isFrozen(repository) };
  });
  assert.deepEqual(contract, { acceptQuote: 'function', frozen: true });
  await context.close();
});
