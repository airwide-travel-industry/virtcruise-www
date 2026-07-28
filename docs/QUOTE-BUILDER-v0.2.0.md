# Quote Builder v0.2.0

## Customer journey

```text
Quick Quote, service card, featured tour or package page
  -> one browser draft
  -> My Trip itinerary review
  -> contact details and consent
  -> aggregate POST /api/v1/quotes
  -> confirmed backend quote number
```

Quick Quote maps its existing destination, dates, traveller selection, budget and contact fields into
the same draft, preserving unrelated services already in My Trip. It does not submit to a separate
endpoint.

## State and domain modules

`js/quote-state.js` creates, restores, rebuilds and persists `virtcruise.quoteBuilder.v1`. Each logical
quote has a stable `quoteId`, `clientReference` and `idempotencyKey`. Service requests and itinerary
items also have stable client IDs.

The modules under `js/quote-domains/` own focused changes for customer, travellers, trip, packages,
flights, accommodation, visa services, transfers, activities, special requests and ordered service
requests. The state includes trip dates and destination, traveller counts and optional traveller
details, selected packages and services, itinerary days, unallocated items, pre-travel requirements,
customer contact details, notes, consent and draft status.

`js/itinerary-builder.js` projects saved services into dated days. Visa work remains pre-travel;
items without adequate dates remain unallocated. My Trip allows edit, remove, expand/collapse,
move up/down, day assignment, optional marking and custom activities.

## Aggregate contract

`js/quote-api-mapper.js` maps the complete browser state without flattening service details into notes:

```http
POST /api/v1/quotes
Content-Type: application/json
Idempotency-Key: submit-quote-<logical-quote-id>
X-Request-Id: <request-id>
```

The aggregate contains customer and consent, traveller counts and optional traveller records, trip
dates/origin/destination, packages, flights, accommodation, visas, transfers, activities, nested
service details, itinerary days, unallocated entries, pre-travel requirements, special requests,
overall notes and the stable client reference.

Production no longer sends `POST /api/v1/customers` and no longer sends a flattened legacy quote DTO
or the compatibility `/api/v1/quote-builder/quotes` route.

## Idempotency and retries

- One idempotency key is created for each new logical quote.
- The key persists with the session draft.
- The submit control is guarded while a request is active, preventing parallel double-click requests.
- HTTP-level automatic retries apply only to safe GET requests, never to quote POSTs.
- A timeout or explicit user retry retains and reuses the same key.
- A new trip receives a new client reference and key.
- Offline queue entries retain the same payload, key and client reference.

The backend returns the original quote for an idempotent replay. The repository validates that
response like an initial success.

## Offline behavior

When production mode detects an offline browser, it queues one deduplicated record per logical
submission in `virtcruise.offline.quoteQueue.v1`. Queue entries flush one at a time after connectivity
returns. The UI states that the request has **not** reached Virtcruise. It never displays a production
success or clears the active trip merely because queueing succeeded.

## Validation, errors and success

Service schemas implement field-level requirements and date/passenger rules. Checkout requires a
full name, valid email, mobile number and explicit consent. Errors are shown inline and announced
without browser alerts.

Network, timeout, HTTP 400/404/409/422/500 and malformed response conditions preserve the draft and
idempotency key. The draft is cleared only after the backend confirms all of:

- quote ID;
- quote number;
- customer ID;
- client reference;
- status.

Only that real quote number is displayed in production. Mock references and browser-only success
messages are limited to explicit `?api=mock` development mode.

## Related documentation

- [Frontend architecture](ARCHITECTURE-v0.2.0.md)
- [Frontend operations](OPERATIONS-v0.2.0.md)
- Backend API: `airwide-travel-industry/virtcruise-backend/docs/API-v0.2.0.md`
