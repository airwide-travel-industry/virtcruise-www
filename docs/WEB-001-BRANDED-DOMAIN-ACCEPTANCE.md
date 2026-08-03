# WEB-001 Branded Domain Acceptance

Status: engineering qualification incomplete; production deployment not authorized.

Static acceptance must use the extracted artifact on an ordinary static server without SPA
fallback. Browser hostnames must exercise the registrable-domain relationship between `www` and
`api.virtcruisetravels.com`; localhost alone is insufficient. Use Chrome at 1920×1080, 1024×768
and 390×844 with public Internet denied except the isolated frontend/API topology.

For every route listed in the hosting document, test navigation, refresh, direct/new-tab/shared
entry, back/forward, query and trailing slash. Test registration, deterministic verification,
login, restoration/refresh, reset, logout/logout-all, unauthenticated redirects and back protection.
Test Dashboard, Profile, Quotes, Bookings, Trips, Financial Portal and Manual Finance. In an isolated
SELF_SERVICE profile also test instructions, multipart proof upload, private Blob retrieval,
Finance approval and customer continuation. Inspect OPTIONS, credentials, Authorization, CSRF and
Idempotency-Key headers; invalid and null origins must be denied.

Inspect console, network, cookies, localStorage, sessionStorage, IndexedDB and Cache Storage. Tokens,
proof bytes, financial DTOs, internal comments, credentials and stack traces must be absent from
persistent browser storage and logs. Verify skip link, headings, landmarks, labels, focus, keyboard,
dialogs/live regions, reduced motion and no horizontal overflow. No accessibility score is claimed.

WEB-001A executed the eight previously skipped frontend tests with zero skips. Results: Finance
4/4; Financial Portal 1/1; Manual Finance 1/1; customer Bank Transfer 1/1 with both JPEG and PNG
replacement variants; partial-to-full Self Service 1/1 with deterministic SMTP. The unchanged
ordinary frontend selection passed 55/55. Full backend PostgreSQL verification ran 619 tests with
zero failures/errors; its one real-ClamAV conditional test was then enabled separately and passed.
Flyway V1–V14, Hibernate validation, PostgreSQL 18.4/UTF-8/UTC/SCRAM and real Chrome passed.

The isolated branded HTTPS result passed registration, verification, login/restoration, Secure
HttpOnly Lax refresh cookie, Lax CSRF cookie/header bootstrap, logout, logout-all, password reset,
back protection, no token storage, 15 routes and three viewports. Public acceptance remains blocked:
the API hostname is unresolved, public TLS/proxy do not exist, production branded CORS is denied,
and the accepted artifact has not been staged or uploaded to WebDev.
