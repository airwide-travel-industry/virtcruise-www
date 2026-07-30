# Financial Portal Acceptance

Workstream: DEV-004C
Version: `0.6.0-SNAPSHOT`

## Acceptance scope

Acceptance covers the customer-facing financial overview, invoices, invoice detail, deposits,
payments, receipts and refunds against the accepted DEV-004E contract. It also covers protected
navigation, Problem Details containment, multi-currency presentation, responsive behavior,
accessibility and storage security.

## Automated matrix

| Gate | Evidence |
|---|---|
| DTO contract | Actual account, invoice, payment, receipt, refund and deposit shapes map strictly |
| Money | Exact amount text/currency retained; mixed aggregate currencies rejected |
| Pagination | Backend page metadata retained; first/last controls enforce boundaries |
| API construction | `/api/v1/financial` paths, page/size/account parameters and owned detail path |
| Authentication | Existing discovery/refresh bootstrap; protected route guard |
| Ownership | 403 invoice detail produces safe denial and no backend detail leakage |
| Storage | Browser storage contains no financial documents or access/refresh token |
| Navigation | Financial section appears only in authenticated portal/header navigation |
| Responsive | 1920×1080, 1024×768 and 390×844; no page overflow |
| Accessibility | One H1, semantic cards/table, labelled controls, focus, live counts and text statuses |
| Regression | Existing authentication bootstrap and guest/authenticated navigation tests |

## Browser journeys

The browser fixture suite provides deterministic zero, open, partially paid, paid,
multi-currency, deposit, payment, receipt, pending-refund, completed-history, pagination and error
representations using only accepted DTO fields.

PostgreSQL-backed acceptance uses a disposable V1–V7 database and development backend:

1. A verified zero-activity customer sees no falsely loaded totals or histories.
2. A booking-linked issued invoice and requested deposit appear on Overview and Invoices.
3. A partial payment updates allocated/unallocated amounts and produces an issued receipt.
4. Completion changes the invoice status to paid without client arithmetic.
5. Requested and completed refunds appear with backend-owned state.
6. Customer A cannot load Customer B’s invoice; logout makes all financial routes inaccessible.

The controlled backend setup owns creation and transitions because DEV-004C does not expose
financial mutation controls or bypass application handlers.

## Contract limitations observed

Date fields, payment/receipt/refund details, allocation targets, credit-note details, cross-currency
account discovery, server-selected filters/sorts and document downloads are not in the accepted
API. Acceptance therefore verifies honest omission and customer-safe list summaries rather than
invented placeholders.

## Completion record

The completed DEV-004C gate produced:

- 152/152 PostgreSQL-enabled backend tests passing against PostgreSQL 18.4;
- Flyway V1–V7 applied successfully to a clean disposable database;
- 22/22 default frontend tests passing, with the real integration journey separately enabled;
- 1/1 real PostgreSQL-backed browser journey passing;
- desktop, tablet and mobile financial routes passing without horizontal overflow;
- zero unexpected console, network or CORS errors on normal paths;
- 84.88% line, 85.50% branch and 80.67% function coverage in the Node test process.

The conditional PostgreSQL browser test is skipped in the default frontend command because it
requires a running development backend, its loopback-only test adapter and a disposable database.
It is mandatory for the workstream acceptance command documented below:

```bash
RUN_FINANCIAL_BROWSER_INTEGRATION=true \
FINANCIAL_FRONTEND_URL=http://localhost:5002 \
LOCAL_AUTH_TEST_KEY=<local-test-key> \
node --test tests/financial-postgres.test.mjs
```

No production credential or token is required or recorded by the test.
