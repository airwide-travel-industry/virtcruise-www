# TEST-001 Final Report — Playwright Browser Runtime Standardization

## 1. Starting commit

`d447dd2b4245631f3821c082150d3d0661976567`

## 2. Final commit

Implementation and documentation baseline: `d909af44d4d100080406355f15c71070927413ab`. This report is committed immediately after that baseline and does not alter the implementation.

## 3. Root cause

Thirteen test and acceptance-script launch sites forced `process.env.CHROME_BIN || '/usr/bin/google-chrome'`. Hooks therefore failed before assertions whenever that machine-specific executable was absent. The repository also depended on `playwright-core`, whose executable is `playwright-core`, so the required `npx playwright install chromium` workflow was not supplied by the project. Playwright 1.54.1 additionally could not install a browser on the validation host's Ubuntu 26.04 platform.

## 4. Files corrected

Runtime selection was corrected in `tests/customer-bank-transfer.test.mjs`, `tests/customer-bank-transfer-partial-full-real-postgres.test.mjs`, `tests/customer-bank-transfer-real-postgres.test.mjs`, `tests/finance-portal.test.mjs`, `tests/finance-real-postgres.test.mjs`, `tests/financial-portal.test.mjs`, `tests/financial-postgres.test.mjs`, `tests/hotfix-web001-homepage.test.mjs`, `tests/manual-finance-real-postgres.test.mjs`, `tests/navigation-visibility.test.mjs`, `tests/offline-acceptance.test.mjs`, `scripts/airwide-hotfix-browser-acceptance.mjs`, and `scripts/web001a-branded-https-acceptance.mjs`.

The shared policy and its regression coverage are in `tests/helpers/playwright-runtime.mjs` and `tests/playwright-runtime.test.mjs`. Dependency metadata changed in `package.json` and `package-lock.json`. Documentation changed in `README.md`, `docs/WEB-002-ACCEPTANCE.md`, and `docs/testing/PLAYWRIGHT-RUNTIME.md`. No application, backend, or frontend behavior file was changed.

## 5. Browser runtime selected

Playwright 1.62.1-managed Chromium is the default. Validation installed Chrome for Testing 151.0.7922.34 / Playwright Chromium revision 1234 in the Playwright user cache. `npm ci`, `npx playwright --version`, and `npx playwright install chromium` passed.

## 6. Chrome dependency removed

All 13 fixed `/usr/bin/google-chrome` dependencies and all `CHROME_BIN` launch selections were removed. Source audit found one direct `chromium.launch`, intentionally contained inside the shared launcher, and no `google-chrome`, `GOOGLE_CHROME_BIN`, `CHROME_BIN`, or `browserType.launch` in executable test/script code. A system Chrome may be used only by explicitly pointing the supported override to it.

## 7. Environment variables

`PLAYWRIGHT_CHROMIUM_EXECUTABLE` optionally selects an exact executable. Empty or unset means managed Chromium. `PLAYWRIGHT_BROWSERS_PATH` remains Playwright's native optional cache location and must be consistent between browser installation and execution. Neither is mandatory; no new mandatory configuration was introduced.

## 8. Desktop launch

Passed. The focused managed-Chromium suite passed desktop Bank Transfer, manual Finance, Finance Portal, Financial Portal, homepage, guest/authenticated navigation, and offline public-route coverage.

## 9. Tablet launch

Passed. The same focused categories passed at 1024×768, including responsive and overflow assertions.

## 10. Mobile launch

Passed. The same focused categories passed at 390×844, including navigation operability and responsive/overflow assertions.

## 11. Browser regression

- Complete ordinary suite: 74 passed, 0 failed, 8 operator-gated skips, 82 total.
- Focused browser suite: 36 passed, 0 failed, 0 skipped.
- Real PostgreSQL browser suite discovery: 8 operator-gated tests discovered and skipped because their backend/database/SMTP profiles were not enabled; no browser launch or executable-path failure occurred.
- Financial Portal, Finance Portal, Bank Transfer, homepage, navigation, and offline coverage all passed in the focused browser run.
- Content Studio focused static acceptance passed 4/4 as part of the ordinary suite; this repository currently has no dedicated Content Studio browser test.
- Runtime policy regression passed 3/3.

The validation host lacked the system `libgbm.so.1` library. `npx playwright install-deps chromium` could not elevate because sudo authentication is unavailable. Without changing the host, validation unpacked Ubuntu's `libgbm1` package under `/tmp` and supplied that temporary library directory through `LD_LIBRARY_PATH`; managed Chromium then launched and the full/focused suites passed. This is an operating-system dependency, not an apt-installed browser or repository runtime override. Ubuntu/AWS/CI/Docker dependency guidance is documented.

## 12. Documentation

`docs/testing/PLAYWRIGHT-RUNTIME.md` documents `npm ci`, `npx playwright install chromium`, runtime priority, both optional environment variables, Ubuntu, AWS, CI, Docker, browser updates, troubleshooting, Linux dependency handling, and the complete browser-selection inventory. It explicitly prohibits Ubuntu `node-playwright`, apt-installed Chrome as a requirement, and Chrome-path symlinks.

## 13. Commits

- `4715f9d` — `test: standardize Playwright browser runtime`
- `d909af4` — `docs: document browser runtime`
- Report commit — `docs: add TEST-001 final report`

## 14. Repository cleanliness

`git diff --check` passed. After the implementation/documentation commits, the only pre-existing untracked item was `test-results/`; it was not modified, staged, or removed. The final report is the only subsequent workstream file. No unrelated application changes are present.

## 15. Push / Merge / Deployment

Not performed. No push, merge, deployment, production change, DNS, TLS, or infrastructure rollout was authorized by TEST-001.

## 16. Recommendation

READY FOR WEB-004 ACCEPTANCE
