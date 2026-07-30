# Virtcruise Frontend v0.5.0-beta

## Overview

This is the first accepted Production Beta frontend, deployed at
<https://virtcruise.airwide.co.uk> from commit
`6e8abd809693c1b17d78c0bebf701828e7051927`. It is paired with backend
`v0.5.0-rc2`.

## Major features

- Premium responsive public site, package catalogue, Quick Quote, Quote Builder and My Trip.
- Registration, verification, sign-in, recovery and account security journeys.
- Customer dashboard, profile, quotes, trips, travellers, preferences and notifications.
- Customer-owned booking list, details, traveller snapshot, timeline and payment summary.

## Security and authentication

Access tokens are memory-only. Refresh sessions use Secure HttpOnly cookies, CSRF protection,
rotation and replay-family revocation. Guest startup uses read-only session discovery. Ownership is
enforced by the backend, not inferred by the browser.

## Deployment and testing

Production is an immutable NGINX release selected by an atomic symlink. Acceptance covered Gmail
verification/reset, JWT and cookie policy, quote and booking ownership, CORS, idempotency, storage,
and Playwright at 1920×1080, 1024×768 and 390×844. Access logs omit query strings.

## Accessibility

The release includes semantic navigation, visible focus, keyboard operation, live regions,
responsive card/table treatments, reduced-motion support and accessible form errors.

## Known limitations and roadmap

Payments, consultant workflows, production monitoring alerts, off-host backup automation and a
durable email outbox remain future work. Sprint 3.5 may begin from `v0.6.0-SNAPSHOT`; this document
does not authorize or implement Financial Engine behavior.

