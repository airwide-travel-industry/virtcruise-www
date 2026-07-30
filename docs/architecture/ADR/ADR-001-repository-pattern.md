# ADR-001: Repository Pattern

## Context
UI code needs mock, local and production data sources without duplicating business flows.
## Decision
Pages consume repositories; only API infrastructure performs network requests.
## Consequences
Data sources are replaceable and calls can be cached, coalesced and tested centrally.
## Alternatives considered
Direct page-level `fetch()` was rejected because it couples views to transport details.
