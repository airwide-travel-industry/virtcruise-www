# WEB-001 Branded Domain Hosting

Release: v0.8.0-dev. Audience: engineering, product, operations and support. Last reviewed: 2026-08-03.

## Decision

The canonical customer origin is `https://www.virtcruisetravels.com`. The browser API origin is
`https://api.virtcruisetravels.com`, routed by DNS/TLS/reverse proxy to the authoritative existing
Airwide API at `https://api.virtcruise.airwide.co.uk`. This keeps frontend and API same-site while
the backend remains on Airwide. The static production boundary is `js/runtime-config.js`; it
contains public origins only, accepts exact HTTPS origins and fails closed.

Direct use of the Airwide API from the branded page was rejected: refresh and CSRF cookies are
Secure and `SameSite=Lax`, so that topology makes session restoration depend on third-party-cookie
behavior. Moving tokens into Web Storage and changing cookies to `SameSite=None` were rejected.

## Route strategy

All application routes already have physical `index.html` files: account, authentication callback,
Bank Transfer (list/new/status/details), bookings/details, dashboard, Finance queues/details,
Financial Portal invoices/details/payments/receipts/refunds, password recovery, notifications,
preferences, profile, quotes/details, registration, travellers, trips/details and verification.
The homepage is `/index.html`; six package pages remain physical `.html` files. Query strings are
handled by browser modules. No NGINX fallback, service worker, `.htaccess` or 404 fallback is used.

## Boundaries and limitations

Read-only observation on 2026-08-03: authoritative nameservers are Cloudflare
`raina.ns.cloudflare.com` and `garret.ns.cloudflare.com`; apex is Cloudflare-proxied at TTL 300;
`www` resolves directly to `156.38.193.84` at TTL 300 and responds over TLS with Apache and a
default HTML index. Apex also returns HTTP 200 rather than redirecting to `www`.
`api.virtcruisetravels.com` does not resolve. No hosting files were changed.

The artifact is ordinary HTML/CSS/ES modules/images and has no CDN, font, Java runtime or backend
code. WebDev document root, `.htaccess`, cache/header controls, upload limit, case sensitivity and
atomic rename support require operator evidence. Security headers must be configured at WebDev;
meta tags cannot supply HSTS, `frame-ancestors` or `X-Content-Type-Options`. No service worker exists.

Activation is blocked until the API subdomain DNS, valid TLS certificate, Airwide proxy route,
branded CORS environment and branded email-link origin are proven in a real browser. Escalation:
Engineering Operations and the domain owner.
