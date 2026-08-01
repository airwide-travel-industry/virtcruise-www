# Virtcruise Frontend v0.6.0

## Promotion

`v0.6.0` promotes the production-accepted `v0.6.0-rc2` static archive and SBOM without functional
change. Production Beta retains the accepted immutable directory, avoiding an unnecessary reload.

## Included capabilities

- Authenticated Customer Financial Portal with Financial Overview, invoices and deposits,
  payments, receipts and refunds.
- Exactly one authoritative default-account request per overview load, including an OPEN ZAR
  account with `ZAR 0.00` and customer-friendly empty histories.
- Existing registration, verification, password recovery, session restoration, customer portal,
  quote and booking journeys.
- Responsive and accessible Money/status presentation at desktop, tablet and mobile widths.
- Read-only integration with the Financial Domain/Application Layer and provider-neutral backend;
  no payment initiation control is exposed.

## Security and supply chain

Access tokens remain memory-only, refresh sessions use Secure HttpOnly cookies, financial data is
not persisted in public browser storage, and logout clears protected state. Exact CORS, ownership,
path-only logging and protected-route behavior passed RC-003. npm audit reported zero
vulnerabilities and the reproducible CycloneDX SBOM is published with the archive checksum.

## Upgrade and rollback

The accepted content remains at
`/var/www/virtcruise/releases/fffd2a832301f831ecfd9b803caddb96b13c700c`; record it
operationally as `v0.6.0` without changing its bytes. If rollback is required, atomically restore
`/var/www/virtcruise/current` to
`/var/www/virtcruise/releases/6e8abd809693c1b17d78c0bebf701828e7051927`, run `nginx -t`, and
reload NGINX.

## Known limitations

There is no Pay control, real provider, PDF invoice/receipt, combined cross-currency total or
payment/receipt/refund detail endpoint. Search and filtering remain page-local.
