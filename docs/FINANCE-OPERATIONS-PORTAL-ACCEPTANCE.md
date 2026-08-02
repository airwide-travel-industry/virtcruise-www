# Finance Operations Portal Acceptance

Baseline: frontend `8dfb7200fad540d31767ad11256b099609583bbf`; backend `8f5f3732cea150312c98174668ecd24c2d9c1a2e`; version `0.7.0-SNAPSHOT`.

## Automated evidence

Run `npm install` followed by `npm test`. Deterministic Finance fixtures cover empty/paginated queues, operational and terminal states, PDF/JPEG/PNG, scanning/rejected/scan-failed/missing proof, SLA states, multiple currencies, ownership/conflict/network failures. Unit coverage verifies strict DTO/state mapping, terminal-state distinction, safe proof allowlisting, and operation-scoped idempotency keys. Existing authentication, financial portal, navigation, static-quality, and static-server regression remains in the same suite.

## Browser acceptance status

The local Playwright acceptance exercises a Finance role guard, Customer denial, authoritative queue requests, detail rendering, secure proof retrieval, approval request contract, cleared-funds dialog, storage inspection, and layout at 1920×1080, 1024×768, and 390×844. The run passes five Finance browser tests without console errors or page overflow. Assignment/start/comment/rejection, concurrency, and all required identity variants still require the real-backend journey. Real PostgreSQL acceptance requires the opt-in accepted-backend environment and is not represented as passed here.

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

Frontend coverage instrumentation is not configured in this repository, so no percentage is claimed. The full local run on 2026-08-02 passed 36 tests, failed 0, and skipped the existing opt-in PostgreSQL financial journey (1). Syntax checks and `git diff --check` passed. DEV-005D remains short of final acceptance until its real PostgreSQL/browser matrix is run.
