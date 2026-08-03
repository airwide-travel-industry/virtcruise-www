# Daily Back Office Checklist

| Field | Value |
|---|---|
| Document ID | DOC-003-DC |
| Version | 0.8.0-draft.1 |
| Source-system version | VirtCruise v0.7.0 and accepted Sprint 3.7 workstreams |
| Status | Draft — Internal Review |
| Owner | Operations Lead |
| Intended approvers | Finance Lead, Support Lead, Business Owner |
| Classification | Confidential — VirtCruise Internal Operations |
| Last reviewed | 2026-08-03 |

## Purpose

Use this printable checklist to open and close a normal back-office shift safely. Tick only checks you performed. Record exceptions in the approved handover or incident record; do not add customer proof, passwords, or unnecessary personal information.

**Date:** ____________________  **Shift/time zone:** ____________________  **Operator:** ____________________

## Start of day

### Application checks

- [ ] Sign in through the approved staff route; confirm your name and expected role.
- [ ] Confirm the customer website and the protected Finance Operations Portal load normally.
- [ ] Open **Finance Overview** and confirm authoritative totals load without an incident banner or unexpected error.
- [ ] Open **Review Queue** and confirm a server page, total, status filter, sorting, and pagination are available.
- [ ] Check **My Assigned Cases**; remember that it narrows only the currently loaded server page.
- [ ] Check **Unassigned Cases**; remember that it narrows only the currently loaded server page.
- [ ] Check **Overdue Cases**; use each case's authoritative SLA marker because this view is not a global server filter.
- [ ] Check proof metadata for `QUARANTINED`, `SCANNING`, `SCAN_FAILED`, `DELETED`, `EXPIRED`, or missing-object conditions.
- [ ] Review approved operational monitoring for integration exceptions, stale claims, and manual-intervention items. These do not have a released staff screen in v0.7.0.
- [ ] Review approved notification monitoring for retry, failure, uncertain delivery, cancellation, or suppression. These do not have a released staff screen in v0.7.0.
- [ ] Review approved proof-storage capacity alerts. Do not inspect storage directly from the main back-office workflow.

### Business checks

- [ ] Read operational announcements, Finance notices, approved bank-account changes, and known incident communications.
- [ ] Confirm whether the customer payment capability remains `MANUAL_FINANCE`; do not assume Self Service is active.
- [ ] Confirm the approved Finance contact route and bank-instruction source are current.
- [ ] Identify cases requiring cleared-funds verification, but do not treat proof as payment.
- [ ] Review cases nearing or exceeding their policy-owned service level agreement (SLA).
- [ ] Check handovers for unresolved approvals, rejections, replacement cycles, partial payments, and customer commitments.

### Escalation checks

- [ ] Escalate unavailable protected pages or widespread access denial to the Administrator and Technical Operations.
- [ ] Escalate breached SLA and unowned priority work to the Finance Supervisor.
- [ ] Escalate scan failure, malware alert, suspicious proof, or unauthorised access through the approved Security route.
- [ ] Escalate integration, projection, notification, or storage alerts to the named owner in the approved operations policy.
- [ ] Link related incidents and handovers by safe reference; do not copy customer payloads into ordinary tickets.

## During the day

- [ ] Assign a case to yourself before review; refresh after a conflict.
- [ ] Open only accepted, clean PDF, JPEG, or PNG proof through **Securely view proof**.
- [ ] Complete every approval check, including independent cleared-funds verification.
- [ ] Use factual internal comments and customer-safe decision wording.
- [ ] Refresh after ambiguous requests; never repeat a decision blindly.
- [ ] Confirm downstream payment, allocation, receipt, booking, and notification outcomes before telling the customer they completed.

## End of day

- [ ] Review or hand over every case still assigned to you.
- [ ] Escalate every overdue case not resolved during the shift.
- [ ] Document unresolved approvals, rejections, replacement deadlines, and partial-payment follow-up.
- [ ] Document integration exceptions, stale claims, scan failures, and manual-intervention items in the approved handover.
- [ ] Escalate failed or uncertain notifications; do not resend blindly.
- [ ] Confirm no customer proof or financial document remains in Downloads, a personal device, ordinary email, messaging, print trays, or desk space.
- [ ] Close all proof viewers and protected tabs.
- [ ] Complete handover notes using references and factual status only.
- [ ] Select **Logout** and confirm protected Finance content is no longer visible.

## Exceptions and handover

| Safe reference | Current state | Action taken | Owner and next action | Due or review time |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

> **Warning:** Do not write proof content, bank account details, full customer data, authentication information, or fraud speculation on this checklist.

## Related documents

- [DOC-003, *Back Office Operations Manual*](BACK-OFFICE-OPERATIONS-MANUAL.md)
- [DOC-003-RM, *Back Office Role Matrix*](BACK-OFFICE-ROLE-MATRIX.md)
- [DOC-002, *VirtCruise Customer User Guide*](../customer/CUSTOMER-USER-GUIDE.md)
- [Operations documentation index](README.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial daily operations checklist | Draft — Internal Review |
