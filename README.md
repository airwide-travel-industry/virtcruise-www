# Virtcruise

Landing page for Virtcruise Travels.

## Development

No build step is required. Because the site loads ES modules and JSON data, serve the repository over HTTP rather than opening `index.html` through `file://`. For example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## GitHub Pages Deployment

The site is deployed directly as static files by `.github/workflows/deploy-pages.yml`. The workflow runs on pushes to `main` and can also be started manually with **Run workflow**.

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Source: GitHub Actions**.
4. Push to `main`, or open **Actions → Deploy Virtcruise to GitHub Pages** and run the workflow manually.
5. Open the deployment URL shown by the workflow or in Pages settings.

The workflow creates a temporary `_pages/` staging directory on the Actions runner and publishes only `index.html`, `.nojekyll`, and the public `css/`, `js/`, `images/`, `data/`, and `packages/` directories. `_pages/` is not committed. Relative URLs make the site compatible with a project URL such as `https://airwide-travel-industry.github.io/virtcruise-www/`.

The production deployment is also served from `https://virtcruise.airwide.co.uk`. Quote drafts remain
in `sessionStorage`, but completed production submissions are sent to
`https://api.virtcruise.airwide.co.uk`. Add `?api=mock` to the page URL for an explicitly local mock
submission, or `?api=local` to use a backend at `http://localhost:8080`.

## Enquiry API contract

The homepage is a lightweight one-page application built with native ES modules. Service forms are rendered by `js/service-modal.js`, the shared session cart and checkout live in `js/enquiry-cart.js`, and UI code calls `js/api-client.js`. The API client is the single adapter between the rich browser model and the current customer/quote REST contracts. `js/mock-api.js` remains available only when mock mode is explicitly requested.

Production submission creates the customer and then the quote:

```http
POST /api/v1/customers
POST /api/v1/quotes
Content-Type: application/json
```

The API adapter maps the browser model to the backend DTOs and stores the current service summary in
the quote notes until the full Quote Builder backend is delivered. A successful response displays
the real backend quote number. A failed quote creation triggers best-effort cleanup of the customer
created during that request.

The browser-side model remains:

```json
{
  "customer": {
    "fullName": "Example Traveller",
    "email": "traveller@example.com",
    "mobile": "+263 000 000 000",
    "preferredContactMethod": "WHATSAPP"
  },
  "items": [
    {
      "serviceType": "FLIGHT",
      "details": {
        "departureCity": "Harare",
        "destinationCity": "Cape Town"
      }
    }
  ],
  "notes": "",
  "consent": true,
  "source": "VIRTCRUISE_WWW"
}
```

## Quote Builder

The active browser-session draft is stored as one versioned document under `virtcruise.quoteBuilder.v1`. It contains the quote identity, trip facts, stable service-request IDs, customer details, generated itinerary days, pre-travel requirements, unallocated items, and manual itinerary overrides. `js/quote-builder.js` owns draft mutations and persistence; `js/service-form-renderer.js` renders and validates the service schemas; `js/itinerary-builder.js` contains deterministic date and sequencing rules.

Draft and itinerary calculation remain browser-local in RC1. Sprint 2 is expected to provide:

```text
POST   /api/v1/quotes
GET    /api/v1/quotes/{quoteId}
PUT    /api/v1/quotes/{quoteId}
POST   /api/v1/quotes/{quoteId}/services
PUT    /api/v1/quotes/{quoteId}/services/{serviceRequestId}
DELETE /api/v1/quotes/{quoteId}/services/{serviceRequestId}
POST   /api/v1/quotes/{quoteId}/itinerary/calculate
PUT    /api/v1/quotes/{quoteId}/itinerary
POST   /api/v1/quotes/{quoteId}/submit
```

The frontend currently proposes the itinerary. The future backend will become authoritative for persistence, itinerary versions, pricing, taxes, availability, package rules, feasibility and conflicts, expiry, customer records, consultant changes, and final itinerary generation. The UI contract should remain stable when the mock methods are replaced with HTTP calls.
