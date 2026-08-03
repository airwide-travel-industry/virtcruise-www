import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const root = process.cwd();
const read = path => readFile(join(root, path), 'utf8');

test('catalogue cover images are unique, real and described', async () => {
  const packages = JSON.parse(await read('data/packages.json'));
  assert.equal(packages.length, 6);
  assert.equal(new Set(packages.map(pkg => pkg.image)).size, packages.length);
  const hashes = [];
  for (const pkg of packages) {
    assert.ok(pkg.imageAlt?.length > 20, `${pkg.slug} needs useful image alt text`);
    assert.equal(pkg.gallery.length, pkg.galleryAlts.length);
    assert.ok(pkg.gallery.length >= 2, `${pkg.slug} needs a relevant gallery`);
    const bytes = await readFile(join(root, pkg.image));
    assert.ok(bytes.length > 20_000, `${pkg.image} must not be a placeholder`);
    hashes.push(createHash('sha256').update(bytes).digest('hex'));
  }
  assert.equal(new Set(hashes).size, packages.length);
});

test('Car Rental is the final supporting service, not a primary catalogue product', async () => {
  const home = await read('index.html');
  const order = ['service-flights', 'service-holiday-packages', 'service-victoria-falls', 'service-cruises', 'service-accommodation', 'service-visa', 'service-car-rental'];
  const css = await read('css/styles.css');
  order.forEach((className, index) => assert.match(css, new RegExp(`\\.${className}\\{order:${index + 1}\\}`)));
  assert.match(home, /service-supporting service-car-rental/);
  assert.match(home, /Trip add-on/);
  assert.doesNotMatch(JSON.stringify(JSON.parse(await read('data/packages.json'))), /Car Rental/i);
});

test('package pages expose reusable components and CMS-ready binding points', async () => {
  const renderer = await read('js/package-page.js');
  for (const component of ['summary', 'gallery']) assert.match(renderer, new RegExp(`data-package-component=\\"${component}\\"`));
  for (const field of ['name', 'summary', 'duration']) assert.match(renderer, new RegExp(`data-package-field=\\"${field}\\"`));
  for (const name of ['duration', 'pricePanel', 'gallery', 'cta']) assert.match(renderer, new RegExp(`function ${name}\\(`));
  assert.doesNotMatch(renderer, /contenteditable|admin|publish|version/i);
});

test('public catalogue pages include descriptions, canonicals and Open Graph image metadata', async () => {
  for (const file of ['index.html', 'packages/victoria-falls-escape.html', 'packages/zimbabwe-safari.html', 'packages/european-city-break.html', 'packages/tropical-paradise.html', 'packages/dubai-city-break.html', 'packages/zanzibar-beach-holiday.html']) {
    const html = await read(file);
    assert.match(html, /<title>[^<]{15,}<\/title>/);
    assert.match(html, /<meta name="description" content="[^\"]{50,}">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/virtcruisetravels\.com\//);
    assert.match(html, /<meta property="og:title"/);
    assert.match(html, /<meta property="og:description"/);
    assert.match(html, /<meta property="og:image"/);
    assert.match(html, /<meta property="og:image:alt"/);
  }
});

test('catalogue styles cover desktop, tablet, mobile, focus and reduced motion', async () => {
  const styles = `${await read('css/package-page.css')}\n${await read('css/shop.css')}`;
  assert.match(styles, /@media\(max-width:900px\)/);
  assert.match(styles, /@media\(max-width:600px\)/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /minmax\(0,/);
});
