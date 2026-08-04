# WEB-005A Public Catalogue Contract

The canonical anonymous surface is `GET /api/v1/catalogue/packages`, `/featured`, and `/{slug}`. No public mutation or `/api/v1/content/**` alias exists.

Collection search is case-normalized and literal-wildcard-safe across title, destination and package type; blank input means no search. Exact destination/type, primary-versus-add-on, featured, and effective-publication-range filters are supported. Only title and effective publication time are sortable. Pages are zero-based, bounded to 100 rows, and ordered with an identity tie-break.

Only the active projection whose `effectiveFrom <= now < effectiveUntil` is visible. Featured excludes trip add-ons, and no rows returns 200 with an empty array/page. Slugs are normalized to lowercase, aliases are accepted when active, and missing or non-public records share the same safe 404.

V17 adds customer-safe version JSON and effective dates to the projection, filters projected pricing to the effective publication instant, filters media to clean/public items, and adds title, destination and featured indexes. List/detail reads remain fixed-query projections, so pricing/media do not cause N+1 queries.

Customer-safe fields and omissions are defined in `WEB-005-API-INTEGRATION.md`. Media captions, related packages, dedicated canonical/Open Graph columns, and price sorting remain unsupported because accepted domain data is absent or ambiguous.

Homepage readiness is explicit for dynamic success, empty and unavailable outcomes. Local tests mock these public endpoints exactly. The rollback flag continues to use the legacy catalogue and reaches the same completion signal.
