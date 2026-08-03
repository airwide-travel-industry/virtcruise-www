# Virtcruise Web v0.7.0-rc1 Release Notes

Release candidate `v0.7.0-rc1` packages the accepted Sprint 3.6 frontend at source commit
`a711733` as the immutable archive `virtcruise-www-v0.7.0-rc1.tar.gz`.

## Scope and architecture

The candidate contains the accepted customer Bank Transfer and Financial experiences, private
proof upload/replacement lifecycle, Finance Operations Portal, payment/Receipt history and Booking
continuation. It uses the existing API-owned accounting and lifecycle state, memory-only access
tokens, application-specific readiness and loopback/offline acceptance guard. It adds no feature or
architecture change.

## Qualification

The ordinary suite passed 50 active tests; seven operator-gated tests were intentionally disabled
there and executed in the mandatory real environment instead. Immutable frontend/backend staging
passed customer PDF/JPEG/PNG replacement, Finance 4/4, Financial Portal 1/1 and same-invoice
partial-to-full 1/1 with zero enabled skips. Desktop, tablet and mobile, keyboard/focus/live status,
clean console/network/CORS/storage and public-Internet denial remain accepted.

The archive and CycloneDX JSON/XML SBOMs were generated twice and were byte-identical. `npm audit`
reported zero vulnerabilities. Checksums, dependency inventory and manifest accompany the archive.

Candidate SHA-256 values:

- Archive: `0b3b1bc7aa79a4c28d26583cc4db7372a8ae4d47d469e422be3213486d19ac07`
- CycloneDX JSON: `ca20e680e2c2566af2f2a507b68c98a53bcacd4e8f66443a602b0d8c39160c8a`
- CycloneDX XML: `93b7ac2d4722850bc824237408648268129fe92c21844b9f616b6bd2a19b375e`
- Dependency inventory: `d0a0dd5e720b2ce28ffe31025633eeef7ff758830a5856e5dd1e4b9623932153`

## Upgrade and rollback

Extract into a versioned release directory, verify SHA-256, then atomically switch the web-root
symlink. Configure the exact backend origin and matching CORS policy; do not expose development,
admin or OpenAPI paths. Retain the previous immutable directory and use
`ROLLBACK-v0.7.0-rc1.md` for the reversal order.

## Known limitations

Local deterministic browser timing is not production/public-Internet capacity evidence. Edge
validation, configuration sign-off and restore rehearsal remain RC-002 prerequisites. OCR,
automated bank reconciliation and dual approval are not candidate features.
