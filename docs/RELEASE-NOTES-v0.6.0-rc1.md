# Virtcruise Frontend v0.6.0-rc1

> RC-002 production validation found a blocking zero-activity financial-account contract defect.
> This candidate must not be promoted. See
> [RC-002 Production Deployment Validation](RC-002-PRODUCTION-VALIDATION.md).

## Overview

This candidate adds the authenticated Customer Financial Portal to the accepted Production Beta
customer experience. It does not deploy, replace Production Beta, expose a real payment control or
enable the backend fake provider.

## New customer experience

- Financial Overview with honest no-balance, outstanding, credit and multi-currency states.
- Invoice and deposit histories plus read-only invoice detail.
- Payment, receipt and refund histories.
- Booking-linked financial navigation.
- Loading, empty, retry, pagination, filtering and safe Problem Details presentation.

## Architecture and security

Financial views use a dedicated repository and API client over the accepted
`/api/v1/financial` contracts. Money strings and currencies are preserved without browser
accounting or conversion. Responses use memory-only caching and clear on logout. Access tokens
remain memory-only and refresh sessions remain HttpOnly cookies.

The development acceptance server logs normalized paths without query strings. Verification,
password-reset, OAuth and financial-detail parameters do not enter retained server output.

## Validation

- JavaScript, HTML/CSS assets, links, workflow YAML, unique IDs and secret scans.
- Desktop, tablet and mobile browser acceptance.
- Real RS256 authentication and PostgreSQL V1–V8 integration.
- Ownership denial, logout protection and browser-storage inspection.
- Regression coverage for authentication, customer portal, quotes, bookings and navigation.

## Upgrade

Deploy the immutable static artifact using the established versioned release directory and atomic
`current` symlink. Activate only with the matching backend `v0.6.0-rc1`. Keep the existing
Production Beta frontend as the rollback target. No frontend data migration is required.

## Rollback

Atomically restore the prior frontend release symlink, run `nginx -t`, reload NGINX and verify the
homepage, package pages and authentication entry points. Backend/database rollback is not required
for a frontend-only rollback.

## Known limitations

There is no Pay control, real provider, PDF invoice/receipt, cross-currency combined total, or
payment/receipt/refund detail endpoint. Page-local search and filtering operate on the current
server page.
