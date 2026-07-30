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

## Technical debt and limitations

- No payments, consultant portal or CRM.
- Some portal preferences and traveller data remain local pending dedicated APIs.
- Email delivery is synchronous; a durable outbox is future work.
- Broader monitoring, WAF/rate-limit edge controls and off-host backup automation remain open.
- Query strings are intentionally absent from NGINX operational logs.

## Roadmap

Sprint 3.5 is the next planned development increment. No Financial Engine implementation is part of
this snapshot.
