# Customer Bank Transfer Experience

DEV-005G1 adds a protected, customer-owned bank-transfer journey to the existing portal. It does not treat a document upload as receipt of funds and does not let the customer record a payment.

## Routes

- `/bank-transfer/` — authoritative instructions and recent reviews
- `/bank-transfer/new/` — invoice selection, exact reference and review creation
- `/bank-transfer/status/` — customer-owned review list
- `/bank-transfer/details/?id={reviewCaseId}` — proof upload/replacement, safe timeline, receipt and booking state

All routes call `requireAuthentication()` before rendering protected content. Backend ownership checks remain authoritative.

## Architecture and contracts

The static pages use `js/bank-transfer/bank-transfer-page.js` and a dedicated API repository. Proof files are sent as multipart data directly from the file input. Proof bytes and names are not copied to localStorage or sessionStorage, and DTOs are never logged.

Consumed APIs:

- `GET /api/v1/bank-transfer/reviews/instructions`
- `GET|POST /api/v1/bank-transfer/reviews`
- `GET /api/v1/bank-transfer/reviews/{id}`
- `GET|POST /api/v1/bank-transfer/reviews/{id}/proofs`
- `GET /api/v1/financial/invoices|payments|receipts`
- `GET /api/v1/bookings` and `GET /api/v1/bookings/{id}`

The accepted backend had no authoritative bank-instruction discovery contract. The minimum compatible extension is one authenticated, read-only endpoint backed by `virtcruise.bank-transfer.instructions` environment configuration. No persistence, workflow, Finance, payment or booking production logic changed.

## Customer-safe state

The timeline translates backend state into Review Created, Proof Uploaded, Proof Accepted, Awaiting Finance Review, Payment Recorded, Receipt Issued and Booking Confirmed. Reviewer identity, internal comments, audit, outbox data and storage keys are never rendered. A rejection displays only the bounded decision reason and offers replacement upload.

Payment and receipt steps are derived from authoritative Financial APIs by the exact transfer reference. Booking status comes from the Booking API and is never calculated in the browser. The receipt view states that PDF download is planned because the current receipt DTO has no PDF contract. Customer notification history is not available from the backend; transactional email remains the notification mechanism.

## Configuration

Set `BANK_TRANSFER_BANK_NAME`, `BANK_TRANSFER_ACCOUNT_NAME`, `BANK_TRANSFER_ACCOUNT_NUMBER`, `BANK_TRANSFER_BRANCH_CODE`, `BANK_TRANSFER_SWIFT`, `BANK_TRANSFER_CURRENCY`, `BANK_TRANSFER_REFERENCE_PREFIX`, `BANK_TRANSFER_REFERENCE_RULES`, and `BANK_TRANSFER_IMPORTANT_INSTRUCTIONS` on the backend. Production values must be verified by Finance before release qualification.
