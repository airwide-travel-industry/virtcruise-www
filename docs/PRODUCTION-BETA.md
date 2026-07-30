# Production Beta Operations

## Topology

```text
Browser
  -> HTTPS NGINX static frontend
  -> HTTPS NGINX API boundary
  -> Spring Boot on 127.0.0.1:8080
  -> PostgreSQL on 127.0.0.1:5432
```

Frontend releases live at `/var/www/virtcruise/releases/<commit>` and
`/var/www/virtcruise/current` is switched atomically. The accepted release is
`6e8abd809693c1b17d78c0bebf701828e7051927`.

## Security dependencies

The backend reads protected JWT key paths and Gmail SMTP credentials from an environment file
outside Git. NGINX restricts the public API surface, exact CORS origin, Swagger and admin routes.
Frontend and API access logs use method plus normalized path and omit query strings.

## Health and rollback

Validate the homepage, `/actuator/health`, package catalogue, `nginx -t`, PostgreSQL, TLS and direct
port restrictions. Roll back by atomically selecting the prior release, testing NGINX and reloading
it. Do not reverse successful additive Flyway migrations solely for a frontend/backend rollback.

## Acceptance gates

Required gates cover checksums, Flyway, JWT, Gmail verification/reset, CSRF, refresh rotation,
session discovery, CORS, ownership, idempotency, Playwright viewports, storage, logs and cleanup.

