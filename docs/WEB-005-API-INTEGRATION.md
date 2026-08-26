# WEB-005 Public API Integration

| Purpose | Route | Result |
| --- | --- | --- |
| Collection | `GET /api/v1/catalogue/packages` | Page object |
| Featured | `GET /api/v1/catalogue/packages/featured` | Array; empty is `200 []` |
| Detail | `GET /api/v1/catalogue/packages/{slug}` | Published DTO or safe Problem Details 404 |

Collection parameters are `page` (default 0), `size` (default 12, 1–100), `search`, `title`, `destination`, `type`, `tripAddOn`, `featured`, `publishedAfter`, `publishedBefore`, `sort` (`title` or `publishedAt`) and `direction` (`asc` or `desc`). Blank search is omitted/equivalent to no search. Page metadata is `content`, `page`, `size`, `totalElements`, `totalPages`, `hasNext`, and `hasPrevious`. Ordering always adds `package_id` as a deterministic tie-break.

The detail projection contains `id`, `code`, `slug`, `packageType`, `tripAddOn`, `title`, `summary`, `description`, `destination`, `durationDays`, `featured`, `highlights`, `inclusions`, `exclusions`, `itinerary`, `customerNotes`, `seo`, `callToAction`, effective public `pricing`, clean public `media`, `effectiveFrom`, and `effectiveUntil`.

Responses exclude version IDs, locks, actors, review/audit/outbox data, private object keys, unpublished prices, and non-effective content. Unsupported sort/page/date inputs return customer-safe `application/problem+json` 400. Missing/retired/draft-only slugs return indistinguishable customer-safe Problem Details 404. GET responses use `Cache-Control: public, max-age=60`; no ETag is currently generated.
