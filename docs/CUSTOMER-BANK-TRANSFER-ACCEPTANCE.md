# Customer Bank Transfer Acceptance

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

## Qualification boundary

The deterministic browser suite is not a substitute for the required disposable real-PostgreSQL/real-JWT acceptance environment. Commercial qualification must repeat create, PDF/JPEG/PNG upload, rejection/replacement, Finance approval, financial projection, receipt and booking confirmation against the accepted backend plus the documented instructions extension. Until that gate is executed, the recommendation remains **CUSTOMER BANK TRANSFER EXPERIENCE REQUIRES FURTHER HARDENING**.
