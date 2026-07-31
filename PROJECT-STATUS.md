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

DEV-004C provides the Customer Financial Portal. DEV-004F integrates it with the accepted DEV-004D
provider-neutral backend while retaining a read-only customer experience. No real provider,
payment initiation control, deployment or release candidate is included.

The integrated V1–V8 backend and real browser journey pass. See
`docs/FINANCIAL-ENGINE-INTEGRATION.md`; a future release-candidate workstream must keep the fake
provider disabled and repeat the documented security and operational gates.
