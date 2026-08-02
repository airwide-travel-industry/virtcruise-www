# Project Status

## DEV-005G commercial qualification

Commercial qualification requires further hardening. The Finance and Financial portals remain
accepted components, but the customer bank-transfer submission/status UI and authoritative
bank-instruction contract do not exist. Local main integration, RC creation and deployment are
blocked. See `docs/BANK-TRANSFER-COMMERCIAL-QUALIFICATION.md`.

## Baseline

Production Beta runs frontend and backend `v0.6.0`, promoted without functional change from the
accepted `v0.6.0-rc2` binaries. `release/v0.6` is the current Production Beta maintenance line;
`release/v0.5` remains available for previous-beta maintenance only. The final `v0.6.0` tag and
release branch are secured; `main` now identifies the future `0.7.0-SNAPSHOT` development line.

## Architecture and quality

- Static HTML/CSS and vanilla ES modules using repository abstractions.
- Memory-only access tokens, cookie refresh sessions and protected portal routes.
- Cached/coalesced catalogue and portal reads; responsive lazy-loaded page modules.
- Automated syntax, navigation, authentication bootstrap and Playwright browser checks.
- Keyboard navigation, focus visibility, live regions and mobile card alternatives.
- Customer financial overview, invoices/deposits, payments, receipts and refunds use accepted V7
  DTOs with exact multi-currency rendering and memory-only financial caching.
- DEV-005D Finance Operations consumes the frozen DEV-005C bank-transfer/proof APIs through strict
  DTOs, role-gated static routes, stable mutation idempotency, and memory-only proof viewing.

## Technical debt and limitations

- No real payment initiation, provider integration, consultant portal or CRM.
- Financial API dates, allocation detail, customer-safe document downloads and cross-currency
  account discovery remain backend contract gaps.
- Some portal preferences and traveller data remain local pending dedicated APIs.
- Email delivery is synchronous; a durable outbox is future work.
- Broader monitoring, WAF/rate-limit edge controls and off-host backup automation remain open.
- Query strings are intentionally absent from NGINX operational logs.
- Finance reviewer discovery, global assignment/SLA/date filters, comment/audit history, and richer
  case display references require additive backend contracts; the UI does not synthesize them.

## Roadmap

DEV-004C provides the Customer Financial Portal. DEV-004F integrates it with the accepted DEV-004D
provider-neutral backend while retaining a read-only customer experience. No real provider,
payment initiation control, deployment or release candidate is included.

The integrated V1–V8 backend and real browser journey pass. See
`docs/FINANCIAL-ENGINE-INTEGRATION.md`; a future release-candidate workstream must keep the fake
provider disabled and repeat the documented security and operational gates.

DEV-005D targets `0.7.0-SNAPSHOT` against accepted backend commit `8f5f373`. It adds no financial
posting or booking progression and does not begin DEV-005E. See `docs/FINANCE-OPERATIONS-PORTAL.md`.
DEV-005D1 real-backend acceptance passed PostgreSQL 18.4/Flyway V1–V10, real RS256 browser sessions,
private proof retrieval, concurrent Finance decisions, authorization, storage/privacy, responsive
Chrome, database effects, and the unchanged backend’s 353-test PostgreSQL regression suite.
