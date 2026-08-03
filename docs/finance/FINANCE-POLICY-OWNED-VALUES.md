# Finance Policy-Owned Values

| Field | Value |
|---|---|
| Document ID | DOC-004-PV |
| Version | 0.8.0-draft.1 |
| Source-system version | VirtCruise v0.7.0 and accepted Sprint 3.7 workstreams |
| Status | Draft — Internal Review |
| Owner | Finance Manager |
| Intended approvers | Finance Director, Business Owner, Compliance/Legal as applicable |
| Classification | Confidential — VirtCruise Finance |
| Last reviewed | 2026-08-03 |

## Purpose

This controlled register separates business policy from software behavior. A blank or pending value is not permission to choose a value during a transaction. Finance must obtain documented approval before the value is used.

## Value-status key

| Status | Meaning |
|---|---|
| Pending approval | Proposed ownership exists, but no approved value is recorded here |
| Approved | An approver has accepted the value and effective dates through the controlled policy process |
| Superseded | A later approved version replaced the value; retain it for audit but do not use it |
| Suspended | Use is temporarily prohibited pending a recorded decision |

## Policy-owned values register

| Policy area | Required controlled value | Owner | Intended approver | Approved value/reference | Effective from | Effective to | Review trigger | Status |
|---|---|---|---|---|---|---|---|---|
| Deposits | Deposit percentage or amount by product/booking class | Finance Manager | Business Owner | `[Pending approved policy reference]` | `[Pending]` | `[Pending]` | Product, supplier, or risk change | Pending approval |
| Deposits | Minimum deposit and rounding rule | Finance Manager | Business Owner | `[Pending approved policy reference]` | `[Pending]` | `[Pending]` | Pricing or currency change | Pending approval |
| Approval | Finance Officer decision authority | Finance Manager | Finance Director | `[Pending authority schedule]` | `[Pending]` | `[Pending]` | Role or control change | Pending approval |
| Approval | Supervisor review threshold by amount/currency/risk | Finance Manager | Finance Director | `[Pending threshold schedule]` | `[Pending]` | `[Pending]` | Risk or loss event | Pending approval |
| Approval | Dual-control circumstances | Finance Manager | Finance Director | `[Pending control schedule]` | `[Pending]` | `[Pending]` | Audit finding or role change | Pending approval |
| Bank accounts | Approved destination account by legal entity and currency | Treasury/Finance Manager | Finance Director | `[Restricted bank-account register]` | `[Pending]` | `[Pending]` | Account or banking change | Pending approval |
| Bank accounts | Account approver, maintainer, verifier, and publisher roles | Finance Manager | Finance Director | `[Pending responsibility schedule]` | `[Pending]` | `[Pending]` | Personnel or segregation change | Pending approval |
| Bank accounts | Effective-date and cutover rules | Treasury/Finance Manager | Finance Director | `[Pending change policy]` | `[Pending]` | `[Pending]` | Account change | Pending approval |
| Bank accounts | Customer instruction template and approved delivery channel | Finance Manager | Business Owner/Security | `[Pending controlled template]` | `[Pending]` | `[Pending]` | Fraud event or channel change | Pending approval |
| Reconciliation | Bank/reconciliation source of truth | Finance Manager | Finance Director | `[Pending source reference]` | `[Pending]` | `[Pending]` | Bank or system change | Pending approval |
| Reconciliation | Reconciliation timetable and cut-off | Finance Manager | Finance Director | `[Pending timetable]` | `[Pending]` | `[Pending]` | Volume or settlement change | Pending approval |
| Reconciliation | Reconciliation identifier format and ownership | Finance Manager | Finance Director | `[Pending identifier policy]` | `[Pending]` | `[Pending]` | Multi-bank activation | Pending approval |
| Payments | Overpayment and underpayment handling | Finance Manager | Finance Director | `[Pending policy reference]` | `[Pending]` | `[Pending]` | Exception trend | Pending approval |
| Payments | Unknown/unallocated payment handling | Finance Manager | Finance Director | `[Pending policy reference]` | `[Pending]` | `[Pending]` | Reconciliation incident | Pending approval |
| Payments | Supported currencies and currency mismatch response | Finance Manager | Business Owner | `[Pending currency policy]` | `[Pending]` | `[Pending]` | Market/product change | Pending approval |
| Refunds | Refund eligibility and approval levels | Finance Manager | Finance Director/Business Owner | `[Pending refund policy]` | `[Pending]` | `[Pending]` | Legal or commercial change | Pending approval |
| Refunds | Refund timetable and communication wording | Finance Manager | Finance Director | `[Pending refund policy]` | `[Pending]` | `[Pending]` | Customer or audit finding | Pending approval |
| Cancellation | Cancellation charges and financial treatment | Business Owner/Finance Manager | Business Owner | `[Pending cancellation policy]` | `[Pending]` | `[Pending]` | Terms change | Pending approval |
| Replacement | Eligibility within accepted one-replacement lifecycle | Finance Manager | Finance Director | `[Pending eligibility criteria]` | `[Pending]` | `[Pending]` | Fraud or customer outcome review | Pending approval |
| Review | Finance review response SLA | Finance Manager | Finance Director | `[Pending SLA schedule]` | `[Pending]` | `[Pending]` | Volume or staffing change | Pending approval |
| Review | Escalation priority and overdue thresholds | Finance Manager | Operations Manager | `[Pending escalation schedule]` | `[Pending]` | `[Pending]` | Incident or staffing change | Pending approval |
| Communications | Finance escalation contacts and approved routes | Finance Manager | Operations Manager | `[Restricted contact register]` | `[Pending]` | `[Pending]` | Personnel change | Pending approval |
| Fraud | Fraud/security escalation route and decision owner | Security/Finance Manager | Security Lead/Finance Director | `[Restricted escalation policy]` | `[Pending]` | `[Pending]` | Security incident | Pending approval |
| Privacy | Proof retention period and legal hold | Privacy/Records Owner | Legal/Privacy approver | `[Pending retention schedule]` | `[Pending]` | `[Pending]` | Legal or regulatory change | Pending approval |
| Privacy | Financial/audit record retention period | Records Owner/Finance Manager | Legal/Compliance | `[Pending retention schedule]` | `[Pending]` | `[Pending]` | Legal or audit change | Pending approval |
| Month end | Close timetable, materiality, and sign-off | Finance Manager | Finance Director | `[Pending month-end calendar]` | `[Pending]` | `[Pending]` | Reporting calendar change | Pending approval |
| Variances | Materiality and tolerance thresholds | Finance Manager | Finance Director | `[Pending threshold schedule]` | `[Pending]` | `[Pending]` | Audit or risk change | Pending approval |
| Self Service | Activation authority and readiness gates | Business Owner/Finance Manager | Business Owner | `[Pending activation record]` | `[Pending]` | `[Pending]` | Mode change | Pending approval |
| Multi-bank | Bank selection, currency routing, and fallback rules | Treasury/Finance Manager | Finance Director | `[Pending multi-bank workbook]` | `[Pending]` | `[Pending]` | Self Service activation | Pending approval |

## Control requirements

1. Record the approved value or link to its controlled policy; never put restricted bank details directly in this customer-distributable repository.
2. Record owner, approver, approval evidence, effective dates, and superseded value.
3. Require a second authorised review for bank accounts, approval thresholds, refunds, retention, and Self Service activation.
4. Communicate an approved effective-dated change before use.
5. Preserve previous versions for audit.
6. Review every value at least on its policy cadence and after the listed trigger.

> **Warning:** Placeholders are not operational values. If a required value remains pending, pause the affected decision and escalate to the owner.

## Related documents

- [DOC-004, *Finance Standard Operating Procedures*](FINANCE-STANDARD-OPERATING-PROCEDURES.md)
- [DOC-004-CL, *Finance Checklists*](FINANCE-CHECKLISTS.md)
- [DOC-003, *Back Office Operations Manual*](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial Finance policy-owned values register | Draft — Internal Review |
