# Financial Engine Integration

DEV-004F verifies this portal at commit `b0ee157c81a2c52655ea10ade2e778b78c3006b3`
against the accepted backend Payment Provider Framework at commit
`d3c85d4cc2b38f6b8cd6e1113d63dd1eba61d471`.

The authoritative architecture, API compatibility matrix, transaction model, provider safety,
PostgreSQL V1–V8 evidence, performance results, security review, known contract gaps and deployment
prerequisites are maintained in the backend repository:

[`docs/FINANCIAL-ENGINE-INTEGRATION.md`](https://github.com/airwide-travel-industry/virtcruise-backend/blob/main/docs/FINANCIAL-ENGINE-INTEGRATION.md)

The frontend remains read-only. It does not call payment-intent or provider-event endpoints, does
not expose the deterministic fake adapter, and retains the honest message that online payment will
be available later. Existing account, balance, invoice, deposit, payment, receipt and refund DTOs
remain compatible.

Integrated acceptance used real RS256 authentication and a clean PostgreSQL 18.4 database migrated
through Flyway V8. The portal passed empty and populated histories, ownership denial, logout
protection, browser-storage inspection and desktop/tablet/mobile layouts without API mapping
changes.
