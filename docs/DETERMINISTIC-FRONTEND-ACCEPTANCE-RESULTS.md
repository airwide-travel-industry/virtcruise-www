# Deterministic Frontend Acceptance Results

Date: 2026-08-02. Frontend start: `5e128cb427db29f781e6a8742af11c56f90c565b`. Backend qualification: `2e9bd74768c0989b760a19568512af896d3cc22f`.

## Root cause and corrections

The original failures were the desktop/tablet/mobile multi-currency financial portal tests, invoice-detail ownership test and zero-activity overview test. Each used `page.goto` with `networkidle` and a 30-second timeout.

A controlled reproduction held only Google Fonts open. `/financial/invoices/` loaded local modules/data but timed out at 3,001 ms with that stylesheet as the sole pending request and no console/request failure. Unmodified successful navigation varied from 2.2–11.1 seconds; the file took 50.1 seconds.

All Google Fonts imports/hints were removed. Body text uses `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; display text uses `Georgia, "Times New Roman", serif`. No font was downloaded. The harness now uses explicit readiness and a query-safe external-request blocker. Real fixtures now expect Flyway V1–V13 and reuse the account created on activation.

## Results

| Gate | Result |
|---|---|
| Original five individually / together | 5/5 / 5/5 passed |
| Repeated group | 10/10 runs; 50/50 passed |
| Ordinary suite | 55 discovered; 49 passed; 0 failed; 6 opt-in skipped |
| Finance opt-in | 4/4 passed; 0 skipped |
| Bank-transfer opt-in | 1/1 passed; 0 skipped |
| Financial opt-in | 1/1 passed; 0 skipped |
| Mandatory opt-in aggregate | 6/6 passed; 0 skipped |
| Offline guard | 2/2 passed; no Google Fonts; injected public request blocked |
| Responsive | 1920×1080, 1024×768, 390×844 passed without overflow |
| Console/network/CORS | Clean on asserted normal routes |
| Accessibility/privacy | Existing focus/keyboard/semantic/live-region/reduced-motion behavior retained; query-safe logs and storage checks passed |

The passing topology used PostgreSQL 18.4, Flyway V1–V13, Hibernate validation, loopback origins, temporary 3072-bit RSA material, local-only test authentication, deterministic scanning and temporary private proof storage. No business behavior, backend API/DTO or hosting changed.

Known limitation: offline smoke coverage uses representative public routes; authenticated financial, Finance and bank-transfer routes are covered in their dedicated deterministic suites. Social/WhatsApp destinations remain optional user-initiated links.

DEV-005G was not rerun or accepted here. Recommendation after final cleanup: **READY TO RERUN DEV-005G COMMERCIAL QUALIFICATION**.
