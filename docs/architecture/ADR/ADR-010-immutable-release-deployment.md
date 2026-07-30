# ADR-010: Immutable Release Deployment

## Context
Production releases must be repeatable and reversible.
## Decision
Build from tags, verify manifests/checksums, install commit-addressed directories and switch an
atomic `current` symlink.
## Consequences
Rollback is fast and deployed identity is independently verifiable.
## Alternatives considered
Copying a working tree over the active document root was rejected.
