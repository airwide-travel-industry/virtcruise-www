# VirtCruise Status Glossary

| Field | Value |
|---|---|
| Document ID | DOC-007-GL |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted evidence through v0.7.0 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Purpose

This glossary defines lifecycle language used by VirtCruise. Qualify reused values with their object, such as review `APPROVED` or content `APPROVED`. Status legality is governed by the [Status Transition Matrix](STATUS-TRANSITION-MATRIX.md).

## 2. Terms

| Term | Definition |
|---|---|
| Accepted | Evidence or behavior that passed the applicable governance/acceptance gate; also a context-qualified quote, booking, or proof state. |
| Active state | A non-terminal state in which at least one legal workflow transition remains. |
| Allocation | An auditable Financial link assigning part or all of a Payment to an invoice or booking obligation. |
| Approval | An authorised decision on one object; it has no automatic meaning for a different lifecycle. |
| Approved policy | Current governed business rules that can enable a policy-dependent edge; informal practice is not policy. |
| Authoritative state | The current value held by the owning service or approved system of record. |
| Automatic transition | A state change performed by an owning system after its guards pass. |
| Awaiting Finance Review | Customer-safe wording indicating Finance has not completed the review decision. |
| Awaiting Replacement | Review case state `AWAITING_REPLACEMENT`; conditional on an accepted replacement contract and policy. |
| Awaiting Upload | Review case state `AWAITING_UPLOAD`, meaning initial proof has not been received. |
| Booked | Quote/trip progression label showing arrangements became a booking; not an accepted booking enum by itself. |
| Booking Confirmation | The event/outcome in which the Booking service legally enters `CONFIRMED`; quote acceptance or transfer submission is insufficient. |
| Booking consequence | A milestone evaluated by the Booking workflow after authoritative Financial and operational results. |
| Booking lifecycle | The canonical progression from customer acceptance through deposit, confirmation, travel, and terminal outcomes. |
| Bounded reason | Customer-safe decision explanation that excludes internal comments, evidence, security detail, and speculation. |
| Cancelled | A terminal, intentionally ended outcome on the named quote, booking, review, or notification record. |
| Canonical status | The exact approved machine value, written in uppercase `SNAKE_CASE`. |
| Changed by | The role, owning service, or approved workflow authorised to cause a transition. |
| Clean | Scan status indicating no current scanner reason blocks viewing; it does not authenticate proof or establish funds. |
| Cleared funds | Money independently verified in the approved banking/financial source, not inferred from uploaded proof. |
| Completed | A terminal lifecycle outcome for the named quote, booking, or operational process; always qualify the object. |
| Content version | An immutable numbered package representation once submitted; only its `DRAFT` state is editable. |
| Current proof | The proof associated with the active review cycle and eligible for its decision. |
| Customer-visible state | A canonical state or approved plain-English projection that a customer may see. |
| Cycle 1 | The original bank-transfer proof/review cycle. |
| Cycle 2 | The single conditional replacement cycle described by policy, unavailable through the accepted rejected-case backend path. |
| Deposit Pending | Booking state `DEPOSIT_PENDING`; required deposit is not yet verified as recorded. |
| Deposit Received | Booking state `DEPOSIT_RECEIVED`; the required deposit milestone is recorded. |
| Derived condition | A value calculated from authoritative records, such as partial or full payment, rather than directly set. |
| Discarded | Terminal package-version state `DISCARDED`; the state is designed, while the staff command remains planned. |
| Draft | An editable pre-submission quote or content version; it is not an accepted booking state. |
| Entry condition | A fact, role, state, evidence item, or policy that must be true before transition. |
| Event | An immutable fact that occurred, such as Payment Recorded or Receipt Issued. |
| Exit condition | The requirements and legal next edge by which a non-terminal state ends. |
| Expired | A terminal review/proof outcome caused by an approved time or retention rule; not an accepted booking or quote state. |
| Failed | An unsuccessful notification or processing outcome requiring authoritative inspection and escalation. |
| Full Payment | Derived condition in which cumulative valid allocations settle the invoice; not itself booking confirmation. |
| Immutable history | Prior decisions, versions, proofs, attempts, and accounting entries retained without rewrite. |
| In Review | Content state `IN_REVIEW`, a sealed version awaiting independent approval; differs from review case `UNDER_REVIEW`. |
| Internal status | A state restricted to authorised staff/systems because it exposes processing, security, accounting, audit, or workload detail. |
| Invalid transition | Any edge absent from the accepted matrix, crossing object boundaries, bypassing guards, or leaving a terminal state without an accepted command. |
| Ledger | Balanced accounting entries reflecting Financial events; not a customer booking status. |
| Legal transition | An edge supported by the accepted lifecycle, current guards, actor authorisation, and any required policy. |
| Lifecycle | The ordered states and transitions owned by one business object. |
| Local Draft | Browser/client persistence result `LOCAL_DRAFT`; not an authoritative server quote state. |
| Manual Finance | Production customer-experience mode that routes the customer to approved Finance assistance without self-service proof upload. |
| Manual intervention | An internal queue condition or supported state requiring an authorised owner to stop automation and investigate safely. |
| Manual transition | A supported command intentionally invoked by an authorised human; never a direct state edit. |
| Notification intent | Durable request to communicate an eligible business event, processed separately from that event. |
| Notification attempt | One audited dispatch try; a retry or recovery does not rewrite a prior attempt. |
| Operational queue | A filter/derived collection of work, such as unassigned or overdue; it does not own business state. |
| Partial Payment | Derived condition in which cumulative valid allocations remain below the invoice total. |
| Payment | An authoritative Financial record of money accepted into processing; distinct from proof and review approval. |
| Payment Recorded | Immutable event/outcome indicating a Payment record was created through the approved Financial workflow. |
| Pending | Work or dispatch remains outstanding; the term must be qualified by its owning lifecycle. |
| Policy dependent | An edge usable only when accepted technical support and an approved policy both permit it. |
| Projection | A safe representation derived from authoritative records, such as customer timeline wording. |
| Proof | Private customer evidence submitted for bank-transfer review; it does not itself prove cleared funds. |
| Proof Accepted | Customer-safe outcome for proof that passed current handling checks; not payment approval. |
| Proof Received | Review case state `PROOF_RECEIVED` or customer timeline event indicating evidence arrived. |
| Published | Content version `PUBLISHED`, effective in the public catalogue while active. |
| Quarantined | Internal proof/integration isolation pending safe processing; never an invitation to open or retry blindly. |
| Quote | Customer-visible proposed travel arrangements and estimated value, subject to availability and confirmation. |
| Receipt | Immutable Financial evidence linked to a recorded Payment; not proof of bank clearing or booking confirmation. |
| Receipt Issued | Event indicating the Financial system created the Receipt. |
| Reconciliation | Comparison of Payment, allocations, Receipt, Ledger, invoice, account, and related outcomes for agreement. |
| Rejected | A terminal negative decision for the named accepted review case or content version; proof rejection is a separate object. |
| Replacement proof | One new proof permitted only by an enabled policy/contract; it creates a new cycle and supersedes the prior proof. |
| Restored | Publication action that derives a new numbered `DRAFT` from retained content; not a content state. |
| Retired | Terminal package-version state removed from public projection while history remains. |
| Retry | Controlled wait/re-execution condition after a recoverable delivery or integration failure. |
| Review case | Customer-owned bank-transfer decision record with its own lifecycle and terminal decision. |
| Review cycle | Immutable grouping of proof, SLA, review context, and decision history. |
| Scheduled | Approved package version awaiting an unambiguous future effective publication instant. |
| Sending | Notification attempt currently claimed/in flight. |
| Sent | Terminal successful transport outcome for an attempt; it does not prove the recipient read the message. |
| State owner | Service or governed record that alone determines authoritative state. |
| Status | Named durable position in one lifecycle; not a general description of all related records. |
| Status history | Immutable ordered record of legal transitions, actor/system, reason, and time. |
| Suppressed | Terminal notification outcome in which policy intentionally prevents dispatch. |
| Superseded proof | Immutable earlier-cycle proof replaced by a newer current proof and barred from the current decision. |
| Terminal state | State with no ordinary outgoing edge for the same record. |
| Transition guard | Server-enforced condition such as current state, role, assignment, version, proof safety, or policy. |
| Under Review | Review case state `UNDER_REVIEW`, meaning an assigned authorised Finance review began. |
| Uncertain delivery | Operational condition where message outcome cannot safely be inferred; it requires inspection, not blind resend. |
| Visible to | Roles or audiences authorised to see a state or its approved projection. |

## 3. Usage rules

- Always qualify `ACCEPTED`, `APPROVED`, `CANCELLED`, `COMPLETED`, `DRAFT`, `EXPIRED`, `REJECTED`, and `PENDING` with their owning object when context is not unmistakable.
- Use canonical values in technical and operational references; use approved plain English for customers.
- Do not turn events, projections, derived conditions, or queue filters into mutable states.
- Do not create synonyms. Add or change a term only through DOC-007 governance and accepted owning-contract evidence.

## Related documents

- [DOC-007, VirtCruise Status & Lifecycle Reference](STATUS-LIFECYCLE-REFERENCE.md)
- [DOC-007 Status Transition Matrix](STATUS-TRANSITION-MATRIX.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial glossary with authoritative lifecycle vocabulary | Draft |
