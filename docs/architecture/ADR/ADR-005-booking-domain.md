# ADR-005: Booking Domain

## Context
Accepted quotes need a stable customer-facing operational representation.
## Decision
Treat bookings as first-class, read through a repository and render immutable timeline,
traveller snapshot and payment summary projections.
## Consequences
Booking UI remains separate from quote drafting and ready for future modules.
## Alternatives considered
Reusing mutable quote screens as bookings was rejected.
