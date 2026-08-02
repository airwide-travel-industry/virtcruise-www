# Changelog

All notable Virtcruise frontend changes are recorded here. The project follows Semantic Versioning;
release candidates use the `-rcN` suffix.

## [0.7.0-SNAPSHOT] - Unreleased

### DEV-005G1 customer Bank Transfer

- Added protected instruction, creation, status and details routes integrated into the Customer Portal.
- Added authoritative configured bank details, exact invoice-derived references, proof upload/replacement, customer-safe progress, receipt and Booking projection views.
- Preserved the distinction between proof received and payment received; no customer control records a payment.
- Added desktop/tablet/mobile Chrome journeys, storage/security assertions and customer documentation.
- Added the smallest backend contract extension: authenticated read-only bank instructions from environment configuration.

### DEV-005G qualification

- Recorded that the accepted Finance portal does not include a customer bank-instruction,
  case-creation, proof-upload or case-status experience.
- Classified the absent authoritative bank-account configuration/discovery contract as a commercial
  launch blocker. No product feature, release candidate or deployment was created.

### Added

- Protected Finance overview, bank-transfer queue, assignment views, SLA view, completed view, and
  operational case detail routes.
- Authenticated private proof inspection for accepted clean PDF/JPEG/PNG evidence with in-memory
  Blob URLs and deterministic cleanup.
- Assignment, start-review, internal-comment, approval, and rejection workflows backed only by the
  accepted DEV-005C APIs.
- Strict Finance DTO mapping, server pagination/filter/sort, safe Problem Details, read coalescing,
  short-lived memory caching, conflict refresh, and stable mutation idempotency keys.
- Deterministic Finance fixtures, contract tests, and portal/acceptance documentation.

### Security

- Finance routes and navigation require accepted Finance/Administrator roles or permissions before
  protected content renders; backend authorization remains authoritative.
- Approval requires explicit independent cleared-funds attestation and a reason. Proof viewing never
  implies cleared funds and unsafe proof states cannot be opened.
- No proof bytes, tokens, internal comments, or Finance API objects are persisted or logged.

### Limitations

- Accepted API gaps for reviewer lookup, server assignment/SLA/date filters, multi-status filtering,
  comments/history reads, audit activity, and richer display references are omitted or explicitly
  labelled as current-page behavior.

### Acceptance

- DEV-005D1 passed real Chrome against PostgreSQL 18.4, Flyway V1–V10, real RS256 sessions, private
  PDF/JPEG/PNG proofs, two concurrent Finance actors, Customer ownership, and Consultant denials.
- Direct database assertions proved idempotent single audit/outbox decisions and no Payment,
  Receipt, Allocation, Ledger, or Booking mutation.
- The unchanged accepted backend passed its complete 353-test PostgreSQL suite.

## [0.6.0] - 2026-08-01

### Released

- Promoted the accepted `v0.6.0-rc2` static archive to final `v0.6.0` without functional change.
- Production Beta retains the accepted immutable frontend directory and matching backend RC2
  binary content.
- `release/v0.6` is the current Production Beta maintenance line; `release/v0.5` is retained for
  previous-beta maintenance only.

### Validation

- RC-003 registration, verification, login, Financial Overview, responsive browser, storage,
  authentication, security and logging gates passed in Production Beta.
- The deterministic archive and CycloneDX SBOM are published with SHA-256 checksums.

## [0.6.0-rc2] - 2026-08-01

### Fixed

- The zero-activity Financial Overview now loads the authoritative default ZAR account exactly
  once instead of inferring a balance solely from empty history collections.

### Validation

- Real Chrome registration, verification, login and Financial Overview acceptance passes at
  desktop, tablet and mobile widths against PostgreSQL V1–V8 and the RC2 backend.
- Account HTTP 200, zero/empty states, ownership, console/network/CORS, storage and logout gates pass.

## [0.6.0-rc1] - 2026-07-31

### Added

- Authenticated Financial Overview, Invoices & Deposits, invoice detail, Payments, Receipts and
  Refunds routes.
- Strict accepted-contract DTO mapping, exact currency-preserving Money presentation, paging,
  page-local search/filtering, loading, empty, retry and safe error states.
- Responsive and accessible financial cards/table plus deterministic API and browser fixtures.

### Changed

- Authenticated portal and account navigation now includes the Financial section.
- Booking-linked financial records navigate back to the existing customer booking experience.

### Security

- Financial responses are cached in memory only and cleared on logout.
- The financial client preserves memory-only access tokens, cookie credentials, CSRF for mutations,
  explicit idempotency keys and safe Problem Details messages.
- Customer ownership remains enforced exclusively by the accepted backend application layer.

### Validation

- DEV-004F confirms API compatibility with the additive Payment Provider Framework and Flyway V8.
- Real authenticated browser acceptance passes against PostgreSQL 18.4 without adding a Pay control
  or changing portal response mapping.

### Fixed

- Local acceptance serving now logs normalized paths without verification, reset, OAuth or
  financial-detail query values.

## [0.5.0-beta] - 2026-07-30

### Added

- Production Beta customer authentication, portal, quote review, booking review, responsive
  navigation and transactional-email journeys.

### Changed

- The accepted frontend baseline is `v0.5.0-rc3` paired with backend `v0.5.0-rc2`.
- `main` now identifies the next development line as `v0.6.0-SNAPSHOT`.

### Fixed

- Guest navigation exposes accessible Sign In and Register actions at all supported widths.
- Session discovery avoids expected anonymous refresh failures.

### Security

- Access tokens remain memory-only and refresh tokens remain Secure HttpOnly cookies.
- Production NGINX logs normalized paths without query strings so one-time tokens are not retained.

## [0.5.0-rc3] - Unreleased

### Fixed

- Guest desktop and mobile navigation now expose both Sign In and Register. RC2 rendered only Sign
  In even though the registration page already existed.

### Validation

- A mandatory real-browser navigation gate verifies computed visibility, clipping, keyboard focus,
  accessible names and `/register/` navigation at desktop, tablet and mobile widths.
- Authenticated navigation remains unchanged and excludes both guest actions.
- The backend remains `v0.5.0-rc2`; RC3 contains no backend or authentication-architecture changes.

## [0.5.0-rc2] - Unreleased

### Changed

- Authentication bootstrap now discovers whether an eligible HttpOnly refresh session exists
  before requesting CSRF and refresh.

### Fixed

- Normal guest browsing no longer makes an expected-to-fail refresh request or creates an HTTP 401
  console entry.
- Concurrent startup calls share one discovery/refresh operation; failed restoration clears stale
  metadata and safely becomes guest without a loop.

### Security

- Access tokens remain memory-only and refresh tokens remain inaccessible HttpOnly cookies.
- Session discovery neither reads browser tokens nor weakens refresh/CSRF behavior.

## [0.5.0-rc1] - 2026-07-28

### Added

- Customer registration, verification, sign-in, refresh, logout, password recovery and OAuth
  initiation using the backend identity contract.
- Authenticated dashboard, owned quote review, booking review, trip timelines, saved travellers,
  preferences, notifications and profile experiences.
- My Bookings and booking-detail routes with customer-owned timeline, traveller and payment-summary
  presentation.
- Accessible loading, empty, validation, error, confirmation and live-announcement components.

### Changed

- Authenticated navigation now exposes the customer portal while preserving the public navigation.
- Access tokens remain memory-only; refresh sessions use the backend HttpOnly-cookie and CSRF flow.
- My Trips is derived from confirmed and travel-stage bookings instead of a separate browser model.
- Portal reads are customer-scoped, cached briefly and coalesced to avoid duplicate requests.

### Security

- Protected routes remember only a safe same-origin destination.
- Portal data access is routed through the authenticated repository abstraction.
- Dynamic customer and booking values are HTML-escaped before template insertion.

### Known limitations

- Payments, supplier booking, downloadable confirmations and consultant workflows are not included.
- Traveller, preference and notification persistence uses clearly labelled browser adapters until
  matching owned backend resources are introduced.
- Google and Facebook require approved provider credentials and callback configuration.
- JavaScript and CSS assets are not content-fingerprinted.

## [0.2.0] - 2026-07-28

- Introduced the production aggregate Quote Builder, live package catalogue, stable quote
  idempotency, offline submission queue and NGINX release process.

[0.5.0-rc3]: docs/RELEASE-NOTES-v0.5.0-rc3.md
[0.5.0-rc2]: docs/RELEASE-NOTES-v0.5.0-rc2.md
[0.5.0-rc1]: docs/RELEASE-NOTES-v0.5.0-rc1.md
[0.2.0]: docs/RELEASE-NOTES-v0.2.0.md
