# ADR-007: Secure Logging

## Context
Verification and reset links carry one-time secrets in query strings.
## Decision
NGINX logs method plus normalized `$uri`, never raw request targets or query strings.
## Consequences
Operational status, timing and request IDs remain; query-level diagnostics are intentionally lost.
## Alternatives considered
Per-parameter redaction was rejected as fragile for future credentials.
