import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';

const root = process.cwd();

async function files(directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries
    .filter(entry => !['.git', 'node_modules', 'artifacts'].includes(entry.name))
    .map(entry => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]));
  return nested.flat();
}

test('HTML has unique IDs and valid local script, stylesheet, image and route references', async () => {
  const htmlFiles = (await files()).filter(file => extname(file) === '.html');
  const failures = [];
  for (const file of htmlFiles) {
    const source = await readFile(file, 'utf8');
    const ids = [...source.matchAll(/\sid=["']([^"']+)["']/gi)].map(match => match[1]);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length) failures.push(`${file}: duplicate IDs ${[...new Set(duplicateIds)].join(', ')}`);
    for (const match of source.matchAll(/\s(?:src|href)=["']([^"'#]+)["']/gi)) {
      const reference = match[1];
      if (/^(?:https?:|mailto:|tel:|data:)/i.test(reference)) continue;
      const pathname = reference.split(/[?#]/)[0];
      if (!pathname || pathname === '/') continue;
      let target = pathname.startsWith('/')
        ? join(root, pathname.replace(/^\/+/, ''))
        : resolve(dirname(file), pathname);
      if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
      if (!existsSync(target)) failures.push(`${file}: missing ${reference}`);
    }
  }
  assert.deepEqual(failures, []);
});

test('financial pages use repository modules and never log financial objects', async () => {
  const page = await readFile(join(root, 'js/financial/financial-page.js'), 'utf8');
  const repository = await readFile(join(root, 'js/financial/financial-repository.js'), 'utf8');
  assert.doesNotMatch(page, /\bfetch\s*\(/);
  assert.doesNotMatch(repository, /\bfetch\s*\(/);
  for (const file of (await files(join(root, 'js/financial')))) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /\bconsole\.(?:log|info|debug|warn|error)\s*\(/);
    assert.doesNotMatch(source, /(?:localStorage|sessionStorage)\.(?:setItem|getItem)/);
  }
});

test('required financial routes and assets exist', () => {
  const required = [
    'financial/index.html', 'financial/invoices/index.html',
    'financial/invoices/details/index.html', 'financial/payments/index.html',
    'financial/receipts/index.html', 'financial/refunds/index.html',
    'js/financial/financial-api-client.js', 'js/financial/financial-model.js',
    'js/financial/financial-repository.js', 'js/financial/financial-components.js',
    'js/financial/financial-page.js', 'css/portal.css'
  ];
  required.forEach(path => assert.equal(existsSync(join(root, path)), true, `${path} must exist`));
});

test('CSS local asset references resolve', async () => {
  const cssFiles = (await files()).filter(file => extname(file) === '.css');
  const failures = [];
  for (const file of cssFiles) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)) {
      const reference = match[2].trim();
      if (/^(?:https?:|data:|#)/i.test(reference)) continue;
      const pathname = reference.split(/[?#]/)[0];
      if (!pathname) continue;
      const target = pathname.startsWith('/')
        ? join(root, pathname.replace(/^\/+/, ''))
        : resolve(dirname(file), pathname);
      if (!existsSync(target)) failures.push(`${file}: missing ${reference}`);
    }
  }
  assert.deepEqual(failures, []);
});
