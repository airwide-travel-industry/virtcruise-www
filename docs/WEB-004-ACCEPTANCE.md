# WEB-004 Acceptance

Run:

```sh
npm ci
npx playwright install chromium
node --test tests/web004-content-studio.test.mjs tests/web004-content-studio-browser.test.mjs
npm test
npm run build:webdev
```

Accepted automated coverage:

- editor, approver and administrator JWT-shaped restored sessions enter the staff shell;
- customer JWT and anonymous sessions cannot reach Content Studio navigation;
- desktop 1920×1080, tablet 1024×768 and mobile 390×844 render without horizontal overflow;
- mobile navigation, labels, focus, ARIA state and reduced-motion behavior are exercised;
- exact WEB-003 create, read, history, edit, lifecycle, pricing, media and audit routes are centralized;
- public catalogue files and APIs are untouched.

Results on 2026-08-03: focused WEB-004 suite 11/11 passed; complete suite 81 passed, 0 failed and 8 operator-gated skips; webdev build passed with 139 staged files.

Environment-backed end-to-end workflow qualification remains necessary once a complete management collection contract and a running WEB-003 staff environment are available. WEB-004 does not deploy or begin WEB-005.
