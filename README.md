# Virtcruise Frontend

> Production Beta remains frontend `v0.5.0-rc3` / backend `v0.5.0-rc2`. The current candidate is
> `v0.6.0-rc1`.

Release documentation: [Production Beta](docs/PRODUCTION-BETA.md),
[release notes](docs/RELEASE-NOTES-v0.5.0-beta.md),
[project status](PROJECT-STATUS.md), and [architecture decisions](docs/architecture/ADR/).

Production static frontend for Virtcruise Travels.

- Production: https://virtcruise.airwide.co.uk
- API: https://api.virtcruise.airwide.co.uk
- Release candidate in preparation: `v0.5.0-rc3` (frontend only; not deployed)
- Current production release: `v0.2.0`
- Matching backend RC: [`airwide-travel-industry/virtcruise-backend`](https://github.com/airwide-travel-industry/virtcruise-backend), `v0.5.0-rc2`

Native HTML, CSS and ES modules provide the homepage, package catalogue/pages, Quick Quote,
Quote Builder, My Trip, authentication and the customer travel portal. Production is served by
NGINX and sends one aggregate, idempotent `POST /api/v1/quotes` to the Spring Boot backend.

## Documentation

- [Architecture v0.2.0](docs/ARCHITECTURE-v0.2.0.md)
- [Quote Builder v0.2.0](docs/QUOTE-BUILDER-v0.2.0.md)
- [Deployment v0.2.0](docs/DEPLOYMENT-v0.2.0.md)
- [Operations v0.2.0](docs/OPERATIONS-v0.2.0.md)
- [Release notes v0.2.0](docs/RELEASE-NOTES-v0.2.0.md)
- [Release notes v0.5.0-rc3](docs/RELEASE-NOTES-v0.5.0-rc3.md)
- [Release notes v0.6.0-rc1](docs/RELEASE-NOTES-v0.6.0-rc1.md)
- [Release notes v0.5.0-rc2](docs/RELEASE-NOTES-v0.5.0-rc2.md)
- [Release notes v0.5.0-rc1](docs/RELEASE-NOTES-v0.5.0-rc1.md)
- [Changelog](CHANGELOG.md)
- [Local authentication development](docs/LOCAL-AUTHENTICATION.md)
- [Customer Travel Portal](docs/CUSTOMER-PORTAL.md)
- [Customer Financial Portal](docs/FINANCIAL-PORTAL.md)
- [Financial Portal Acceptance](docs/FINANCIAL-PORTAL-ACCEPTANCE.md)
- [Financial Engine integration](docs/FINANCIAL-ENGINE-INTEGRATION.md)
- [Booking Engine](https://github.com/airwide-travel-industry/virtcruise-backend/blob/main/docs/BOOKING-ENGINE.md)

## Development

No build step is required. Because the site loads ES modules and JSON data, serve the repository over HTTP rather than opening `index.html` through `file://`. For example:

```sh
node scripts/safe-static-server.mjs 8000
```

Then open `http://localhost:8000/`.

The development server deliberately logs normalized paths without query strings so verification,
password-reset and OAuth codes do not enter terminal output or retained acceptance logs.

Use `?api=mock` for the explicit browser mock or `?api=local` for a backend at
`http://localhost:8080`. There is no build step. A basic quality gate is:

```sh
for file in js/*.js js/repositories/*.js js/quote-domains/*.js js/auth/*.js js/portal/*.js; do
  node --check "$file"
done
```

Sprint 3 authentication must be tested against the real local backend and PostgreSQL. See
[Local authentication development](docs/LOCAL-AUTHENTICATION.md) for routes, storage guarantees,
CSRF/cookie troubleshooting, and the matching backend runbook.

## Customer portal

Authenticated customers can use the dashboard, owned quote review, booked-trip timelines, saved
travellers, notifications, travel preferences and expanded profile pages. Portal views use
`js/portal/portal-repository.js`; they do not call `fetch()` or create another authentication state.
See [Customer Travel Portal](docs/CUSTOMER-PORTAL.md) for the navigation map, routes, data ownership,
browser-only adapters and post-RC backend boundaries.

Accepted quotes can be converted into idempotent customer-owned bookings. `/bookings/` and
`/bookings/details/?id=…` provide status, timeline, traveller and payment-summary review; confirmed
booking stages feed My Trips. Payment capture remains Sprint 3.5 work.

## Customer financial portal

Sprint 3.5 adds protected `/financial/`, invoice/deposit, payment, receipt and refund views backed
by the accepted `/api/v1/financial` application contract. Financial responses use a dedicated
repository, strict DTO mapping and memory-only caching. Amounts retain their backend currency and
are never combined or converted in the browser. No real payment control, ledger view or fake
document download is exposed. See [Customer Financial Portal](docs/FINANCIAL-PORTAL.md).

DEV-004F confirms these unchanged read contracts against the provider-framework backend and a clean
Flyway V1–V8 PostgreSQL database. The portal remains read-only and does not expose the fake
provider. See [Financial Engine integration](docs/FINANCIAL-ENGINE-INTEGRATION.md).

## GitHub Pages Deployment

GitHub Pages is a manually published preview artifact. It is not the production custom-domain host.
Production uses the versioned NGINX process in
[Deployment v0.2.0](docs/DEPLOYMENT-v0.2.0.md).

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Source: GitHub Actions**.
4. Open **Actions → Deploy Virtcruise to GitHub Pages** and run the workflow manually.
5. Open the deployment URL shown by the workflow or in Pages settings.

The workflow creates a temporary `_pages/` staging directory on the Actions runner and publishes only `index.html`, `.nojekyll`, and the public `css/`, `js/`, `images/`, `data/`, and `packages/` directories. `_pages/` is not committed. Relative URLs make the site compatible with a project URL such as `https://airwide-travel-industry.github.io/virtcruise-www/`.

Quote drafts remain in `sessionStorage`. Normal site traffic uses the production API at
`https://api.virtcruise.airwide.co.uk`. Development can explicitly select `?api=mock` for the
browser-only mock or `?api=local` for a backend at `http://localhost:8080`. Mock modules are loaded
dynamically only in explicit mock mode.

## Enquiry API contract

The homepage is a lightweight one-page application built with native ES modules. Service forms are
rendered by `js/service-form-renderer.js`, the Quote Builder shell lives in `js/quote-builder.js`, and
UI code calls `js/api-client.js`. The API client is the single adapter between the rich browser model
and the customer/quote REST contracts. `js/mock-api.js` is development-only. Repository modules in
`js/repositories/` add caching, retry handling, offline package-catalogue fallback and an offline
quote queue without coupling views to JSON or REST.

Production submission sends the complete Quote Builder aggregate in one request:

```http
POST /api/v1/quotes
Content-Type: application/json
Idempotency-Key: submit-quote-<stable logical quote identity>
```

The backend atomically creates or reconciles the customer and creates the quote. The API adapter preserves
nested service details, traveller counts and itinerary structures. Only a confirmed backend response
containing the quote ID, quote number, customer ID, client reference and status displays a production
quote number or clears the browser draft. Production never creates a customer separately.

The aggregate request contract includes:

```json
{
  "quoteId": "quote-stable-client-reference",
  "customer": {
    "fullName": "Example Traveller",
    "email": "traveller@example.com",
    "mobile": "+263 000 000 000",
    "preferredContactMethod": "WHATSAPP"
  },
  "serviceRequests": [
    {
      "serviceType": "FLIGHT",
      "details": {
        "departureCity": "Harare",
        "destinationCity": "Cape Town"
      }
    }
  ],
  "itineraryDays": [],
  "unallocatedItems": [],
  "preTravelRequirements": [],
  "specialRequests": [],
  "overallNotes": "",
  "consent": true,
  "source": "VIRTCRUISE_WWW"
}
```

## Quote Builder

The active browser-session draft is stored as one versioned document under
`virtcruise.quoteBuilder.v1`. It contains the quote identity, trip facts, stable service-request IDs,
customer details, generated itinerary days, pre-travel requirements, unallocated items, and manual
itinerary overrides. `js/quote-state.js` owns draft composition and persistence.
`js/quote-domains/` separates customer, travellers, trip, packages, flights, accommodation, visa,
transfers, activities and special-request state. `js/service-form-renderer.js` renders and validates
the schemas; `js/itinerary-builder.js` contains deterministic date and sequencing rules.

Itinerary editing remains browser-local until it is submitted. The public website does not read,
update or delete submitted quotes and does not use customer lookup/history endpoints. Repository
methods for those future authenticated capabilities remain isolated from the public journey.

Packages load from `/api/v1/packages` and `/api/v1/packages/featured`. The local JSON catalogue is used
only in explicit mock mode, while offline, or when the production catalogue is unavailable or has no
active records. Package responses are cached to avoid duplicate requests.

If a user submits while the browser is offline, the aggregate is queued under
`virtcruise.offline.quoteQueue.v1`, together with its stable idempotency key, client reference and
original queued timestamp. The UI explicitly states that it has not reached Virtcruise. Queue entries
flush one at a time when connectivity returns; a success state appears only after backend confirmation.

The production reverse proxy must expose `/api/v1/quotes` and the package catalogue routes, and its
CORS allow-list must include every production frontend origin. The frontend deliberately does not
fall back to the legacy two-step customer/quote flow when the aggregate route is unavailable.

## Known limitations

The current customer portal derives trips from customer-owned bookings. Dedicated traveller,
notification, preference and extended-profile backend resources remain future work. It does not
provide payments, real-time supplier availability, downloadable documents or a staff portal.
Offline submissions remain on the originating device until delivered. JavaScript and CSS currently
use a one-day cache lifetime; see [Operations v0.2.0](docs/OPERATIONS-v0.2.0.md).
