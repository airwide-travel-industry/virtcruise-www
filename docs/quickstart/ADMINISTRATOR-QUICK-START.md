# Administrator Quick Start

| Field | Value |
|---|---|
| Document ID | DOC-008-AD |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted behavior through v0.7.0 |
| Status | Draft |
| Owner | Operations Lead |
| Classification | Confidential — VirtCruise Internal Operations |
| Last reviewed | 2026-08-03 |

## Purpose

Understand the system and role boundaries, coordinate access/support issues, and protect operational workflows without treating Administrator access as business authority.

## Who should use this guide

Approved Administrators and supervisors coordinating access. Accepted authorization permits Administrator entry to Finance Operations, but does not make the Administrator a Finance decision owner or waive assignment, proof, cleared-funds, or policy controls. No released general administration screen is established.

> **Warning:** This guide does not grant access or change authority. It does not replace DOC-002 through DOC-007, DOC-009, or DOC-010.

## Daily workflow

```text
Check authorised access/support work → Verify requester and approved authority
→ Diagnose boundary, not business outcome → Route/coordinate
→ Record decision and owner → Review access-related handover
```

## Top 10 tasks

1. **Understand the system.** Keep customer, quote, booking, Financial, bank-transfer review/proof, notification, content, authentication, and operational records as separate owning domains.
2. **Confirm your scope.** Read the DOC-003 role matrix and current access policy. Visible controls indicate technical capability, not permission to use them for every case.
3. **Verify an access request.** Confirm requester identity, business owner approval, role purpose, least privilege, duration/review need, and recorded request reference.
4. **Check current permissions.** Use only an approved authoritative access source. Do not infer permission from a job title, prior access, or a screenshot.
5. **Coordinate account recovery.** Support owns customer communication; follow approved authentication recovery without requesting passwords, codes, reset links, or secrets.
6. **Handle a denied action.** Record role, intended task, exact safe message, time, route, and request reference. Determine whether denial is correct before routing to the access owner.
7. **Respect Finance boundaries.** Administrator portal entry never permits approval/rejection without Finance authority and the same case assignment, proof safety, state, reason, and cleared-funds controls.
8. **Respect operational boundaries.** Do not create/edit Payments, allocations, Receipts, Ledger entries, bookings, notifications, package states, or configuration to solve a support case.
9. **Coordinate incidents.** Route access/service faults to Technical Operations, suspected compromise to Security, exposure to Privacy, and business permission decisions to the Business Owner.
10. **Record and review.** Preserve request/approval, action/result, actor, time, least-privilege rationale, receiving owner, and next review. Use the approved audit route; never create a shadow access list.

## Quick checklist

### Start-of-day checklist

- [ ] Confirm approved Administrator scope, access policy, contact register, and open incidents.
- [ ] Review access/recovery requests and prior handovers for approval and urgency.
- [ ] Check for unexpected access results or security/privacy notices through approved monitoring.

### Top task checklist

- [ ] Verify requester, owner approval, task need, least privilege, and reference.
- [ ] Inspect the authoritative access result and exact failure safely.
- [ ] Separate technical access from business authority.
- [ ] Apply only an accepted, approved administration action—or route it.
- [ ] Record result, audit reference, owner, and review/expiry requirement.

### End-of-day checklist

- [ ] Reconcile completed access/support work with approved requests.
- [ ] Hand over unresolved recovery, access, incident, privacy, or security work.
- [ ] Close administrative sessions, secure evidence, and confirm no credentials were retained.

## Common mistakes

- Treating `ROLE_ADMIN`, portal entry, or a visible button as permission to make a Finance/business decision.
- Granting access from an informal message or solving denial with broader permanent permission.
- Editing operational records/configuration to work around a lifecycle or service fault.
- Sharing access/security details too broadly in a Support case.

## Do's and don'ts

### Things you should always do

- Apply least privilege, separation of duties, recorded approval, and authoritative verification.
- Preserve auditability and keep Support informed with customer-safe wording.
- Stop and escalate when technical capability and business authority differ.

### Things you must never do

- Ask for/share passwords, tokens, codes, reset links, private keys, or live secrets.
- Borrow accounts, approve your own access, bypass Finance/content review, or disable safeguards.
- Promise permission, resolution time, financial outcome, or production change without the owning authority.

## Escalation

| Issue | Owner | Escalate when | Do not escalate when |
|---|---|---|---|
| Role/permission decision | Business/access owner | Approval, least privilege, or role design is unclear | Authoritative policy clearly denies the request |
| Authentication/account recovery | Support + Security as needed | Safe standard recovery fails or compromise is suspected | User has not completed the valid current flow |
| Finance action/record | Finance Supervisor | Business decision or Financial correction is required | Issue is only a correctly enforced access denial |
| Service/configuration fault | Technical Operations | Accepted authorised behavior fails or multiple users are affected | Current lifecycle/policy correctly blocks action |
| Privacy/security | Security/Privacy | Immediately on exposure, suspicious access, or credential compromise | Never investigate beyond safe evidence preservation |

DOC-003 controls operational role boundaries; DOC-004 controls Finance authority. Administrator coordinates Support but does not absorb the receiving team's decision ownership.

## Screenshot placeholder

> **Screenshot required — Figure 1: Administrator access boundary check**  
> Views: Desktop, Tablet, Mobile. Content: fictional approved request, role/permission result, owner, audit reference, and escalation. Alternative text: Administrator route separating technical access from business authority. Dependency: accepted administration/access view.

## Related manuals

- [DOC-002, Customer User Guide](../customer/CUSTOMER-USER-GUIDE.md) — customer recovery context.
- [DOC-003, Operations Manual](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md) — role matrix and operational controls.
- [DOC-004, Finance SOP](../finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md) — Finance authority and separation of duties.
- [DOC-005, Support Playbook](../support/CUSTOMER-SUPPORT-PLAYBOOK.md) — verification and coordination.
- [DOC-006, Content Studio Guide](../content/CONTENT-STUDIO-USER-GUIDE.md) — content roles/approval separation.
- [DOC-007, Status & Lifecycle Reference](../reference/STATUS-LIFECYCLE-REFERENCE.md) — authoritative state boundaries.

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial role Quick Start | Draft |
