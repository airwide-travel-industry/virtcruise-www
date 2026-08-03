# Bank Transfer Partial-to-Full Acceptance

DEV-005G3 ran on 2026-08-03 from frontend
`1413a53d088c9e4e69896d45fc991533fad38437` and backend
`cec6e0fa2799a57488bd93410b476b54ed81fb4a`.

The accepted harness reuses Playwright, application readiness and the offline guard, adding only a
dependency-free loopback fake SMTP capture server. The disposable environment used real Chrome,
the real frontend/backend, PostgreSQL 18.4, Flyway V1–V13, RS256 JWT, private proof roots,
deterministic scanning and the bounded scheduler. Public Internet was denied and no final API was
intercepted.

One safely redacted `VC-G3-…` Booking and `INV-G3-…` invoice began at ZAR 10,000.00. The customer
submitted ZAR 4,000.00 and a PDF through browser controls. Finance privately viewed and approved it
with cleared-funds attestation. UI and database showed ZAR 6,000.00 remaining, a partial invoice,
`DEPOSIT_PENDING`, one Payment/allocation/Receipt and no confirmation intent or email. Fake SMTP
proved the ZAR 4,000 payment and Receipt messages and authoritative ZAR 6,000 remaining balance.

The same invoice then accepted a distinct ZAR 6,000.00 browser transfer and PDF under a distinct
reference. Final state showed both Payments and Receipts, zero remaining obligation, a paid invoice
and one legal Booking confirmation. Fake SMTP proved the second payment, second Receipt and exactly
one confirmation. Source/outbox replay did not change effective cardinality.

Initial, partial and final states passed 1920×1080, 1024×768 and 390×844 without overflow.
Amount/currency pairing, keyboard-native controls, semantic headings/labels, textual status,
reduced motion and local fonts passed. Logout/back/direct navigation disclosed no protected state;
Web Storage contained no token, proof or Financial payload. No console error, public request, CORS
error or unexpected request failure occurred.

The journey proved two bounded frontend defects. Commit `b7a10a3` adds an exact transfer-amount
control; `1bb822f` gives repeated invoice transfers distinct deterministic references. Both were
failing-test-first corrections. Harness commit `d51876e` records the journey and SMTP correlation.

Focused regression passed 13/13. The ordinary suite passed 50 active tests with seven opt-in skips
by design. The enabled real-customer suite and DEV-005G3 each passed 1/1 with zero enabled skips.
DEV-005G3 supplied the missing prerequisite. The subsequent final DEV-005G consolidation passed;
see `BANK-TRANSFER-COMMERCIAL-QUALIFICATION.md` for the release-candidate entry decision.
