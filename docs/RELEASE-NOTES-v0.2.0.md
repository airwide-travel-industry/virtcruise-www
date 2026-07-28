# Virtcruise Frontend v0.2.0

## Summary

v0.2.0 delivers the production customer journey at https://virtcruise.airwide.co.uk and connects the
shared Quote Builder to the v0.2.0 aggregate backend at https://api.virtcruise.airwide.co.uk.

## Highlights

- Premium responsive homepage with fixed utility/navigation bars and accessible menus.
- Quick Quote starts and merges into one Quote Builder draft.
- My Trip provides itinerary review, editing, removal, ordering and notes.
- Featured Tours, Victoria Falls and package pages share the same trip state.
- Six live packages and three featured packages load through the production catalogue API.
- One aggregate, idempotent `POST /api/v1/quotes` replaces the legacy customer-first flow.

## Added

- Data-driven forms for flights, accommodation, visa services, car rental, packages and cruises.
- Traveller, trip, package, service and itinerary domain modules.
- Package repository with production, local/mock and offline-fallback sources.
- Stable submission identity and a serial offline queue.
- Loading, empty, error and success states.
- Keyboard menus, focus management, inline validation and live announcements.

## Changed

- Production never calls `POST /api/v1/customers` and never flattens service details into notes.
- POST submissions are not automatically retried; intentional retry reuses the original key.
- Package actions use backend package IDs while retaining stable public slugs.
- Production is hosted in immutable NGINX release directories with an atomic `current` symlink.

## Security

- Production API traffic is HTTPS-only and restricted by backend CORS to the production origin.
- Browser drafts contain customer-entered data and are session-scoped; operators should avoid
  collecting storage dumps or payloads in routine support.
- Production success requires a complete real backend response; no mock reference is generated.

## Deployment and validation

- Release commit: `5fda61df4d4f414a5058bf08ad6ff1b65ebd857e`
- Tag: `v0.2.0`
- NGINX release: `/var/www/virtcruise/releases/5fda61df4d4f414a5058bf08ad6ff1b65ebd857e`
- Validated at desktop, tablet and mobile widths.
- End-to-end quote creation, idempotent replay, package catalogue and scoped test cleanup passed.

## Upgrade notes

Deploy the matching backend v0.2.0 before switching the NGINX frontend symlink. Export the frontend
from the immutable tag, verify its manifest/checksum and preserve the previous release for rollback.
Existing v1 browser drafts are normalized on load; production must not fall back to the legacy
customer-first endpoint if aggregate submission is unavailable.

## Known limitations

- No payments, authentication, booking engine, CRM or staff portal.
- Pricing is indicative and supplier availability is not real-time.
- Offline submissions remain on the originating device until connectivity returns.
- Local JSON is an offline/development fallback, not live inventory.
- JavaScript and CSS use a one-day cache lifetime without fingerprinted filenames.
- Browser storage is not a substitute for authenticated account history.

## Next release

Candidate work includes authenticated customer/staff experiences, server-authoritative quote
lifecycle and pricing, production email delivery, monitoring, and fingerprinted frontend assets.

## Documentation

- [Architecture](https://github.com/airwide-travel-industry/virtcruise-www/blob/main/docs/ARCHITECTURE-v0.2.0.md)
- [Quote Builder](https://github.com/airwide-travel-industry/virtcruise-www/blob/main/docs/QUOTE-BUILDER-v0.2.0.md)
- [Deployment](https://github.com/airwide-travel-industry/virtcruise-www/blob/main/docs/DEPLOYMENT-v0.2.0.md)
- [Operations](https://github.com/airwide-travel-industry/virtcruise-www/blob/main/docs/OPERATIONS-v0.2.0.md)
