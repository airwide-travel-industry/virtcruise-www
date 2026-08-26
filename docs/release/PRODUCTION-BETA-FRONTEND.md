# Production-Beta Frontend

Release: `0.8.0-beta.2`
Artifact source commit: `9e4e734e7b216c7de0680256440c91589488d207`
Artifact commit: `1669af142d7813d8b089692be92a93a3a283cc27`
Backend baseline: `05378a05285756a995517b0cbcf68aefbf99751f`

Artifact: `dist/virtcruise-www-0.8.0-beta.2.zip`
Size: 4,489,217 bytes
Files: 143 including `SHA256SUMS`
SHA-256: `125da7356f8e10b8a180595c26e98cc5f01c20cea1b00dc5f7ac01d7414cae8c`
Build recorded: 2026-08-04T15:37:36Z

The manifest records production runtime enabled and development runtime disabled. SEC-001 remains
compatible because authentication/CSRF behavior and `/signin` are retained; `/first-admin` remains
correctly backend-served and is not a required static frontend asset.

Two clean builds produced the same SHA-256. Focused packaging and artifact browser acceptance:
6 passed, 0 failed. The broader deterministic frontend selection: 94 passed, 0 failed. Browser
coverage includes homepage, Dynamic Catalogue, authentication, Content Studio authorization and
responsive modules, Control Tower presence/authorization, console, network, assets and horizontal
overflow across desktop, tablet and mobile.
