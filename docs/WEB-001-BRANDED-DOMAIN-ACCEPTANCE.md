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

Current result: runtime-origin unit tests and static reference tests are implemented. Real same-site
TLS browser, WebDev behavior, PostgreSQL 18.4/Flyway V1–V14 and full journey evidence remain mandatory;
therefore mandatory skipped/not-executed gates are non-zero and WEB-001 is not deployable yet.
