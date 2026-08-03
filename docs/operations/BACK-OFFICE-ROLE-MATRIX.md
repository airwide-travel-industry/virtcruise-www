# Back Office Role Matrix

| Field | Value |
|---|---|
| Document ID | DOC-003-RM |
| Version | 0.8.0-draft.1 |
| Source-system version | VirtCruise v0.7.0 and accepted Sprint 3.7 workstreams |
| Status | Draft — Internal Review |
| Owner | Operations Lead |
| Intended approvers | Product Owner, Finance Lead, Security Lead, Business Owner |
| Classification | Confidential — VirtCruise Internal Operations |
| Last reviewed | 2026-08-03 |

## Purpose

This matrix summarises accepted product access and operational boundaries. It does not grant access. The application and approved access policy remain authoritative.

## Status key

| Marking | Meaning |
|---|---|
| Allowed | The accepted product supports the role performing the action, subject to case state and business controls. |
| Read only | The role can view the accepted information but cannot perform the listed mutation. |
| Denied | The accepted authorization model denies the role or the action. |
| Policy dependent | The activity occurs outside the released screen or needs separate policy and authority. |
| Not applicable | The action does not apply to that role or no accepted role-specific product capability exists. |

## Accepted role notes

- **Customer** uses customer-owned portal records only and cannot enter the Finance Operations Portal.
- **Consultant** is an accepted staff role. Accepted evidence denies Consultant access to Finance operations and mutations. No Consultant back-office mutation screen is established by v0.7.0 evidence.
- **Finance** can access the Finance Operations Portal and perform state-appropriate review actions. Assignment is to self; no reviewer directory is available.
- **Administrator** can enter the Finance Operations Portal under accepted authorization, but this does not convert the Administrator into Finance or waive Finance policy, assignment, or cleared-funds controls.
- **Operations/Support** is an audience responsibility in DOC-001, but no distinct accepted `ROLE_OPERATIONS` or `ROLE_SUPPORT` route is established by the v0.7.0 frontend. Access therefore depends on a separately approved product role or permission.
- **Content Editor** shared operational responsibilities are policy-owned. Content Studio operation belongs in future DOC-005; no Finance power is implied.
- The accepted permissions `BANK_TRANSFER_REVIEW` and `BANK_TRANSFER_ADMIN` can grant Finance Operations Portal entry. The matrix describes staff roles; assignment of those permissions requires separate authority.

## Role-action matrix

| Action | Customer | Consultant | Finance | Administrator | Operations/Support | Content Editor |
|---|---|---|---|---|---|---|
| View own customer booking | Allowed | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| View another customer's booking | Denied | Policy dependent | Read only when exposed in authorised case context | Policy dependent | Policy dependent | Denied |
| View own customer quote | Allowed | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Search customer, quote, or booking in a staff screen | Denied | Not applicable in released UI | Not applicable in released Finance UI | Not applicable in released UI | Not applicable in released UI | Denied |
| View customer Financial Portal records | Own records only | Denied | Policy dependent through approved finance source | Policy dependent | Policy dependent | Denied |
| Enter Finance Operations Portal | Denied | Denied | Allowed | Allowed | Denied unless an accepted Finance permission is assigned | Denied unless an accepted Finance permission is assigned |
| View review queue and case | Denied | Denied | Allowed | Allowed | Denied unless an accepted Finance permission is assigned | Denied |
| View customer, booking, and invoice identifiers in case | Denied except own customer view | Denied | Read only | Read only | Denied unless an accepted Finance permission is assigned | Denied |
| Assign case to self | Denied | Denied | Allowed | Allowed, subject to Finance policy | Denied unless an accepted Finance permission is assigned | Denied |
| Assign case to another reviewer | Denied | Denied | Not applicable — no reviewer directory/control | Not applicable — no reviewer directory/control | Not applicable | Denied |
| Remove assignment | Denied | Denied | Allowed for eligible non-terminal cases | Allowed, subject to Finance policy | Denied unless an accepted Finance permission is assigned | Denied |
| Start review | Denied | Denied | Allowed when assigned, proof is accepted and clean, and case is eligible | Allowed, subject to Finance policy and the same controls | Denied unless an accepted Finance permission is assigned | Denied |
| Add internal comment | Denied | Denied | Allowed | Allowed, subject to Finance policy | Denied unless an accepted Finance permission is assigned | Denied |
| Read comment history | Denied | Denied | Not applicable — no released read endpoint | Not applicable — no released read endpoint | Not applicable | Denied |
| View accepted, clean proof | Own Self Service case only when available | Denied | Allowed | Allowed, subject to Finance policy | Denied unless an accepted Finance permission is assigned | Denied |
| View quarantined, scanning, failed, or superseded proof bytes | Denied | Denied | Denied | Denied | Denied | Denied |
| Approve review case | Denied | Denied | Allowed when assigned and under review, with reason and cleared-funds attestation | Allowed by accepted authorization, subject to Finance authority | Denied unless explicit accepted permission and Finance authority exist | Denied |
| Reject review case | Denied | Denied | Allowed when assigned and under review, with reason | Allowed by accepted authorization, subject to Finance authority | Denied unless explicit accepted permission and Finance authority exist | Denied |
| Permit/request one replacement | Customer responds only when offered | Denied | Allowed only through eligible rejection decision and policy | Allowed by accepted authorization, subject to Finance policy | Denied unless explicit accepted permission and authority exist | Denied |
| View review-cycle history | Customer sees bounded progress in Self Service | Denied | Not applicable — no released Finance history view | Not applicable — no released Finance history view | Not applicable | Denied |
| Create payment directly from portal | Denied | Denied | Denied | Denied | Denied | Denied |
| Edit allocation, receipt, ledger, invoice, or booking directly | Denied | Denied | Denied | Denied | Denied | Denied |
| View recorded payment or receipt | Own records only | Denied | Policy dependent through approved financial operations source | Policy dependent | Policy dependent | Denied |
| Retry a review mutation blindly | Denied | Denied | Denied | Denied | Denied | Denied |
| Retry controlled integration/notification work | Not applicable | Not applicable | Policy dependent | Policy dependent | Policy dependent | Not applicable |
| View notification operations | Own browser notifications only | Not applicable | Not applicable in released Finance UI | Not applicable in released UI | Policy dependent through approved monitoring | Not applicable |
| Manage payment mode, bank instructions, SLA, or production configuration | Denied | Denied | Denied in released Finance UI; policy dependent outside it | Policy dependent with separate authority | Policy dependent with separate authority | Denied |
| Change roles or permissions | Denied | Denied | Denied | Policy dependent; no released administration screen established | Denied | Denied |
| Access technical operations or production runbooks | Denied | Denied | Policy dependent | Policy dependent | Policy dependent | Policy dependent |
| Manage Content Studio | Denied | Denied | Not applicable | Future DOC-005 and policy dependent | Not applicable | Future DOC-005; not established here |

## Decision rules

1. A visible control does not replace business authority.
2. `ROLE_ADMIN` access does not permit bypassing Finance controls.
3. A person with an accepted Finance permission follows the same assignment, proof, cleared-funds, audit, and conflict rules as Finance.
4. If the matrix says **Policy dependent**, stop and consult the approved policy or named supervisor; do not infer permission.
5. If the interface and this draft differ, stop the action, preserve the current state, and escalate to the Product Owner and access-control owner.

## Related documents

- [DOC-003, *Back Office Operations Manual*](BACK-OFFICE-OPERATIONS-MANUAL.md)
- [DOC-003-DC, *Daily Back Office Checklist*](DAILY-BACK-OFFICE-CHECKLIST.md)
- [DOC-002, *VirtCruise Customer User Guide*](../customer/CUSTOMER-USER-GUIDE.md)
- [DOC-001, *Documentation Architecture*](../documentation/DOCUMENTATION-ARCHITECTURE.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial accepted-role and action matrix | Draft — Internal Review |
