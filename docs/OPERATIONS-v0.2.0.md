# Frontend Operations v0.2.0

## Endpoints and routine checks

| Component | URL |
|---|---|
| Frontend | https://virtcruise.airwide.co.uk |
| Backend | https://api.virtcruise.airwide.co.uk |
| Health | https://api.virtcruise.airwide.co.uk/actuator/health |

```bash
curl --fail --location https://virtcruise.airwide.co.uk/
curl --fail https://virtcruise.airwide.co.uk/js/api-client.js
curl --fail https://virtcruise.airwide.co.uk/packages/victoria-falls-escape.html
curl --fail https://api.virtcruise.airwide.co.uk/actuator/health
```

On the frontend host:

```bash
readlink -f /var/www/virtcruise/current
sudo nginx -t
systemctl is-active nginx
sudo grep -n "PRODUCTION_API_BASE_URL" /var/www/virtcruise/current/js/api-client.js
```

Use `?release=<commit>` or `Cache-Control: no-cache` for release checks. Compare checksums rather than
judging version from appearance.

## Browser regression

Use a clean/private browser at desktop, tablet and mobile widths. Check navigation/dropdowns,
Quick Quote, each service entry, My Trip, Featured Tours, Victoria Falls, package filters, all package
pages, About and Contact. Confirm live package requests, one aggregate quote POST, the idempotency
header, no customer-first request, no horizontal overflow, and no console/CORS/network errors.

## Diagnosis

| Symptom | Checks |
|---|---|
| Old frontend | Public/local checksums, `current` symlink, one-day JS/CSS cache |
| Empty packages | `/api/v1/packages`, console, network panel, visible fallback label |
| CORS failure | Exact browser origin, API preflight, backend allow-list |
| Quote not sent | Online status, inline error, offline queue, API health, request ID |
| Duplicate concern | Client reference and idempotency key; do not resubmit with a new key |
| Package page incomplete | Slug endpoint, page HTTP status, JavaScript console |
| 403 static file | release ownership, directory execute bit, file read bit |

Escalate to backend operations when API health fails, package endpoints return server errors,
canonical quote submission is rejected after valid frontend validation, or persistence/idempotency
cannot be confirmed. Preserve request IDs and timestamps; never copy customer payloads into tickets
unless an approved secure process requires them.

## Safe production test

Use a unique, clearly labelled synthetic contact, submit one modest itinerary, capture its generated
IDs and key, replay only once with the same key, and verify no duplicate. Remove only those identified
records through an internal database-supported process. Do not use public lifecycle endpoints for
cleanup and do not log or publish test contact details.

## Rollback

Preserve the current target before changing it. For v0.2.0 rollback:

```bash
sudo ln -sfn releases/b3abeaf989ffb3f8e9ea74101dead7040650f0e1 /var/www/virtcruise/current
sudo nginx -t
sudo systemctl reload nginx
curl --fail https://virtcruise.airwide.co.uk/
```

## Known operational consideration

HTML is non-cacheable, while JavaScript/CSS/images currently receive a one-day cache lifetime. A
visitor active immediately before a cutover can temporarily retain an older asset. Validate with a
clean profile and plan fingerprinted asset URLs or an explicit cache-version strategy for a later
release.
