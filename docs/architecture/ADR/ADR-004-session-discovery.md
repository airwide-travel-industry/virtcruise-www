# ADR-004: Session Discovery

## Context
Unconditional guest refresh produced an expected HTTP 401 console error.
## Decision
Call read-only session discovery first and refresh only when `refreshable=true`.
## Consequences
Guest startup is quiet and returning sessions still restore without exposing cookies.
## Alternatives considered
Weakening refresh responses or reading HttpOnly cookies was rejected.
