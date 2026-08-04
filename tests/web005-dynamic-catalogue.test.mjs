import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createPackageRepository } from '../js/repositories/package-repository.js';

const published = {
  id: '11111111-1111-1111-1111-111111111111', code: 'PKG-CAPE', slug: 'cape-escape',
  packageType: 'HOLIDAY_PACKAGE', title: 'Cape Escape', summary: 'A published escape',
  description: 'Published description', destination: 'Cape Town', durationDays: 4, featured: true,
  highlights: ['Table Mountain'], inclusions: ['Breakfast'], exclusions: ['Flights'],
  itinerary: [{ day: 1, title: 'Arrival' }], customerNotes: ['Passport required'],
  seo: { title: 'Cape SEO', description: 'Cape description' },
  callToAction: { label: 'Plan Cape Town' },
  pricing: [{ currency: 'USD', amount: 500, displayBasis: 'per person' }],
  media: [
    { reference: 'images/cape.webp', role: 'COVER', order: 0, altText: 'Cape Town mountain view' },
    { reference: 'managed/private.webp', role: 'GALLERY', order: 1, altText: 'private' },
    { reference: 'images/beach.webp', role: 'GALLERY', order: 2, altText: 'Cape beach', caption: 'Atlantic coast' }
  ], effectiveFrom: '2026-08-03T00:00:00Z', effectiveUntil: null
};

function response(body, { status = 200, etag = '"publication-1"' } = {}) {
  return { ok: status >= 200 && status < 300, status, headers: { get: name => name === 'ETag' ? etag : null }, json: async () => body };
}

test('dynamic catalogue uses only published endpoints and maps public projection fields', async () => {
  Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, configurable: true });
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const requests = [];
  globalThis.fetch = async (url, options) => { requests.push({ url: String(url), options }); return response({ content: [published], number: 1, size: 12, totalElements: 13, totalPages: 2 }); };
  const repository = createPackageRepository({ apiBaseUrl: 'https://api.example', dynamicCatalogueEnabled: true });
  const packages = await repository.list({ page: 1, size: 12, search: 'Cape', destination: 'Cape Town', type: 'HOLIDAY_PACKAGE' });
  assert.match(requests[0].url, /^https:\/\/api\.example\/api\/v1\/catalogue\/packages\?/);
  assert.match(requests[0].url, /page=1/); assert.match(requests[0].url, /search=Cape/);
  assert.doesNotMatch(requests[0].url, /content|draft|review|audit/i);
  assert.equal(packages[0].name, 'Cape Escape'); assert.equal(packages[0].priceFrom, 500);
  assert.deepEqual(packages[0].gallery, ['images/beach.webp']);
  assert.deepEqual(packages[0].inclusions, ['Breakfast']);
  assert.deepEqual(packages[0].bookingTerms, ['Passport required']);
  assert.deepEqual(repository.pagination, { number: 1, size: 12, totalElements: 13, totalPages: 2,
    hasNext: false, hasPrevious: false });
});

test('published featured and slug routes never fall back to management APIs', async () => {
  Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, configurable: true });
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const requests = [];
  globalThis.fetch = async url => { requests.push(String(url)); return response(String(url).endsWith('/featured') ? [published] : published); };
  const repository = createPackageRepository({ apiBaseUrl: 'https://api.example', dynamicCatalogueEnabled: true });
  assert.equal((await repository.featured()).length, 1);
  assert.equal((await repository.getBySlug('cape-escape')).slug, 'cape-escape');
  assert.deepEqual(requests, ['https://api.example/api/v1/catalogue/packages/featured', 'https://api.example/api/v1/catalogue/packages/cape-escape']);
});

test('WEB-005 public code has an explicit rollback flag and no private API routes', async () => {
  const files = await Promise.all(['js/repositories/package-repository.js', 'js/shop.js', 'js/package-page.js', 'js/main.js'].map(file => readFile(file, 'utf8')));
  const code = files.join('\n');
  assert.match(code, /dynamicCatalogueEnabled/);
  assert.doesNotMatch(code, /api\/v1\/(?:content|review|audit)|editorialOwner|createdBy|updatedBy/);
  assert.match(code, /If-None-Match/);
});
