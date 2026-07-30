# ADR-008: Transactional Email

## Context
Registration and recovery require trustworthy production links.
## Decision
The frontend invokes generic backend lifecycle APIs and never receives mail-provider credentials.
## Consequences
Anti-enumeration responses and provider independence remain backend responsibilities.
## Alternatives considered
Client-side email delivery and exposed provider keys were rejected.
