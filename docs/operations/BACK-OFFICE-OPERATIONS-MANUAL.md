# VirtCruise Back Office Operations Manual

| Field | Value |
|---|---|
| Document ID | DOC-003 |
| Version | 0.8.0-draft.1 |
| Source-system version | VirtCruise v0.7.0 and accepted Sprint 3.7 workstreams |
| Sprint | 3.7 |
| Status | Draft — Internal Review |
| Owner | Operations Lead |
| Intended approvers | Product Owner, Finance Lead, Operations Lead, Support Lead, Security/Privacy Lead, Business Owner |
| Classification | Confidential — VirtCruise Internal Operations |
| Last reviewed | 2026-08-03 |

> **Warning:** This manual is for authorised VirtCruise staff after non-disclosure agreement confirmation, internal approval, and role-based access authorisation. It does not grant application access or business authority.

## Contents

1. [Purpose of this manual](#1-purpose-of-this-manual)
2. [Intended audience](#2-intended-audience)
3. [Roles and responsibilities](#3-roles-and-responsibilities)
4. [Accessing the Back Office](#4-accessing-the-back-office)
5. [Back Office navigation](#5-back-office-navigation)
6. [Daily start-of-day checks](#6-daily-start-of-day-checks)
7. [Customer and booking search](#7-customer-and-booking-search)
8. [Quote and booking review](#8-quote-and-booking-review)
9. [Booking status management](#9-booking-status-management)
10. [Manual Finance Mode](#10-manual-finance-mode)
11. [Bank transfer review cases](#11-bank-transfer-review-cases)
12. [Proof review and secure handling](#12-proof-review-and-secure-handling)
13. [Assignment and work queues](#13-assignment-and-work-queues)
14. [Internal comments and audit notes](#14-internal-comments-and-audit-notes)
15. [Approving a bank transfer review](#15-approving-a-bank-transfer-review)
16. [Rejecting a bank transfer review](#16-rejecting-a-bank-transfer-review)
17. [Replacement proof and resubmission](#17-replacement-proof-and-resubmission)
18. [Payment, allocation, and receipt consequences](#18-payment-allocation-and-receipt-consequences)
19. [Partial and full payment handling](#19-partial-and-full-payment-handling)
20. [Booking progression](#20-booking-progression)
21. [Financial Portal operations](#21-financial-portal-operations)
22. [Notifications and delivery failures](#22-notifications-and-delivery-failures)
23. [Integration and projection exceptions](#23-integration-and-projection-exceptions)
24. [SLA, overdue work, and escalation](#24-sla-overdue-work-and-escalation)
25. [Customer communication boundaries](#25-customer-communication-boundaries)
26. [Fraud, suspicion, and security escalation](#26-fraud-suspicion-and-security-escalation)
27. [Privacy and confidentiality](#27-privacy-and-confidentiality)
28. [Common operational errors](#28-common-operational-errors)
29. [End-of-day controls](#29-end-of-day-controls)
30. [Incident and service degradation procedures](#30-incident-and-service-degradation-procedures)
31. [Role-based quick procedures](#31-role-based-quick-procedures)
32. [Frequently asked operational questions](#32-frequently-asked-operational-questions)
33. [Glossary](#33-glossary)
34. [Appendices](#34-appendices)

## 1. Purpose of this manual

### Purpose

This manual gives authorised staff one safe, repeatable operating method for the released Back Office and Finance Operations experience. It covers normal work, exceptions, handovers, escalation, and recovery while separating application actions from business checks performed in approved external systems.

### Scope

It reflects the v0.7.0 release and accepted Sprint 3.7 workstreams, including production Manual Finance Mode, the Finance Operations Portal, accepted conditional Self Service bank-transfer behavior, financial consequences, and customer terminology from DOC-002.

It governs:

- protected staff access and navigation;
- current-page Finance queues, assignment, proof review, comments, approval, and rejection;
- the accepted one-replacement lifecycle when Self Service is separately enabled;
- independent cleared-funds verification and downstream outcome checks;
- privacy, customer communication, daily controls, exceptions, and escalation.

It does not replace Finance policy, Content Studio guidance, Support playbooks, lifecycle governance, technical operations, or production handover procedures. Exact SLA values, bank-account approval, fraud decisions, segregation of duties, retention, refund policy, deposit rules, and contact ownership remain policy-controlled.

### Prohibited use

This manual does not authorise anyone to:

- bypass cleared-funds verification;
- change customer amounts or currencies;
- create a payment manually outside an approved workflow;
- edit an invoice, allocation, receipt, ledger, or booking record directly;
- expose or retain private proof documents outside approved controls;
- disclose internal comments or investigation notes;
- alter production configuration, payment mode, bank instructions, or SLA values;
- change a role or permission without authority;
- approve work merely because a control is visible; or
- repeat an ambiguous operation blindly.

**Expected result:** Staff understand the manual's authority, operating boundary, and required policy hand-offs.

### Screenshot placeholder

> **Figure 1 placeholder — Staff operations journey**
> Role: Finance Officer. Route: protected Finance entry. State: signed in, no customer data.
> Masking: fictional staff identity; exclude addresses, tokens, and internal host names.
> Required views: Desktop, Tablet, Mobile. Dependency: capture after WEB-006 and DOC-003 internal review acceptance.

### Related documents

[DOC-002, *VirtCruise Customer User Guide*](../customer/CUSTOMER-USER-GUIDE.md), [Daily Back Office Checklist](DAILY-BACK-OFFICE-CHECKLIST.md), and [Back Office Role Matrix](BACK-OFFICE-ROLE-MATRIX.md).

## 2. Intended audience

### Purpose

Identify who uses this manual and which sections require additional authority.

### Audiences

| Audience | Use of this manual | Required boundary |
|---|---|---|
| Consultant | Customer context, quote/booking terminology, communication, and escalation | No Finance portal or mutation right is established by accepted v0.7.0 evidence |
| Finance Officer | Queue, assignment, proof review, decisions, cleared-funds verification, and outcome checks | Finance role or accepted permission plus Finance policy authority |
| Administrator | Access and exception coordination where authorised | Administrator access does not replace Finance authority or controls |
| Operations Staff | Daily controls, handover, exception coordination, and escalation | No distinct released Operations portal role is established; access is policy dependent |
| Support Supervisor | Customer-safe communication, incident coordination, and escalation | No Finance access unless separately authorised through an accepted permission |
| Content Editor | Shared confidentiality and incident controls | Content operations belong in future DOC-005; no Finance power is implied |

### Use the right manual

1. Confirm your assigned role and task.
2. Check the [Back Office Role Matrix](BACK-OFFICE-ROLE-MATRIX.md).
3. Use this manual only for the listed operational task.
4. Stop and use the future role-specific manual or approved policy when the task crosses this scope.

**Expected result:** Each task has an authorised owner and no role is broadened by documentation.

### Related documents

[Roles and responsibilities](#3-roles-and-responsibilities) and [Role-based quick procedures](#31-role-based-quick-procedures).

## 3. Roles and responsibilities

### Purpose

Apply the actual product roles and accepted permissions without merging business responsibilities.

### Role definitions

| Role | Responsibilities | Product access and visible data | Prohibited actions | Escalation |
|---|---|---|---|---|
| Customer | Manage owned travel and customer-visible financial records | Own quotes, bookings, invoices, payments, receipts, and conditional Self Service cases | Staff queues, internal comments, other customers, staff decisions | Support or Finance through approved contact route |
| Consultant | Help with travel planning and customer communication | No accepted Finance shell; mutation paths are denied | Finance assignment, proof review, approval, rejection | Consultant Supervisor or Finance |
| Finance | Review assigned cases and verify cleared funds | Finance overview, queues, case identifiers, amount/currency, proof metadata, accepted clean proof, decisions | Direct financial edits, proof-only approval, bypassing assignment or policy | Finance Supervisor |
| Administrator | Coordinate authorised administration and exceptions | Accepted Finance route access; backend still checks each action | Treating Administrator as Finance by default, bypassing controls, unauthorised configuration | Business Owner, Finance Lead, or Technical Operations |
| Operations/Support | Coordinate service, customer, and incident response | No distinct accepted v0.7.0 route; access depends on separately assigned accepted permission | Assuming access from job title, exposing proof or internal comments | Operations or Support Lead |
| Content Editor | Manage approved content under future guidance | No accepted shared Finance control | Finance operations or access to proof | Content Owner |

Finance and Administrator remain distinct. The accepted portal permits `ROLE_FINANCE`, `ROLE_ADMIN`, `BANK_TRANSFER_REVIEW`, or `BANK_TRANSFER_ADMIN` to enter, but business approval authority still comes from policy. Assignment is to self; there is no reviewer-selection directory.

### Verify authority before acting

1. Confirm the signed-in identity shown in the Finance header.
2. Confirm the task is allowed in the [Back Office Role Matrix](BACK-OFFICE-ROLE-MATRIX.md).
3. Confirm the case state permits the action.
4. Confirm required business authority, especially for approval, replacement permission, configuration, and manual intervention.
5. Escalate any mismatch rather than borrowing another person's access.

**Expected result:** The operator, system permission, case state, and business authority all agree.

### Related documents

[Accessing the Back Office](#4-accessing-the-back-office) and [Privacy and confidentiality](#27-privacy-and-confidentiality).

## 4. Accessing the Back Office

### Purpose

Enter and leave protected staff pages securely and handle access problems safely.

### Sign in

1. Open the approved VirtCruise sign-in page.
2. Enter your staff email address and password.
3. Complete the approved sign-in process.
4. Open **Finance Operations** only if it appears for your role.
5. Confirm the Finance header shows your identity before opening a case.

An unauthenticated visitor is sent to **Sign In**. An authenticated person without accepted Finance access is returned to the Customer Dashboard. Every protected request is checked again by the application.

### Handle an expired or invalid sign-in

1. Stop the action when the sign-in page or an access message appears.
2. Sign in again through the approved route.
3. Return to the queue and refresh the case before continuing.
4. If access remains denied, confirm your assigned role with the access owner.
5. Report malformed sign-in behavior or repeated unexpected denial to Support or Security without copying authentication data.

### Sign out

1. Close any proof viewer.
2. Finish or safely hand over the current case.
3. Select **Logout** in the Finance header.
4. Confirm protected content is no longer available.

> **Warning:** Never share credentials, use another operator's session, or work around access denial. Report suspected account compromise immediately and stop using the account until instructed.

**Expected result:** Only the authorised operator can access protected Finance content, and sign-out removes it from view.

### Screenshot placeholder

> **Figure 2 placeholder — Staff sign-in**
> Role: Finance Officer. Route: `/signin/`. State: empty staff sign-in form.
> Masking: no credentials or remembered email. Views: Desktop, Tablet, Mobile. Dependency: accepted authentication UI and WEB-006.

### Related documents

[Fraud, suspicion, and security escalation](#26-fraud-suspicion-and-security-escalation) and DOC-002, “Signing in.”

## 5. Back Office navigation

### Purpose

Move between released Finance pages without assuming unsupported global views.

### Navigation map

| Label | Route | Released purpose |
|---|---|---|
| **Finance Overview** | `/finance/` | Authoritative totals for selected review statuses |
| **Review Queue** | `/finance/bank-transfers/` | Server-paginated queue with one status filter and supported sorting |
| **My Assigned Cases** | `/finance/bank-transfers/assigned/` | Current loaded page narrowed to your reviewer identity |
| **Unassigned Cases** | `/finance/bank-transfers/unassigned/` | Current loaded page narrowed to no reviewer |
| **Overdue Cases** | `/finance/bank-transfers/overdue/` | Current loaded page narrowed to cases marked as breached |
| **Completed Reviews** | `/finance/bank-transfers/completed/` | Current loaded page narrowed to terminal cases |
| Case detail | `/finance/bank-transfers/details/?id=…` | Case facts, proof metadata, comment entry, and eligible actions |

The assigned, unassigned, overdue, and completed views are not global server-side compound filters. They narrow only the currently loaded server page, and displayed totals remain server totals.

### Navigate safely

1. Start at **Finance Overview** for authoritative status totals.
2. Use **Review Queue** for server status filtering and sorting.
3. Select **Open case** for a specific case.
4. Use **Refresh queue** or **Refresh case** when current state matters.
5. Return to the queue after completing or handing over work.

**Expected result:** You reach the intended server page and understand whether a count or filter is authoritative or page-local.

### Screenshot placeholder

> **Figure 3 placeholder — Finance overview and navigation**
> Role: Finance Officer. Route: `/finance/`. State: fictional totals.
> Masking: exclude real identities and case references. Views: Desktop, Tablet, Mobile. Dependency: DEV-005D accepted UI and WEB-006.

### Related documents

[Assignment and work queues](#13-assignment-and-work-queues) and [SLA, overdue work, and escalation](#24-sla-overdue-work-and-escalation).

## 6. Daily start-of-day checks

### Purpose

Confirm that staff can operate safely and that urgent exceptions have owners before routine work begins.

### Application checks

1. Sign in and confirm the expected role.
2. Load **Finance Overview** and **Review Queue**.
3. Check assigned, unassigned, overdue, and terminal current-page views.
4. Identify proof scan failures or unavailable proof.
5. Review approved monitoring for integration, projection, notification, stale-claim, manual-intervention, and proof-storage alerts.

### Business checks

1. Read operational announcements and known incidents.
2. Confirm the customer capability remains Manual Finance unless an approved change notice says otherwise.
3. Confirm the approved Finance contact and bank-instruction source.
4. Review handovers, priority cases, replacement deadlines, and partial-payment follow-up.
5. Verify cleared funds only through the approved banking or reconciliation process.

### Escalation checks

1. Assign an owner for every known blocking incident.
2. Escalate breached SLA and unassigned priority cases to the Finance Supervisor.
3. Escalate suspicious proof or unauthorised access to Security.
4. Cross-reference the future Production Handover Guide for technical checks; do not use raw infrastructure commands from this manual.

**Expected result:** Availability, priority work, incidents, and handovers have been reviewed and assigned.

### Screenshot placeholder

> **Figure 4 placeholder — Start-of-day overview**
> Role: Finance Supervisor. Route: `/finance/`. State: fictional pending, under-review, approved, rejected, and expired totals.
> Masking: aggregate data only. Views: Desktop and Tablet; Mobile optional for supervisor review. Dependency: DEV-005D and WEB-006.

### Related documents

[Daily Back Office Checklist](DAILY-BACK-OFFICE-CHECKLIST.md) and [Incident and service degradation procedures](#30-incident-and-service-degradation-procedures).

## 7. Customer and booking search

### Purpose

Locate the correct customer context while disclosing the least information necessary.

### Released search boundary

The v0.7.0 Finance portal does not provide a general staff customer, quote, booking, invoice, payment, or receipt search. Case detail exposes customer, booking, and invoice identifiers, not customer names or human booking/invoice references. The customer Financial Portal supports customer-owned histories only and is not a staff search tool.

### Locate a record safely

1. Start with an authoritative case, booking, invoice, payment, or receipt reference from an approved source.
2. Use **Review Queue** status and sort controls to locate a review case when applicable.
3. Open the case and compare customer, booking, invoice, amount, currency, and transfer reference.
4. Use the separately approved operational source for records not exposed in the Finance portal.
5. Verify at least 2 independent reference points; do not rely on a person's name alone.
6. Close unrelated records immediately.

> **Warning:** Do not browse unrelated customers, copy identifiers into ordinary chat, or share screenshots containing other customers. Never alter a route identifier to test access.

**Expected result:** The operator identifies the correct record through authorised sources and avoids unrelated data.

### Related documents

[Quote and booking review](#8-quote-and-booking-review), [Financial Portal operations](#21-financial-portal-operations), and [Privacy and confidentiality](#27-privacy-and-confidentiality).

## 8. Quote and booking review

### Purpose

Understand customer-visible quote and booking context without inventing staff editing powers.

### Review the context

1. Identify the quote or booking reference from the approved source.
2. Confirm customer ownership and travel context.
3. Compare booking and invoice references with the review case.
4. Review commercial booking status separately from payment status and review status.
5. Review the customer-visible timeline or history only through an authorised view.
6. Escalate mismatches; do not edit a reference, amount, or status to make records agree.

### Four separate status families

| Family | Question answered | Authoritative source |
|---|---|---|
| Commercial booking status | What stage has the travel booking reached? | Booking record |
| Payment/invoice status | What money is recorded and allocated? | Financial record |
| Bank-transfer review status | What stage has evidence review reached? | Review case |
| Notification status | What is known about message delivery? | Approved notification operations source |

A review `APPROVED` status is not itself a payment. A paid invoice does not by itself prove that a booking is `CONFIRMED`; booking milestone evaluation must complete.

**Expected result:** Staff describe each state accurately and do not mutate unsupported records.

### Related documents

[Booking status management](#9-booking-status-management), [Payment, allocation, and receipt consequences](#18-payment-allocation-and-receipt-consequences), and DOC-002, “Making a booking.”

## 9. Booking status management

### Purpose

Protect authoritative booking state and verify lawful progression.

### Released boundary

The Finance Operations Portal displays booking identifiers but does not provide a booking status editor. Staff must not directly set a booking status through an unapproved route. Accepted processing evaluates booking milestones after financial work completes.

### Check progression

1. Record the current booking status from the authoritative booking view.
2. Check the invoice balance and recorded payments separately.
3. Check the review case and downstream integration state.
4. Refresh the authoritative booking view after processing.
5. Confirm notification state before telling the customer a confirmation was delivered.

The customer guide uses statuses including `DEPOSIT_PENDING`, `DEPOSIT_RECEIVED`, and `CONFIRMED`. Exact transitions depend on booking and deposit policy; do not invent thresholds.

**Expected result:** Booking status changes only through the authorised lifecycle and agrees with financial consequences.

### Related documents

[Booking progression](#20-booking-progression), [Partial and full payment handling](#19-partial-and-full-payment-handling), and future DOC-007.

## 10. Manual Finance Mode

### Purpose

Operate the production customer payment hand-off without suggesting Self Service is active.

### Current released behavior

Production launches in `MANUAL_FINANCE`. Customers see approved Finance contact information, an owned booking or invoice reference, currency, and explicit unpaid/unconfirmed wording. They do not see bank details, review creation, or proof upload.

### Handle a customer request

1. Ask the customer for the authoritative reference and currency shown in their portal.
2. Verify the customer and invoice through the approved Finance process.
3. Supply only approved bank instructions for that invoice and currency through the approved secure route.
4. Record the hand-off as required by Finance policy.
5. Explain that giving instructions does not record a payment.
6. Verify cleared funds independently after transfer.
7. Use only an approved authorised process to record and progress the payment.
8. Confirm the customer-visible financial and booking results before communicating completion.

### Staff must not

- show test-bank details or copy bank details from memory;
- use an unapproved account or currency;
- state that payment is received before verification;
- confirm a booking prematurely; or
- request proof through ordinary email or messaging without approved policy.

### Future functionality — Self Service

Self Service bank instructions, case creation, proof upload, and replacement exist as an accepted conditional capability but are unavailable to customers while Manual Finance Mode is active. Activation requires separately approved configuration and operational readiness. The remaining case chapters apply only to cases legitimately present under an authorised Self Service or controlled operational context.

**Expected result:** The customer receives verified Finance instructions, and no payment or booking claim is made before authoritative processing.

### Related documents

[DOC-002, “Manual Finance Mode”](../customer/CUSTOMER-USER-GUIDE.md#14-manual-finance-mode) and [Customer communication boundaries](#25-customer-communication-boundaries).

## 11. Bank transfer review cases

### Purpose

Understand the accepted case lifecycle and its Manual Finance production boundary.

### Lifecycle summary

| Review status | Operational meaning | Available next action |
|---|---|---|
| `NEW` | Case exists before proof workflow progresses | Follow current case controls; do not infer proof receipt |
| `AWAITING_UPLOAD` | Initial proof has not been received | Customer upload only in authorised Self Service |
| `AWAITING_REPLACEMENT` | One permitted replacement is awaited | Customer uploads by the displayed deadline in Self Service |
| `PROOF_RECEIVED` | Current proof was received and may be ready after safe scanning | Assign and start only when proof is accepted and clean |
| `UNDER_REVIEW` | Assigned review has started | Complete checks, then approve or reject |
| `APPROVED` | Operational decision is terminal | Wait for downstream consequences; do not decide again |
| `REJECTED` | Review cycle or case was rejected | Replacement only if explicitly permitted and eligible |
| `EXPIRED` | Allowed time ended | Terminal; escalate policy questions |
| `CANCELLED` | Case was cancelled | Terminal; no further review action |

The case is customer-owned. Finance can assign to self, start review, comment, and make eligible decisions; Administrator access remains policy-controlled. Customers see bounded progress and customer-safe reasons, not reviewer identity, internal comments, audit history, operational events, or storage details.

### Open a case

1. Select **Review Queue**.
2. Apply one supported server status filter if needed.
3. Select **Open case**.
4. Confirm status, amount, currency, customer, booking, invoice, reference, reviewer, and SLA.
5. Refresh before action if the case may have changed.

**Expected result:** The authoritative case appears with only state-eligible controls.

### Related documents

[Assignment and work queues](#13-assignment-and-work-queues), [Proof review and secure handling](#12-proof-review-and-secure-handling), and [Appendix A](#appendix-a-status-reference-summary).

## 12. Proof review and secure handling

### Purpose

View only safe evidence and keep private documents within approved controls.

### Proof states

| Proof state | Meaning for the operator | Action |
|---|---|---|
| `QUARANTINED` | Isolated pending checks | Do not open; wait for processing |
| `SCANNING` | Security scanning is in progress | Do not open or decide |
| `ACCEPTED` with scan `CLEAN` | File passed current scanning and type checks | May open through secure viewer if authorised |
| `REJECTED` | File failed an accepted proof condition | Do not open; follow safe rejection process |
| `SCAN_FAILED` | Scanner could not establish a safe result | Do not open; escalate |
| `SUPERSEDED` | Replaced by a newer proof cycle | Do not use for the current decision |
| `EXPIRED` or `DELETED` | Retention/lifecycle makes the file unavailable | Do not seek a local copy; escalate if required |
| Missing object | Metadata exists but the private file cannot be retrieved | Stop review and escalate storage exception |

Supported viewable formats are PDF, JPEG, and PNG. Only proof that is both `ACCEPTED` and scan `CLEAN` has **Securely view proof**. Malware-clean means only that the scanner found no current reason to block the file; it does not prove authenticity or cleared funds.

### View proof safely

1. Confirm you are assigned and need the proof for the review.
2. Confirm it is the current proof and is accepted and clean.
3. Select **Securely view proof**.
4. Compare reference, amount, currency, payer context, destination account, and visible integrity indicators.
5. Close the viewer immediately after review.
6. Verify cleared funds independently in the approved banking or reconciliation source.

> **Warning:** Do not create a public link, forward proof through ordinary email or messaging, save it to a personal device, or retain a local copy unless explicit policy permits. Never assume proof alone establishes payment.

**Expected result:** Current clean proof is viewed temporarily, no copy escapes approved control, and financial verification remains independent.

### Screenshot placeholder

> **Figure 5 placeholder — Review detail and proof viewer**
> Role: Finance Officer. Route: `/finance/bank-transfers/details/?id=…`. State: `UNDER_REVIEW`, current PDF `ACCEPTED` and `CLEAN`.
> Masking: fictional identifiers, amount, account, filename, and reference; flatten and inspect masking. Views: Desktop, Tablet, Mobile. Dependency: DEV-005D/WEB-006 accepted evidence.

### Related documents

[Approving a bank transfer review](#15-approving-a-bank-transfer-review), [Fraud, suspicion, and security escalation](#26-fraud-suspicion-and-security-escalation), and [Appendix B](#appendix-b-approval-checklist).

## 13. Assignment and work queues

### Purpose

Claim work once, respect current ownership, and handle concurrent action safely.

### Queue controls

The server supports one status filter, pagination, sort by created time, updated time, SLA due time, review status, or amount, and ascending or descending direction. Reviewer, assignment, SLA, date, and multi-status completed filters are not supported globally.

### Assign and begin

1. Open the case from **Review Queue**.
2. Confirm it is non-terminal and unassigned.
3. Select **Assign to me** once.
4. Confirm your reviewer identity appears.
5. Confirm current proof is accepted and clean.
6. Select **Start review** when status is `PROOF_RECEIVED`.
7. Confirm status becomes `UNDER_REVIEW`.

### Handle a conflict

A conflict may mean another Finance Officer acted first.

1. Stop submitting.
2. Select **Refresh case** or return to the queue.
3. Review the authoritative current state and owner.
4. Continue only if the refreshed state and policy permit.
5. Coordinate or escalate if ownership is unclear.

**Standard response:** Refresh the case and review the authoritative current state.

Do not make repeated blind submissions. Mutations are not automatically retried, and an ambiguous request retains its operation identity while the portal refreshes where possible.

**Expected result:** One authorised reviewer owns the case, and races converge without overwriting another decision.

### Screenshot placeholders

> **Figure 6 placeholder — Review queue**
> Role: Finance Officer. Route: `/finance/bank-transfers/`. State: mixed fictional statuses, server page 1. Masking: all identifiers fictional. Views: Desktop, Tablet, Mobile. Dependency: DEV-005D and WEB-006.

> **Figure 7 placeholder — Assigned, unassigned, and overdue views**
> Role: Finance Supervisor. Routes: `/assigned/`, `/unassigned/`, `/overdue/`. State: demonstrate current-page limitation. Masking: fictional references. Views: Desktop and responsive Mobile. Dependency: DEV-005D and WEB-006.

### Related documents

[SLA, overdue work, and escalation](#24-sla-overdue-work-and-escalation) and [Common operational errors](#28-common-operational-errors).

## 14. Internal comments and audit notes

### Purpose

Create factual, professional records without disclosing unnecessary information.

### Add an internal comment

1. Open the correct case.
2. Use **Add internal comment** only for relevant operational facts.
3. Write a concise statement of observation, check, action, and next owner.
4. Remove speculation, emotion, unrelated personal data, and copied proof content.
5. Select **Add internal comment** once.
6. Wait for confirmation; the released portal does not provide comment-history reading.

Comments cannot be blank and are limited to 2,000 characters. They are internal, immutable records and are not customer-visible. Actions are audited; staff must not alter or evade the audit trail.

> **Example:** Good: “Reference and currency match the current invoice. Cleared-funds check remains pending with Finance reconciliation.”

> **Example:** Poor: “Customer probably changed this document and always causes trouble.” This is speculative, personal, and unprofessional.

> **Example:** Good: “Proof viewer unavailable because scan status is failed. Review paused and escalated to the approved security queue at 14:30 UTC.”

**Expected result:** The comment records necessary operational facts without becoming customer communication or an investigation narrative.

### Screenshot placeholder

> **Figure 8 placeholder — Internal comment**
> Role: Finance Officer. Route: case detail. State: eligible non-terminal case with empty comment field.
> Masking: fictional case facts; no real comment history. Views: Desktop and Tablet. Dependency: DEV-005D and WEB-006.

### Related documents

[Customer communication boundaries](#25-customer-communication-boundaries) and [Privacy and confidentiality](#27-privacy-and-confidentiality).

## 15. Approving a bank transfer review

### Purpose

Make one auditable operational approval only after evidence and independent financial checks agree.

### Approval checklist

Before approval confirm:

- correct customer, booking, and invoice;
- correct currency and expected amount;
- exact transfer reference;
- correct destination bank account;
- cleared funds independently verified;
- proof belongs to the current review cycle;
- proof is current, accepted, clean, and not superseded;
- no duplicate payment or reused approval;
- no unapproved overpayment;
- no unresolved fraud or security concern; and
- a factual reason and cleared-funds attestation are complete.

### Approve

1. Assign the case to yourself.
2. Select **Start review** and confirm `UNDER_REVIEW`.
3. Complete the checklist using proof and the independent financial source.
4. Select **Approve**.
5. Review customer, booking/invoice identifiers, amount, currency, reference, account, reviewer, and state in the dialog.
6. Enter a factual **Approval reason**.
7. Read and select the cleared-funds attestation only when true.
8. Select **Confirm approval** once.
9. Confirm the case becomes `APPROVED`.
10. Follow downstream processing separately.

> **Warning:** Proof alone is insufficient. Approval is an operational event, not the Financial payment record.

### Ambiguous or conflicting result

If the response is uncertain or a conflict appears, do not approve again. Refresh the case, inspect current state, check downstream operations, and escalate with the safe request reference if needed.

**Expected result:** One terminal approval is recorded, and downstream processing can create financial and booking consequences eventually.

### Screenshot placeholder

> **Figure 9 placeholder — Approval dialog**
> Role: assigned Finance Officer. Route: case detail. State: `UNDER_REVIEW`, current clean proof.
> Masking: fictional customer, booking, invoice, reference, account, amount, and reviewer. Views: Desktop, Tablet, Mobile. Dependency: DEV-005D and WEB-006.

### Related documents

[Payment, allocation, and receipt consequences](#18-payment-allocation-and-receipt-consequences), [Appendix B](#appendix-b-approval-checklist), and [Common operational errors](#28-common-operational-errors).

## 16. Rejecting a bank transfer review

### Purpose

Record a safe terminal or replaceable rejection without exposing internal analysis.

### Valid operational grounds

A rejection requires a supported, factual reason such as unreadable or mismatched evidence, wrong reference, wrong amount/currency, wrong destination account, duplicate evidence, or an unresolved verification problem. Finance policy remains authoritative; these examples are not a formal reason-code policy.

### Reject

1. Confirm assignment and `UNDER_REVIEW` state.
2. Complete the rejection checklist in [Appendix C](#appendix-c-rejection-checklist).
3. Select **Reject**.
4. Decide whether the accepted one-replacement path is explicitly permitted by policy and current lifecycle.
5. If permitted, select the replacement option and enter a bounded customer-safe reason.
6. Enter the internal rejection reason without disclosing investigation detail to the customer.
7. Select **Confirm rejection** once.
8. Refresh and confirm the authoritative result.

### Safe wording examples

> **Example — requires Finance approval:** “We could not verify the transfer from the current document. Please follow the replacement instructions shown in your account.”

> **Example — requires Finance approval:** “The uploaded image does not show the required reference clearly. A replacement may be submitted by the deadline shown.”

Do not state that fraud occurred unless the approved Security process authorises that communication. Do not promise resubmission unless the case explicitly becomes eligible.

**Expected result:** The case records one rejection, the customer sees only the approved safe reason, and internal notes remain private.

### Screenshot placeholder

> **Figure 10 placeholder — Rejection dialog**
> Role: assigned Finance Officer. Route: case detail. State: `UNDER_REVIEW`.
> Masking: fictional identifiers and safe sample reason; exclude investigation notes. Views: Desktop, Tablet, Mobile. Dependency: accepted replacement lifecycle, DEV-005D, and WEB-006.

### Related documents

[Replacement proof and resubmission](#17-replacement-proof-and-resubmission), [Customer communication boundaries](#25-customer-communication-boundaries), and [Appendix C](#appendix-c-rejection-checklist).

## 17. Replacement proof and resubmission

### Purpose

Apply the accepted conservative replacement policy without reopening an ineligible case.

### Accepted boundary

Where explicitly permitted, one replacement proof may be submitted within 7 days. The replacement changes proof only; it does not change the transfer, amount, currency, booking, invoice, or reference. The first cycle remains immutable, its proof becomes `SUPERSEDED`, a new current proof starts a second review cycle, and the SLA restarts for that cycle.

### Request and review a replacement

1. During rejection, confirm policy permits replacement and the transfer itself is unchanged.
2. Select the replacement permission and enter a customer-safe reason.
3. Confirm the case becomes `AWAITING_REPLACEMENT` and a deadline is available to the customer.
4. Wait for the customer's one replacement in authorised Self Service.
5. Confirm the original cycle remains unchanged and original proof is superseded.
6. Confirm the new proof becomes current and passes scanning.
7. Assign and begin the second review cycle under normal controls.
8. Reperform all verification; do not rely on the first decision.
9. Approve or reject once according to current evidence and cleared funds.

No Financial effect occurs before second-cycle approval. Approved, expired, cancelled, financially completed, or otherwise terminal ineligible cases cannot reopen.

> **Important:** In production Manual Finance Mode, customers cannot create cases or upload replacement proof through the website. Follow approved Manual Finance policy rather than presenting Self Service controls as available.

**Expected result:** At most one eligible replacement creates a distinct current proof and review cycle without altering the first cycle.

### Screenshot placeholders

> **Figure 11 placeholder — Replacement request**
> Role: Finance Officer. Route: rejection dialog/case detail. State: eligible first-cycle rejection with one replacement permitted. Masking: fictional reason and deadline. Views: Desktop, Tablet, Mobile. Dependency: accepted Self Service activation and WEB-006.

> **Figure 12 placeholder — Cycle history**
> Role: Finance Officer. Route: future history view. State: first proof superseded, second proof current.
> Masking: fictional data. Views: Desktop and Tablet. Dependency: **Future functionality** — no released Finance comment/cycle-history read view; capture only after an accepted workstream adds it.

### Related documents

[Proof review and secure handling](#12-proof-review-and-secure-handling) and [Appendix D](#appendix-d-replacement-checklist).

## 18. Payment, allocation, and receipt consequences

### Purpose

Verify the downstream results of approval without confusing the operational decision with Financial records.

### Expected eventual consequences

After successful approved-event processing, the accepted outcome is:

- one Bank Transfer Payment for the approved amount;
- exact allocation to the related invoice;
- one Receipt for that Payment;
- a balanced Ledger effect;
- updated invoice and booking payment summaries;
- booking milestone evaluation; and
- eligible notification intents.

These consequences can be eventual. Approval returning successfully does not prove they all completed immediately.

### Verify downstream results

1. Refresh the case and confirm `APPROVED`.
2. Check approved operations status for the integration execution.
3. Confirm one Payment with the expected reference, amount, currency, and method.
4. Confirm the allocation matches the approved amount.
5. Confirm one Receipt belongs to that Payment.
6. Confirm the Ledger effect is balanced through the authorised Finance source.
7. Confirm the invoice balance and booking payment summary updated.
8. Confirm booking milestone evaluation and notification status.

If expected records do not appear within the normal policy-owned window, refresh once, inspect operations and integration status, check notifications, and escalate. Do not approve again blindly.

**Expected result:** One approval produces one coherent, traceable set of downstream records without duplicates.

### Related documents

[Partial and full payment handling](#19-partial-and-full-payment-handling), [Financial Portal operations](#21-financial-portal-operations), and [Integration and projection exceptions](#23-integration-and-projection-exceptions).

## 19. Partial and full payment handling

### Purpose

Record exact transferred amounts and prevent premature booking confirmation.

### Partial payment

1. Verify the exact cleared amount and currency.
2. Confirm the review case amount matches the transferred amount, not the full invoice by assumption.
3. Approve only after the full checklist passes.
4. Confirm one Payment, exact allocation, and one Receipt for the partial amount.
5. Confirm the remaining invoice balance is correct.
6. Confirm the booking remains at the lawful milestone, which may be `DEPOSIT_PENDING`.
7. Confirm no premature booking-confirmation notification exists.

### Final payment

1. Verify the distinct final transfer, reference, amount, and currency.
2. Approve its eligible review separately.
3. Confirm cumulative allocations settle the invoice.
4. Confirm a second Payment and second Receipt exist.
5. Confirm the invoice becomes paid.
6. Confirm booking milestone evaluation produces `CONFIRMED` only when booking and deposit policy permit.
7. Confirm exactly one booking-confirmation notification intent for the legal transition.

Accepted evidence demonstrates a ZAR 4,000 partial payment and later ZAR 6,000 final payment against a ZAR 10,000 invoice, but these values are test evidence, not customer policy or configured thresholds. Do not copy them into live decisions.

**Expected result:** Each transfer is recorded once, remaining balance is exact, and confirmation occurs only after lawful cumulative settlement.

### Related documents

[Booking progression](#20-booking-progression), [Approving a bank transfer review](#15-approving-a-bank-transfer-review), and future DOC-004.

## 20. Booking progression

### Purpose

Confirm the booking reflects completed financial processing without manually forcing status.

### Verify progression

1. Confirm the relevant Payment and allocation exist.
2. Confirm the invoice balance after all eligible payments.
3. Refresh the authoritative booking view.
4. Compare the booking status with the applicable deposit and booking policy.
5. Check that the status history shows only lawful transitions.
6. Check notification operations for the expected milestone intent.
7. Communicate confirmation only when the booking itself is `CONFIRMED`.

A partial payment can leave a booking `DEPOSIT_PENDING`. A fully paid invoice can permit confirmation, but exact behavior depends on the booking's policy and other required checks. Never set or promise `CONFIRMED` solely because proof was clean, the review was approved, or money was transferred.

**Expected result:** The booking progresses through authoritative milestone evaluation and customer communication matches that state.

### Related documents

[Booking status management](#9-booking-status-management), [Notifications and delivery failures](#22-notifications-and-delivery-failures), and DOC-002, “Booking status.”

## 21. Financial Portal operations

### Purpose

Use financial records as authoritative outcomes while respecting the released portal boundary.

The released Financial Portal is customer-owned and read-only. It shows invoices and deposits, payments, receipts, refunds, and per-currency balances. It does not provide staff mutation controls, payment initiation, receipt PDF download, a customer ledger, or a cross-currency total.

### Check financial state

1. Use the approved staff financial source; do not impersonate a customer.
2. Locate the invoice by authoritative reference.
3. Review total, allocated amount, outstanding balance, and currency.
4. Locate the Payment and confirm reference, status, amount, allocated, unallocated, and refunded values where exposed.
5. Locate the Receipt and confirm it belongs to the Payment.
6. Compare the booking payment summary.
7. Escalate inconsistencies without editing records directly.

### Important distinctions

- **Cleared funds** are independently verified in the approved bank/reconciliation source.
- A **recorded Payment** is the Financial record created after approved processing.
- An **invoice paid** state means allocations settle the invoice.
- A **booking confirmed** state is a separate booking milestone.

> **Warning:** Do not copy financial records into unapproved spreadsheets, ordinary messaging, or personal notes. Do not combine different currencies.

**Expected result:** Staff identify the authoritative financial outcome and preserve confidentiality.

### Screenshot placeholder

> **Figure 13 placeholder — Financial Portal outcome**
> Role: authorised Finance/Operations reader. Route: approved financial record view. State: fictional invoice, Payment, allocation, Receipt, and balance.
> Masking: all customer and financial data fictional; one currency. Views: Desktop, Tablet, Mobile. Dependency: accepted Financial Portal plus an approved staff viewing source.

### Related documents

[Payment, allocation, and receipt consequences](#18-payment-allocation-and-receipt-consequences), DOC-002, “Financial Portal,” and future DOC-004.

## 22. Notifications and delivery failures

### Purpose

Handle customer and staff message outcomes without duplicate or unsafe resends.

Accepted downstream events can create notifications for payment recorded, Receipt issued, and booking confirmed. Self Service lifecycle may also support proof-received, rejection, and replacement communication. The released Finance frontend has no notification-operations screen and does not expose message bodies, recipient addresses, retry controls, or delivery history.

### Respond by operational state

| Observable operational state | Safe response |
|---|---|
| Retry pending | Allow the controlled retry policy to operate; monitor and do not resend manually |
| Failed | Record the safe reference and escalate to notification operations owner |
| Delivery uncertain | Check authoritative attempt state before any resend; avoid duplicate customer messages |
| Manual intervention required | Assign an authorised owner and follow approved procedure |
| Cancelled | Confirm cancellation reason through authorised monitoring; do not recreate blindly |
| Suppressed | Respect suppression and escalate policy questions; do not bypass it |

### Check a missing notification

1. Confirm the source financial or booking event completed.
2. Locate the notification intent through the approved operations source.
3. Review retry, failure, uncertainty, cancellation, suppression, or manual-intervention state.
4. Preserve the notification reference and timestamps.
5. Escalate to the notification owner.
6. Contact the customer manually only when approved, using wording from [Appendix G](#appendix-g-safe-customer-wording).

> **Warning:** Do not manually resend an uncertain message until authoritative state is known. Do not expose internal message bodies or recipient lists beyond authorised views.

**Expected result:** Delivery exceptions are handled once and do not create contradictory or duplicate communication.

### Screenshot placeholder

> **Figure 14 placeholder — Notification operations**
> Role: Operations/Support Supervisor. Route: not released. State: retry, failed, uncertain, and manual intervention.
> Masking: fictional recipient and message metadata. Views: Desktop and Tablet. Dependency: **Future functionality** — capture only after an accepted notification-operations workstream.

### Related documents

[Customer communication boundaries](#25-customer-communication-boundaries) and [Integration and projection exceptions](#23-integration-and-projection-exceptions).

## 23. Integration and projection exceptions

### Purpose

Respond safely when an approved review does not yet produce expected Financial or Booking results.

The released Finance frontend does not expose an integration-operations or projection-recovery screen. Use the approved operations source and future Production Handover Guide; this manual provides business response only.

### Exception matrix

| Symptom | Business meaning | Safe operator action | Prohibited action | Escalation owner |
|---|---|---|---|---|
| Payment integration pending | Approved event has not completed Financial processing | Refresh once, check approved execution state, monitor policy window | Approve again or create payment manually | Finance Operations |
| Financial recorded, Booking not projected | Financial consequence exists; booking milestone has not caught up | Verify payment/allocation, inspect projection state, escalate | Force booking confirmation | Operations/Technical Operations |
| Quarantined integration | Automated processing stopped for controlled review | Preserve references, assign manual intervention, follow approved recovery | Edit data or replay without authority | Technical Operations and Finance |
| Stale processing claim | Work appears claimed beyond its valid processing window | Check authoritative ownership and recovery policy, escalate | Clear or steal claim from UI assumptions | Technical Operations |
| Proof missing | Metadata exists but private object is unavailable | Stop review, record safe references, escalate storage exception | Use an emailed/local copy | Security/Technical Operations |
| Scan failure | Safe status cannot be established | Keep file closed and escalate | Download or approve from appearance | Security/Technical Operations |
| Notification failure/uncertainty | Customer may not have received an outcome | Check intent/attempt state and escalate | Blind resend | Notification Operations |
| Duplicate request conflict | Same or competing logical action was submitted | Refresh and compare authoritative result | Generate a new repeat request | Finance Supervisor |
| Optimistic conflict | Another operator changed the case first | Refresh and review current state | Overwrite or repeat blindly | Finance Supervisor if unresolved |
| Malformed customer request | Reference or data cannot be safely matched | Ask for bounded correction through approved route | Guess the intended record | Support/Finance |
| Unauthorised access attempt | Person or route lacks permission | Stop, preserve safe evidence, report | Reveal whether another customer's record exists | Security |

**Expected result:** The original records remain intact, each exception has one owner, and recovery uses approved controls.

### Screenshot placeholder

> **Figure 15 placeholder — Integration operations**
> Role: Operations Supervisor. Route: not released. State: pending, quarantined, stale, completed, and manual intervention.
> Masking: fictional references; no payloads or infrastructure detail. Views: Desktop and Tablet. Dependency: **Future functionality** — accepted integration-operations UI and DOC-010.

### Related documents

[Incident and service degradation procedures](#30-incident-and-service-degradation-procedures) and future DOC-010.

## 24. SLA, overdue work, and escalation

### Purpose

Prioritise time-sensitive cases using authoritative case markers and approved policy.

Each case exposes an SLA due time with a time zone and an authoritative breach marker. Exact SLA durations and priority rules are configuration- and policy-owned.

> **Important:** Refer to the approved Finance Operations Policy for response times, expiry rules, and priority definitions.

### Manage overdue work

1. Review **Overdue Cases**, remembering it narrows only the current loaded server page.
2. Use **Review Queue** with supported status and SLA sorting to review additional pages.
3. Open the case and confirm its authoritative `slaBreached` result and due time.
4. Assign or escalate according to Finance policy.
5. For a replacement cycle, use the restarted cycle SLA and the explicit 7-day customer replacement deadline where applicable.
6. Record handover and escalation without promising unapproved customer timelines.

### Escalation matrix

| Condition | Primary owner | Secondary owner | Approved contact placeholder |
|---|---|---|---|
| Unassigned or overdue review | Finance Supervisor | Operations Lead | `[Finance Supervisor route]` |
| Access/role problem | Administrator | Security | `[Administrator route]` |
| Customer service impact | Support Supervisor | Operations Lead | `[Support route]` |
| Integration, projection, scan, or availability issue | Technical Operations | Finance Supervisor | `[Technical Operations route]` |
| Suspected fraud, malware, or data exposure | Security/Privacy contact | Business Owner | `[Security/Privacy route]` |

**Expected result:** Urgent work has an authorised owner and escalation record without invented service times.

### Related documents

[Daily Back Office Checklist](DAILY-BACK-OFFICE-CHECKLIST.md) and [Appendix E](#appendix-e-escalation-matrix-template).

## 25. Customer communication boundaries

### Purpose

Give accurate, calm, customer-safe updates that match authoritative state.

### Communicate safely

1. Verify the customer's authorised contact route and relevant reference.
2. Check review, Financial, booking, and notification states separately.
3. Use the approved wording in [Appendix G](#appendix-g-safe-customer-wording).
4. Share only customer-visible facts and next actions.
5. Record the communication according to policy.

### Statements to avoid

- “Your payment is confirmed” before cleared funds and the Payment record are verified.
- “Your booking is confirmed” before booking status is `CONFIRMED`.
- Internal comments, reviewer identity, fraud suspicion, audit detail, or system implementation.
- Blame directed at another staff member or team.
- A timeline that has not been approved.
- Bank details from memory, an old message, or an unapproved source.

### Customer terminology

Use DOC-002 terms: quote, booking, booking reference, invoice, Payment, Receipt, outstanding balance, Booking Confirmation, Financial Portal, and Manual Finance. Explain that proof is evidence, not confirmation of payment.

**Expected result:** The customer receives a truthful status and safe next action without internal or private detail.

### Related documents

[DOC-002, *VirtCruise Customer User Guide*](../customer/CUSTOMER-USER-GUIDE.md), [Rejecting a bank transfer review](#16-rejecting-a-bank-transfer-review), and [Notifications and delivery failures](#22-notifications-and-delivery-failures).

## 26. Fraud, suspicion, and security escalation

### Purpose

Recognise warning signs, stop unsafe processing, and preserve records for authorised review.

### Indicators requiring escalation

- customer, payer account, booking, invoice, currency, amount, destination account, or reference mismatch;
- visibly altered or duplicate proof;
- reused transfer reference or apparent duplicate Payment;
- unusual urgency or pressure to bypass review;
- malware or scan alert;
- request to use changed or unapproved bank details;
- unauthorised access or another customer's information appearing;
- unexpected overpayment or unsupported partial-payment pattern.

### Respond

1. Pause operational action.
2. Do not accuse the customer or complete the approval.
3. Preserve the existing case, proof metadata, audit record, references, and timestamps.
4. Add only a factual internal comment when safe and authorised.
5. Escalate through the approved Security/Privacy route.
6. Follow instructions from the authorised owner.

**Required rule:** Pause operational action, preserve records, and escalate through the approved internal route.

This manual does not provide criminal investigation procedures.

**Expected result:** Suspicious activity remains contained and available to authorised reviewers without unsafe disclosure.

### Related documents

[Privacy and confidentiality](#27-privacy-and-confidentiality) and [Incident and service degradation procedures](#30-incident-and-service-degradation-procedures).

## 27. Privacy and confidentiality

### Purpose

Protect customer, proof, financial, staff, and audit information throughout operations.

### Controls

- Use least-privilege access and open only records required for your task.
- Treat proof and financial information as confidential.
- Customer ownership checks remain authoritative; changing a route reference does not grant access.
- Share screens only through approved tools, close unrelated tabs, and show the minimum area.
- Follow DOC-001 masking: use fictional data where possible; opaque replacement rather than blur; second-person inspection of flattened output.
- Do not print unless policy permits. Collect prints immediately, store securely, and dispose through approved confidential waste.
- Keep a clean desk and clear local downloads, print queues, and temporary working areas.
- Report exposure, wrong-customer display, lost print, or misdirected communication immediately.

### Secure screen sharing

1. Confirm every participant is authorised.
2. Share one application window, not the whole desktop.
3. Hide notifications and unrelated records.
4. Stop sharing before opening proof unless every viewer has proof authority and policy permits.
5. Record any accidental exposure as a privacy incident.

**Expected result:** Staff see and share only the minimum data required, and incidents are reported promptly.

### Related documents

[DOC-001 Screenshot Standards](../documentation/SCREENSHOT-STANDARDS.md), [Proof review and secure handling](#12-proof-review-and-secure-handling), and future DOC-006.

## 28. Common operational errors

### Purpose

Prevent repeated mistakes and recover without corrupting authoritative state.

| Error | Safe correction |
|---|---|
| Treating current-page assigned/unassigned/overdue view as global | Use server totals, supported status filter, sorting, and additional pages |
| Starting work owned by another reviewer | Refresh, coordinate, and resolve assignment first |
| Repeating after a timeout or conflict | Refresh authoritative state and retain the same logical action context |
| Approving from proof alone | Stop and independently verify cleared funds |
| Using superseded proof | Identify the current proof and review cycle |
| Promising replacement after terminal rejection | Check explicit eligibility and deadline first |
| Calling approval a Payment | Wait for the Financial record and allocation |
| Calling invoice paid a confirmed booking | Check authoritative booking status |
| Sending an uncertain notification again | Check delivery state and escalate |
| Copying financial data into an ordinary spreadsheet/chat | Remove it and report exposure according to policy |
| Showing test or remembered bank details | Stop and retrieve approved instructions through the authorised source |
| Entering speculation in internal comments | Replace with observable facts, action, owner, and time |

**Expected result:** The operator corrects course without blind retries, direct edits, or unsafe disclosure.

### Related documents

[Assignment and work queues](#13-assignment-and-work-queues), [Approving a bank transfer review](#15-approving-a-bank-transfer-review), and [Incident and service degradation procedures](#30-incident-and-service-degradation-procedures).

## 29. End-of-day controls

### Purpose

Leave no unowned priority work, private documents, or active staff session at shift end.

### Close the shift

1. Review cases assigned to you.
2. Complete eligible work or hand it over with current state, action, owner, and due time.
3. Escalate overdue work and unresolved approvals.
4. Record integration, scan, notification, and manual-intervention exceptions.
5. Remove locally retained customer documents under approved disposal rules.
6. Collect permitted prints and clear the desk.
7. Close proof viewers and protected tabs.
8. Select **Logout**.
9. Complete the [Daily Back Office Checklist](DAILY-BACK-OFFICE-CHECKLIST.md).

**Expected result:** Work is owned, exceptions are visible, private material is secured, and the session is closed.

### Related documents

[Daily Back Office Checklist](DAILY-BACK-OFFICE-CHECKLIST.md) and [SLA, overdue work, and escalation](#24-sla-overdue-work-and-escalation).

## 30. Incident and service degradation procedures

### Purpose

Keep customer and financial records safe when part of VirtCruise is unavailable or unreliable.

### Respond to degradation

1. Stop the affected mutation and preserve the visible safe request reference and timestamp.
2. Determine whether the issue affects one case, one role, one page, or the wider service.
3. Check approved operational announcements and incident status.
4. Do not switch to personal email, local documents, direct data edits, or unapproved bank instructions.
5. Record the last authoritative state and whether the outcome is certain or ambiguous.
6. Escalate using [Appendix E](#appendix-e-escalation-matrix-template).
7. Use approved customer delay wording without promising a recovery time.
8. After recovery, refresh authoritative state before resuming.

### Specific safe responses

- **Queue unavailable:** stop case mutations; use approved incident/handover tracking only.
- **Proof viewer unavailable:** do not download through another route; pause review.
- **Financial Portal unavailable:** do not infer payment from proof or bank message.
- **Booking projection delayed:** do not force confirmation.
- **Email delivery uncertain:** do not resend blindly.
- **Expired sign-in:** sign in again, then refresh the case.

Technical diagnosis, infrastructure commands, deployment, database repair, and production configuration belong in future DOC-010.

**Expected result:** Degradation is contained, no duplicate action is introduced, and recovery begins from authoritative state.

### Related documents

[Integration and projection exceptions](#23-integration-and-projection-exceptions), [Notifications and delivery failures](#22-notifications-and-delivery-failures), and future DOC-010.

## 31. Role-based quick procedures

### Purpose

Give each audience the shortest safe path to its common outcome.

### Finance Officer — complete one review

1. Check **Review Queue** and open an eligible case.
2. Select **Assign to me**, confirm current accepted/clean proof, and select **Start review**.
3. View proof securely and verify cleared funds independently.
4. Complete [Appendix B](#appendix-b-approval-checklist) or [Appendix C](#appendix-c-rejection-checklist).
5. Decide once, refresh, and verify downstream consequences.

### Finance Supervisor — control the queue

1. Review authoritative status totals and all relevant server pages.
2. Identify unassigned, overdue, ambiguous, and manual-intervention work.
3. Resolve ownership and policy questions.
4. Escalate integration, security, or delivery failures.
5. Complete start/end-of-day handover controls.

### Consultant — answer a customer status question

1. Verify the customer and reference through an authorised source.
2. Distinguish quote, booking, payment, review, and notification status.
3. Do not enter the Finance portal or imply Finance mutation rights.
4. Use DOC-002 wording and refer payment verification to Finance.

### Administrator — handle access or exception coordination

1. Confirm the operator's approved role and task.
2. Do not use Administrator access as a substitute for Finance authority.
3. Preserve access-denial details without authentication data.
4. Coordinate with Finance, Security, or Technical Operations.

### Operations/Support Supervisor — coordinate a customer-impacting exception

1. Confirm the authoritative business state.
2. Assign the internal owner and safe reference.
3. Use approved customer wording.
4. Track the incident without proof or unnecessary financial data.
5. Confirm resolution before closing communication.

### Content Editor — shared operational control

1. Follow confidentiality and incident controls in this manual.
2. Do not perform Finance actions.
3. Use future DOC-005 for Content Studio work.

**Expected result:** Each role completes only its authorised portion and hands off correctly.

### Related documents

[Back Office Role Matrix](BACK-OFFICE-ROLE-MATRIX.md) and future DOC-004 through DOC-006.

## 32. Frequently asked operational questions

### Purpose

Resolve common operating questions quickly. Full procedures and approved policy remain authoritative.

### Access and roles

1. **Who can enter the Finance Operations Portal?**
   Accepted access includes Finance, Administrator, or an account with an accepted bank-transfer review/admin permission. Business authority still applies.
2. **Can a Consultant enter Finance operations?**
   No. Accepted evidence denies the Consultant Finance route and mutations.
3. **Does Administrator access make someone a Finance Officer?**
   No. It does not waive Finance policy, assignment, attestation, or segregation controls.
4. **What should I do after an expired sign-in?**
   Sign in again through the approved route, return to the case, and refresh it.
5. **What does access denied mean?**
   Your current role or permission does not authorise the route or action. Stop and contact the access owner.
6. **May I use a colleague's account to finish urgent work?**
   No. Escalate the access or ownership problem.
7. **How do I report suspected account compromise?**
   Stop using the account and report it immediately through the approved Security route without sending credentials.

### Queues and assignment

8. **Are My Assigned Cases and Unassigned Cases global?**
   No. They narrow only the currently loaded server page.
9. **How do I see all matching cases?**
   Use server status filtering, supported sorting, pagination, and authoritative totals.
10. **Can I assign a case to another reviewer?**
    No reviewer directory or assign-to-other control is released; assignment is to self.
11. **What if another Finance Officer assigns the case first?**
    Refresh and review the authoritative owner; do not repeat the assignment blindly.
12. **Can I unassign a terminal case?**
    No terminal operations are offered. Follow policy for escalation.
13. **When can I select Start review?**
    When the case is assigned appropriately, status is `PROOF_RECEIVED`, and current proof is accepted and clean.
14. **What if the overdue view is empty but totals suggest work exists?**
    Review additional server pages and sort by SLA; the view is page-local.
15. **Where are exact SLA times defined?**
    In approved Finance Operations Policy and configuration, not this manual.

### Proof viewing and security

16. **Which proof formats can be viewed?**
    Accepted, clean PDF, JPEG, and PNG.
17. **Can I open quarantined or scanning proof?**
    No. Wait for an accepted clean outcome.
18. **Does clean scanning prove the transfer is genuine?**
    No. It addresses current malware/type checks only.
19. **Can I download proof to my personal device?**
    No, unless explicit approved policy permits a controlled business need.
20. **Can I email proof to another reviewer?**
    Not through ordinary email or messaging. Use approved access and escalation.
21. **What if proof metadata exists but the file is missing?**
    Stop review and escalate the storage exception; do not use an outside copy.
22. **Which proof should I use after replacement?**
    The current accepted proof in the new cycle, never the superseded original.
23. **May I approve from a convincing bank image?**
    No. Independently verify cleared funds.

### Approval and rejection

24. **Must a case be assigned before approval?**
    Yes. Follow assignment and review-start controls first.
25. **What does cleared-funds attestation mean?**
    You personally confirm the approved independent check established that funds cleared in the correct account and match amount and currency.
26. **Is approval the same as a Payment?**
    No. Approval is an operational event; downstream processing creates the Financial record.
27. **What if approval times out?**
    Refresh and inspect authoritative state and downstream status. Do not approve again blindly.
28. **What if approval and rejection conflict?**
    Refresh. One terminal result wins; act from that state and escalate if unclear.
29. **Can I reject without a reason?**
    No. A factual internal reason is required.
30. **Should the customer see the internal rejection reason?**
    No. Use only the bounded customer-safe reason.
31. **Can I accuse a customer of fraud in the rejection message?**
    No. Pause and escalate to Security; use only authorised wording.
32. **Can I change an approved or rejected decision?**
    Terminal decisions are immutable through released operations.
33. **Should I submit the decision repeatedly after a 409 conflict?**
    No. Refresh and review the current state.

### Replacement and cycles

34. **Is replacement always available after rejection?**
    No. It must be explicitly permitted and lifecycle-eligible.
35. **How many replacements are accepted?**
    One under the accepted conservative policy.
36. **What is the replacement deadline?**
    Seven days in the accepted lifecycle; use the explicit case deadline.
37. **Can replacement change the amount or transfer?**
    No. It is proof-only.
38. **What happens to the original proof?**
    It remains immutable and becomes superseded.
39. **Does the SLA restart?**
    The review-cycle SLA restarts for the new proof; use policy-owned timing.
40. **Can an approved, expired, or cancelled case reopen?**
    No.
41. **Can customers replace proof in Manual Finance Mode?**
    Not through the website. Self Service controls are unavailable in production Manual Finance Mode.

### Payments, receipts, and booking

42. **What should appear after successful approval processing?**
    One Payment, exact allocation, one Receipt, balanced Ledger effect, updated summaries, milestone evaluation, and eligible notifications.
43. **Why has a Payment not appeared immediately?**
    Downstream processing can be eventual. Check operations state and escalate within policy.
44. **Should I approve again if the Payment is missing?**
    No. Check the approved case and integration state first.
45. **What happens after a partial payment?**
    Record the exact amount, allocate it, issue one Receipt, retain the remaining balance, and avoid premature confirmation.
46. **Can a partial payment leave the booking Deposit Pending?**
    Yes, depending on booking and deposit policy.
47. **What happens after final payment?**
    Cumulative allocation can pay the invoice and permit lawful booking confirmation after milestone evaluation.
48. **How many Receipts should 2 distinct payments create?**
    One Receipt per Payment: 2 Payments produce 2 Receipts.
49. **Does a paid invoice guarantee booking confirmation?**
    No. Confirm the authoritative booking milestone.
50. **Can staff edit a Payment, allocation, Receipt, or Ledger entry in the portal?**
    No.

### Notifications, privacy, and escalation

51. **Can I resend a notification marked uncertain?**
    Not until authoritative delivery state is checked and controlled resend is approved.
52. **Where is the notification-operations screen?**
    No such staff screen is released in v0.7.0; use approved monitoring and future guidance.
53. **What if a customer says no Receipt email arrived?**
    Confirm the Receipt and notification intent/attempt state, then escalate; do not expose internal message details.
54. **Can I put proof details in an incident ticket?**
    Use only the minimum safe reference unless an approved secure process explicitly requires more.
55. **What if I see another customer's data?**
    Stop viewing, preserve a safe incident reference, and report a privacy/security incident immediately.
56. **Can I take a screenshot for Support?**
    Only under approved policy and DOC-001 masking standards, with a second privacy inspection.
57. **What should an internal comment contain?**
    Observable facts, checks, action, next owner, and time—no unnecessary sensitive data or speculation.
58. **Who owns a scan failure?**
    Pause Finance review and escalate through approved Security/Technical Operations routes.
59. **What should I tell a customer during a processing delay?**
    State that processing continues, avoid an unapproved promise, and use Appendix G wording.
60. **What should happen at shift end?**
    Hand over assigned work, escalate overdue items, remove local documents, close viewers, and log out.

**Expected result:** Staff find a concise safe action and follow the full linked procedure when required.

### Related documents

[Common operational errors](#28-common-operational-errors) and [Daily Back Office Checklist](DAILY-BACK-OFFICE-CHECKLIST.md).

## 33. Glossary

### Purpose

Use consistent business terms across Operations, Finance, Support, and customer communication.

| Term | Business-friendly definition |
|---|---|
| Allocation | The amount of a recorded Payment applied to a particular invoice. |
| Audit Trail | The immutable record of who performed an operational action, what occurred, and when. |
| Cleared Funds | Money independently verified as received and available in the correct approved bank account. Proof alone does not establish this. |
| Confirmed | The booking status reached after lawful booking milestone evaluation; it is separate from review approval and invoice payment. |
| Current Proof | The one proof document eligible for the active review cycle after accepted scanning. |
| Deposit Pending | A booking stage in which a required deposit has not yet satisfied the applicable policy and authoritative record. |
| Idempotency | Protection that lets the same logical operation be recognised so an uncertain repeat does not create a second effect. Operators still refresh before retrying. |
| Integration Execution | Controlled downstream work that translates an approved review into Financial consequences. |
| Ledger | The balanced Financial record of debits and credits created by authorised processing. It is not editable in the released portal. |
| Manual Finance | Production mode in which customers contact Finance for approved bank instructions and cannot create review cases or upload proof through the website. |
| Manual Intervention | A controlled state requiring an authorised person to investigate or recover work that automation cannot safely finish. |
| Notification Intent | The authoritative record that a business event requires a message to be prepared and delivered. |
| Optimistic Conflict | A conflict showing that another operator changed the record after it was loaded; refresh before acting. |
| Outbox | A controlled queue of committed business events awaiting downstream processing or delivery. |
| Payment | The authoritative Financial record created after eligible funds and approved processing are recorded. |
| Projection | Updating a customer or booking view from an authoritative completed business event. |
| Quarantine | Isolation of uploaded proof while security and type checks are incomplete or unsafe. |
| Receipt | The Financial record issued for one eligible recorded Payment. |
| Review Case | The customer-owned operational record connecting a transfer claim, invoice, booking, proof, reviewer, SLA, and decision. |
| Review Cycle | One immutable round of proof submission and Finance decision. An accepted replacement creates a second cycle. |
| Self Service | Conditional mode in which an eligible customer can see bank instructions, create a review case, and upload proof. It is not active in production Manual Finance Mode. |
| Service Level Agreement (SLA) | The policy-owned target and due marker for operational work. Exact values are not defined in this manual. |
| Superseded Proof | An earlier proof retained in history but no longer eligible for the current decision. |

**Expected result:** Staff distinguish operational evidence, financial records, booking state, and delivery processing.

### Related documents

DOC-002, “Glossary,” and future DOC-007.

## 34. Appendices

### Purpose

Provide concise controlled references without duplicating future DOC-004 or DOC-007.

### Appendix A — Status reference summary

| Family | Non-terminal examples | Terminal examples | Key rule |
|---|---|---|---|
| Review case | `NEW`, `AWAITING_UPLOAD`, `AWAITING_REPLACEMENT`, `PROOF_RECEIVED`, `UNDER_REVIEW` | `APPROVED`, `REJECTED`, `EXPIRED`, `CANCELLED` | Use only controls offered by authoritative state |
| Proof | `QUARANTINED`, `SCANNING` | `ACCEPTED`, `REJECTED`, `SUPERSEDED`, `SCAN_FAILED`, `DELETED`, `EXPIRED` as lifecycle outcomes | Open only current `ACCEPTED` + `CLEAN` PDF/JPEG/PNG |
| Booking | `DEPOSIT_PENDING`, `DEPOSIT_RECEIVED`, and other active milestones | `COMPLETED`, `CANCELLED`, `REFUNDED` in customer views | Never set from review status; follow milestone evaluation |
| Notification | retry, uncertain, or manual-intervention categories | delivered, failed, cancelled, or suppressed where supported | Check authoritative delivery state before resend |

Future DOC-007 becomes the authoritative full lifecycle reference.

### Appendix B — Approval checklist

- [ ] Assigned to the authorised reviewer and status `UNDER_REVIEW`.
- [ ] Correct customer, booking, invoice, currency, amount, reference, and destination account.
- [ ] Current-cycle proof is accepted, clean, and not superseded.
- [ ] Cleared funds independently verified.
- [ ] No duplicate Payment, duplicate decision, or unapproved overpayment.
- [ ] No unresolved fraud, malware, ownership, or privacy concern.
- [ ] Factual approval reason entered.
- [ ] Cleared-funds attestation read and true.
- [ ] Decision submitted once and terminal result confirmed.
- [ ] Downstream Payment, allocation, Receipt, Ledger, booking, and notifications checked.

### Appendix C — Rejection checklist

- [ ] Assigned reviewer and correct case confirmed.
- [ ] Current proof and current cycle identified.
- [ ] Factual rejection ground supported by approved policy.
- [ ] Internal reason excludes unnecessary sensitive data and speculation.
- [ ] Customer-safe reason reveals no internal investigation detail.
- [ ] Replacement offered only when explicitly eligible.
- [ ] Decision submitted once and refreshed state confirmed.
- [ ] Customer communication and escalation recorded as required.

### Appendix D — Replacement checklist

- [ ] Finance policy explicitly permits replacement.
- [ ] First cycle is eligible; not approved, expired, cancelled, financially completed, or otherwise closed.
- [ ] Only one replacement is permitted.
- [ ] Explicit deadline is within the accepted 7-day window.
- [ ] Transfer, amount, currency, booking, invoice, and reference do not change.
- [ ] First cycle remains immutable and first proof becomes superseded.
- [ ] New proof is current, accepted, and clean before review.
- [ ] Second-cycle SLA is used.
- [ ] All approval/rejection checks are repeated.
- [ ] No Financial effect exists before second approval.

### Appendix E — Escalation matrix template

| Issue | Severity/policy priority | Primary owner | Backup owner | Approved route | Safe references | Next review time |
|---|---|---|---|---|---|---|
| Finance review/SLA | `[policy]` | Finance Supervisor | Operations Lead | `[route]` | Case reference | `[time zone]` |
| Access/permission | `[policy]` | Administrator | Security | `[route]` | User and request reference | `[time zone]` |
| Customer impact | `[policy]` | Support Supervisor | Operations Lead | `[route]` | Booking/case reference | `[time zone]` |
| Integration/availability | `[policy]` | Technical Operations | Finance Supervisor | `[route]` | Execution/request reference | `[time zone]` |
| Security/privacy | `[policy]` | Security/Privacy contact | Business Owner | `[route]` | Incident reference only | `[time zone]` |

### Appendix F — Daily checklist

Use the controlled [Daily Back Office Checklist](DAILY-BACK-OFFICE-CHECKLIST.md). Do not copy it into local or personal documents.

### Appendix G — Safe customer wording

| Situation | Approved-style wording |
|---|---|
| Proof received | “We have received your document. This does not yet mean that payment has been verified.” |
| Under review | “Finance is reviewing the information and independently checking the funds.” |
| Rejected | “We could not complete verification using the current document. Please follow the next instructions shown or provided through the approved route.” |
| Replacement requested | “You may provide one replacement document by the deadline shown. The transfer details must not change.” |
| Payment recorded | “Finance has verified and recorded the payment. You can review the Payment in your Financial Portal.” |
| Receipt available | “A Receipt has been issued for the recorded Payment and is visible in your Financial Portal.” |
| Booking confirmed | “Your booking now shows as Confirmed. Please review the current booking details and direct communications.” |
| Processing delay | “Processing is taking longer than expected. Your reference remains under review; we will provide an update through the approved contact route.” |
| Technical incident | “A service issue is affecting this task. Your existing record remains under controlled review; please do not submit or pay again unless Finance instructs you.” |

Wording requires owner approval and must be adapted only to the verified authoritative state.

### Appendix H — Screenshot capture register

| Figure | Subject | Role and route | Required state | Views | Dependency/status |
|---:|---|---|---|---|---|
| 1 | Staff operations journey | Finance; protected entry | No customer data | Desktop/Tablet/Mobile | WEB-006, pending |
| 2 | Staff sign-in | Finance; `/signin/` | Empty form | Desktop/Tablet/Mobile | Authentication UI, pending |
| 3 | Finance Overview | Finance; `/finance/` | Fictional totals | Desktop/Tablet/Mobile | DEV-005D/WEB-006, pending |
| 4 | Start-of-day overview | Supervisor; `/finance/` | Aggregate status | Desktop/Tablet | DEV-005D/WEB-006, pending |
| 5 | Review detail/proof viewer | Finance; case detail | Under review, accepted/clean PDF | Desktop/Tablet/Mobile | DEV-005D/WEB-006, pending |
| 6 | Review Queue | Finance; queue | Mixed fictional cases | Desktop/Tablet/Mobile | DEV-005D/WEB-006, pending |
| 7 | Assigned/unassigned/overdue | Supervisor; queue routes | Page-local limitation | Desktop/Mobile | DEV-005D/WEB-006, pending |
| 8 | Internal comment | Finance; case detail | Empty comment form | Desktop/Tablet | DEV-005D/WEB-006, pending |
| 9 | Approval dialog | Finance; case detail | Under review | Desktop/Tablet/Mobile | DEV-005D/WEB-006, pending |
| 10 | Rejection dialog | Finance; case detail | Under review | Desktop/Tablet/Mobile | Replacement acceptance/WEB-006, pending |
| 11 | Replacement request | Finance; decision | Eligible replacement | Desktop/Tablet/Mobile | Self Service activation/WEB-006, conditional |
| 12 | Cycle history | Finance; future route | 2 immutable cycles | Desktop/Tablet | Future functionality |
| 13 | Financial outcome | Finance/Operations; approved source | Payment/allocation/Receipt | Desktop/Tablet/Mobile | Approved staff view, pending |
| 14 | Notification operations | Operations; future route | Retry/failure states | Desktop/Tablet | Future functionality |
| 15 | Integration operations | Operations; future route | Pending/quarantined/manual | Desktop/Tablet | Future functionality |
| 16 | Responsive mobile queue | Finance; queue | Fictional paged cards | Mobile 390 × 844 | DEV-005D/WEB-006, pending |

All captures use approved non-production fictional data, 100% zoom, English locale, supported browser, and DOC-001 profiles. Record build, theme, locale, capture date, and reviewer. Opaque-mask unavoidable sensitive values, flatten, remove metadata where needed, and obtain a second-person privacy inspection.

> **Figure 16 placeholder — Responsive mobile queue**
> Role: Finance Officer. Route: `/finance/bank-transfers/`. State: fictional page-local queue cards.
> Masking: all identifiers, references, amounts, and reviewer values fictional. Required view: Mobile 390 × 844; desktop/tablet are covered by Figure 6. Dependency: DEV-005D and WEB-006.

**Expected result:** Appendices provide safe point-of-work summaries while policy and authoritative lifecycle sources retain control.

## Related documents

- [DOC-001, *VirtCruise Documentation Architecture*](../documentation/DOCUMENTATION-ARCHITECTURE.md)
- [DOC-002, *VirtCruise Customer User Guide*](../customer/CUSTOMER-USER-GUIDE.md)
- [DOC-003-DC, *Daily Back Office Checklist*](DAILY-BACK-OFFICE-CHECKLIST.md)
- [DOC-003-RM, *Back Office Role Matrix*](BACK-OFFICE-ROLE-MATRIX.md)
- [Finance Operations Portal](../FINANCE-OPERATIONS-PORTAL.md)
- [Financial Portal](../FINANCIAL-PORTAL.md)
- [Manual Finance Launch Mode](../MANUAL-FINANCE-LAUNCH-MODE.md)
- [Bank Transfer Commercial Qualification](../BANK-TRANSFER-COMMERCIAL-QUALIFICATION.md)
- [Operations documentation index](README.md)

## Scope exclusions and future manuals

DOC-003 does not replace:

- DOC-004, Finance Standard Operating Procedures;
- DOC-005, Content Studio User Guide;
- DOC-006, Customer Support Playbook;
- DOC-007, Status & Lifecycle Reference;
- DOC-009, Training Manual; or
- DOC-010, Production Handover Guide.

This manual contains no production credentials, raw Structured Query Language, private keys, unapproved server addresses, code-level implementation guidance, database table names, developer troubleshooting, or infrastructure deployment commands.

## Review record

| Gate | Responsible role | Decision | Date | Evidence/notes |
|---|---|---|---|---|
| Author self-review | Documentation Lead | Complete | 2026-08-03 | Structure, role, status, privacy, terminology, links, and PDF checked |
| Product accuracy review | Product Owner | Pending | — | Validate v0.7.0 and accepted Sprint 3.7 behavior |
| Finance operational review | Finance Lead | Pending | — | Validate policy hand-offs, decisions, and wording |
| Operations/Support review | Operations and Support Leads | Pending | — | Validate daily control and escalation use |
| Security/privacy review | Security/Privacy Lead | Pending | — | Validate proof and data-handling boundaries |
| Business approval | Business Owner | Pending | — | Required before internal operational publication |
| Publication | Publisher | Pending | — | Confirm NDA and role-based access before distribution |

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial Back Office Operations Manual for internal review | Draft — Internal Review |
