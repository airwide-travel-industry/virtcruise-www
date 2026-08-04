# WEB-005A Final Report

## 1. Starting commits

- Backend: `f84f337142e6c95eaa80757d131679391d1cacc5`
- Frontend: `b88817b2be1d177b097de431245677c922117077`

Both worktrees were clean on `workstream/WEB-003-package-content-management`.

## 2. Final commits

- Backend: `c180995` (functional predecessor `bf1d04d`)
- Frontend: `998a4ea` for completed implementation and documentation; the report-only commit is repository `HEAD`.

## 3. Root causes

The desktop, tablet and mobile homepage tests routed every API request to an authentication-shaped fixture. Both catalogue calls therefore received malformed data and produced no cards, while the test waited indefinitely for exactly three cards instead of an application lifecycle state. The desktop, tablet and mobile guest-navigation harness recognized the obsolete `/api/v1/packages` prefix rather than `/api/v1/catalogue/packages`; list and featured calls received harness 404s, and ordinary fallback handling logged a console error. Captured requests were `GET https://api.virtcruisetravels.com/api/v1/catalogue/packages?size=12&sort=title&direction=asc` and `GET https://api.virtcruisetravels.com/api/v1/catalogue/packages/featured`. The 404s were fixture-prefix defects, not missing backend routes, missing published data, malformed queries, or origin/proxy mismatch.

## 4. Scope delivered

Anonymous published list, featured list and slug detail; literal normalized public search; title/destination/type/add-on/featured/publication-date filters; bounded stable paging; approved sorting; effective publication visibility; expanded safe detail projection; clean public pricing/media projection; customer-safe Problem Details; deterministic homepage readiness; empty/unavailable fallbacks; exact local public-route fixtures; focused security, PostgreSQL and performance evidence.

## 5. Scope explicitly excluded

Booking, Financial, Bank Transfer, Proof Upload, Notifications, Manual Finance, authentication architecture, Content Studio management workflows, staff package-management APIs, deployment, DNS, TLS, NGINX, production, the v0.7.0 release, urgent hotfix deployment, WEB-006, push, merge and release tagging were unchanged. DOC-001 through DOC-011 were untouched.

## 6. Public routes

- `GET /api/v1/catalogue/packages`
- `GET /api/v1/catalogue/packages/featured`
- `GET /api/v1/catalogue/packages/{slug}`

No public mutation or management-route alias was introduced.

## 7. Search, filtering, sorting and pagination

Inputs: zero-based `page`; `size` 1–100; `search`; `title`; exact `destination`; `type`; `tripAddOn`; `featured`; `publishedAfter`; `publishedBefore`; `sort=title|publishedAt`; `direction=asc|desc`. Search trims/lowercases input, escapes wildcard characters, searches customer title/destination/type only, and treats blank input as absent. Unsupported page/date/sort inputs return safe 400 Problem Details. Metadata is `page`, `size`, `totalElements`, `totalPages`, `hasNext`, `hasPrevious`; `package_id` is the deterministic tie-break. Counts are server authoritative.

## 8. Package detail projection

Returned fields: stable `id`, business `code`, `slug`, `packageType`, `tripAddOn`, `title`, `summary`, `description`, `destination`, `durationDays`, `featured`, `highlights`, `inclusions`, `exclusions`, `itinerary`, `customerNotes`, JSON `seo`, JSON `callToAction`, currently effective published `pricing`, ordered clean/public `media` with alt text, `effectiveFrom`, and `effectiveUntil`. Pricing includes currency, amount/price-on-request, basis, qualifier and validity. Intentional omissions: media captions, related packages, FAQ, dedicated canonical/Open Graph columns and price sorting, because the accepted domain lacks unambiguous authoritative fields. No values were invented.

## 9. Homepage readiness and graceful failure

Desktop/tablet/mobile now complete against valid published fixtures with three cards and no console/network errors. `data-catalogue-ready` changes from `loading` to `complete` and `virtcruise:catalogue-ready` fires after successful, empty or safe unavailable settlement. Featured/Victoria Falls regions leave busy state and render professional empty/unavailable copy. Ordinary timeout, network, HTTP and malformed catalogue failures do not log raw repository errors or stacks to the customer console. The legacy rollback flag remains intact and reaches completion through the same lifecycle.

## 10. Security and privacy

Anonymous routes select only the active effective projection. Direct missing/draft-like slug attempts receive the same safe 404 and do not reveal existence. DTO and route tests found no draft, review, audit, staff identity, configuration ID, reconciliation ID, storage/object key, file path, lock version, outbox, future content, archived/retired content or unpublished-price leakage. Media projection requires `CLEAN` and non-private; pricing is restricted to the publication-effective instant. Anonymous and authenticated customer reads share the same public projection; management routes remain protected and no mutation route exists.

## 11. Database and migration

PostgreSQL 18.4 ran in a disposable UTF-8, UTC, SCRAM cluster. Flyway V1–V17 migrated and validated; Hibernate validation passed. Additive V17 was required to store inclusions, exclusions, itinerary, customer notes and publication bounds in the public projection, to rebuild effective pricing, and to add title/destination/featured indexes. V1–V16 were not modified. List executes one count plus one page query; featured/detail execute one query, with embedded pricing/media JSON and no N+1 reads. Publication scheduling now preserves `effectiveUntil`.

## 12. Performance

Local-only evidence used 1,007 projection rows and 500 samples per timed operation. Milliseconds p50/p95/p99: list 0.1835/0.6722/1.1890; destination 0.0390/0.0520/0.4761; featured 0.0400/0.0540/0.4790; slug 0.3410/0.8609/1.3530. Search plan execution was 0.098 ms in the captured sample. List/title and featured used the new indexes; destination used stable title-index scanning at this small selectivity; slug was subsequently corrected to exact normalized lookup so its unique slug index is eligible. A representative 12-row projection payload was 13,054 bytes. Lock waits: 0; deadlocks: 0. These local figures are not a production-capacity claim.

## 13. Validation and regression

- Frontend focused catalogue/homepage/navigation: 15 passed, 0 failed, 0 errors, 0 skipped.
- Frontend full suite: 92 total, 84 passed, 0 failed, 0 errors, 8 pre-existing operator-gated real-environment skips.
- Backend full unit-mode suite report set: 570 total, 0 failures, 0 errors; 106 PostgreSQL/operator-gated tests skipped by default and not claimed as passes.
- Backend mandatory focused PostgreSQL catalogue/content selection: 11 passed, 0 failed, 0 errors, 0 skipped.
- Chromium managed runtime launched successfully. Desktop/tablet/mobile homepage and guest navigation passed with no unexpected console errors, failed required assets, or required network failures. Dynamic contract, featured, detail, rollback, responsive, accessibility, SEO and offline/public-boundary coverage passed in the full frontend run.

## 14. Defects corrected

1. Three homepage regressions preserved the failing 30-second condition; correction replaced the malformed all-routes fixture with exact public fixtures and waited on explicit readiness before asserting three cards.
2. Three navigation regressions preserved the 404/console evidence; correction changed the fixture from obsolete `/api/v1/packages` matching to exact `/api/v1/catalogue/packages` page/featured semantics.
3. Backend collection tests proved missing search/page/filter/sort metadata; correction added bounded parameterized queries and deterministic ordering.
4. Projection tests proved missing safe version/effective fields and over-broad price/media aggregation; V17 and publication projection changes added only accepted domain data and filtered it.
5. PostgreSQL integration caught an invalid explicit `LIKE ESCAPE` expression; the smallest correction retained escaped bound values and PostgreSQL's standard backslash behavior.
6. Query-plan evidence found lowercased slug lookup prevented the unique index; input remains normalized, while the stored normalized slug is now compared exactly.

## 15. Documentation

Updated `docs/WEB-005-DYNAMIC-CATALOGUE.md`, `docs/WEB-005-API-INTEGRATION.md`, and `docs/WEB-005-ACCEPTANCE.md`; created `docs/WEB-005A-PUBLIC-CATALOGUE-CONTRACT.md` and this report.

## 16. Logical commits

- Backend `bf1d04d feat(catalogue): complete published catalogue contract`
- Backend `c180995 test(catalogue): cover public catalogue acceptance`
- Frontend `af259f1 feat(catalogue): consume completed public projection`
- Frontend `c94e129 fix(catalogue): make homepage readiness deterministic`
- Frontend `998a4ea docs(catalogue): record WEB-005A public contract`
- Frontend report-only commit: repository `HEAD`

## 17. Repository cleanliness

Both repositories remain on `workstream/WEB-003-package-content-management`. The disposable PostgreSQL cluster, temporary Maven distribution/password, test outputs and generated build artifacts were removed after evidence capture. Both worktrees are clean after the report commit.

## 18. Push, merge, deployment and release status

- not pushed;
- not merged;
- not deployed;
- not tagged;
- production unchanged.

## 19. Known limitations

Accepted domain data still lacks media captions, related-package relationships, dedicated canonical/Open Graph columns and an unambiguous authoritative price sort. The backend does not generate ETags; public cache control remains 60 seconds. Pre-existing operator-gated suites require their own real-environment credentials/services and were not relabeled as passes.

## 20. Recommendation

READY TO RERUN WEB-005 ACCEPTANCE
