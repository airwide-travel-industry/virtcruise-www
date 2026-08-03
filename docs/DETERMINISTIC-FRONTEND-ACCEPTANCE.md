# Deterministic Frontend Acceptance

Final consolidation (2026-08-03) passed 50 active ordinary tests and all seven mandatory
real-environment tests with zero mandatory skips, including DEV-005G3. Loopback-only operation,
external-request denial and the prohibition on runtime `networkidle` remain green.

Final DEV-005G rerun confirmation (2026-08-02): 49 active ordinary tests, all six enabled
real-environment tests, and ten repeated five-test financial groups passed. Accepted source contains
no global `networkidle` navigation and mandatory routes remained loopback-only. This deterministic
gate passes; it does not remove the separate integrated partial/full and fake-SMTP blocker.

DEV-005G2 makes mandatory browser acceptance independent of public Internet availability. Only the frontend origin and explicitly configured Virtcruise backend origin are permitted HTTP(S) origins. Browser-internal `about:`, `blob:` and `data:` resources remain permitted.

## Dependency inventory

| Resource | Source | Routes | Classification | Resolution and impact |
|---|---|---|---|---|
| Nunito and Playfair Display | `fonts.googleapis.com`, `fonts.gstatic.com` | Home, package, authentication, portal and financial pages | Runtime, non-mandatory | Removed stylesheet and connection hints from 27 pages. System/Georgia stacks remove public DNS/CDN waits. |
| Virtcruise API | configured production API or loopback `localhost:8080` | Data-backed routes | Runtime, mandatory | Retained; acceptance allows only the selected backend or deterministic intercepted API. |
| WhatsApp/social destinations | `wa.me` and social sites | Home/package links | User-initiated, optional | Retained as links; never fetched during rendering. |
| CSS, JS, images, JSON, favicon | repository-relative paths | All routes | Local runtime, mandatory | Retained; reference and server tests fail on missing assets. |

No remote `@font-face`, CSS `@import`, JavaScript import, image, favicon, iframe, analytics, service worker, manifest dependency or CDN fallback exists. Documentation URLs are non-runtime.

## Readiness and offline policy

Navigation waits for `domcontentloaded`, then observable application state. `tests/helpers/browser-acceptance.mjs` provides guest, authenticated portal, financial-page, Finance-queue and bank-transfer readiness. Readiness requires rendered headings/forms/navigation, completed bootstrap, page-specific result/empty/error content and no active `aria-busy` loading state. Real Finance bootstrap also awaits its known CSRF response. Global `networkidle` is prohibited by regression test; polling and background connections cannot hold navigation open.

`enforceOfflineAcceptance` intercepts all browser requests. It allows declared origins/internal schemes, aborts anything else, and reports only origin plus path for the resource and initiating page. Query strings cannot enter diagnostics. Tests prove representative public routes render loopback-only, Google Fonts is absent, and an injected tracker is blocked.

## Local topology

The static server resolves directories locally, uses explicit MIME types, returns real 404s, sends `Cache-Control: no-store`, logs path only, supports ephemeral port `0`, reports the resolved port and exposes reliable close semantics. It has no public redirect or fallback.

Real-backend acceptance uses PostgreSQL 18.4, backend `2e9bd74768c0989b760a19568512af896d3cc22f`, temporary RSA keys outside both repositories, a local-only authentication key, deterministic scanning, private temporary proof storage and loopback origins. Bank-transfer processing is enabled only for the journey requiring payment/receipt projections.

## Accessibility, responsive and privacy

Font loading is not a content prerequisite. Existing headings, landmarks, labels, focus-visible styling, keyboard navigation, dialog behavior, live regions, reduced-motion CSS and currency text remain unchanged. Automated geometry covers 1920×1080, 1024×768 and 390×844 without horizontal overflow for affected financial, Finance and bank-transfer routes.

Logs exclude query strings. Tests assert that tokens, proof bytes/paths, filenames and financial DTOs are absent from browser storage. No persistent browser profile is used.

## DEV-005G rerun prerequisite

From a clean checkout: install locked dependencies, pass 49/49 ordinary active tests, pass all six separately enabled real-backend tests with zero skips, pass the five-test financial group ten consecutive times, and retain clean responsive/security/network diagnostics. DEV-005G2 does not itself rerun or accept DEV-005G.
