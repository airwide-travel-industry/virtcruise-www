# Finance Operations Portal Acceptance

Baseline: frontend `8dfb7200fad540d31767ad11256b099609583bbf`; backend `8f5f3732cea150312c98174668ecd24c2d9c1a2e`; version `0.7.0-SNAPSHOT`.

## Automated evidence

Run `npm install` followed by `npm test`. Deterministic Finance fixtures cover empty/paginated queues, operational and terminal states, PDF/JPEG/PNG, scanning/rejected/scan-failed/missing proof, SLA states, multiple currencies, ownership/conflict/network failures. Unit coverage verifies strict DTO/state mapping, terminal-state distinction, safe proof allowlisting, and operation-scoped idempotency keys. Existing authentication, financial portal, navigation, static-quality, and static-server regression remains in the same suite.

## DEV-005D1 real-backend acceptance

Accepted 2026-08-02 against frontend `fbb22a2` plus the opt-in acceptance test and unchanged backend `8f5f373`.

Topology: rootless `postgres:18` container, PostgreSQL 18.4 on isolated loopback port 55435, UTF-8, UTC, disposable SCRAM role/database, Flyway V1–V10, backend development profile on localhost:8080, 3072-bit temporary RS256 keys outside both repositories, deterministic scanner, private temporary local storage, query-safe frontend server on localhost:15002, and system Chrome through Playwright. The frontend and API deliberately shared the localhost site so the real `SameSite=Lax` refresh cookie behaved normally. No request interception, production configuration, or production credential was used.

Real identities were registered through `/api/v1/auth/register`; the accepted controlled fixture mechanism linked Customer A/B records and promoted Finance 1/2, Consultant, and Administrator roles because no public bootstrap-admin flow exists. Login and issued roles then came from the real authentication API. Anonymous, Customer A/B, Finance 1/2, Consultant, and Administrator behavior ran over real HTTP. The backend’s full PostgreSQL suite additionally passed expired, malformed, wrong-issuer, wrong-audience, invalid-signature, and unknown-key JWT cases.

`tests/finance-real-postgres.test.mjs` creates booking/invoice prerequisites through controlled fixtures, then creates every review and uploads PDF/JPEG/PNG evidence through authenticated HTTP. Its definitive run passed 4/4:

- Chrome loaded the real queue/detail at 1920×1080, 1024×768, and 390×844 without console, network, CORS, or overflow failures; amount/currency, textual state, proof metadata, Blob viewer, storage inspection, and Customer route denial passed.
- Two real Finance tokens raced assignment; one returned 200 and one sanitized 409. Assignment persisted, start-review passed, unassignment passed, and blank/2,001-character comments returned 400. Escaped internal text persisted once in PostgreSQL; Customer and Consultant mutation paths were denied.
- Approval and rejection exact replays returned the same review identity; changed payload with the same key returned 409; approval after rejection returned 422. Customer B could not read Customer A’s case or proof; malformed IDs returned 400; tampered and anonymous requests returned 401.
- Approval-versus-rejection converged on one terminal state and one effective terminal outbox event. Direct database assertions proved one approval/rejection audit and outbox effect, completed idempotency, accepted proof metadata, V1–V10, and no Payment, Receipt, Allocation, Ledger, or Booking status mutation.

The complete unchanged backend run `RUN_POSTGRES_INTEGRATION_TESTS=true mvn verify` passed 353 tests with 0 failures, 0 errors, and 0 skipped in 60 seconds. This includes the accepted invalid-JWT matrix, proof unsafe-state/download-header checks, proof recovery/retention, idempotency concurrency, rollback, outbox, SLA/expiry, and terminal-decision races.

The browser journey uses native keyboard-operable dialogs and existing semantic/focus primitives; local automated coverage continues to check headings, labels, storage, responsive layout, and denials. No separate axe dependency or frontend coverage instrumentation exists, so no unsupported accessibility score or coverage percentage is claimed.

The frozen backend’s acceptance record already proves V1–V10, real RS256 authorization, private accepted storage, safe download headers, concurrency/idempotency, audit/outbox behavior, and absence of Payment, Receipt, Allocation, Ledger, or Booking mutation. DEV-005D does not duplicate or weaken those backend controls.

## Manual security checks

- Customer, Consultant, and Anonymous identities never receive a rendered Finance shell.
- Finance and Administrator identities pass the frontend role guard; the backend re-authorizes every request.
- Proof bytes are held only in a Blob URL and revoked on viewer close, page hide, and logout.
- Unsafe proof states have metadata only and no open control.
- Comments are labelled internal and drafts are not persisted.
- Approval is unavailable without cleared-funds attestation and reason.
- Terminal cases expose no assignment/review/decision buttons.
- Ambiguous mutations refresh before another decision and retain their idempotency key.
- Support details contain only a request ID.

## Limitations

See the contract matrix in `FINANCE-OPERATIONS-PORTAL.md`. The accepted API gaps prevent truthful global assigned/unassigned/overdue/completed compound views, reviewer selection, history, and several overview cards. These are explicitly labelled or omitted.

Frontend coverage instrumentation is not configured in this repository, so no percentage is claimed. The final ordinary frontend regression passed with all opt-in PostgreSQL tests skipped by default; the separate DEV-005D1 run passed 4/4. Syntax checks and `git diff --check` passed.

No production defect was found. Acceptance harness corrections were limited to the documented registration HTTP 202 status, exact password-input locator, same-site localhost topology, and unique per-process emails to avoid repeat-run rate-limit pollution. No backend source changed. DEV-005E prerequisites remain the additive API gaps documented in the portal guide, not an acceptance blocker for the supported DEV-005D journeys.
