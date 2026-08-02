# Customer Bank Transfer Acceptance

Final DEV-005G rerun (2026-08-02) passed a straight-through browser PDF approval and independent
PDF-to-JPEG and PDF-to-PNG rejection/replacement journeys against PostgreSQL 18.4/Flyway V1–V13.
Registration, verification, instructions, upload, Finance review, privacy, payment/receipt/Booking
continuation, ownership denials and three viewports passed. Integrated partial-then-remaining and
fake-SMTP mailbox evidence remains mandatory and incomplete, so this is not RC entry approval.

## Automated browser coverage

`node --test tests/customer-bank-transfer.test.mjs` exercises real headless Chrome with authenticated JWT-shaped sessions and mocked HTTP contracts:

- protected authoritative instructions at desktop, tablet and mobile widths
- no horizontal overflow at 1440, 768 and 390 pixels
- exact transfer-reference display and review creation using server invoice/booking identifiers
- PDF multipart upload, scanning/accepted messaging and no browser storage of proof bytes
- rejected proof reason and replacement-upload path
- payment-recorded, receipt-issued and booking-confirmed presentation
- explicit separation between proof receipt and payment receipt

`npm test` runs this journey with the existing frontend suites. `mvn -Dtest=BankTransferControllerTest test` verifies the compatible instructions endpoint.

## Security evidence

- Customer review reads/uploads are still enforced by the accepted backend owner checks.
- Proof download URLs are not generated or exposed by the customer UI.
- Upload bodies go directly to the authenticated private endpoint.
- No raw DTO logging and no proof bytes in web storage.
- Internal Finance fields returned by legacy review DTOs are not rendered except `decisionReason`, which is the only available rejection-reason contract and is bounded/escaped.

## Accessibility and responsive evidence

Semantic headings, labelled controls, keyboard-native file/select controls, focus movement to page headings, live upload announcements, `aria-current` timeline state, large portal buttons and reduced-motion behavior are retained. Layouts collapse at 850 and 520 pixels without horizontal scrolling.

## DEV-005G1A real-backend evidence

On 2026-08-02, `tests/customer-bank-transfer-real-postgres.test.mjs` passed without mocks or skips against PostgreSQL 18.4 (UTF-8, UTC, SCRAM), Flyway V1–V12, temporary 3072-bit RS256 keys, deterministic scanning, private temporary proof storage, disabled/fake mail transport and Chrome 141. The browser registered and verified real users, used refresh-backed RS256 sessions, rendered configured instructions at 1920×1080, 1024×768 and 390×844, created a review from a real invoice/booking, uploaded and inspected a real PDF, completed Finance assignment/comment/review/approval, and refreshed as the customer to observe Payment, BTR receipt and confirmed Booking data from the backend.

Database assertions proved one review, accepted proof, payment, receipt and `ReceiptIssued` notification intent for the journey, plus a zero-sum journal. Customer B was denied review/proof access and could not see Customer A's receipt; anonymous and Consultant Finance access were denied; Administrator review access passed. Browser storage contained no proof filename/bytes, tokens or financial DTO identifiers.

Acceptance found and corrected frontend correlation/envelope/timeline defects plus absent and locking production outbox dispatch. The frontend run passed 42 tests with zero failures (six opt-in suites skipped by the default command); the real PDF suite ran separately with zero skips. The clean backend PostgreSQL run passed 562 tests with zero failures, errors or skips.

## Remaining qualification boundary

The real harness proves the primary PDF approval path. JPEG and PNG remain proven by deterministic browser and PostgreSQL component suites, but not separate no-mock customer-browser journeys. The mandatory rejection/replacement path is impossible under the accepted contract: Finance rejection transitions the review to terminal `REJECTED`, while proof acceptance permits only `AWAITING_UPLOAD`. No workaround or lifecycle extension was invented. Therefore DEV-005G1A remains **CUSTOMER BANK TRANSFER REAL BACKEND ACCEPTANCE REQUIRES FURTHER HARDENING**.
