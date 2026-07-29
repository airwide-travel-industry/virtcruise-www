# Local authentication development

Sprint 3 customer authentication is validated against the real local Spring Boot API and
PostgreSQL—not synthetic browser responses.

## Start the applications

First follow the backend repository's `docs/LOCAL-AUTHENTICATION.md` runbook. It covers PostgreSQL
18, Flyway V1–V6, local RS256 keys, the development email adapter, cookies, CSRF, and cleanup.
Start the backend at `http://localhost:8080`.

Serve this repository over HTTP:

```bash
python3 -m http.server 5002
```

Open:

```text
http://localhost:5002/?api=local
```

The `api=local` query selects `http://localhost:8080`. Authentication pages preserve this mode in
their links. Do not open pages with `file://`, and do not use `api=mock` for database-backed
acceptance testing.

## Identity lifecycle

Useful local routes are:

- `/register/?api=local`
- `/verify-email/?api=local&token=...`
- `/signin/?api=local`
- `/forgot-password/?api=local`
- `/reset-password/?api=local&token=...`
- `/account/?api=local`
- `/profile/?api=local`

Verification and reset tokens must be obtained through the backend's controlled loopback-only
development endpoint. Never put them in logs or committed files. Google and Facebook initiation
fails closed while the corresponding backend provider is disabled; provider client secrets never
belong in this repository.

## Browser security expectations

- The access token is held in memory only.
- The opaque refresh token is held only in the backend-issued HttpOnly cookie.
- Neither token may appear in `localStorage` or `sessionStorage`.
- Session storage may contain only the minimal non-secret user summary required to render the
  authenticated header.
- “Remember me” stores only the email preference.
- Cookie-authenticated refresh/logout operations first obtain CSRF material and return it in the
  required header.
- Startup first calls read-only `GET /api/v1/auth/session`. A guest response establishes guest state
  without calling refresh. Only a returning browser reported as refreshable obtains CSRF and calls
  the protected refresh endpoint.

If restoration refresh returns 401, sign in again; the token may have expired, rotated, or been
revoked. The client clears stale session metadata and does not enter a refresh loop. A 403
on refresh/logout usually indicates a missing or mismatched CSRF cookie/header. Confirm that the
frontend and backend origins match their local CORS configuration and that both fetch and cookie
requests include credentials.

## Validation

Test registration, verification, login, refresh, logout, logout-all, forgot/reset password, change
password, protected redirects, and the guest/authenticated header with the browser network and
storage panels open. Also exercise Quick Quote, Quote Builder, My Trip, and package pages to catch
public-flow regressions.

Run the frontend static checks from the repository root:

```bash
find js -name '*.js' -print0 | xargs -0 -n1 node --check
node --test tests/auth-session-bootstrap.test.mjs
```

Stop the HTTP server after testing and delete temporary browser profiles or token files. The
backend runbook describes safe disposal of the isolated database.
