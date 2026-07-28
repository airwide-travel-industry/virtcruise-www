# Virtcruise

Landing page for Virtcruise Travels.

## Development

No build step is required. Because the site loads ES modules and JSON data, serve the repository over HTTP rather than opening `index.html` through `file://`. For example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## GitHub Pages Deployment

The site is deployed directly as static files by `.github/workflows/deploy-pages.yml`. During the
Sprint 2.5 coordinated cutover, deployment is manual through **Run workflow** so a release push cannot
publish the frontend before the matching backend contract is live.

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Source: GitHub Actions**.
4. Open **Actions → Deploy Virtcruise to GitHub Pages** and run the workflow manually after the
   production backend cutover is confirmed.
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
