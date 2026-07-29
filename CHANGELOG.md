# Changelog

All notable Virtcruise frontend changes are recorded here. The project follows Semantic Versioning;
release candidates use the `-rcN` suffix.

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

[0.5.0-rc1]: docs/RELEASE-NOTES-v0.5.0-rc1.md
[0.2.0]: docs/RELEASE-NOTES-v0.2.0.md
