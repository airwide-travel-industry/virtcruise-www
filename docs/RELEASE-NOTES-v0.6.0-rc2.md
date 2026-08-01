# Virtcruise Frontend v0.6.0-rc2

## Overview

RC2 retains the accepted Customer Financial Portal and closes the RC-002 zero-activity lifecycle
gap with the matching backend. The Financial Overview always retrieves the authoritative default
ZAR Financial Account exactly once, including when every financial history is empty.

## Validation

- Actual registration, verification, login and Financial Overview browser journey.
- HTTP 200 account retrieval, OPEN ZAR account and `ZAR 0.00` presentation.
- Empty invoices, deposits, payments, receipts and refunds.
- Chrome at 1920×1080, 1024×768 and 390×844 with no overflow.
- Clean console/network/CORS, no fetch loop, memory-only financial caching and access token.
- Ownership denial, keyboard/focus behavior, logout and protected browser-back navigation.
- npm audit and reproducible CycloneDX SBOM generation are required before tagging.

## Upgrade

Install the immutable tarball under `/var/www/virtcruise/releases/<RC2-commit>` without editing its
contents. Activate only after the matching backend is healthy on Flyway V8, then atomically update
`/var/www/virtcruise/current`, validate NGINX and reload it. The artifact must retain the production
API target and include all authentication, booking, financial, font and static assets.

## Rollback

Restore `/var/www/virtcruise/current` to the accepted Production Beta commit
`6e8abd809693c1b17d78c0bebf701828e7051927`, validate NGINX and reload. Restore the prior NGINX
configuration if the RC2 route boundary contributes to failure. No frontend data migration exists.

## Known limitations

There is no Pay control, real provider, PDF invoice/receipt, cross-currency combined total or
payment/receipt/refund detail endpoint. Page-local search and filtering operate on the current
server page.
