# ADR-006: NGINX Route Strategy

## Context
Production exposes only approved API resources and must preserve ownership preflights.
## Decision
Use explicit route boundaries; narrow UUID customer routes precede an ordinary blocking catch-all.
## Consequences
OPTIONS reaches backend CORS while admin, lookup and unsupported routes remain unavailable.
## Alternatives considered
A broad `^~ /customers` catch-all was rejected because it suppresses narrower regex locations.
