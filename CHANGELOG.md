# Changelog

All notable Virtcruise frontend changes are recorded here. The project follows Semantic Versioning;
release candidates use the `-rcN` suffix.

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
