# ADR-009: Flyway Migration Strategy

## Context
Frontend releases depend on a known backend schema contract.
## Decision
Production activation requires a successful forward-only Flyway chain and health validation.
## Consequences
Frontend rollback does not automatically reverse additive database migrations.
## Alternatives considered
Manual schema changes and automatic destructive down-migrations were rejected.
