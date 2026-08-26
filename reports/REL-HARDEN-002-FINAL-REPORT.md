# REL-HARDEN-002 Final Report

## 1. Starting commit

`165803c17bc06948b05419b339d4b44eb00213c6` on
`workstream/DEPLOY-PROD-BETA-001`, verified clean before changes.

## 2. Final commit

The documentation commit containing this report is the final branch tip; resolve it with
`git rev-parse HEAD`. Fixed preceding commits are recorded in section 12 to avoid a self-referential
hash.

## 3. Root causes

- `scripts/deployment-profiles.mjs` exposed stale `hotfix-e9662ea` identity.
- `scripts/build-webdev-artifact.mjs` copied the generic runtime tree without a production overlay.
- `js/api-client.js` and `js/auth/config.js` accepted query-selected local/mock modes and localhost.
- `js/repositories/quote-repository.js`, `customer-repository.js`, and
  `package-repository.js` retained executable mock/static fallback branches.
- `js/mock-api.js` and `data/packages.json` were copied into the archive.
- `js/quote-builder.js` retained development/mock presentation.
- HTML and `js/package-page.js` retained legacy branded canonical/Open Graph origins.
- The runtime inventory omitted `content-studio`, `operational-readiness`, and `fonts`.

The complete pre-change keyword inventory contained 212 matches. Responsible application/runtime
locations were the files above plus `js/runtime-config.js`; remaining matches elsewhere were
historical documents, test fixtures, local test servers, opt-in PostgreSQL harnesses, and the
packaging gate itself.

## 4. Artifact identity

The profile, stage directory, ZIP filename and deployment manifest now identify
`0.8.0-beta.1`. `productionRuntime` is true and `developmentRuntime` is false. Canonical and Open
Graph URLs are normalised to `https://virtcruise.airwide.co.uk`. No runtime banner exposes an
obsolete identity.

## 5. Runtime origins

The sole application API origin is `https://api.virtcruise.airwide.co.uk`. Artifact analysis found
zero `localhost`, `127.0.0.1`, `0.0.0.0`, development-server, test-API, or mock-API origins. Public
canonical/SEO URLs use the Airwide origin. Customer-facing WhatsApp and social links and the
standard schema.org/sitemap namespaces are intentional non-API destinations.

## 6. Mock removal

Production query switching, mock/local repository branches and development success presentation
are removed by a fail-closed packaging overlay. `js/mock-api.js` and `data/` are absent from the
archive. Mock code and datasets remain only in repository development/test sources and cannot load
from production because they are neither packaged nor referenced by packaged modules.

## 7. Security

Artifact scans found no secrets, API keys, development credentials, loopback/internal hosts,
source maps, private management routes in public catalogue code, draft data, or staff data.
Ordinary password form field names are expected application code and contain no credential values.
SEC-001 remains compatible: authentication and CSRF modules are present, while `/first-admin`
correctly remains a backend-served route.

## 8. Browser validation

Focused artifact validation passed 6/6 with zero failures: three packaging cases plus desktop
1920×1080, tablet 1024×768, and mobile 390×844. It verified homepage, Dynamic Catalogue,
authentication, Content Studio, Control Tower, production-only network origin, required assets,
console, request failures and horizontal overflow. Content Studio role/authorization and responsive
coverage also passed in the broader deterministic suite. The selected non-database frontend suite
passed 94/94 with zero failures.

## 9. Static analysis

Production artifact blockers: zero occurrences of stale identity, localhost, loopback IPs, active
local/mock selectors, mock API, development preview, source maps, private API routes, secrets, or
legacy branded canonical origins. Remaining terms `developmentRuntime: false` and the explanatory
comment stating that development paths were removed are acceptable negative declarations.

Pre-documentation repository-only retained counts were 39 `localhost`, 36 `127.0.0.1`, and 126
case-insensitive `mock` occurrences. They are acceptable because they reside in documentation,
tests, safe local servers, opt-in integration harnesses, generic development sources, and exclusion
assertions. One `hotfix-e9662ea` occurrence remains solely in a negative packaging assertion.

## 10. Checksums

- Artifact: `dist/virtcruise-www-0.8.0-beta.1.zip`
- Size: 4,489,217 bytes
- File count: 143 including the per-file `SHA256SUMS`
- Git source commit: `9e4e734e7b216c7de0680256440c91589488d207`
- Build timestamp recorded: `2026-08-04T15:37:36Z`
- SHA-256: `125da7356f8e10b8a180595c26e98cc5f01c20cea1b00dc5f7ac01d7414cae8c`
- Reproducibility: two clean builds produced the identical hash.

## 11. Documentation

Created `docs/release/REL-HARDEN-002.md`, `docs/release/FRONTEND-PACKAGING.md`,
`docs/release/PRODUCTION-BETA-FRONTEND.md`, and this report. Updated
`docs/PRODUCTION-BETA.md` with the factual packaging status. Deployment documentation was not
changed to claim deployment; DEPLOY-PROD-BETA-001 was not resumed.

## 12. Logical commits

- `9e4e734` `build(frontend): harden production-beta packaging`
- `1669af1` `build(frontend): create production beta artifact`
- Final branch-tip commit: `docs(release): record frontend packaging hardening`

## 13. Repository cleanliness

After the final documentation commit, the branch is clean. Generated extracted stage files remain
ignored; the immutable ZIP and checksum are tracked. `git diff --check` passes.

## 14. Push / Merge / Deployment

No push, merge, tag, hosted release, production access, artifact transfer or deployment occurred.
DEPLOY-PROD-BETA-001 and QA-001 were not started.

## 15. Known limitations

- Browser validation used deterministic API interception; it is packaging acceptance, not a claim
  about live production or backend availability.
- Opt-in real-PostgreSQL frontend integration suites were not run because backend/database work is
  outside this frontend packaging workstream; accepted backend compatibility remains authoritative.
- Repository development/test references intentionally remain outside the production archive.

## 16. Recommendation

READY TO RESUME DEPLOY-PROD-BETA-001
