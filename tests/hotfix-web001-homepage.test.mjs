import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { launchChromium } from './helpers/playwright-runtime.mjs';
import { startStaticServer } from '../scripts/safe-static-server.mjs';

const homepage = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const packagePages = await Promise.all([
  'zimbabwe-safari.html',
  'european-city-break.html',
  'tropical-paradise.html',
  'victoria-falls-escape.html',
  'zanzibar-beach-holiday.html',
  'dubai-city-break.html'
].map(name => readFile(new URL(`../packages/${name}`, import.meta.url), 'utf8')));
const liveMarkup = [homepage, ...packagePages].join('\n');
const homepageText = homepage.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
let browser;
let origin;
let server;

before(async () => {
  server = startStaticServer({ port: 0 });
  await new Promise(resolve => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await launchChromium({ headless: true });
});

after(async () => {
  await browser?.close();
  await new Promise(resolve => server?.close(resolve));
});

test('publishes the approved customer contacts and consultants', () => {
  for (const phone of ['+263779680336', '+263779656335']) {
    assert.match(homepage, new RegExp(`href="tel:\\${phone}"`));
    assert.match(homepage, new RegExp(`>\\${phone}<`));
  }
  assert.match(homepage, /href="mailto:info@virtcruisetravels\.com"/);
  assert.match(homepage, />info@virtcruisetravels\.com</);
  assert.match(homepage, />Lorreta</);
  assert.match(homepage, />Monalisa</);
  assert.doesNotMatch(liveMarkup, /263772463284|info@virtcruise\.co\.zw/);
});

test('places exactly one complete About section before Featured Tours', () => {
  assert.equal((homepage.match(/About Virtcruise Travels/g) || []).length, 1);
  assert.ok(homepage.indexOf('About Virtcruise Travels') < homepage.indexOf('Featured Tours'));
  assert.match(homepage, /href="#aboutVirtcruiseTitle">About Us<\/a>/);
  assert.equal((homepage.match(/id="aboutVirtcruiseTitle"/g) || []).length, 1);
  assert.match(homepage, /<h3>Our Mission<\/h3>[\s\S]*To connect people to the world through exceptional travel experiences, guided by excellence, care, and innovation\./);
  assert.match(homepage, /<h3>Our Vision<\/h3>[\s\S]*To become Africa’s most trusted and admired travel brand, recognized for redefining the standards of modern travel\./);
  for (const value of [
    'Authenticity — We believe in real experiences.',
    'Service Excellence — We exceed expectations every time.',
    'Flexibility — We adapt. We solve. We deliver.',
    'Sustainability — We support responsible travel practices.',
    'Passion — Travel is in our DNA.'
  ]) assert.ok(homepageText.includes(value), `missing core value: ${value}`);
});

for (const viewport of [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 }
]) test(`${viewport.name} homepage keeps the About and contact update accessible`, async () => {
  const page = await browser.newPage({ viewport });
  const errors = [];
  await page.route('https://api.virtcruisetravels.com/**', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ success: true, data: { authenticated: false, refreshable: false } })
  }));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`${request.method()} ${request.url()}`));
  await page.goto(origin, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelectorAll('#featuredToursGrid .tour-card').length === 3);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
  await page.evaluate(() => document.querySelector('a[href="#aboutVirtcruiseTitle"]').click());
  assert.equal(await page.evaluate(() => location.hash), '#aboutVirtcruiseTitle');
  await page.locator('#aboutVirtcruiseTitle').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('#aboutVirtcruiseTitle').isVisible(), true);
  assert.equal(await page.getByRole('heading', { name: 'Featured Tours' }).isVisible(), true);
  assert.equal(await page.locator('a[href="tel:+263779680336"]').count() >= 2, true);
  assert.equal(await page.locator('a[href="tel:+263779656335"]').count() >= 2, true);
  assert.equal(await page.locator('a[href="mailto:info@virtcruisetravels.com"]').isVisible(), true);
  assert.deepEqual(errors, []);
  await page.close();
});
