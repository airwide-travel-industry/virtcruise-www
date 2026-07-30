# ADR-002: JWT Authentication

## Context
Protected portal APIs require short-lived, verifiable customer authority.
## Decision
Keep RS256 access tokens in memory and attach them through the authentication provider.
## Consequences
Reload requires secure session restoration; browser storage cannot leak bearer tokens.
## Alternatives considered
Persistent bearer tokens and browser-managed identity logic were rejected.
