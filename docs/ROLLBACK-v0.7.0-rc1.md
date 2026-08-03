# v0.7.0-rc1 Frontend Rollback

RC-001 did not deploy. For an authorized staging or production operation:

1. Retain current and previous immutable archives/directories and verify their SHA-256 values.
2. Stop ingress or place the edge in maintenance mode.
3. Atomically repoint the web-root symlink to the previous verified release directory.
4. Reload the static server, then verify homepage, authentication, customer/Finance routes, API
   origin, CORS, cache headers and the external-request guard.
5. Reopen ingress only after protected-route/logout and responsive smoke checks pass.

Frontend rollback does not roll back database or proof facts. If the backend/database also changes,
follow the backend rollback guide and preserve its database/proof-store consistency boundary.

