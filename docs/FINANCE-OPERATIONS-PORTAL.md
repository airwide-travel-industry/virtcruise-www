# Finance Operations Portal

DEV-005D consumes the frozen DEV-005C backend at `8f5f373`. It is a static-hosting-compatible ES-module portal. No backend production source was changed.

## Routes and authorization

| Route | Purpose |
|---|---|
| `/finance/` | Finance overview using authoritative status totals |
| `/finance/bank-transfers/` | Server-paginated review queue |
| `/finance/bank-transfers/details/?id={reviewCaseId}` | Case, proof metadata, and operations |
| `/finance/bank-transfers/assigned/` | Labelled current-page assigned-to-me view |
| `/finance/bank-transfers/unassigned/` | Labelled current-page unassigned view |
| `/finance/bank-transfers/overdue/` | Labelled current-page breached-SLA view |
| `/finance/bank-transfers/completed/` | Labelled current-page terminal view |

The route guard completes session restoration and then requires `ROLE_FINANCE`, `ROLE_ADMIN`, `BANK_TRANSFER_REVIEW`, or `BANK_TRANSFER_ADMIN` before rendering the Finance shell. Other authenticated users are replaced to `/dashboard/`; guests are replaced to sign-in. Finance navigation uses the same predicate. Backend authorization remains authoritative.

## API contract matrix

| Capability | Accepted contract | Portal behavior / gap |
|---|---|---|
| Queue | `GET /api/v1/bank-transfer/reviews` | Uses server page, size, single status, sort, and direction |
| Detail | `GET /api/v1/bank-transfer/reviews/{id}` | Strictly maps documented `ReviewCaseView` |
| Assignment | `POST .../{id}/assign` | Assign-to-self using authenticated user ID; no reviewer directory exists |
| Unassignment | `DELETE .../{id}/assignment` | Available for non-terminal cases; server decides policy |
| Start review | `POST .../{id}/review` | Offered for accepted/clean proof and `PROOF_RECEIVED`; server guards remain authoritative |
| Comments | `POST .../{id}/comments` | Internal composition, blank/2,000-character validation; no comment-list endpoint exists |
| Approval | `POST .../{id}/approve` | Required reason and cleared-funds attestation; operational only |
| Rejection | `POST .../{id}/reject` | Required reason; no reason-code list or notification API exists |
| Filtering | `status` only | Unsupported reviewer/assignment/SLA/date views are clearly labelled current-page narrowing |
| Sorting | `createdAt`, `updatedAt`, `slaDueAt`, `reviewStatus`, `amount`; `asc`/`desc` | Passed to backend only |
| Pagination | `page`, `size`, response totals | Server metadata shown unchanged |
| Proof metadata | `GET .../{id}/proofs` | Maps documented `ProofView`; no supersession/legal-hold field exists |
| Proof download | `GET .../{id}/proofs/{proofId}` | Authenticated Blob; only accepted + clean PDF/JPEG/PNG; URL revoked on close/logout/page hide |
| SLA | `slaDueAt`, `slaBreached` | Backend breach result is authoritative; due timestamp uses explicit timezone |
| History | No read endpoint | Omitted; decision reason and timestamps shown from case DTO only |
| Problem Details | Standard problem response and safe statuses | Sanitized messages; request ID only in expandable support detail |
| Optimistic lock | HTTP 409 | Refreshes detail and explains conflict without overwrite |
| Idempotency | `Idempotency-Key`, max 128 | One generated key per intended mutation; ambiguous failures retain the key and refresh before another decision |

The case API does not provide customer names, human booking/invoice references, proof-replacement state, review age, completion timestamp, reviewer eligibility, recent activity, or aggregate totals other than a filtered list total. The portal displays UUIDs and omits unsupported information.

## Security and privacy

Access tokens remain in the existing memory-only token manager; the refresh token remains an HttpOnly cookie. Finance requests include bearer authorization, credentials, CSRF on mutation, request ID, timeout, cancellation, and idempotency keys. Reads are coalesced and cached in bounded short-lived memory. Mutations are never automatically retried. Cache and Blob URLs clear on logout; proof bytes and comment drafts never enter Web Storage. API objects, storage keys, paths, and security claims are not rendered or logged.

Proof viewing treats evidence as untrusted until both document status is `ACCEPTED` and scan status is `CLEAN`. SVG/HTML and non-allowlisted media are rejected. A PDF uses a Blob-backed sandboxed backend response in a controlled dialog; images use in-memory Blob URLs.

## Decisions and lifecycle

Terminal cases have no operational buttons. Assignment, unassignment, review, and decision races still defer to backend lifecycle and authorization. Approval requires an accessible modal, case context, reason, and explicit attestation that cleared funds were independently verified, proof alone is insufficient, amount and currency match, the decision is auditable, and downstream processing is separate. Rejection requires a reason and makes no promise of notification or resubmission.

## Refresh, accessibility, and responsive behavior

The portal uses explicit refresh only; no polling or WebSocket was introduced. It has a skip link, semantic main/navigation/table/caption, labelled filters, status text in addition to colour, live announcements, native modal focus behavior, visible focus, reduced-motion support, and paired amount/currency accessible names. At narrower widths the queue table becomes labelled cards and dialogs fit the viewport.

## DEV-005E prerequisites

Backend support is required before adding a reviewer directory, server-side assignment/reviewer/SLA/date filters, multi-status completed filtering, comment/history reads, audit-safe activity, richer customer/booking/invoice display references, review-age/completion timestamps, resubmission/supersession data, or proof legal-hold state. These gaps are not frontend convenience changes and DEV-005D does not alter the backend.

## Real-backend acceptance

DEV-005D1 passed the supported portal against PostgreSQL 18.4, Flyway V1–V10, real RS256 authentication, private accepted storage, deterministic scanning, two Finance sessions, Customer ownership, Consultant read-only policy, Administrator backend policy, authenticated PDF/JPEG/PNG retrieval, HTTP idempotency, concurrency, and direct database assertions. Run the opt-in harness with `npm run test:finance:real` only after provisioning the disposable topology described in the acceptance document. It never intercepts API responses.
