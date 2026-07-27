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

GitHub Pages provides static hosting only. The Quote Builder currently uses `sessionStorage`, while mock submissions and development references may be stored in `localStorage`; no enquiry is transmitted to Virtcruise. A future Spring Boot backend must be deployed separately, then connected by replacing the mock delegate in `js/api-client.js` without changing the frontend contract.

## Enquiry API contract

The homepage is a lightweight one-page application built with native ES modules. Service forms are rendered by `js/service-modal.js`, the shared session cart and checkout live in `js/enquiry-cart.js`, and UI code calls `js/api-client.js`. The API client currently delegates to `js/mock-api.js`, which simulates latency, validates enquiries, returns a generated reference, and optionally records successful submissions in `localStorage` under `virtcruise.mock.enquiries`. Draft cart and customer details use `sessionStorage`.

The future backend endpoint is:

```http
POST /api/v1/enquiries
Content-Type: application/json
```

The stable request contract is:

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

The expected response contract is:

```json
{
  "success": true,
  "enquiryId": "VCT-2026-000123",
  "status": "RECEIVED",
  "receivedAt": "2026-07-26T12:00:00.000Z",
  "message": "Your enquiry has been received."
}
```

When Spring Boot 3, Java 21 and PostgreSQL are introduced, replace the delegate in `js/api-client.js` with an HTTP `fetch` implementation and remove `js/mock-api.js`. The UI modules and the request/response contract should remain unchanged.

## Quote Builder

The active browser-session draft is stored as one versioned document under `virtcruise.quoteBuilder.v1`. It contains the quote identity, trip facts, stable service-request IDs, customer details, generated itinerary days, pre-travel requirements, unallocated items, and manual itinerary overrides. `js/quote-builder.js` owns draft mutations and persistence; `js/service-form-renderer.js` renders and validates the service schemas; `js/itinerary-builder.js` contains deterministic date and sequencing rules.

The mock API exposes draft, calculation, and submission methods through `js/api-client.js`. The future Spring Boot API is expected to provide:

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
