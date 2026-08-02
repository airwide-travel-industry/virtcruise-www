# Project Status

## DEV-005G commercial requalification

Qualification used frontend `4e431899c112515cd50321c8e6e7cc5a36e1cbfd` and backend
`7f4e3a4cf6425bbb6356f55aa1cb9e5b81d300db`. The backend passed all 583 PostgreSQL 18.4 tests with
zero skips and clean Flyway V1–V13. The mandatory frontend regression did not pass: `npm test`
reported 39 passes, five 30-second `networkidle` navigation timeouts and six opt-in skips, and the
financial-portal timeouts reproduced in isolation. External Google Fonts requests make the browser
harness nondeterministic before UI assertions execute.

No bank-transfer product defect was proven and no product code was changed. Remaining DEV-005G
journeys were stopped under the blocker rule. A bounded frontend acceptance-harness hardening
workstream is required before DEV-005G can rerun. Local main was not integrated and nothing was
pushed, tagged, deployed, promoted or released. Recommendation: **BANK TRANSFER COMMERCIAL
QUALIFICATION REQUIRES FURTHER HARDENING**.

## DEV-005G1A real-backend acceptance

The no-mock PostgreSQL 18.4/Flyway V1–V12/RS256/Chrome primary customer Bank Transfer journey passes through Finance approval, one Payment, one Receipt, balanced Ledger and confirmed Booking. Acceptance-proven defects were minimally corrected and regression tested. Terminal `REJECTED` prevents mandatory replacement and second approval; separate no-mock JPEG/PNG browser journeys also remain incomplete. The recommendation is **CUSTOMER BANK TRANSFER REAL BACKEND ACCEPTANCE REQUIRES FURTHER HARDENING**. DEV-005G has not begun and deployment is not authorized.

## DEV-005G1 customer Bank Transfer

The complete protected customer UI is implemented on `0.7.0-SNAPSHOT`: instructions, exact reference, review creation, secure proof upload/replacement, safe progress, payment/receipt status and authoritative Booking progression. Deterministic Chrome acceptance covers desktop, tablet and mobile. The accepted backend required one read-only environment-configured instruction endpoint. Real PostgreSQL/real JWT end-to-end qualification remains to be executed, so the current recommendation is **CUSTOMER BANK TRANSFER EXPERIENCE REQUIRES FURTHER HARDENING**. DEV-005G has not begun and no deployment is authorized.

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
