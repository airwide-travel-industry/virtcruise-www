# Virtcruise Frontend v0.5.0-rc1

## Summary

This release candidate combines the proven v0.2.0 quote journey with customer identity, the
authenticated travel portal and the first booking-engine customer experience. It introduces no
payment or consultant functionality and does not change the public homepage design.

## Highlights

- Production-ready customer authentication with email verification, password recovery, refresh
  rotation, CSRF protection and optional Google/Facebook initiation.
- Customer dashboard and owned quote, booking and trip review.
- Searchable My Quotes and My Bookings experiences with responsive detail pages.
- Saved travellers, preferences, profile drafts and notification centre behind repository adapters.
- Accepted quotes convert into one idempotent booking and expose timeline, travellers and payment
  summary.

## Architecture

- React-free static HTML, CSS and native ES modules.
- One authentication provider, in-memory access-token manager and HttpOnly refresh-cookie contract.
- Portal UI depends on `js/portal/portal-repository.js`, never directly on transport calls.
- Query-parameter detail routes remain compatible with static NGINX and GitHub Pages hosting.
- Existing Quote Builder and package repository remain the single public quote and catalogue paths.

## Security

- Protected routes restore only validated same-origin destinations.
- Backend-owned customer, quote and booking resources require bearer authentication and ownership.
- Refresh, logout and logout-all use the CSRF cookie/header contract.
- No access or refresh token is persisted in web storage.
- Customer-supplied values are escaped before dynamic HTML rendering.

## Performance

- Portal GET requests use a 60-second in-memory cache and in-flight request coalescing.
- Search is debounced and local to already-loaded owned collections.
- Customer cache keys include the authenticated account identifier.
- Static page modules load only on their corresponding authentication or portal route.

## Accessibility

- Skip links, landmarks, labelled controls, live regions and visible focus states.
- Keyboard-operable navigation, dialogs, account flows and destructive confirmations.
- Reduced-motion behavior and mobile layouts without horizontal scrolling.
- Inline validation and focused error summaries for authentication and traveller forms.

## Breaking changes

- Authenticated customer pages require the matching v0.5.0-rc1 backend contract and V5–V6 schema.
- My Trips is booking-backed; quote status alone no longer represents an operational trip.
- Production OAuth callbacks must exactly match the backend allow-list.

## Validation

- JavaScript syntax and import graph validated.
- All static route and asset references validated.
- Desktop, tablet and mobile portal routes exercised without application console errors or
  horizontal overflow.
- Authentication, quote and booking contracts validated against PostgreSQL 18 through the backend
  integration suite.

## Known limitations

- No payment processing, receipts or refunds.
- No real-time supplier availability or supplier reservation engine.
- No customer document upload or generated PDF itinerary.
- Traveller, notification, preference and extended-profile writes remain browser-backed adapters.
- OAuth provider sign-in still depends on external provider approval and credentials.
- CSS and JavaScript filenames are not content-fingerprinted.

## Upcoming Sprint 3.5

Sprint 3.5 should add payment-provider abstractions, payment intents, webhook verification,
reconciliation, receipts and refunds while preserving booking idempotency and audit history.

## Documentation

- [Architecture](ARCHITECTURE-v0.2.0.md)
- [Local authentication](LOCAL-AUTHENTICATION.md)
- [Customer portal](CUSTOMER-PORTAL.md)
- [Quote Builder](QUOTE-BUILDER-v0.2.0.md)
- [Backend booking engine](https://github.com/airwide-travel-industry/virtcruise-backend/blob/main/docs/BOOKING-ENGINE.md)
