# Virtcruise Frontend Architecture v0.2.0

## Purpose and topology

Virtcruise WWW is a dependency-free, multi-page static frontend. Native ES modules provide a
lightweight single-page experience on the homepage while dedicated package pages remain directly
addressable.

```text
Browser
  -> NGINX static frontend (https://virtcruise.airwide.co.uk)
  -> js/api-client.js and repositories
  -> HTTPS API (https://api.virtcruise.airwide.co.uk)
  -> Spring Boot 3.5.4
  -> PostgreSQL 18
```

NGINX, rather than GitHub Pages, serves the customer-facing production domain. GitHub Pages is an
inactive preview artifact.

## Browser application

`index.html` contains the fixed header, hero and Quick Quote, service cards, Featured Tours,
Victoria Falls feature, package shop, About section, footer, and the shared application panel.
`js/main.js` coordinates those sections and routes service actions to one Quote Builder.

The Quote Builder is composed from:

| Responsibility | Source |
|---|---|
| Shell, review, checkout and focus behavior | `js/quote-builder.js` |
| Versioned state and persistence | `js/quote-state.js` |
| Service schemas and inline validation | `js/service-form-renderer.js` |
| Deterministic itinerary projection | `js/itinerary-builder.js` |
| Aggregate API mapping | `js/quote-api-mapper.js` |
| Package-to-trip adapter | `js/package-quote-adapter.js` |
| Domain state operations | `js/quote-domains/` |

My Trip is the Quote Builder's local itinerary review, not a second cart. It supports service
editing, removal, ordering, expandable summaries, dated itinerary entries, pre-travel requirements,
unallocated work, notes, traveller counts, dates, and estimated package prices.

## Catalogue and package pages

`js/repositories/package-repository.js` is the single package data abstraction. It consumes the
production list, featured, ID and slug endpoints and normalizes responses for homepage cards,
Featured Tours and the six files under `packages/`. `js/shop.js` provides catalogue filtering and
package details. `js/package-page.js` renders a package page from the same repository and adds the
selected package to the shared draft.

Production package responses are cached in memory and in browser storage for offline recovery.
`data/packages.json` is used only in explicit mock mode or as an offline/development fallback. The
catalogue shop identifies fallback results; fallback content must not be presented as live production
inventory.

## API and runtime modes

`js/api-client.js` selects exactly one mode:

| Mode | Selection | Data path |
|---|---|---|
| Production | default | `https://api.virtcruise.airwide.co.uk` |
| Local backend | `?api=local` | `http://localhost:8080` |
| Browser mock | `?api=mock` | dynamically loaded `js/mock-api.js` |

Repositories under `js/repositories/` isolate HTTP, packages, quotes, future customer operations,
caching, retry policy and the offline queue. Production quote submission is one aggregate
`POST /api/v1/quotes`; it never creates a customer separately. Production success is accepted only
when the API returns a quote ID, quote number, customer ID, client reference and status. Production
does not generate mock references.

GET requests use bounded retry and timeout handling. POST submission is never automatically retried;
intentional retries reuse the logical quote's stable idempotency key.

## Browser storage

| Key | Storage | Purpose |
|---|---|---|
| `virtcruise.quoteBuilder.v1` | `sessionStorage` | Active versioned trip draft |
| `virtcruise.offline.quoteQueue.v1` | `localStorage` | Undelivered aggregate submissions |
| `virtcruise.packageCatalog.v1` | `localStorage` | Last usable package catalogue |

The offline queue stores the aggregate payload, idempotency key, client reference and original queue
time. It flushes serially. Queued work is explicitly described as not delivered until a real API
confirmation arrives.

## Authentication and customer portal

Sprint 3 authentication is the single security boundary for the customer portal. Access tokens
remain memory-only, refresh tokens remain secure HttpOnly cookies, and cookie-authenticated
operations use the backend CSRF contract. Portal pages reuse that provider through the authenticated
HTTP adapter.

`js/portal/portal-repository.js` is the only portal data gateway. It loads owned quote history and
details, loads owned bookings, projects travel-stage bookings into My Trips, normalizes errors,
coalesces requests and applies a short memory cache. Pending dedicated backend resources for
travellers, notifications, preferences and expanded profile data are isolated behind
customer-scoped browser adapters.

Presentation is divided between `js/portal/portal-page.js` and reusable shell, state, badge, dialog
and announcement components in `js/portal/portal-components.js`. See
[Customer Travel Portal](CUSTOMER-PORTAL.md) for routes and the Sprint 3.4 migration boundary.

## UX, accessibility and presentation

The responsive interface uses CSS breakpoints and fluid sizing for desktop, tablet and mobile.
Playfair Display is reserved for major headings and prices; Nunito is the interface and body font,
with system fallbacks. Accessible behavior includes semantic navigation, keyboard dropdowns,
focus trapping and restoration in the Quote Builder, Escape/backdrop closing, scroll locking,
visible focus indicators, ARIA live status, inline validation, and keyboard alternatives for
itinerary ordering.

## Related documentation

- [Quote Builder](QUOTE-BUILDER-v0.2.0.md)
- [Deployment](DEPLOYMENT-v0.2.0.md)
- [Operations](OPERATIONS-v0.2.0.md)
- [Release notes](RELEASE-NOTES-v0.2.0.md)
- [Customer Travel Portal](CUSTOMER-PORTAL.md)
- Backend repository: `airwide-travel-industry/virtcruise-backend`; production baseline `v0.2.0`,
  release-candidate contract `v0.5.0-rc1`
- [Release candidate notes](RELEASE-NOTES-v0.5.0-rc1.md)
