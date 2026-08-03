import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromiumLaunchOptions } from './helpers/playwright-runtime.mjs';

test('Playwright-managed Chromium is the default runtime', () => {
  assert.deepEqual(chromiumLaunchOptions({ headless: true }, {}), { headless: true });
});

test('the documented executable override is explicit and whitespace-safe', () => {
  assert.deepEqual(chromiumLaunchOptions(
    { headless: true, executablePath: '/unapproved/browser' },
    { PLAYWRIGHT_CHROMIUM_EXECUTABLE: ' /opt/chromium/chrome ' }
  ), { headless: true, executablePath: '/opt/chromium/chrome' });
});

test('the dependency exposes the Playwright browser installer', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
  assert.equal(packageJson.devDependencies.playwright, '1.62.1');
  assert.equal(packageJson.devDependencies['playwright-core'], undefined);
});
