# VirtCruise Status & Lifecycle Reference

| Field | Value |
|---|---|
| Document ID | DOC-007 |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted evidence through v0.7.0 |
| Status | Draft |
| Owner | Documentation Lead |
| Reviewer | Business, Operations, Finance, Support, Content, and Technical leads |
| Approver | Product Owner |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## Contents

1. [Introduction](#1-introduction)
2. [Purpose](#2-purpose)
3. [Status naming standard](#3-status-naming-standard)
4. [Customer journey lifecycle](#4-customer-journey-lifecycle)
5. [Booking lifecycle](#5-booking-lifecycle)
6. [Quote lifecycle](#6-quote-lifecycle)
7. [Manual Finance lifecycle](#7-manual-finance-lifecycle)
8. [Bank transfer review lifecycle](#8-bank-transfer-review-lifecycle)
9. [Review cycle lifecycle](#9-review-cycle-lifecycle)
10. [Proof lifecycle](#10-proof-lifecycle)
11. [Notification lifecycle](#11-notification-lifecycle)
12. [Payment lifecycle](#12-payment-lifecycle)
13. [Receipt lifecycle](#13-receipt-lifecycle)
14. [Booking progression](#14-booking-progression)
15. [Package publication lifecycle](#15-package-publication-lifecycle)
16. [Content version lifecycle](#16-content-version-lifecycle)
17. [Operational queue statuses](#17-operational-queue-statuses)
18. [Status transition rules](#18-status-transition-rules)
19. [Terminal states](#19-terminal-states)
20. [Invalid transitions](#20-invalid-transitions)
21. [Customer-visible statuses](#21-customer-visible-statuses)
22. [Internal statuses](#22-internal-statuses)
23. [Operational meanings](#23-operational-meanings)
24. [Glossary](#24-glossary)
25. [Appendices](#25-appendices)

## 1. Introduction

This is the authoritative vocabulary and transition reference for VirtCruise business, operational, financial, customer-visible, approval, notification, and publication lifecycles. After acceptance, other documents must link to DOC-007 instead of redefining a state or transition.

An authoritative state is the value held by the owning service or approved record. A badge, email, queue name, timeline label, derived balance, or staff statement does not override it.

## 2. Purpose

DOC-007 enables customers, Support, Finance, Operations, Content, product owners, and engineers to use the same meanings. It defines accepted states, legal exits, terminality, visibility, ownership, and consequences; identifies conditional or policy-owned behavior; and records unsupported transitions without extending the product contract.

### Audience

- Customers and Support use sections 4, 5, 12, 14, and 21 for plain-English status meaning.
- Finance and Operations use sections 7–13 and 17–20 for controlled decisions and recovery.
- Content teams use sections 15–16 for version and publication governance.
- Product and engineering use the master matrix, transition rules, and appendices as the semantic contract.

### Scope

Included are accepted status evidence from DOC-001 through DOC-006, the reviewed plans and web workstreams listed in the DOC-007 brief, v0.7.0, and accepted bank-transfer, financial, notification, customer, operations, Finance, Support, and Content documentation.

This document does **not** replace DOC-003, DOC-004, DOC-005, DOC-006, DOC-009, or DOC-010. Those documents retain their procedural, operational, financial, support, training, release, or future-governance purpose. DOC-007 owns status meaning and legal transition semantics only.

No application, backend, frontend, deployment, production, or configuration change is included.

## 3. Status naming standard

Canonical machine values use uppercase `SNAKE_CASE`, for example `UNDER_REVIEW`. Customer copy may use a plain-English label, for example “Under review,” but must retain a one-to-one mapping. Title-case terms such as “Payment Recorded” identify a business event when accepted evidence does not expose a distinct enum.

Each entry is classified as:

- **State** — a durable lifecycle value owned by one authoritative record.
- **Event** — an immutable fact that occurred; it is not a mutable status.
- **Derived condition** — calculated from authoritative records, such as partial or full payment.
- **Projection** — a customer-safe or operational representation of authoritative state.
- **Queue condition** — selection criteria such as assigned, overdue, or manual intervention; it does not replace the record state.
- **Policy dependent** — permitted only when an approved policy and server guard allow it.
- **Planned/unsupported** — named in design or guidance but not an available accepted command.

The same word can occur in different families. `APPROVED` on a bank-transfer review is not `APPROVED` on a package version. Always include the owning object when ambiguity is possible.

For compactness, the detailed nine-field definition for every accepted state appears in Appendix A. The companion [Status Glossary](STATUS-GLOSSARY.md) supplies plain-language definitions, and the [Status Transition Matrix](STATUS-TRANSITION-MATRIX.md) is the normative edge list.

## 4. Customer journey lifecycle

The customer journey is a coordinated view, not a separate persisted enum:

```text
Enquiry → Quote request → Customer-visible quote → Accepted quote / booking
        → Deposit pending → Deposit received → Confirmed
        → Documents pending → Ready to travel → In progress → Completed
                                      └──────────────→ Cancelled / Refunded
```

**Figure 1 — Customer journey workflow.** Commercial, booking, financial, and travel states remain separately authoritative. Branches depend on the applicable booking and cancellation policy.

A customer may see quote, booking, financial, receipt, and bank-transfer progress at the same time. These are parallel facts, not one interchangeable status. “Payment recorded” does not mean “booking confirmed”; “proof uploaded” does not mean “payment received”; and a sent notification does not prove the underlying action completed.

## 5. Booking lifecycle

### Accepted canonical states

The accepted customer booking vocabulary is `PENDING_CUSTOMER_ACCEPTANCE`, `ACCEPTED`, `DEPOSIT_PENDING`, `DEPOSIT_RECEIVED`, `CONFIRMED`, `DOCUMENTS_PENDING`, `READY_TO_TRAVEL`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, and `REFUNDED`.

The brief’s “Draft,” “Quoted,” and “Booked” are journey concepts, not supported booking enum values in accepted evidence:

| Requested label | Authoritative treatment |
|---|---|
| Draft | Quote-builder or quote state; not a booking status |
| Quoted | Quote state; not a booking status |
| Booked | Quote/trip projection or business description; use the actual booking status |
| Deposit Pending | Canonical booking state `DEPOSIT_PENDING` |
| Confirmed | Canonical booking state `CONFIRMED` |
| Completed | Canonical booking state `COMPLETED` |
| Cancelled | Canonical booking state `CANCELLED` |
| Expired | Not evidenced as an accepted booking state; quote or review cases may expire |

### Booking workflow

```text
PENDING_CUSTOMER_ACCEPTANCE → ACCEPTED → DEPOSIT_PENDING
                                      └→ DEPOSIT_RECEIVED → CONFIRMED
CONFIRMED → DOCUMENTS_PENDING → READY_TO_TRAVEL → IN_PROGRESS → COMPLETED
Any eligible active state --policy-controlled cancellation--> CANCELLED
Eligible financial outcome ----------------------------------> REFUNDED
```

**Figure 2 — Booking workflow.** The arrows describe accepted progression concepts; exact deposit thresholds, cancellation eligibility, and optional milestone skipping are booking-policy dependent.

Only the Booking service or approved booking workflow changes booking state. Finance, Support, customers, proof review, notification delivery, and browser code cannot force it. `COMPLETED`, `CANCELLED`, and `REFUNDED` are terminal customer-view outcomes unless a future accepted contract explicitly defines correction or reopening.

## 6. Quote lifecycle

Accepted customer portal evidence exposes `DRAFT`, `SUBMITTED`, `QUOTED`, `ACCEPTED`, `BOOKED`, `CANCELLED`, and `COMPLETED`. `LOCAL_DRAFT` is a client-side persistence/result label and not an authoritative server quote state.

```text
DRAFT → SUBMITTED → QUOTED → ACCEPTED → BOOKED → COMPLETED
   └──────── eligible cancellation at supported stages ─────→ CANCELLED
```

Quote acceptance is eligible only when the authoritative quote exposes the acceptance action. It may create or begin a booking, but it does not confirm travel or establish payment. Quote `EXPIRED` is not supported by the accepted portal evidence and must not be displayed or transitioned to without a later accepted contract.

## 7. Manual Finance lifecycle

`MANUAL_FINANCE` is a customer-experience mode, not a payment, booking, or review status. In this mode, the customer receives approved Finance contact details, currency, and an owned reference, together with explicit unpaid and unconfirmed wording.

```text
Manual Finance instructions shown → Customer contacts Finance
→ Finance follows approved verification and recording procedures
→ Authoritative Financial records created, if justified
→ Booking milestone evaluated separately
```

No self-service case creation, bank instructions, proof upload, or replacement control is customer-available in production Manual Finance Mode. Staff must not invent a shadow “pending” state to compensate.

## 8. Bank transfer review lifecycle

The canonical review case states are `NEW`, `AWAITING_UPLOAD`, `AWAITING_REPLACEMENT`, `PROOF_RECEIVED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `EXPIRED`, and `CANCELLED`.

```text
NEW → AWAITING_UPLOAD → PROOF_RECEIVED → UNDER_REVIEW → APPROVED
                                  │             ├────→ REJECTED
                                  │             └────→ EXPIRED / CANCELLED
                                  └→ EXPIRED / CANCELLED

Conditional design only:
first-cycle REJECTED → AWAITING_REPLACEMENT → PROOF_RECEIVED → UNDER_REVIEW
```

**Figure 3 — Bank-transfer review workflow.** Solid-path text is accepted. The replacement path is policy dependent and not executable by the accepted backend because `REJECTED` is terminal and proof acceptance currently permits only `AWAITING_UPLOAD`.

### Transition meanings

- `NEW → AWAITING_UPLOAD`: the case enters the initial upload stage; automatic/workflow controlled.
- `AWAITING_UPLOAD → PROOF_RECEIVED`: an eligible proof is uploaded and accepted into the review workflow; system controlled after file handling.
- `PROOF_RECEIVED → UNDER_REVIEW`: an authorised, appropriately assigned Finance reviewer starts review only when the current proof is `ACCEPTED` and scan status `CLEAN`; manual command with server guards.
- `UNDER_REVIEW → APPROVED`: an authorised reviewer records a reason and attests that cleared funds were independently verified, amount/currency/reference match, and the decision is auditable; manual and terminal.
- `UNDER_REVIEW → REJECTED`: an authorised reviewer records a bounded reason; manual and terminal in the accepted contract.
- Non-terminal state to `EXPIRED`: an approved time/SLA rule closes the case; automatic or controlled policy action.
- Eligible non-terminal state to `CANCELLED`: an approved cancellation command closes the case; manual/policy controlled.
- `REJECTED → AWAITING_REPLACEMENT`: **not allowed in the accepted implementation**. It is a documented one-replacement design only if a later accepted server contract and policy activate it.
- `APPROVED → COMPLETED`: `COMPLETED` is an operational description of downstream processing, not an accepted review-case enum. Preserve `APPROVED` and inspect Financial records separately.
- `SUPERSEDED` is a proof state, never a review-case state.

`APPROVED`, `REJECTED`, `EXPIRED`, and `CANCELLED` are terminal review-case states. Approval is not a Payment; rejection does not reverse a Payment; and terminal decisions expose no further operational decision buttons.

## 9. Review cycle lifecycle

A review cycle groups the current proof, decision context, SLA, and immutable history. Cycle 1 is the original submission. Cycle 2 exists only for the conditional one-replacement design.

```text
Cycle 1: current proof → review → approval (terminal)
                            └→ rejection (terminal in accepted backend)

Conditional future/policy path:
Cycle 1 rejected → proof SUPERSEDED → Cycle 2 current proof → review → decision
```

**Figure 4 — Review-cycle workflow.** A cycle never edits a prior cycle. The first proof becomes `SUPERSEDED`; it is not deleted or rewritten. The new proof becomes current and the SLA restarts for Cycle 2. At most one replacement is described by accepted operational policy, within seven days where that policy is activated.

Cycle number, “current proof,” and “immutable history” are record relationships rather than mutable statuses. The released Finance UI has no cycle-history read view; operators must not claim that an unreleased screen exists.

## 10. Proof lifecycle

Accepted proof states are `QUARANTINED`, `SCANNING`, `ACCEPTED`, `REJECTED`, `SCAN_FAILED`, `SUPERSEDED`, `DELETED`, and `EXPIRED`. `CLEAN` is a separate scan status. “Proof Received” is a review-case state/timeline concept, not the proof object state.

```text
QUARANTINED → SCANNING → ACCEPTED
                       ├→ REJECTED
                       └→ SCAN_FAILED
ACCEPTED --eligible replacement--> SUPERSEDED
Eligible retained proof ----------> EXPIRED / DELETED
```

Only a current proof that is both `ACCEPTED` and `CLEAN`, and is PDF, JPEG, or PNG, may be opened through the secure viewer by an authorised user. `ACCEPTED`/`CLEAN` means current safety checks permit viewing; it never authenticates the document or proves cleared funds. Terminal proof outcomes are immutable for that proof record.

## 11. Notification lifecycle

Notification operations are not exposed in the released Finance frontend. The following is the controlled operational vocabulary required by the brief; it describes intent/attempt processing and must be used only where the authoritative notification source supports the value:

```text
PENDING → SENDING → SENT
              └→ RETRY → SENDING
              └→ FAILED → MANUAL_INTERVENTION
PENDING / RETRY → CANCELLED
PENDING / RETRY → SUPPRESSED
```

**Figure 5 — Notification workflow.** Automatic dispatcher transitions are normal; retry or manual intervention must follow policy. Delivery uncertainty is an operational condition, not permission to resend.

| State | Meaning and exit |
|---|---|
| `PENDING` | Intent exists and awaits dispatch; exits automatically to `SENDING`, or by policy to `CANCELLED`/`SUPPRESSED`. |
| `SENDING` | A claimed attempt is in progress; exits automatically to `SENT`, `RETRY`, or `FAILED`. |
| `SENT` | Accepted transport hand-off/delivery outcome; terminal for that attempt, not proof the recipient read it. |
| `RETRY` | A recoverable attempt awaits controlled retry; automatic/policy exit to `SENDING`, `FAILED`, `CANCELLED`, or `SUPPRESSED`. |
| `FAILED` | Attempts ended without accepted success; terminal unless approved recovery creates a new attempt. |
| `CANCELLED` | Dispatch intentionally ended before successful send; terminal. |
| `SUPPRESSED` | Policy prevented sending; terminal and must not be bypassed. |
| `MANUAL_INTERVENTION` | An owner must resolve an exception; queue condition unless the owning contract defines it as a state. |

Notifications may be related to proof received, review outcomes, payment recorded, Receipt issued, or booking confirmation. Notification status never substitutes for the event’s authoritative state. Customer notification history is not an authoritative backend resource in the released portal; browser read/unread preferences are presentation state only.

## 12. Payment lifecycle

“Payment Recorded” is an immutable Financial event/outcome represented by a Payment record, not a claim that a bank-transfer proof was valid. Partial and full payment are derived allocation conditions:

```text
Cleared funds verified → Payment recorded → Allocation(s) posted
→ Receipt issued → Ledger balanced → Invoice/outstanding recalculated
→ Booking milestone evaluated → eligible notifications
```

- **Partial Payment**: cumulative valid allocations are less than the invoice total. The outstanding balance remains positive; booking may remain `DEPOSIT_PENDING`.
- **Full Payment**: cumulative valid allocations settle the invoice. This permits, but does not itself force, booking confirmation.
- **Allocation**: the auditable link assigning all or part of a Payment to an invoice/booking obligation. Unallocated money is not assumed to settle an invoice.
- **Receipt**: evidence that the Financial system recorded the Payment; it is not a bank confirmation, booking confirmation, or proof-verification decision.
- **Ledger**: the balanced accounting effect. It must reconcile with Payment, allocation, Receipt, and account totals.
- **Booking consequence**: the Booking service evaluates policy after Financial processing. No Finance user manually sets the milestone.

An approved review can trigger downstream processing, but approval itself creates no payment semantics. Idempotency and exact transfer reference prevent duplicate recording.

## 13. Receipt lifecycle

A Receipt is created once for an accepted Payment outcome, linked to the Payment reference and booking. “Receipt Issued” is the accepted event/customer timeline label. The current receipt DTO exposes status but does not define a PDF download contract; documentation must not promise a downloadable PDF.

The record is immutable financial evidence. Correction or refund does not rewrite the original Receipt; it uses the approved financial process and retains the audit trail. Receipt creation may create one eligible notification intent. `Receipt issued → Booking confirmed` is not a direct transition: booking milestone evaluation is separate.

## 14. Booking progression

Booking progression consumes authoritative commercial and Financial outcomes. The safe sequence is:

1. Read the current booking state.
2. Confirm Payment, allocations, invoice/outstanding, Receipt, and Ledger independently.
3. Apply the booking’s deposit and operational policy.
4. Let the owning workflow perform the legal transition.
5. Verify status history and only then verify the eligible notification intent.

A partial payment can leave `DEPOSIT_PENDING`. Full settlement can permit `DEPOSIT_RECEIVED` or `CONFIRMED`, depending on policy and other checks. Proof acceptance, review approval, invoice paid, receipt issuance, and email delivery are each insufficient alone.

## 15. Package publication lifecycle

The accepted version lifecycle is:

```text
DRAFT → IN_REVIEW → APPROVED → SCHEDULED → PUBLISHED → RETIRED
   │         └→ REJECTED         └────────→ PUBLISHED (effective time)
   └→ DISCARDED
APPROVED ────────────────────────→ PUBLISHED (publish now)
RETIRED --restore/derive----------→ new numbered DRAFT
```

**Figure 6 — Publication workflow.** Only `DRAFT` is editable. Submitted and later versions are immutable. Schedule cancellation back to `APPROVED` and staff discard are architecture/planned paths without accepted commands.

The brief’s “Review” maps to canonical `IN_REVIEW`; “Restored” is an action that derives a new `DRAFT`, not a state. Public visibility exists only for the effective `PUBLISHED` version. `RETIRED`, `REJECTED`, and `DISCARDED` are terminal for that version; restoration preserves the source and creates a new version.

## 16. Content version lifecycle

Every package version has an increasing version number and optional retained source version. Editing is legal only in `DRAFT`. Submission seals content and moves it to `IN_REVIEW`. An independent Approver may record `APPROVED` or `REJECTED`; rejected content is not reopened. An approved version may publish immediately or become `SCHEDULED`. Publication changes the effective public projection without rewriting history. Retirement removes the public projection but retains the immutable version and audit.

Publication state belongs to a version, while package public availability is a projection. A package can therefore retain retired and rejected history while another version is current.

## 17. Operational queue statuses

Queue labels are filters or derived work conditions, not replacement lifecycle states:

| Queue condition | Meaning | Customer visible |
|---|---|:---:|
| Unassigned | Eligible work has no current reviewer | No |
| Assigned / Assigned to me | A reviewer owns the current task | No |
| Overdue | SLA due time passed while work remains non-terminal | No |
| Completed reviews | Filter over `APPROVED`, `REJECTED`, `EXPIRED`, `CANCELLED` | No |
| Retry | Recoverable notification/integration work awaits retry | No |
| Failed | Processing ended unsuccessfully and needs escalation | No |
| Uncertain | Outcome cannot safely be inferred | No |
| Quarantined | Processing or evidence is isolated pending controls | No |
| Stale claim | A worker claim needs safe recovery under policy | No |
| Manual intervention | An authorised owner must investigate/recover | No |
| Missing object | Proof metadata exists but private object cannot be retrieved | No |

The accepted review API supports one server status filter, pagination, and defined sorting. Reviewer, assignment, SLA, date, and multi-status aggregate views are not authoritative global filters in the released Finance UI; current-page narrowing must be labelled as such.

## 18. Status transition rules

1. Read before write; the owning service is authoritative.
2. Use a supported command, never direct state editing.
3. Validate actor role, ownership/assignment, current state, required evidence, and policy at command time.
4. Treat optimistic conflicts as a request to refresh, not overwrite.
5. Make terminal decisions once; use idempotency where supported.
6. Preserve immutable proof, review, financial, receipt, content, and audit history.
7. Keep parallel lifecycles separate and let explicit events coordinate them.
8. Create notifications from legal business events, not from browser inference.
9. Expose only the approved customer projection and bounded reason.
10. Treat conditional/planned transitions as unavailable until accepted server support and policy exist.

The companion transition matrix uses `A` (allowed), `N` (not allowed), `P` (policy dependent), `U` (automatic/system), and `M` (manual authorised command). A transition may carry two markers, such as `A/M`.

## 19. Terminal states

Terminal means no ordinary transition exists for that same record. A correction, refund, derived replacement, or new attempt may create a related record without reopening history.

| Family | Terminal states/outcomes |
|---|---|
| Booking | `COMPLETED`, `CANCELLED`, `REFUNDED` in accepted customer views |
| Quote | `COMPLETED`, `CANCELLED` |
| Review case | `APPROVED`, `REJECTED`, `EXPIRED`, `CANCELLED` |
| Proof | `ACCEPTED`, `REJECTED`, `SCAN_FAILED`, `SUPERSEDED`, `DELETED`, `EXPIRED` for that proof; retention may later remove bytes without changing history |
| Notification attempt | `SENT`, `FAILED`, `CANCELLED`, `SUPPRESSED` |
| Package version | `REJECTED`, `RETIRED`, `DISCARDED`; `PUBLISHED` exits only by controlled retirement |
| Receipt / ledger event | Immutable once posted; corrections use separate controlled entries |

Review `REJECTED` is terminal in the accepted backend even though the documented replacement design describes a possible later Cycle 2. That path remains unavailable until separately accepted.

## 20. Invalid transitions

| Invalid transition | Why invalid | Correct handling |
|---|---|---|
| Review `REJECTED → CONFIRMED` | Crosses review and booking lifecycles; rejection is terminal and cannot confirm a booking | Keep review rejected; follow policy and inspect booking separately |
| Review `APPROVED → PAYMENT_RECORDED` by manual status edit | Approval is not a Payment and the target is an event, not review state | Allow accepted downstream Financial processing |
| Proof `ACCEPTED → UNDER_REVIEW` | `UNDER_REVIEW` belongs to the case, not proof | Start the eligible case review |
| Review `REJECTED → AWAITING_REPLACEMENT` | Accepted backend makes rejection terminal | Treat replacement as unavailable until accepted contract/policy |
| Booking `DEPOSIT_PENDING → CONFIRMED` because proof is clean | Clean proof does not prove funds or satisfy booking policy | Verify cleared funds, Financial outcomes, and milestone evaluation |
| Invoice paid → booking `CONFIRMED` by Finance | Invoice and booking are separately authoritative | Let Booking evaluate all policy requirements |
| Notification `FAILED → SENT` by relabelling | Rewrites delivery history | Create/execute an authorised recovery attempt |
| Notification `SUPPRESSED → SENDING` | Bypasses a policy control | Resolve suppression through its policy owner |
| Package `IN_REVIEW → DRAFT` | Submission sealed the version | Reject if required and derive a new draft |
| Package `REJECTED → APPROVED` | Rejected version is immutable | Derive, edit, submit, and approve a new version |
| Package `RETIRED → PUBLISHED` in place | Rewrites retired history | Restore by deriving a new numbered `DRAFT` |
| Superseded proof → current | Breaks immutable cycle ordering | Submit a new eligible proof in a new cycle |
| `CANCELLED → active` on the same record | Terminal outcome has no reopen command | Create a new eligible record under policy |

## 21. Customer-visible statuses

Customers may see these canonical or explicitly mapped states where the relevant capability is enabled:

| Status/label | Plain-English meaning |
|---|---|
| Quote `DRAFT` | Your request is still being prepared. |
| `SUBMITTED` | VirtCruise received the quote request. |
| `QUOTED` | A quote has been prepared for review. |
| Quote `ACCEPTED` | You accepted the eligible quote; booking steps may now begin. |
| Quote `BOOKED` | The quote has progressed into booking arrangements. |
| `PENDING_CUSTOMER_ACCEPTANCE` | Your decision is required on the booking. |
| Booking `ACCEPTED` | The booking was accepted and arrangements can progress. |
| `DEPOSIT_PENDING` | A required deposit is not yet verified as recorded. |
| `DEPOSIT_RECEIVED` | The required deposit is recorded as received. |
| `CONFIRMED` | VirtCruise has confirmed the booking. |
| `DOCUMENTS_PENDING` | Travel documents are being prepared or checked. |
| `READY_TO_TRAVEL` | Current arrangements are ready for the travel stage. |
| `IN_PROGRESS` | The trip is under way. |
| `COMPLETED` | The recorded quote/booking/trip is complete. |
| `CANCELLED` | The relevant quote, booking, or case has been cancelled. |
| `REFUNDED` | The booking view records a completed refund outcome. |
| Review Created | A bank-transfer review case exists. |
| Proof Uploaded / Proof Received | Evidence was received; payment is not yet confirmed. |
| Proof Accepted | The file passed current handling checks; funds are not proven. |
| Awaiting Finance Review | Finance has not completed the decision. |
| Under Review | An authorised Finance review is in progress. |
| Rejected | The review did not pass; the displayed bounded reason applies. |
| Awaiting Replacement | One replacement is awaited only when an enabled authoritative case says so. |
| Approved | Finance approved the review after independent checks; downstream records remain separate. |
| Payment Recorded | The Financial system recorded a Payment. |
| Partial Payment | Some balance remains after allocation. |
| Full Payment | Allocations settle the invoice; booking confirmation remains separate. |
| Receipt Issued | A Receipt was created for the recorded Payment. |
| Booking Confirmed | The Booking service reached `CONFIRMED`. |
| Package Published | The current package version is publicly effective. |
| Package Retired | That version is no longer in the public catalogue. |

Internal proof scanning, reviewer identity, queue ownership, audit, outbox attempts, storage, ledger internals, suppression, and manual-intervention states are never translated verbatim to customers.

## 22. Internal statuses

Internal-only values include review `NEW`; proof `QUARANTINED`, `SCANNING`, `SCAN_FAILED`, `SUPERSEDED`, `DELETED`, `EXPIRED`, and missing-object conditions; assignment/overdue/stale-claim queues; notification `PENDING`, `SENDING`, `RETRY`, `FAILED`, `SUPPRESSED`, and `MANUAL_INTERVENTION`; ledger posting and reconciliation conditions; and content approval/audit mechanics not intended for the catalogue.

Customers never see these because they disclose security controls, worker mechanics, staff identity or workload, private evidence handling, delivery infrastructure, accounting internals, or editorial governance; because they are unstable intermediate details; or because a safe customer projection already communicates the required action. Support may communicate a bounded outcome, never internal comments, recipient lists, message bodies, proof storage keys, fraud speculation, or audit internals.

## 23. Operational meanings

- **Never manually change state.** Use the approved command so validation, audit, idempotency, downstream events, and authorisation run together.
- **Never bypass workflow.** A desirable business outcome does not justify skipping proof safety, cleared-funds verification, independent approval, Financial posting, or booking policy.
- **Never expose internal states.** Translate only through an approved customer-safe projection.
- **Always use authoritative state.** Refresh after conflict or uncertainty and compare each owning record separately.
- **Never infer success from a notification.** Verify the event, intent, attempt, and business record.
- **Never overwrite immutable history.** Derive a new proof cycle, content version, notification attempt, or correction record where accepted.

Operationally, “pending” means work remains, “under review” means an authorised review began, “approved” means that object’s approval checks passed, “completed” means that object’s lifecycle ended, and “manual intervention” means stop automation and assign an approved owner—not edit data until it looks correct.

## 24. Glossary

The authoritative glossary contains more than 40 terms in [STATUS-GLOSSARY.md](STATUS-GLOSSARY.md). Its definitions are part of DOC-007. Appendix A below remains the compact master status table; the glossary supplies fuller cross-family language.

## 25. Appendices

### Appendix A — Master status matrix

“Notification” identifies the related intent or states “None required”; it does not promise delivery. “Terminal” applies to the named record.

| Status | Meaning | Visible to | Changed by | Entry | Exit | Terminal | Customer visible | Notification |
|---|---|---|---|---|---|:---:|:---:|---|
| Quote `DRAFT` | Editable quote request | Customer, Consultant | Customer/workflow | New quote | Submit/cancel | No | Yes | None |
| Quote `SUBMITTED` | Request received | Customer, Consultant | System | Submit valid draft | Prepare quote/cancel | No | Yes | Receipt/update where supported |
| Quote `QUOTED` | Offer prepared | Customer, Consultant | Consultant workflow | Quote complete | Accept/cancel | No | Yes | Quote available |
| Quote `ACCEPTED` | Customer accepted offer | Customer, Operations | Customer command | Eligible quoted offer | Create/progress booking | No | Yes | Acceptance/update |
| Quote `BOOKED` | Quote progressed to booking | Customer, Operations | Booking workflow | Booking created | Complete/cancel | No | Yes | Booking update |
| Quote `COMPLETED` | Quote journey ended | Customer, staff | System | Accepted completion rule | None | Yes | Yes | Policy dependent |
| Quote `CANCELLED` | Quote ended without progression | Customer, staff | Authorised actor/system | Eligible quote cancelled | None | Yes | Yes | Cancellation where supported |
| Booking `PENDING_CUSTOMER_ACCEPTANCE` | Customer decision required | Customer, staff | Booking workflow | Booking offered | Accept/cancel per policy | No | Yes | Action request |
| Booking `ACCEPTED` | Booking accepted | Customer, staff | Customer/workflow | Accepted decision | Deposit milestone | No | Yes | Update |
| `DEPOSIT_PENDING` | Required deposit not verified | Customer, staff | Booking workflow | Deposit obligation applies | Deposit received/cancel | No | Yes | Payment reminder policy |
| `DEPOSIT_RECEIVED` | Deposit recorded | Customer, staff | Booking workflow | Financial milestone satisfied | Confirm/cancel | No | Yes | Payment recorded/receipt |
| `CONFIRMED` | Booking confirmed | Customer, staff | Booking workflow | All confirmation checks pass | Documents/travel/cancel | No | Yes | Booking confirmation |
| `DOCUMENTS_PENDING` | Documents in preparation/check | Customer, staff | Booking workflow | Confirmed and docs needed | Ready/cancel | No | Yes | Policy dependent |
| `READY_TO_TRAVEL` | Arrangements ready | Customer, staff | Booking workflow | Readiness checks pass | In progress/cancel | No | Yes | Travel reminder |
| `IN_PROGRESS` | Travel under way | Customer, staff | System/workflow | Travel begins | Complete | No | Yes | Policy dependent |
| Booking `COMPLETED` | Trip lifecycle complete | Customer, staff | System/workflow | Completion criteria pass | None | Yes | Yes | Completion policy |
| Booking `CANCELLED` | Booking cancelled | Customer, staff | Authorised workflow | Cancellation policy permits | None | Yes | Yes | Cancellation |
| `REFUNDED` | Completed refund outcome projected | Customer, Finance, staff | Financial/booking workflow | Refund completes | None | Yes | Yes | Refund outcome |
| Review `NEW` | Case created | Finance/Operations | System | Valid case creation | Await upload/cancel/expire | No | No | None |
| `AWAITING_UPLOAD` | Initial proof awaited | Customer-safe projection, Finance | System | Upload stage opens | Proof received/expire/cancel | No | Yes, if Self Service | Upload reminder policy |
| `AWAITING_REPLACEMENT` | One allowed replacement awaited | Customer-safe projection, Finance | Policy/server workflow | Eligible replacement opened | Proof received/expire/cancel | No | Conditional | Replacement request |
| `PROOF_RECEIVED` | Current proof received | Customer-safe projection, Finance | System | Eligible upload handled | Start review/expire/cancel | No | Yes | Proof received |
| `UNDER_REVIEW` | Finance review started | Customer-safe projection, Finance | Assigned Finance reviewer | Current accepted clean proof | Approve/reject/expire/cancel | No | Yes | Usually none until outcome |
| Review `APPROVED` | Review decision passed | Customer-safe projection, Finance | Authorised reviewer | Cleared-funds and approval checks | None on case | Yes | Yes | Approval/payment processing |
| Review `REJECTED` | Review decision failed | Customer-safe projection, Finance | Authorised reviewer | Reasoned rejection | None in accepted backend | Yes | Yes | Rejection |
| Review `EXPIRED` | Case time ended | Customer-safe projection, Finance | System/policy | Expiry rule | None | Yes | Yes, bounded | Expiry policy |
| Review `CANCELLED` | Case intentionally closed | Customer-safe projection, Finance | Authorised workflow | Cancellation rule | None | Yes | Yes, bounded | Cancellation policy |
| Proof `QUARANTINED` | File isolated | Security/Finance metadata | Upload/security system | Upload received | Scan | No | No | None |
| Proof `SCANNING` | Safety scan running | Security/Finance metadata | Security system | Scan begins | Accept/reject/fail | No | No | None |
| Proof `ACCEPTED` + `CLEAN` | File may be securely viewed | Authorised Finance | Security system | Checks pass | Supersede/retention | Yes for proof decision | Customer sees safe label only | Proof accepted where supported |
| Proof `REJECTED` | File failed proof condition | Authorised Finance/Security | Security/workflow | Check fails | None | Yes | Bounded outcome only | Rejection policy |
| `SCAN_FAILED` | Safety result unavailable | Security/Finance | Security system | Scanner fails | None; escalate | Yes | No | None |
| `SUPERSEDED` | Newer cycle proof replaced it | Authorised staff | Review-cycle workflow | Replacement accepted | None | Yes | No | Replacement update |
| Proof `EXPIRED` | Retention/use period ended | Authorised staff | Retention system | Expiry rule | None | Yes | No | None |
| Proof `DELETED` | Private bytes removed by lifecycle | Security/audit staff | Retention system | Deletion rule | None | Yes | No | None |
| Notification `PENDING` | Intent awaits dispatch | Notification Operations | Event/system | Legal event creates intent | Send/cancel/suppress | No | No | Self |
| `SENDING` | Attempt is claimed/in flight | Notification Operations | Dispatcher | Claim pending/retry | Sent/retry/fail | No | No | Self |
| Notification `SENT` | Transport accepted outcome | Notification Operations; customer receives message | Dispatcher | Successful attempt | None for attempt | Yes | Indirectly | Self |
| `RETRY` | Recoverable attempt awaits retry | Notification Operations | Dispatcher/policy | Transient failure | Send/fail/cancel/suppress | No | No | Self |
| Notification `FAILED` | Delivery attempts ended | Notification Operations | Dispatcher/policy | Nonrecoverable/exhausted | New recovery attempt only | Yes | No | Self |
| Notification `CANCELLED` | Pending delivery intentionally stopped | Notification Operations | Authorised workflow | Cancellation rule | None | Yes | No | Self |
| `SUPPRESSED` | Policy prevents delivery | Notification Operations | Policy/system | Suppression matches | None | Yes | No | Self |
| `MANUAL_INTERVENTION` | Human owner required | Operations | Monitoring/policy | Automation cannot continue safely | Resolve/escalate | No, if queue condition | No | None |
| Payment Recorded | Payment record exists | Customer, Finance, Operations | Financial workflow | Cleared-funds/recording checks | Allocate/reconcile | Event | Yes | Payment recorded |
| Partial Payment | Allocations below invoice total | Customer, Finance, Operations | Derived by Financial system | Some valid allocation | More allocation/refund/correction | No | Yes | Receipt/payment update |
| Full Payment | Allocations settle invoice | Customer, Finance, Operations | Derived by Financial system | Outstanding becomes zero | Refund/correction | Derived outcome | Yes | Eligible milestone updates |
| Receipt Issued | Immutable Receipt created | Customer, Finance, Operations | Financial workflow | Payment recorded | Correction via separate record | Event | Yes | Receipt issued |
| Content `DRAFT` | Editable private version | Editor | Editor/system | Create/derive | Submit/discard | No | No | None |
| `IN_REVIEW` | Sealed independent review | Editor, Approver | Editor command | Submit valid draft | Approve/reject | No | No | Review task policy |
| Content `APPROVED` | Eligible to publish | Editor, Approver | Independent Approver | Review passes | Schedule/publish | No | No | Approval policy |
| `SCHEDULED` | Approved for future publication | Editor, Approver | Approver | Future effective time set | Auto-publish | No | No | Publication policy |
| `PUBLISHED` | Effective public version | Everyone | Publisher/system | Publish now/effective time | Retire | No | Yes | Publication policy |
| Content `REJECTED` | Review failed; version sealed | Editor, Approver | Independent Approver | Reasoned rejection | None; derive draft | Yes | No | Editorial notification |
| `RETIRED` | Removed from catalogue; retained | Staff | Approver/publisher | Controlled retirement | None; derive draft | Yes | No | Retirement policy |
| `DISCARDED` | Draft abandoned | Staff | Planned command/system | Eligible draft discard | None | Yes | No | None |

### Appendix B — Screenshot placeholder register

No screenshot is fabricated. Capture only after the named view and fictional dataset are approved.

> **Screenshot required — Figure S1: Customer booking status**  
> Views: Desktop, Tablet, Mobile. Content: fictional booking timeline and current canonical status. Alternative text: Customer booking details showing a status timeline and payment summary. Dependency: approved customer capture environment.

> **Screenshot required — Figure S2: Bank-transfer customer timeline**  
> Views: Desktop, Tablet, Mobile. Content: fictional customer-safe proof/review/payment milestones; exclude reviewer and storage data. Alternative text: Bank-transfer progress from review creation through booking confirmation. Dependency: authorised Self Service capability.

> **Screenshot required — Figure S3: Finance review case**  
> Views: Desktop, Tablet, Mobile. Content: fictional `UNDER_REVIEW` case with current `ACCEPTED`/`CLEAN` proof metadata. Alternative text: Finance review detail with status and eligible decision controls. Dependency: approved capture environment.

> **Screenshot required — Figure S4: Notification operations**  
> Views: Desktop, Tablet. Content: fictional retry, failure, suppression, and manual-intervention records. Alternative text: Notification operations statuses and safe references. Dependency: future accepted notification-operations view.

> **Screenshot required — Figure S5: Package version history**  
> Views: Desktop, Tablet, Mobile. Content: fictional immutable versions from draft to retired. Alternative text: Package version history with publication states. Dependency: future Content Studio.

### Appendix C — Evidence and authority map

| Area | Accepted evidence used | Authority retained outside DOC-007 |
|---|---|---|
| Documentation rules | DOC-001 documentation architecture and standards | Governance, templates, review process |
| Customer wording | DOC-002 Customer User Guide | End-user procedures |
| Operations | DOC-003 Back Office Operations Manual | Operator procedures and escalation |
| Finance | DOC-004 Finance Standard Operating Procedures | Financial controls and approvals |
| Support | DOC-005 Customer Support Playbook | Case handling and communication |
| Content | DOC-006 Content Studio User Guide | Editorial procedures and publishing checks |
| Released behavior | v0.7.0 release notes and accepted portal/bank-transfer evidence | Release qualification |
| Future work | DOC-009 and DOC-010 | Not replaced or pre-empted by DOC-007 |

### Appendix D — Authority and precedence

When sources disagree: the owning service/accepted contract controls runtime behavior; DOC-007 controls terminology and legal transition documentation; approved policy controls a `P` edge; procedural documents control how authorised roles perform work. A UI label or historic document cannot legalise an edge absent from the accepted contract.

### Appendix E — Quality review checklist

- [x] Status names use canonical casing and object qualification.
- [x] Customer, internal, event, derived, and queue concepts are separated.
- [x] Every master-matrix entry covers purpose/meaning, visibility, changer, entry, exit, terminality, notification, and operational action.
- [x] Booking, bank transfer, review cycle, proof, notification, payment, receipt, and publication consequences are separated.
- [x] Conditional and unsupported paths are labelled.
- [x] Terminal and invalid transitions are explicit.
- [x] Customer wording is plain English and internal details are bounded.
- [x] All required diagrams and screenshot placeholders are present.
- [x] Companion matrix and glossary are cross-referenced.
- [x] Scope exclusions and no-implementation boundary are explicit.

### Related documents

- [DOC-001, Documentation Architecture](../documentation/DOCUMENTATION-ARCHITECTURE.md)
- [DOC-002, VirtCruise Customer User Guide](../customer/CUSTOMER-USER-GUIDE.md)
- [DOC-003, Back Office Operations Manual](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md)
- [DOC-004, Finance Standard Operating Procedures](../finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md)
- [DOC-005, Customer Support Playbook](../support/CUSTOMER-SUPPORT-PLAYBOOK.md)
- [DOC-006, Content Studio User Guide](../content/CONTENT-STUDIO-USER-GUIDE.md)
- [Status Transition Matrix](STATUS-TRANSITION-MATRIX.md)
- [Status Glossary](STATUS-GLOSSARY.md)
- [Release notes v0.7.0](../RELEASE-NOTES-v0.7.0.md)
- [Customer Bank Transfer](../CUSTOMER-BANK-TRANSFER.md)
- [Financial Engine Integration](../FINANCIAL-ENGINE-INTEGRATION.md)

### Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial authoritative lifecycle reference | Draft |
