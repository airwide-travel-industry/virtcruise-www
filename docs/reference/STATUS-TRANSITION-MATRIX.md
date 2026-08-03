# VirtCruise Status Transition Matrix

| Field | Value |
|---|---|
| Document ID | DOC-007-TM |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted evidence through v0.7.0 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Purpose

This is the normative edge list for DOC-007. A transition not listed as allowed is not allowed. The matrix does not grant permission: the owning service, role authorisation, current record version, entry conditions, and approved policy must all permit the command.

## 2. Legend

| Code | Meaning |
|---|---|
| `A` | Allowed by accepted lifecycle evidence |
| `N` | Not allowed |
| `P` | Policy dependent or conditional capability; unavailable unless accepted support and policy exist |
| `U` | Automatic/system transition |
| `M` | Manual command by an authorised actor |
| `E` | Event/derived consequence, not a direct state mutation |

Combined codes identify both legality and agency, such as `A/M`. `P/M` is not an accepted runtime edge by itself.

## 3. Master legal transition table

| Lifecycle | From | To | Rule | Trigger/actor | Required guard or consequence |
|---|---|---|---|---|---|
| Quote | `DRAFT` | `SUBMITTED` | `A/M` | Customer | Valid owned request |
| Quote | `SUBMITTED` | `QUOTED` | `A/M` | Consultant workflow | Customer-visible quote prepared |
| Quote | `QUOTED` | `ACCEPTED` | `A/M` | Customer | Acceptance action is offered and quote is current |
| Quote | `ACCEPTED` | `BOOKED` | `A/U` | Booking workflow | Booking creation/progression succeeds |
| Quote | `BOOKED` | `COMPLETED` | `A/U` | Workflow | Completion criteria pass |
| Quote | eligible active | `CANCELLED` | `P/M` | Authorised actor | Applicable cancellation policy |
| Booking | `PENDING_CUSTOMER_ACCEPTANCE` | `ACCEPTED` | `A/M` | Customer | Current eligible booking accepted |
| Booking | `ACCEPTED` | `DEPOSIT_PENDING` | `P/U` | Booking workflow | Deposit policy applies |
| Booking | `DEPOSIT_PENDING` | `DEPOSIT_RECEIVED` | `P/U` | Booking workflow | Required Financial milestone passes |
| Booking | `DEPOSIT_RECEIVED` | `CONFIRMED` | `P/U` | Booking workflow | All confirmation conditions pass |
| Booking | `CONFIRMED` | `DOCUMENTS_PENDING` | `P/U` | Booking workflow | Document preparation is required |
| Booking | `DOCUMENTS_PENDING` | `READY_TO_TRAVEL` | `P/U` | Booking workflow | Readiness checks pass |
| Booking | `CONFIRMED` | `READY_TO_TRAVEL` | `P/U` | Booking workflow | Policy permits skipping documents state |
| Booking | `READY_TO_TRAVEL` | `IN_PROGRESS` | `A/U` | Booking workflow | Travel begins |
| Booking | `IN_PROGRESS` | `COMPLETED` | `A/U` | Booking workflow | Completion criteria pass |
| Booking | eligible active | `CANCELLED` | `P/M` | Authorised workflow | Cancellation policy permits |
| Booking | eligible financial outcome | `REFUNDED` | `P/U` | Financial/booking workflow | Approved refund completes |
| Review case | `NEW` | `AWAITING_UPLOAD` | `A/U` | Case workflow | Initial upload stage opened |
| Review case | `AWAITING_UPLOAD` | `PROOF_RECEIVED` | `A/U` | Upload/proof workflow | Eligible proof handled |
| Review case | `PROOF_RECEIVED` | `UNDER_REVIEW` | `A/M` | Assigned Finance reviewer | Current proof `ACCEPTED` + scan `CLEAN` |
| Review case | `UNDER_REVIEW` | `APPROVED` | `A/M` | Authorised Finance reviewer | Independent cleared-funds verification, match, reason, attestation |
| Review case | `UNDER_REVIEW` | `REJECTED` | `A/M` | Authorised Finance reviewer | Reason recorded; accepted case becomes terminal |
| Review case | eligible non-terminal | `EXPIRED` | `P/U` | Expiry workflow | Approved timing rule |
| Review case | eligible non-terminal | `CANCELLED` | `P/M` | Authorised workflow | Cancellation rule |
| Review case | `REJECTED` | `AWAITING_REPLACEMENT` | `P/M` | Conditional replacement workflow | **Not executable in accepted backend**; future contract and one-replacement policy required |
| Review case | `AWAITING_REPLACEMENT` | `PROOF_RECEIVED` | `P/U` | Conditional proof workflow | Eligible Cycle 2 proof; unavailable in accepted backend path |
| Proof | upload created | `QUARANTINED` | `A/U` | Proof service | Private controlled storage |
| Proof | `QUARANTINED` | `SCANNING` | `A/U` | Security scanner | Scan claim succeeds |
| Proof | `SCANNING` | `ACCEPTED` | `A/U` | Security/proof workflow | Type and checks pass; separate scan status must be `CLEAN` to view |
| Proof | `SCANNING` | `REJECTED` | `A/U` | Security/proof workflow | Accepted proof condition fails |
| Proof | `SCANNING` | `SCAN_FAILED` | `A/U` | Security/proof workflow | Safe result cannot be established |
| Proof | `ACCEPTED` | `SUPERSEDED` | `P/U` | Replacement workflow | Eligible new cycle accepted; original remains immutable |
| Proof | eligible retained | `EXPIRED` | `P/U` | Retention workflow | Retention/expiry rule |
| Proof | eligible retained | `DELETED` | `P/U` | Retention workflow | Approved deletion rule; audit metadata retained |
| Notification | intent created | `PENDING` | `A/U` | Business event/outbox | One effective intent for eligible event |
| Notification | `PENDING` | `SENDING` | `A/U` | Dispatcher | Safe claim/lease |
| Notification | `SENDING` | `SENT` | `A/U` | Dispatcher | Accepted transport outcome |
| Notification | `SENDING` | `RETRY` | `P/U` | Dispatcher | Recoverable failure and retry policy |
| Notification | `SENDING` | `FAILED` | `P/U` | Dispatcher | Nonrecoverable or exhausted attempts |
| Notification | `RETRY` | `SENDING` | `P/U` | Dispatcher | Backoff elapsed and claim succeeds |
| Notification | `RETRY` | `FAILED` | `P/U` | Dispatcher | Retry policy exhausted |
| Notification | `PENDING` or `RETRY` | `CANCELLED` | `P/M` | Authorised workflow | Cancellation policy |
| Notification | `PENDING` or `RETRY` | `SUPPRESSED` | `P/U` | Notification policy | Suppression rule matches |
| Notification | `FAILED` | `MANUAL_INTERVENTION` | `P/U` | Monitoring/Operations | Owner required; may be queue classification |
| Payment | cleared funds verified | Payment Recorded | `A/E` | Financial workflow | Idempotent record by exact reference |
| Payment | Payment Recorded | Allocation | `A/E` | Financial workflow | Valid invoice/booking obligation |
| Payment | Allocation | Partial Payment | `A/E` | Financial calculation | Allocated total below invoice total |
| Payment | Allocation | Full Payment | `A/E` | Financial calculation | Allocations settle invoice |
| Payment | Payment Recorded | Receipt Issued | `A/E` | Financial workflow | One Receipt for accepted outcome |
| Payment | Financial records | Ledger balanced | `A/E` | Financial workflow | Debits/credits reconcile |
| Payment | Financial milestone | booking evaluation | `A/E` | Booking workflow | Booking policy remains authoritative |
| Content version | `DRAFT` | `IN_REVIEW` | `A/M` | Editor | Complete valid version; submission seals it |
| Content version | `DRAFT` | `DISCARDED` | `P/M` | Planned staff command | State exists; accepted staff command not exposed |
| Content version | `IN_REVIEW` | `APPROVED` | `A/M` | Independent Approver | Approval checklist passes |
| Content version | `IN_REVIEW` | `REJECTED` | `A/M` | Independent Approver | Specific reason recorded |
| Content version | `APPROVED` | `SCHEDULED` | `A/M` | Approver | Valid future unambiguous time and public checks |
| Content version | `APPROVED` | `PUBLISHED` | `A/M` | Approver/publisher | Publish-now checks pass |
| Content version | `SCHEDULED` | `PUBLISHED` | `A/U` | Publication scheduler | Effective time reached and conditions remain valid |
| Content version | `SCHEDULED` | `APPROVED` | `P/M` | Planned cancel command | Architecture only; no accepted explicit command |
| Content version | `PUBLISHED` | `RETIRED` | `A/M` | Approver/publisher | Impact checked and reason recorded |
| Content version | `REJECTED` | new `DRAFT` | `A/M` | Editor | Derive a new numbered version; do not reopen source |
| Content version | `RETIRED` | new `DRAFT` | `A/M` | Approver/editor workflow | Restore by derivation; source retained |

## 4. Explicitly prohibited transitions

| Lifecycle | From | To | Rule | Reason |
|---|---|---|---|---|
| Booking | any | `EXPIRED` | `N` | No accepted booking `EXPIRED` state |
| Booking | `DEPOSIT_PENDING` | `CONFIRMED` by proof/review action | `N` | Cross-lifecycle inference bypasses Financial and booking policy |
| Booking | terminal | active state | `N` | No accepted reopen transition |
| Quote | any | `EXPIRED` | `N` | Not supported by accepted quote evidence |
| Review case | terminal | any case state | `N` | Terminal cases expose no ordinary actions; replacement exception is not accepted runtime support |
| Review case | `REJECTED` | booking `CONFIRMED` | `N` | Different owning records and contradictory meaning |
| Review case | `APPROVED` | `COMPLETED` | `N` | `COMPLETED` is not an accepted review-case state |
| Proof | `ACCEPTED` | `UNDER_REVIEW` | `N` | Target belongs to review case |
| Proof | `SUPERSEDED` | current/`ACCEPTED` | `N` | Immutable prior-cycle evidence cannot become current again |
| Notification | `FAILED` | `SENT` on same attempt | `N` | Recovery requires a separately audited attempt |
| Notification | `SUPPRESSED` | `SENDING` | `N` | Would bypass policy |
| Content version | `IN_REVIEW` | `DRAFT` | `N` | Submitted version is immutable |
| Content version | `REJECTED` | `APPROVED` | `N` | Must derive and review a new version |
| Content version | `RETIRED` | `PUBLISHED` | `N` | Restore creates a new numbered draft |
| Any | direct database/UI state edit | any | `N` | Bypasses authorisation, guards, audit, events, and idempotency |

## 5. Transition decision procedure

Before executing or documenting an edge:

1. Identify the owning object and canonical current state.
2. Find the exact edge in section 3.
3. If it is `P`, verify accepted technical support and the named approved policy; otherwise stop.
4. Verify actor, ownership/assignment, evidence, record version, and entry guards.
5. Invoke only the supported command.
6. Refresh and verify authoritative state, immutable history, downstream events, and notifications separately.
7. On conflict or uncertainty, preserve references and escalate; do not repeat blindly.

## Related documents

- [DOC-007, VirtCruise Status & Lifecycle Reference](STATUS-LIFECYCLE-REFERENCE.md)
- [DOC-007 Status Glossary](STATUS-GLOSSARY.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial normative transition matrix | Draft |
