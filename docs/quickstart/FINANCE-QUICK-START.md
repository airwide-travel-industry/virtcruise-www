# Finance Quick Start

| Field | Value |
|---|---|
| Document ID | DOC-008-FI |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted behavior through v0.7.0 |
| Status | Draft |
| Owner | Finance Lead |
| Classification | Confidential — VirtCruise Finance Operations |
| Last reviewed | 2026-08-03 |

## Purpose

Triage Manual Finance and review work, handle proof safely, make controlled decisions, and verify downstream Financial and booking consequences.

## Who should use this guide

Authorised Finance Officers and Supervisors. You need approved Finance access, current Finance policy, secure work environment, and the DOC-004 checklists.

> **Warning:** Proof is evidence, not confirmation of cleared funds. This guide does not replace DOC-002 through DOC-007, DOC-009, or DOC-010 and does not grant decision authority.

## Daily workflow

```text
Check controls/queues → Claim eligible case → Inspect current safe proof
→ Verify funds independently → Decide once → Verify downstream records
→ Reconcile and hand over exceptions
```

## Top 10 tasks

1. **Support Manual Finance.** Confirm the approved contact route, owned quote/invoice reference, and currency. Do not expose unapproved bank details or claim payment is recorded.
2. **Triage the review queue.** Refresh; use supported server status/sort controls; open the exact case. Treat assigned, overdue, and completed views as queue conditions described in DOC-003.
3. **Claim work.** Assign an eligible non-terminal case to yourself. Do not assign another reviewer; no reviewer directory/control is accepted.
4. **Review proof safely.** Confirm it is current, `ACCEPTED`, scan `CLEAN`, and PDF/JPEG/PNG before **Securely view proof**. Keep it in the controlled viewer.
5. **Start review.** Only when assigned, case `PROOF_RECEIVED`, and proof meets viewing controls; confirm the case becomes `UNDER_REVIEW`.
6. **Approve.** Independently verify cleared funds; match customer, booking/invoice, amount, currency, reference, and account; check duplicates; enter a factual reason and truthful attestation; submit once.
7. **Reject.** From eligible `UNDER_REVIEW`, record a bounded factual reason and submit once. In the accepted backend, `REJECTED` is terminal.
8. **Handle replacement.** Do not promise it. The Cycle 2 path is conditional and unavailable from accepted terminal `REJECTED`; use it only if a later authoritative case and approved policy explicitly permit it.
9. **Check Payment and Receipt.** After approval, verify one Payment, exact allocation, one Receipt, balanced Ledger effect, updated invoice/account, and eligible notification. Never create or edit these directly from the portal.
10. **Check booking progression.** Verify the Booking workflow evaluated its own policy. Partial/full payment, review approval, or Receipt issuance never directly authorises Finance to set `CONFIRMED`.

## Quick checklist

### Start-of-day checklist

- [ ] Confirm Finance access, policy, secure workspace, and escalation routes.
- [ ] Review pending/under-review/overdue work and prior handovers.
- [ ] Check proof, integration, reconciliation, and notification exceptions.

### Top task checklist

- [ ] Refresh and match case, customer, booking, invoice, currency, amount, and reference.
- [ ] Confirm assignment, current case state, current proof, and `CLEAN` scan.
- [ ] Verify cleared funds independently and check duplicates.
- [ ] Use one supported decision with reason/attestation.
- [ ] Verify Payment, allocation, Receipt, Ledger, booking, and notification separately.

### End-of-day checklist

- [ ] Reconcile completed decisions and downstream results.
- [ ] Hand over owned non-terminal cases and exceptions with safe references.
- [ ] Close proof viewers, remove unauthorised local copies, and sign out.

## Common mistakes

- Approving from the appearance of proof, a customer message, or a notification.
- Repeating a decision after timeout/conflict instead of refreshing authoritative state.
- Treating review `APPROVED` as Payment Recorded or Booking Confirmation.
- Offering replacement when the current accepted lifecycle makes rejection terminal.

## Do's and don'ts

### Things you should always do

- Work from refreshed authoritative records and complete the DOC-004 decision checklist.
- Keep evidence private, reasons factual, and identifiers exact.
- Stop and escalate on mismatch, duplicate, malware, privacy, ownership, or uncertain outcome.

### Things you must never do

- Download/forward proof outside approved controls or open unsafe/superseded proof.
- Manually edit a Payment, allocation, Receipt, Ledger, invoice, booking, or lifecycle state.
- Blindly retry a mutation, resend a notification, or bypass suppression/assignment.

## Escalation

| Issue | Owner | Escalate when | Do not escalate when |
|---|---|---|---|
| Decision/policy/duplicate | Finance Supervisor | Authority, match, overpayment, duplicate, or lifecycle is unclear | Eligible case simply awaits your normal controlled work |
| Proof malware/missing/privacy | Security/Technical Operations | Immediately when safe access cannot be established | Scanner is legitimately still processing |
| Payment/Receipt/Ledger mismatch | Finance Operations | Expected downstream records disagree or exceed policy window | Processing remains within an approved observable window |
| Booking projection | Operations | Financial records complete but booking does not lawfully progress | Booking policy correctly retains current state |
| Notification failure/uncertainty | Notification Operations | Authoritative attempt failed or is uncertain | A valid intent is simply pending within policy |

DOC-003 owns operational coordination; DOC-004 owns Finance procedure. Preserve state and references—never repair an exception by direct edit.

## Screenshot placeholder

> **Screenshot required — Figure 1: Finance safe decision route**  
> Views: Desktop, Tablet, Mobile. Content: fictional assigned `UNDER_REVIEW` case with current accepted/clean proof and decision checklist. Alternative text: Finance review route from queue through downstream verification. Dependency: approved Finance capture environment.

## Related manuals

- [DOC-002, Customer User Guide](../customer/CUSTOMER-USER-GUIDE.md) — customer-visible Finance journey.
- [DOC-003, Operations Manual](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md) — queues and exception coordination.
- [DOC-004, Finance SOP](../finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md) — mandatory detailed controls.
- [DOC-005, Support Playbook](../support/CUSTOMER-SUPPORT-PLAYBOOK.md) — customer handoff boundaries.
- [DOC-006, Content Studio Guide](../content/CONTENT-STUDIO-USER-GUIDE.md) — separate content authority.
- [DOC-007, Status & Lifecycle Reference](../reference/STATUS-LIFECYCLE-REFERENCE.md) — legal transitions and terminal states.

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial role Quick Start | Draft |
