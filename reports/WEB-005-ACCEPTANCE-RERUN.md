# WEB-005 Acceptance Rerun

## Baseline and scope

- Backend baseline/final implementation: `c1809956350edbd6f53180c99226eca255b3e948`.
- Frontend baseline: `41cdcba7bd679eb22dc6038cf582aab3ed684ea6`.
- Frontend acceptance correction: `58c8135`; the report-only commit is repository `HEAD`.
- Both repositories used `workstream/WEB-003-package-content-management` and were clean at baseline.
- This was an acceptance rerun. No redesign or new feature was introduced, and WEB-006 was not begun.

## Acceptance result

All mandatory WEB-005 acceptance checks completed with zero failures, zero errors and zero mandatory skips. One response-validation defect was reproduced, minimally corrected and fully rerun. The eight full-frontend skips are pre-existing operator-gated real-environment tests in explicitly excluded domains; they are not counted as passes.

## Public API contract

Live HTTP checks against the packaged application and a fresh PostgreSQL database passed:

| Capability | Evidence | Result |
| --- | --- | --- |
| Published collection | `GET /api/v1/catalogue/packages?page=0&size=2&sort=title&direction=asc` | 200; page metadata and two rows valid |
| Featured | `GET /api/v1/catalogue/packages/featured` | 200 array; all featured and primary packages |
| Slug detail | `GET /api/v1/catalogue/packages/zimbabwe-safari` | 200 safe detail with pricing/media |
| Search | `search=Zimbabwe` | Matching public title/destination/type only |
| Destination filter | `destination=Mauritius` | Exact public destination matches only |
| Package-type filter | `type=VICTORIA_FALLS` | Matching package type only |
| Add-on filter | `tripAddOn=false` | No trip add-ons in primary results |
| Sorting | `sort=title&direction=asc` | Stable approved ordering |
| Pagination | `page=0&size=2` | Authoritative totals/pages/next/previous |
| Invalid sort | `sort=internal_id` | Safe `application/problem+json` 400 |
| Draft-like direct route | `/draft-secret` | Indistinguishable safe Problem Details 404 |

The live response checks found no `lockVersion`, editorial owner, review, audit, object/storage key, or outbox data. Automated DTO checks additionally cover staff/audit/storage-path and internal-version exclusion. Effective projection tests cover draft, retired, future and unpublished-price exclusion. No management endpoint or public mutation was used.

## Frontend catalogue matrix

| Area | Acceptance evidence | Result |
| --- | --- | --- |
| Homepage dynamic catalogue | explicit readiness plus published fixture | Passed desktop/tablet/mobile |
| Featured Tours | three published cards and exact featured route | Passed |
| Victoria Falls | public detail page and dynamic binding | Passed |
| Trip Add-ons | excluded from primary catalogue; Car Rental remains supporting service | Passed |
| Package details | public slug mapping and Victoria Falls browser route | Passed |
| Pricing | published pricing/price-on-request mapping | Passed |
| Media | ordered public cover/gallery, alt text, private-path rejection | Passed |
| SEO | description, canonical, Open Graph and JSON-LD coverage | Passed |
| Rollback flag | legacy source selected only when flag is false | Passed |
| Empty state | valid empty page remains empty with authoritative zero total | Passed |
| Backend unavailable | `NETWORK_UNAVAILABLE` controlled repository outcome | Passed |
| Malformed response | explicit `MALFORMED_RESPONSE`, never coerced to empty | Passed after correction |
| Offline/public boundary | loopback-only route acceptance and blocked unexpected requests | Passed |

The readiness contract reaches `complete` after catalogue settlement and leaves featured/Victoria Falls regions in a usable fallback state. Customer UI receives professional empty/unavailable content without raw repository details.

## Responsive, accessibility and browser evidence

- Managed Playwright Chromium launched successfully.
- Desktop `1920×1080`, tablet `1024×768`, and mobile `390×844` homepage and guest/authenticated navigation checks passed.
- Required links and controls were visible and operable; navigation keyboard/focus behavior passed.
- Catalogue CSS acceptance confirmed focus-visible and reduced-motion rules.
- Horizontal-overflow assertions passed at all three homepage viewports.
- Browser acceptance recorded no unexpected console errors, request failures, or failed required assets.
- Package-detail and mandatory public routes rendered under the loopback-only network boundary.

## Defect reproduced and corrected

The acceptance probe supplied a structurally malformed successful collection response: `200 {"unexpected":true}`. The repository converted missing `content` to `[]`, incorrectly treating malformed data as a valid empty catalogue. A focused regression now requires collection payloads to be either an array or an object with array `content`. The minimal correction throws the existing customer-safe `MALFORMED_RESPONSE` classification. Focused and full frontend suites were rerun after the change.

## PostgreSQL, Flyway and Hibernate

- PostgreSQL: 18.4, disposable local cluster.
- Encoding: UTF-8.
- Time zone: UTC.
- Host authentication: SCRAM-SHA-256.
- Flyway: all 17 migrations validated and applied from an empty schema; final version V17.
- Hibernate: schema validation and application startup passed.
- Packaged application live HTTP startup passed on the migrated database.
- Mandatory public-catalogue/content selection: 11 passed, 0 failed, 0 errors, 0 skipped.

The mandatory selection comprised `CatalogueServiceContractTest`, `PublicCatalogueIntegrationTest`, `PackagePublicationSchedulerIntegrationTest`, and `PackageContentRealJwtIntegrationTest`. It covered routes, search, filters, sorting, paging, featured/detail projection, safe errors, publication-effective behavior, authentication boundary, Flyway and Hibernate.

## Test totals

- Focused frontend rerun after correction: 16 tests, 16 passed, 0 failed, 0 errors, 0 skipped.
- Broader pre-correction focused browser/catalogue matrix: 27 tests, 27 passed, 0 failed, 0 errors, 0 skipped.
- Final full frontend suite: 93 tests, 85 passed, 0 failed, 0 errors, 8 gated skips.
- Mandatory backend selection: 11 tests, 11 passed, 0 failed, 0 errors, 0 skipped.
- Live HTTP assertion matrix: 9 request cases plus response/privacy assertions, all passed.

The eight frontend skips are precisely:

1. Bank Transfer partial-to-full real invoice/email journey.
2. Complete real customer Bank Transfer journey.
3. Real PostgreSQL Finance queue/browser journey.
4. Finance assignment/review/comments/role-denial journey.
5. Finance approval/rejection/idempotency journey.
6. Finance concurrent-decision/Flyway/proof-storage journey.
7. Real PostgreSQL Financial portal customer journeys.
8. Real Manual Finance non-mutating customer journey.

These require operator-provided real-environment services or credentials, belong to Bank Transfer, Finance/Financial, Proof-related or Manual Finance scope, and are explicitly excluded from WEB-005. They remain skips and are not acceptance passes.

## Protected scope and operational status

Booking, Financial, Bank Transfer, Proof Upload, Notifications, Manual Finance, authentication architecture, Content Studio, deployment, DNS, TLS, NGINX, production, tags and releases were not modified. Backend code remained unchanged. Nothing was pushed, merged, deployed, tagged or released; production is unchanged.

The temporary backend process, PostgreSQL cluster, downloaded Maven distribution, local test password and generated backend build outputs were removed. Both worktrees are clean after committing this report.

## Recommendation

READY FOR WEB-006 — COMMERCIAL ACCEPTANCE
