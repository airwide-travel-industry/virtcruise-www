# REL-HARDEN-002 Frontend Production-Beta Packaging Hardening

Target: `0.8.0-beta.1`
Backend compatibility: `05378a05285756a995517b0cbcf68aefbf99751f`

The former Airwide profile copied the generic development tree without a production boundary. It
therefore inherited stale `hotfix-e9662ea` identity, query-selectable local and mock modes,
loopback API configuration, the mock implementation and the static mock catalogue. It also omitted
Content Studio, Operational Readiness (Control Tower), and local font assets.

The new `production-beta` profile fails closed when expected source inputs change. It emits a
production-only API client and repositories, removes development selection and presentation paths,
excludes `js/mock-api.js` and `data/`, includes all required application modules and fonts, and
normalises canonical/Open Graph metadata to `https://virtcruise.airwide.co.uk`. Repository-only
development tools and fixtures remain available to tests but are not packaged.

The production archive scan reports zero occurrences of stale identity, localhost, loopback IPs,
active local/mock selectors, mock API imports, development preview text, source maps, private API
routes, credentials, or branded legacy canonical origins. Browser acceptance passed at 1920×1080,
1024×768 and 390×844 with only the authorised Airwide API origin observed.
