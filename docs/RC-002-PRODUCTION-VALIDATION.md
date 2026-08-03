# RC-002 Production Deployment Validation

## v0.7.0-rc1 pre-flight — 2026-08-03

**RC-002 REQUIRES FURTHER HARDENING.** Both immutable RC-001 artifacts and their complete checksum,
manifest, inventory and CycloneDX metadata verified. Public frontend/TLS and the existing Production
Beta remained healthy, but deployment stopped before backup or mutation because the backend has no
approved production Bank Transfer instructions or private proof roots and NGINX has no V13 Bank
Transfer/operations routes.

The frontend archive was not copied, extracted or activated. Production remains on frontend release
`fffd2a832301f831ecfd9b803caddb96b13c700c`; no browser acceptance or rollback was attempted because
the mandatory pre-flight gate failed. The backend report contains the authoritative infrastructure
evidence and required configuration actions.

The earlier v0.6.0-rc1 validation is retained below as historical evidence.

Production validation of frontend `v0.6.0-rc1` with backend `v0.6.0-rc1` ended in a verified
rollback. The frontend artifact itself installed correctly, all 25 routes were present, and the
guest desktop/tablet/mobile gates passed.

The production NGINX boundary initially omitted the Sprint 3.5 financial and provider paths. After
that route defect was corrected, a newly verified and customer-linked account exposed the blocking
application contract defect: the financial overview request returned 404 when no financial account
row existed. The history endpoints returned empty pages, but the overview could not render the
required authoritative zero-balance state without a normal-path failed request.

RC1 is not eligible for promotion. The complete evidence, backup and rollback record is maintained
in the backend repository's `docs/RC-002-PRODUCTION-VALIDATION.md`.

The frontend and backend RC1 tags remain immutable. Production Beta was restored to frontend commit
`6e8abd809693c1b17d78c0bebf701828e7051927` and backend `0.5.0-rc2`.
