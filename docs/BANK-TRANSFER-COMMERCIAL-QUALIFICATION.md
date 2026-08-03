# Bank Transfer Commercial Qualification — Frontend Cross-reference

## Final consolidation — 2026-08-03

**READY FOR v0.7.0 RELEASE-CANDIDATE WORKSTREAM.** This supersedes the historical blocked entries
below. The accepted frontend baseline was `2744de0012fe556f4ad3357b55b6a5c1cbede6b0`; backend
baseline `4c128ab3662a852dd986002309880dd5549895c9` supplied PostgreSQL/Flyway and service evidence.

The complete ordinary suite passed 50 active tests. All mandatory real-environment suites passed:
customer Bank Transfer 1/1, Finance 4/4, Financial Portal 1/1 and DEV-005G3 1/1—7/7 with zero
mandatory skips. No product correction was required during consolidation. The accepted source has
no runtime `networkidle`, external resource dependency or public-network allowance.

Commercial evidence covers initial PDF approval, private Finance proof viewing and cleared-funds
attestation; safe rejection with private comments; independent JPEG and PNG replacements with
immutable cycles/supersession; and the same ZAR 10,000.00 invoice receiving ZAR 4,000.00 then ZAR
6,000.00. The partial UI retained ZAR 6,000.00 outstanding and no confirmation; final UI showed two
Payments/Receipts, a paid invoice and confirmed Booking. Deterministic SMTP proved two payment, two
Receipt and one post-commit confirmation messages with no proof/private/internal content.

Desktop 1920×1080, tablet 1024×768 and mobile 390×844 passed without overflow. Semantic headings,
labels, keyboard/focus behavior, live textual status, reduced motion and local fonts are accepted;
no accessibility score is claimed. Offline denial, query-safe diagnostics, clean console/CORS,
memory-only tokens, empty sensitive Web Storage, Blob cleanup and logout/back protection passed.

Production exact origin, backend URL and bank details remain deployment configuration. Staging
must validate edge routing, credentials, multipart/CSRF/idempotency headers and invalid-origin
denial. No push, tag, RC or deployment occurred.

## DEV-005G3 prerequisite evidence — 2026-08-03

The missing same-invoice partial-to-full real-browser journey and deterministic fake-SMTP evidence
now pass. See `BANK-TRANSFER-PARTIAL-FULL-ACCEPTANCE.md`. DEV-005G remains unaccepted until its full
commercial qualification is freshly rerun.

## DEV-005G final rerun

Final decision: **BANK TRANSFER COMMERCIAL QUALIFICATION REQUIRES FURTHER HARDENING**. Starting
frontend `8c4d0b681524c6deba4ca0b213e246665464bc1b` and backend
`2e9bd74768c0989b760a19568512af896d3cc22f` were clean and contained all accepted ancestry.

Fresh results: 49/49 active ordinary tests; all six enabled real-environment tests; 50/50 assertions
across ten repeats of the formerly failing financial group; real straight-through PDF approval;
independent browser PDF-to-JPEG and PDF-to-PNG replacement journeys; desktop/tablet/mobile; clean
asserted console/network/CORS/storage behavior; and loopback-only runtime with injected public
requests denied. The backend passed 583/583 tests and clean Flyway V1–V13.

The final gate remains blocked because the accepted integrated browser harness does not drive one
invoice through partial and remaining transfers and inspect the resulting deterministic fake-SMTP
mailbox. Component coverage cannot replace that mandatory integrated evidence. No frontend product
defect was reproduced or changed. Local main was not integrated; nothing was pushed, tagged,
deployed or released.

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
