# REL-DEMO-MERGE-001 reconciliation matrix

Baseline: `e7809160578bb25308f7733827efb5a677b2d0f4`.

## Inventory

| Hotfix/workstream | Report/commit/branch | Files or evidence | Classification | Decision |
|---|---|---|---|---|
| HOTFIX-AUTH-001 / HOTFIX-AUTH-002 | No matching commit or report found in repository history/worktrees | Backend OAuth capability is conditional; production credentials/routes are deployment configuration | BACKEND/CONFIGURATION ISSUE — NOT A FRONTEND MERGE | Verify production env and exact HTTPS redirect; do not hardcode credentials |
| HOTFIX-EMAIL-001 | No matching commit/report; backend has provider-independent email port and SMTP adapter | `QuoteBuilderService` and security lifecycle retain email semantics | ALREADY CORRECT / NO CODE CHANGE | No frontend port |
| DEMO-ADMIN-001 | No frontend commit; existing administrator is production data | SEC-001 bootstrap/backend concern | BACKEND/CONFIGURATION ISSUE — NOT A FRONTEND MERGE | Do not add bootstrap or data logic |
| HOTFIX-LOGIN-001 | No matching code commit; diagnostic-only evidence | Auth API uses configured runtime origin and CORS contract | ALREADY SOLVED IN V0.8 | No speculative login change |
| HOTFIX-ADMIN-NAV-001 | `c2fa00e` on post-artifact `main`; `js/navigation.js` | Baseline exposed customer links for any authenticated user | PORT REQUIRED | Share persona predicate and render staff/admin links |
| HOTFIX-ADMIN-NAV-002 | `a25b61b`; `js/auth/persona.js`, `js/navigation.js`, `js/portal/portal-components.js`, `js/portal/portal-page.js` | Baseline had customer-only shell/dashboard | PORT REQUIRED | Port persona boundary, replace limited dashboard with v0.8 modules |
| HOTFIX-ADMIN-DASH-001 | `a25b61b`, wording follow-up `5b99dc4` | V14 Finance-only dashboard; v0.8 has richer modules | OBSOLETE — V0.8 REPLACES IT | Use Administration Dashboard with real v0.8 destinations |
| HOTFIX-DEMO-CACHE-001 | No matching implementation found | No cache-busting defect evidenced in source | REQUIRES FURTHER REVIEW | No code change |
| HOTFIX-ADMIN-OPS-001 | No separate commit found | V14 preview depended on unavailable operations | DEMO-ONLY — DO NOT PORT | Baseline WEB-006 is API-backed |
| HOTFIX-ADMIN-LABEL-001 | `5b99dc4`; `js/portal/portal-page.js` | Wording was tied to Finance-only V14 demo | OBSOLETE — V0.8 REPLACES IT | Keep Administration and Operations distinct |
| HOTFIX-OPS-PREVIEW-001 | `a917a84`; adds `js/operational-preview.js`, `/operations-preview/`, static metrics | Baseline has `/operational-readiness/` and operational API client | DEMO-ONLY — DO NOT PORT | Do not ship preview route/data/labels |
| HOTFIX-ADMIN-QUOTES-001 | `0208b55`; adds admin quote list/details | Backend v0.8 has protected `GET /api/v1/quotes` and `/details`; baseline has no staff workspace | PORT REQUIRED | Rebuild using v0.8 shell, permissions and live labels |
| HOTFIX-STAFF-ADMIN-001 / 002 | `6113618`; `admin/staff/create`, `js/admin-staff.js`; no second implementation | Backend has create/mutate endpoints but no list/read/roles catalogue API | OBSOLETE — V0.8 REPLACES V14 HOTFIX / REQUIRES FURTHER REVIEW | Do not ship constrained V14-only UI; report backend capability gap |
| HOTFIX-QUOTE-PRICE-001 | No matching commit found | v0.8 exposes quote read/update contracts but no accepted staff pricing/issuance workflow | BACKEND/CONFIGURATION ISSUE — NOT A FRONTEND MERGE | Do not invent quotation lifecycle |
| HOTFIX-LOGOUT-MENU-001 / 002 | No proven source change; baseline `js/navigation.js` already contains toggle, outside-click, Escape, logout/session clear | Existing account-menu implementation | ALREADY SOLVED IN V0.8 | Browser-test; no blind port |

## Behavioral evidence

- V14 `c2fa00e` corrected the persona predicate and prevented staff identities from receiving customer links and customer-only calls.
- V14 `a25b61b` prevented staff dashboard rendering from constructing the customer repository and supplied an admin landing page. Its Finance-only content is not accepted for v0.8.
- V14 `a917a84` contains hard-coded demonstration metrics (`12`, `7`, `6`, `1`, `3`, `2`, `82`, `76`) and the `PREVIEW — v0.8 Operations` label. It is not production operational data.
- V14 `0208b55` uses the correct v0.8 quote read endpoints, but labels the service `LIVE · V14 quote data · read-only` and says it uses the V14 quote service. Those labels and implementation context are removed in the port.
- V14 `6113618` explicitly identifies its role list and API as V14 compatibility. The accepted backend provides no staff listing or role-list endpoint, so a complete Users & Roles UI cannot be claimed in this workstream.

## Release conclusions

The only frontend ports required by this audit are the persona boundary/admin landing and a clean, protected staff quote-request workspace. Operations preview, demo labels/data, and constrained staff creation are excluded. Backend and runtime configuration findings remain outside this frontend merge.

## Verification and artifacts

- Focused reconciliation tests: 2 passed, 0 failed.
- Full frontend suite: 106 total, 98 passed, 0 failed, 8 gated skips.
- Focused navigation: 7 passed, 0 failed.
- Focused Finance: 6 passed, 0 failed.
- Production/browser/static focused checks: 15 passed, 0 failed.
- Reconciliation browser acceptance: 2 passed, 0 failed (admin dashboard/customer dashboard; admin emitted no customer workspace calls).
- Reconciled source branch: `workstream/REL-DEMO-MERGE-001-v08-demo-reconciliation`.
- Reconciled source includes production frontend changes; the old artifact is therefore not reused.
- New artifact: `dist/virtcruise-www-0.8.0-beta.1-reconciled-rel-demo-merge-001.zip`.
- New artifact SHA-256: `5d5d56976cecca0f7ce44b3ab00b608308b07b9a1a6385164ef936ed07209ebb`.
- Artifact manifest asserts release `0.8.0-beta.1`, `productionRuntime=true`, `developmentRuntime=false`, public origin `https://virtcruise.airwide.co.uk`, and API origin `https://api.virtcruise.airwide.co.uk`.
- Original accepted artifact remains unchanged at SHA-256 `125da7356f8e10b8a180595c26e98cc5f01c20cea1b00dc5f7ac01d7414cae8c`.
- Backend source/artifact was not changed; backend artifact SHA remains `8bac0230a52444d6f1491196ec204f1beb3cf33128b7931a9e05f5b468bc4d90`.
