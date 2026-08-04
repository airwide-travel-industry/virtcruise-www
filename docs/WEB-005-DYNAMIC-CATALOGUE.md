# WEB-005 Dynamic Catalogue

Dynamic mode reads only the anonymous published routes under `/api/v1/catalogue/packages`. `dynamicCatalogueEnabled=false` retains the accepted legacy JSON rollback path; dynamic failures never select legacy content or drafts.

The homepage now publishes `document.documentElement.dataset.catalogueReady`. It changes from `loading` to `complete` after success, an empty response, or the safe unavailable fallback, and emits `virtcruise:catalogue-ready`. Featured and Victoria Falls regions always leave `aria-busy`; ordinary catalogue unavailability is customer-safe and does not produce a console error.

The adapter maps server page metadata, search and approved filters/sorts. It maps published inclusions, exclusions, itinerary, customer notes, effective dates, pricing, public media, CTA, SEO and Open Graph data. Private/storage-like media references remain rejected. Memory and browser caching use a 60-second public freshness window; ETags are revalidated if supplied. The offline cache contains only normalized data previously read from public routes.

Local browser fixtures route the exact catalogue URLs and separately represent page success, featured success, and empty catalogue behavior. Authentication fixtures do not impersonate catalogue responses.

Known limitation: accepted data has no media-caption column, related-package model, dedicated canonical/Open Graph columns, or authoritative price-sort definition. JSON SEO/CTA values are projected where present; no unsupported value is invented.
