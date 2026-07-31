# RC-002 Production Deployment Validation

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
