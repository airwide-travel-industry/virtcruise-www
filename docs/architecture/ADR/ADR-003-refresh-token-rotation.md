# ADR-003: Refresh Token Rotation

## Context
Longer sessions must resist replay without exposing refresh credentials to JavaScript.
## Decision
Use backend-rotated Secure HttpOnly refresh cookies with CSRF protection.
## Consequences
The frontend requests CSRF before refresh/logout and degrades safely after reuse detection.
## Alternatives considered
Local storage and non-rotating cookies were rejected.
