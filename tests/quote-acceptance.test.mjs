import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../js/portal/portal-page.js', import.meta.url), 'utf8');
const repository = readFileSync(new URL('../js/portal/portal-repository.js', import.meta.url), 'utf8');

test('customer quote UI exposes acceptance only for SENT and an accepted state', () => {
  assert.match(page, /String\(quote\.status\)\.toUpperCase\(\) === 'SENT'/);
  assert.match(page, /data-accept-quote/);
  assert.match(page, /Quote Accepted/);
  assert.doesNotMatch(page, /SENT[\s\S]{0,300}data-create-booking/);
});

test('acceptance confirms, calls the protected endpoint, refreshes and prevents duplicate action', () => {
  assert.match(page, /confirmAction\('This confirms that you wish to proceed with the quoted travel arrangement\.', 'Accept this quotation\?'\)/);
  assert.match(page, /await repository\.acceptQuote\(/);
  assert.match(page, /await \(page === 'quote-details' \? renderQuoteDetails\(\) : renderQuotes\(\)\)/);
  assert.match(repository, /\/api\/v1\/quotes\/\$\{encodeURIComponent\(id\)\}\/accept/);
});

test('acceptance provides visible progress and failure feedback without swallowing errors', () => {
  assert.match(page, /data-quote-acceptance-message/);
  assert.match(page, /acceptQuote\.textContent = 'Accepting…'/);
  assert.match(page, /We could not accept this quote\. Please try again\./);
  assert.match(page, /acceptQuote\.textContent = 'Accept Quote'/);
});

test('acceptance preserves separate booking conversion behavior', () => {
  assert.match(repository, /async createBooking\(quoteId\)/);
  assert.match(page, /data-create-booking/);
});
