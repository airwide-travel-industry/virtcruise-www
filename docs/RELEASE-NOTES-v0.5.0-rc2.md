# Virtcruise Frontend v0.5.0-rc2

Status: local release candidate in preparation; not tagged or deployed.

## Summary

RC2 is a focused stabilization release. Guest pages now use safe session discovery instead of
unconditionally attempting refresh, eliminating the expected guest HTTP 401 console entry while
preserving the existing authentication design.

## Session startup

1. Call `GET /api/v1/auth/session`.
2. If `refreshable=false`, clear stale metadata and render guest navigation.
3. If `refreshable=true`, obtain CSRF and call `POST /api/v1/auth/refresh`.
4. Keep the returned access token in memory only.
5. On restoration failure, clear metadata and become guest without retry loops.

Bootstrap and refresh calls are coalesced to prevent duplicate requests. Protected API request
recovery and intended-destination behavior are unchanged.

## Validation

- Guest homepage, package, sign-in and registration pages make no refresh request.
- Returning browser restoration performs one discovery and one CSRF-protected refresh.
- Registration, verification, login and password reset pass against the real local backend and
  PostgreSQL using fake SMTP.
- Desktop, tablet and mobile guest pages have no console errors or horizontal overflow.

Production Gmail delivery validation, tagging, push and deployment require the explicit operator
credential checkpoint and are not part of local validation.
