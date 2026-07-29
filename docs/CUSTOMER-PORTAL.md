# Virtcruise Customer Travel Portal

## Purpose

The customer portal extends the authenticated Virtcruise experience from account security into
quote review, booked-trip planning, saved travellers, preferences, notifications and profile
management. It uses the existing Sprint 3 authentication provider and does not create a second
session or token model.

## Navigation and routes

Authenticated header navigation follows this map:

```text
Dashboard
├── My Quotes
│   └── Quote details
├── My Bookings
│   └── Booking details
├── My Trips
│   └── Trip timeline
├── Travellers
├── Profile
├── Notifications
└── Logout
```

| Experience | Static route | Notes |
|---|---|---|
| Dashboard | `/dashboard/` | Counts, activity, security and quick actions |
| My Quotes | `/quotes/` | Search, filters, sorting and pagination |
| Quote details | `/quotes/details/?id={quoteId}` | Customer-owned, read-only review |
| My Bookings | `/bookings/` | Deposit, status and operational booking review |
| Booking details | `/bookings/details/?id={bookingId}` | Timeline, travellers, services and payment summary |
| My Trips | `/trips/` | Booked, completed and cancelled travel |
| Trip details | `/trips/details/?id={tripId}` | Timeline and expandable future modules |
| Travellers | `/travellers/` | Session-scoped traveller CRUD |
| Notifications | `/notifications/` | Read/unread notification centre |
| Preferences | `/preferences/` | Travel and communication preferences |
| Profile | `/profile/` | Personal and travel-preference details |
| Security | `/account/` | Existing password and session controls |

The query-parameter detail routes are intentional: the production frontend is a static site and
does not require NGINX route rewrites. A future server-rendered or router-backed portal may expose
equivalent `/quotes/{quoteId}` and `/trips/{tripId}` paths without changing repository contracts.

## Architecture

All pages share three modules:

| Module | Responsibility |
|---|---|
| `js/portal/portal-page.js` | Page-specific rendering, validation and interaction |
| `js/portal/portal-components.js` | Shell, navigation, badges, states, announcements and confirmation dialog |
| `js/portal/portal-repository.js` | Owned backend data, normalization, cache and pending-backend adapters |
| `js/portal/debounced-search.js` | Cancellable client-side search timing |

Views never call `fetch()` directly. `portal-repository.js` uses `authRequest()` from the existing
authentication HTTP layer and `authenticationProvider.withAccess()` for bearer-token recovery.
HTTP 401, 403, 404, 409, 422 and server/network failures are normalized into safe UI states.

## Data sources and ownership

Quote history and quote details use customer-owned backend APIs. Bookings use the authenticated
booking repository and expose customer-owned operational state, immutable timeline, traveller
snapshots and payment summary. My Trips is projected from confirmed and travel-stage bookings,
rather than maintaining a competing trip model.

Backend support for dedicated traveller, notification, preference and expanded profile resources
is pending. Their repository adapters are deliberately isolated:

- traveller and profile drafts use customer-scoped `sessionStorage`;
- preference and notification state use customer-scoped `localStorage`;
- no passport document upload or binary identity data is stored;
- the UI labels browser-only persistence honestly;
- replacing an adapter with a REST repository does not require rewriting a page.

The repository caches successful reads in memory for 60 seconds and coalesces repeat route reads.
Mutations invalidate relevant cache keys. Search is client-side and debounced, so typing does not
generate backend traffic.

## Page capabilities

### Dashboard

Provides upcoming-trip, quote, completed-trip, traveller, notification and security summaries,
recent activity and direct actions. Every collection has a deliberate empty state.

### Quotes and trips

Quotes support search, status filter, sort and client-side pagination. Quote details group
travellers, flights, accommodation, transfers, visas, activities, insurance, requests, itinerary,
notes and pricing without exposing staff-only information. Trips provide status filters, countdowns
and a daily timeline with placeholders for documents, weather and packing lists.

### Travellers

Traveller records validate required identity fields, passport expiry and likely duplicates.
Create, edit and remove actions are keyboard accessible; destructive removal uses the shared
confirmation dialog. Passport upload is a labelled future capability.

### Profile, preferences and notifications

Profile supports contact and travel preferences while the account page continues to own security.
Preferences capture interests, communications, currency and language. Notifications expose type
and read state plus an honest future-push placeholder.

## Accessibility and responsive behavior

Portal pages provide:

- a skip link, semantic landmarks and one page-level heading;
- labelled controls, accessible status badges and ARIA live announcements;
- focus restoration after dialogs and visible keyboard focus;
- keyboard-operable mobile navigation and confirmation actions;
- reduced-motion alternatives;
- error summaries and inline field errors;
- card-based quote/trip presentation that requires no horizontal table scrolling.

The layouts are validated at 1920×1080, 1024×768 and 390×844. Dense grids collapse to one column,
actions remain reachable, and no portal page requires horizontal scrolling.

## Booking engine integration

Accepted quote cards create one booking through `POST /api/v1/bookings`. The repository sends a
stable `booking-create-{quoteId}` idempotency key, disables the initiating control while active and
does not retry the POST automatically. Booking cards and details show operational status, deposit
and outstanding amounts without implying that online payment is available.

Customer cancellation requires a reason and accessible confirmation. Booking milestone
notifications use deterministic IDs in the existing notification adapter, so refreshes do not
create duplicate messages.

## Post-RC backend work

Authoritative owned resources remain pending for saved travellers, preferences, notifications and
expanded profile data, along with PDF/itinerary generation, customer quote-update requests,
conversation support, travel documents and weather/packing integrations. Each can replace its
isolated repository adapter without changing the current route or page-component contracts.
