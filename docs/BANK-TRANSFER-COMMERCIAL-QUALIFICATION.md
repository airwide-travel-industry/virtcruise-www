# Bank Transfer Commercial Qualification — Frontend Cross-reference

## DEV-005G2 deterministic acceptance

DEV-005G2 removed Google Fonts runtime dependencies, replaced `networkidle` with application readiness, and added a loopback-only request guard. The original five pass individually, together and for ten consecutive grouped runs. The ordinary suite passes 49/49 active tests; all six real-backend tests pass separately with zero skips against backend `2e9bd747`. See the deterministic acceptance guide and results.

This permits a new qualification run; it is not DEV-005G acceptance. DEV-005G was not rerun here.

## Requalification after DEV-005G1B

DEV-005G reran from frontend `4e431899c112515cd50321c8e6e7cc5a36e1cbfd` and backend
`7f4e3a4cf6425bbb6356f55aa1cb9e5b81d300db`. The backend passed PostgreSQL 18.4, clean Flyway
V1–V13 and 583 tests with zero failures/errors/skips.

The frontend's locked dependencies installed successfully with zero audit vulnerabilities, but the
mandatory complete suite reported 39 passes, five failures and six opt-in skips. Each failure was a
30-second Playwright navigation timeout waiting for `networkidle`; the financial-portal failures
reproduced in isolation. Because the pages request Google Fonts from external origins, unavailable
or delayed font responses make this gate nondeterministic before its assertions run.

No product defect was proven and no production code was changed. Qualification stopped, local main
was not integrated, and nothing was pushed, tagged, deployed, promoted or released. The next
bounded workstream must make browser acceptance independent of external font/network availability,
then rerun DEV-005G. Result: **BANK TRANSFER COMMERCIAL QUALIFICATION REQUIRES FURTHER HARDENING**.

## Historical initial qualification

DEV-005G evaluated frontend `9dce33b44788005e38c37c6546722689d92b8268` with backend `102eed4a9aa6ec4d39eca7adc8529e71a3064455` on `integration/DEV-005G-bank-transfer-commercial-qualification`.

Result: **BANK TRANSFER COMMERCIAL QUALIFICATION REQUIRES FURTHER HARDENING.** The accepted Finance portal and customer Financial Portal are present, but there is no customer route/component/repository for bank instructions, review-case creation, proof upload, case/proof state, rejection/resubmission, or linkage to payment/receipt/booking results. No deliberate staff-assisted commercial submission policy is documented.

The backend also has no authoritative bank-instruction discovery model/API. Case creation accepts caller-supplied `bankAccount` and `transferReference`; the frontend must not invent or hardcode production details. A bounded corrective workstream must first define effective-dated multi-currency bank configuration and server-side reconciliation identity, then build the customer instructions/submission/status experience against it.

Consequently DEV-005G cannot truthfully claim the complete UI journey, customer proof negative matrix, partial/full transfer journey, rejection/resubmission, or customer-path responsive/accessibility/privacy acceptance. Existing Finance coverage remains component evidence only. See the backend `docs/BANK-TRANSFER-COMMERCIAL-QUALIFICATION.md`, operations, deployment readiness, production checklist, and rollback guide for the authoritative qualification record.

No frontend production code, release branch, tag, local main, deployment, or remote was changed.
