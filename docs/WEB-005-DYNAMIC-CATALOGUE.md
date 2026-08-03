# WEB-005 Dynamic Catalogue

## Status

The customer catalogue now reads the accepted public projection at `/api/v1/catalogue/packages`, `/featured`, and `/{slug}` when `dynamicCatalogueEnabled` is true. The flag defaults to true in `js/runtime-config.js`; setting it to false restores the legacy `data/packages.json` catalogue.

Dynamic mode does not fall back to hardcoded data after HTTP, authorization, timeout, or malformed-response failures. It may use browser data previously obtained from the published API while offline. This prevents drafts or a misleading legacy catalogue from replacing authoritative publication state.

## Delivered frontend behavior

- Published cards, featured tours, Victoria Falls content, price/price-on-request, duration, highlights, cover/gallery media, alt text, captions, CTA, SEO, Open Graph and JSON-LD mapping.
- Search, destination and package-type request parameters plus paged-response rendering and stable API ordering.
- Loading, empty, no-featured, missing-image, missing-price, offline, 404 and generic failure states.
- `TRIP_ADD_ON` records are excluded from the primary grid. Car Rental remains the existing separate supporting add-on.
- Public media references are ordered and storage-like/private references are rejected.
- 60-second memory caching, browser HTTP caching, ETag revalidation where supplied, cache clear on reconnect, and published-only offline cache.

## Acceptance constraints

The accepted backend list endpoint currently returns an unpaged `List`, accepts only `destination` and `type`, and orders by title. It does not implement `page`, `size`, or `search`; the frontend is ready to consume those parameters and a Spring-style page response, but server pagination/search cannot be accepted end-to-end in WEB-005 without changing the excluded backend.

The public DTO contains highlights, SEO, CTA, pricing and media, but not inclusions, exclusions, itinerary, FAQ, terms, or add-on relationships. Those fields therefore cannot be rendered authoritatively. No hardcoded substitute is shown in dynamic mode.

## Rollback

Change only `dynamicCatalogueEnabled` to `false`, rebuild through the normal artifact process, and verify the source label through repository diagnostics. No backend, database, deployment, or production mutation is part of WEB-005.
