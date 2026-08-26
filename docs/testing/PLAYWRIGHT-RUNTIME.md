# Playwright Browser Runtime

VirtCruise browser acceptance uses the Chromium revision managed by the version of Playwright pinned in `package-lock.json`. A system installation of Google Chrome is not required.

## Installation

From the repository root:

```sh
npm ci
npx playwright install chromium
npm test
```

Do not install the Ubuntu `node-playwright` package or an apt-managed Google Chrome package for this project. `npm ci` supplies the matching Playwright CLI and `npx playwright install chromium` supplies its matching browser revision.

## Runtime selection

The shared launcher in `tests/helpers/playwright-runtime.mjs` applies this policy:

1. Use Playwright-managed Chromium by default.
2. If `PLAYWRIGHT_CHROMIUM_EXECUTABLE` is non-empty, use that exact executable.
3. A system Chrome/Chromium is optional and is used only when its path is explicitly supplied through that override.

Tests must call the shared launcher and must not add a fixed `executablePath`. The former `CHROME_BIN` convention is not supported because it could silently restore a machine-specific dependency.

`PLAYWRIGHT_BROWSERS_PATH` is Playwright's native optional browser-cache setting. If set, use the same value for installation and test execution:

```sh
export PLAYWRIGHT_BROWSERS_PATH="$PWD/.cache/ms-playwright"
npx playwright install chromium
npm test
```

Neither variable is mandatory.

## Browser selection inventory

The TEST-001 repository audit found browser selection in these locations. They now all delegate to the shared launcher:

- `tests/customer-bank-transfer.test.mjs`
- `tests/customer-bank-transfer-partial-full-real-postgres.test.mjs`
- `tests/customer-bank-transfer-real-postgres.test.mjs`
- `tests/finance-portal.test.mjs`
- `tests/finance-real-postgres.test.mjs`
- `tests/financial-portal.test.mjs`
- `tests/financial-postgres.test.mjs`
- `tests/hotfix-web001-homepage.test.mjs`
- `tests/manual-finance-real-postgres.test.mjs`
- `tests/navigation-visibility.test.mjs`
- `tests/offline-acceptance.test.mjs`
- `scripts/airwide-hotfix-browser-acceptance.mjs`
- `scripts/web001a-branded-https-acceptance.mjs`

Executable selection occurs only in `tests/helpers/playwright-runtime.mjs`. `PLAYWRIGHT_BROWSERS_PATH` is consumed internally by Playwright and therefore does not appear in launch options. No `GOOGLE_CHROME_BIN`, `CHROME_BIN`, `browserType.launch`, or additional direct `chromium.launch` selector remains in test or acceptance-script code.

## Ubuntu development workstations

Run the standard installation commands as the same user who runs the tests. The browser is normally cached under the user's Playwright cache. On a minimal workstation, an administrator may install Playwright's operating-system libraries separately with `npx playwright install-deps chromium`; this is distinct from installing Chrome and should be reviewed before use because it invokes the system package manager.

## AWS development servers

Use the same pinned Node dependencies and Playwright installation. Persist the default Playwright cache between builds, or set `PLAYWRIGHT_BROWSERS_PATH` to a stable workspace/cache directory and preserve it. Existing headless and `--no-sandbox` test options remain unchanged. Do not create `/usr/bin/google-chrome` symlinks.

## CI

A CI job should install dependencies and the browser before tests:

```sh
npm ci
npx playwright install chromium
npm test
```

Cache the browser directory only as an optimization. A cache miss must fall back to the install command. Keep the Playwright package version and installed browser revision coupled through `package-lock.json`.

## Docker

Install dependencies and Chromium during the image build, not when the container starts:

```dockerfile
RUN npm ci
RUN npx playwright install chromium
```

The base image must include the Linux shared libraries required by Chromium. An official Playwright image with the same pinned Playwright version is suitable, or dependencies can be installed in a controlled build stage. Run tests as a non-root user where practical, and ensure that user can read `PLAYWRIGHT_BROWSERS_PATH` when a shared path is configured.

## Browser updates

Update the pinned `playwright` dependency intentionally, regenerate `package-lock.json`, run `npx playwright install chromium`, and execute the complete ordinary and real-environment acceptance matrices. Commit the package and lockfile changes together. Do not update a cached browser independently of Playwright.

## Troubleshooting

- **Executable does not exist:** run `npm ci` and `npx playwright install chromium` as the test user. Confirm `PLAYWRIGHT_BROWSERS_PATH` has the same value for both commands.
- **Override does not launch:** unset `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to return to the managed runtime, or verify that it is an absolute executable path compatible with the pinned Playwright version.
- **Missing Linux library:** use an appropriate Playwright base image or have an administrator install the dependencies reported by `npx playwright install-deps chromium`. Do not install `node-playwright`.
- **Browser revision mismatch:** remove the stale Playwright cache entry, rerun `npm ci`, then rerun `npx playwright install chromium`.
- **Permissions in AWS/CI/Docker:** make the configured browser cache readable and executable by the account running `npm test`.

The useful diagnostic command is `npx playwright --version`; its version must match the pinned package. Browser launch errors should be resolved as infrastructure failures before application assertions are interpreted.
