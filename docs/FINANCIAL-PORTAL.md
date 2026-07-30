# Customer Financial Portal

Workstream: DEV-004C
Version: `0.6.0-SNAPSHOT`

## Purpose and architecture

The Financial Portal gives an authenticated customer a customer-safe view of money owed, payments
received, receipts, deposits and refunds linked to travel bookings. It extends the existing static
Customer Portal; it does not introduce a second router, authentication model, accounting model or
payment provider.

```text
Protected static page
  → financial page/controller
  → financial repository (30-second memory cache + read coalescing)
  → authenticated financial HTTP client
  → /api/v1/financial
  → accepted Spring Boot application layer
  → PostgreSQL V7
```

Views never call `fetch()` directly. `js/financial/financial-api-client.js` owns request IDs,
credentials, the memory-only bearer token, timeouts, CSRF material for mutations and safe Problem
Details mapping. `js/financial/financial-repository.js` maps explicit DTOs, coalesces identical
reads and keeps financial responses in memory only. Cache state is cleared when authentication
becomes guest and on portal logout.

No Financial Domain, backend DTO, Flyway or application-layer change was required.

## Page and navigation map

```text
Financial Overview        /financial/
├── Invoices & Deposits   /financial/invoices/
│   └── Invoice detail    /financial/invoices/details/?id={ownedInvoiceId}
├── Payments              /financial/payments/
├── Receipts              /financial/receipts/
└── Refunds               /financial/refunds/
```

The customer portal sidebar exposes each history directly; the authenticated public-header menu
links to Financial Overview. Invoice and financial cards link back to My Bookings using the
customer-facing booking reference. The invoice identifier follows the established static-site
detail-route convention. It is used only to call the owned backend endpoint and is never treated as
authorization.

Deposits are a clearly separated section of Invoices and a next-deposit card on Overview. There is
no Pay control. The interface states, “Online payment will be available soon.”

## Frontend-to-API contract matrix

All responses are the existing `{ success, data, timestamp }` envelope. Collections contain the
accepted `PageResponse` metadata (`content`, `page`, `size`, `totalElements`, `totalPages`, `first`,
`last`). Every route requires authentication and backend ownership enforcement.

| Experience | Endpoint | DTO fields used | UI behavior |
|---|---|---|---|
| Account summary | `GET /api/v1/financial/accounts/me?currency={code}` | status, debits, credits, outstanding, creditBalance | Per-currency account and deposit lookup |
| Balance | `GET /api/v1/financial/balance?currency={code}` | same as account | Overview outstanding/credit/no-balance distinction |
| Invoice list | `GET /api/v1/financial/invoices?page=&size=` | id, number, bookingReference, status, total, allocated, outstanding | Paged cards; page-local search/status filter |
| Invoice detail | `GET /api/v1/financial/invoices/{id}` | list fields plus lines, quantity, unitPrice, taxRate, net, tax | Read-only detail and print-friendly browser view |
| Payment list | `GET /api/v1/financial/payments?page=&size=` | reference, bookingReference, method, status, amount, allocated, unallocated, refunded | Paged history and allocation summary |
| Receipt list | `GET /api/v1/financial/receipts?page=&size=` | number, paymentReference, bookingReference, status, total | Paged receipt history; no fake download |
| Deposit list | `GET /api/v1/financial/deposits?accountId=&page=&size=` | bookingReference, dueDate, status, required, received, outstanding | Account ownership is rechecked by backend |
| Refund list | `GET /api/v1/financial/refunds?page=&size=` | paymentReference, status, reason, amount | Paged status tracking |
| Financial mutation support | accepted POST endpoints | `Idempotency-Key` only when a caller supplies a stable logical key | Client supports CSRF and stable keys; DEV-004C exposes no mutation control |
| Problem Details | any financial route | title, status and response request ID | Fixed safe message; optional request ID support detail |

### Proven contract gaps

The accepted API does not currently expose:

- issue/created/due dates on invoices;
- created/completed dates on payments, receipts and refunds;
- payment, receipt or refund detail endpoints;
- per-invoice payment allocations or receipt allocations;
- credit-note detail in an invoice;
- refund booking reference or completion date;
- server-side status/date filtering or caller-selected sorting;
- a list of all currency accounts or one authoritative cross-currency summary;
- an approved invoice/receipt PDF.

The portal does not invent these values. Search, status filtering and ordering apply only to the
current server page. The UI labels missing detail honestly. These gaps limit richness but do not
block the supported customer histories.

## Money and multi-currency

`financial-model.js` validates every Money object as an amount plus one of `USD`, `GBP`, `EUR` or
`ZAR`. It keeps amount text and performs no arithmetic or exchange-rate conversion.
`formatFinancialMoney()` groups the integer portion with `Intl.NumberFormat`, preserves the
fractional text, and always renders the currency code beside the amount. Invoice aggregates are
rejected if their component currencies disagree.

Cards never combine currencies. A multi-currency invoice list displays each item in its own
currency. The overview shows the requested ZAR account only; it does not present a false global
total because the API has no account-currency discovery endpoint.

## States and errors

Every route begins with the existing skeleton. Collections have explicit empty states, pagination
boundaries and a retry control. A failed balance request is never rendered as a successful zero
balance; only a not-found account is treated as no activity.

The client maps 400, 401, 403, 404, 409, 422, server errors, timeouts and network failures to fixed
customer-safe language. It does not render backend `detail`, stack traces, SQL, class names,
fingerprints or internal security rules. A request ID may appear under an expandable Support
details control.

GET requests may be coalesced and cached briefly. Unsafe mutations are never automatically retried.
The client obtains backend CSRF material for mutations and accepts an explicit stable
`Idempotency-Key`; it does not silently create a replacement key after an ambiguous response.

## Security and privacy

- Access tokens remain memory-only; refresh tokens remain backend cookies.
- Financial responses, identifiers and filters are never stored in localStorage or sessionStorage.
- No financial response or Problem Details object is written to the console.
- Backend customer scoping remains authoritative for list and detail routes.
- A manipulated invoice identifier receives the backend’s 403/404 response and a safe UI.
- Logout clears in-memory financial cache before redirecting.
- No ledger, commission, supplier-settlement or administration route is called by the portal.
- Browser history after logout cannot reload protected data without restoring a valid session.

## Responsive and accessible presentation

Desktop uses dense cards and a semantic line-item table. At tablet and mobile widths the summary
grid reflows, fact groups collapse, the invoice table becomes labelled stacked rows and references
wrap. Currency and amount remain one non-breaking unit. No route requires horizontal page
scrolling at 1920×1080, 1024×768 or 390×844.

Pages retain the portal skip link, landmarks, semantic headings, visible focus, labelled
search/status filters, pagination navigation, table caption/header associations, status text in
addition to colour, live result counts, retry alerts and focus placement on the page heading.
Reduced-motion behavior comes from the shared portal CSS.

## Source map

| File | Responsibility |
|---|---|
| `js/financial/financial-api-client.js` | Authenticated HTTP, CSRF, timeout and safe errors |
| `js/financial/financial-model.js` | Strict accepted-DTO and Money mapping |
| `js/financial/financial-repository.js` | API methods, paging, memory cache and read coalescing |
| `js/financial/financial-components.js` | Money, status, pagination and support presentation |
| `js/financial/financial-page.js` | Route rendering and customer interaction |
| `tests/fixtures/financial-api.mjs` | Deterministic accepted-contract fixtures |
| `tests/financial-model.test.mjs` | DTO, paging, currency and contract validation |
| `tests/financial-portal.test.mjs` | Browser, ownership-denial, storage and responsive gates |

## Known limitations

No payment initiation, provider integration, webhook, PDF, invoice/receipt email, staff console,
supplier view or customer ledger is part of DEV-004C. Detail routes for payments, receipts and
refunds will remain list-level until the backend explicitly publishes customer-safe contracts.
