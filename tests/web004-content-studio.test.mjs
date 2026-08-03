import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile('content-studio/index.html', 'utf8');
const script = await readFile('js/content-studio.js', 'utf8');
const css = await readFile('css/content-studio.css', 'utf8');

test('Content Studio is a noindex staff application with an explicit module entry point', () => {
  assert.match(html, /noindex,nofollow/);
  assert.match(html, /content-studio\.css/);
  assert.match(html, /js\/content-studio\.js/);
});

test('Content Studio enforces the WEB-003 content role boundary before rendering', () => {
  assert.match(script, /ROLE_CONTENT_EDITOR/);
  assert.match(script, /ROLE_CONTENT_APPROVER/);
  assert.match(script, /ROLE_ADMIN/);
  assert.match(script, /Sign-in required/);
  assert.match(script, /Access denied/);
  assert.match(script, /authenticationProvider\.initialize/);
  assert.doesNotMatch(script, /ROLE_CUSTOMER.*contentRoles/);
});

test('Content Studio exposes the editorial modules and uses existing management routes', () => {
  for (const label of ['Dashboard', 'Packages', 'Drafts', 'Review Queue', 'Publication Queue', 'Media', 'Pricing', 'SEO', 'Version History', 'Audit', 'Settings']) {
    assert.match(script, new RegExp(label));
  }
  assert.match(script, /\/api\/v1\/content\/packages/);
  assert.match(script, /apiRequest\(['"]\/api\/v1\/content\//);
  assert.doesNotMatch(script, /innerHTML\s*=\s*[^;]*values\./);
});

test('Content Studio has responsive and accessibility affordances', () => {
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(script, /aria-current/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /role="alert"/);
  assert.match(html, /lang="en"/);
});
