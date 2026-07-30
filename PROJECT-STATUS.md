# Project Status

## Baseline

Production Beta pairs frontend `v0.5.0-rc3` with backend `v0.5.0-rc2`. The release branch is
`release/v0.5`; ongoing development uses `v0.6.0-SNAPSHOT`.

## Architecture and quality

- Static HTML/CSS and vanilla ES modules using repository abstractions.
- Memory-only access tokens, cookie refresh sessions and protected portal routes.
- Cached/coalesced catalogue and portal reads; responsive lazy-loaded page modules.
- Automated syntax, navigation, authentication bootstrap and Playwright browser checks.
- Keyboard navigation, focus visibility, live regions and mobile card alternatives.
- Customer financial overview, invoices/deposits, payments, receipts and refunds use accepted V7
  DTOs with exact multi-currency rendering and memory-only financial caching.

## Technical debt and limitations

- No real payment initiation, provider integration, consultant portal or CRM.
- Financial API dates, allocation detail, customer-safe document downloads and cross-currency
  account discovery remain backend contract gaps.
- Some portal preferences and traveller data remain local pending dedicated APIs.
- Email delivery is synchronous; a durable outbox is future work.
- Broader monitoring, WAF/rate-limit edge controls and off-host backup automation remain open.
- Query strings are intentionally absent from NGINX operational logs.

## Roadmap

DEV-004C is the customer Financial Portal increment. DEV-004D remains the next financial
workstream after DEV-004C acceptance.
