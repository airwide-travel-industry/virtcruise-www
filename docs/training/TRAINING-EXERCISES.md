# VirtCruise Training Exercises and Practical Labs

| Field | Value |
|---|---|
| Document ID | DOC-009-EX |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted behavior through v0.7.0 |
| Status | Draft |
| Owner | Learning and Development Lead |
| Classification | Confidential — VirtCruise Internal Training |
| Last reviewed | 2026-08-03 |

## 1. Exercise rules

Use only the fictional records in this pack and an authorised non-production environment or tabletop. The exercise gives no production permission. Learners may consult DOC-002–DOC-008 during guided practice; assessors control materials during summative use.

For every response, record: owning object and authoritative state; verified facts; missing information; actor authority; safe next action; prohibited action; escalation owner/trigger; customer-safe wording; and evidence of completion. DOC-007 owns lifecycle meaning.

## 2. Fictional training dataset

| Record | Fictional value |
|---|---|
| Customer | Amina Dube, `amina.dube@example.com`, customer `VC-C-TRAIN-0042` |
| Quote | `VC-Q-TRAIN-1042`, Cape Town, `QUOTED`, ZAR 10,000 |
| Booking | `VC-B-TRAIN-2042`, `DEPOSIT_PENDING` |
| Invoice | `VC-I-TRAIN-3042`, ZAR 10,000, allocated ZAR 4,000, outstanding ZAR 6,000 |
| Review case | `VC-R-TRAIN-4042`, current exercise state varies |
| Proof | `VC-P-TRAIN-5042`, PDF, proof/scan state varies |
| Payment | `VC-PAY-TRAIN-6042`, ZAR 4,000, transfer reference `TRN-TRAIN-7042` |
| Receipt | `VC-REC-TRAIN-8042` |
| Package | `VC-PKG-TRAIN-9042`, version state varies |
| Support case | `VC-SUP-TRAIN-0142` |

These values are teaching artifacts, not thresholds, prices, service levels, or production identifiers.

## 3. Scenario exercises

### EX-01 — Customer forgot password

**Roles:** Support, Administrator. **Time:** 15 minutes. **Sources:** DOC-002 password reset; DOC-005 sign-in/reset; Administrator/Support Quick Starts.

**Situation:** Amina says she cannot sign in and offers to send her password and latest reset link. The first reset email is old; a newer email may exist.

**Learner tasks:** Explain the safe flow; decline secrets; choose verification appropriate to any protected disclosure; capture a safe case note; identify when Support owns resolution and when Administrator/Security escalation is required.

**Expected decision:** Use **Forgot password**, newest valid one-time link, and one careful retry. Never receive or set the password. Escalate repeated valid-flow failure to Administrator; suspected compromise to Security.

**Evidence/rubric:** No secret requested/recorded (critical); exact safe guidance; minimum case note; correct owner; no unsupported promise.

### EX-02 — Customer asks about booking status

**Roles:** Customer Support, Consultant, Operations. **Time:** 20 minutes. **Sources:** DOC-002 booking status; DOC-003 booking review; DOC-005 booking support; DOC-007.

**Situation:** The customer says, “I accepted my quote and received an email, so why is my booking `DEPOSIT_PENDING`?” The Financial record shows no verified deposit.

**Learner tasks:** Identify each lifecycle; explain the status in plain English; state what the email proves; choose owner/action; write a two-sentence customer update.

**Expected decision:** Quote acceptance/email do not confirm booking. `DEPOSIT_PENDING` remains authoritative; Finance owns payment verification and Operations owns booking progression.

**Evidence/rubric:** No redefinition or promise; accurate separation; empathetic wording; exact references; acknowledged handoff if escalation is needed.

### EX-03 — Payment under review

**Roles:** Finance, Support, Operations. **Time:** 25 minutes. **Sources:** DOC-003 review/proof; DOC-004 assessment; DOC-007 sections 8–14.

**Situation:** Case `VC-R-TRAIN-4042` is `PROOF_RECEIVED`; proof is `ACCEPTED` and scan `CLEAN`; no reviewer is assigned. Customer asks whether payment is complete.

**Learner tasks:** State the eligible Finance sequence, safe customer wording, and records that must exist before claiming Payment Recorded or Booking Confirmation.

**Expected decision:** Authorised Finance assigns to self and may start review; proof does not establish funds. Customer is told Finance review is pending without internal details.

**Evidence/rubric:** Correct guards; no proof disclosure; no premature Financial/booking claim; correct owner.

### EX-04 — Customer disputes payment allocation

**Roles:** Finance, Support, Operations. **Time:** 30 minutes. **Sources:** DOC-004 partial payments/reconciliation; DOC-003 Financial operations; DOC-005 payment support.

**Situation:** One ZAR 4,000 Payment and Receipt exist; invoice total is ZAR 10,000 and outstanding is ZAR 6,000. Customer believes the invoice should be fully paid.

**Learner tasks:** Reconcile the fictional records, identify missing evidence, draft a Support response, and state what Finance must not edit directly.

**Expected decision:** Records show a partial payment unless another valid Payment/allocation exists. Investigate by exact reference; do not change an allocation or promise an outcome to match the claim.

**Evidence/rubric:** Arithmetic and lifecycle correct; customer claim treated respectfully; no direct edit; correct escalation record.

### EX-05 — Customer requests refund

**Roles:** Support, Consultant, Finance, Operations, Manager. **Time:** 25 minutes. **Sources:** DOC-002 customer Finance guidance; DOC-003 escalation; DOC-004 Finance boundaries; DOC-005 complaint handling.

**Situation:** Amina asks for an immediate refund and says she will complain publicly unless Support confirms it today. Booking is `CONFIRMED`; no approved refund decision is present.

**Learner tasks:** Conduct the conversation, collect minimum facts, identify policy/decision owners, avoid promises, and define next communication ownership.

**Expected decision:** Acknowledge impact, verify record, route cancellation/refund decision to Finance/Operations under policy, retain Support communication, and avoid promising eligibility, amount, or time.

**Evidence/rubric:** Empathy plus boundary; no coercive reaction; complete safe handoff; serious complaint escalation where applicable.

### EX-06 — Proof rejected

**Roles:** Finance, Support, Operations. **Time:** 25 minutes. **Sources:** DOC-004 rejection/replacement; DOC-003 proof handling; DOC-007 terminal/invalid transitions.

**Situation:** Review case is `REJECTED` with bounded reason “Reference does not match.” Customer asks to upload another proof immediately.

**Learner tasks:** Identify terminality, give safe wording, decide whether replacement can be offered, and preserve immutable history.

**Expected decision:** Accepted backend `REJECTED` is terminal; do not promise or fabricate `AWAITING_REPLACEMENT`. Escalate a policy question without reopening or changing the case.

**Evidence/rubric:** Terminal rule correct (critical); bounded reason only; no new upload route invented; correct owner.

### EX-07 — Notification delayed

**Roles:** Support, Operations, Administrator. **Time:** 20 minutes. **Sources:** DOC-003 notifications; DOC-005 notifications; DOC-007 notification lifecycle.

**Situation:** Booking is authoritatively `CONFIRMED`, an eligible notification intent exists, but delivery outcome is uncertain. Customer has not received email.

**Learner tasks:** Separate booking from notification; decide whether to resend; create an Operations escalation and customer update.

**Expected decision:** Booking remains confirmed. Inspect authoritative attempt state; never blindly resend or bypass suppression. Tell the customer verified booking facts and that delivery is being checked.

**Evidence/rubric:** No duplicate send; no exposure of recipient/message internals; owner/timestamps/references captured.

### EX-08 — Package requires update

**Roles:** Content Editor, Approver. **Time:** 30 minutes. **Sources:** DOC-006 drafts/versions/pricing/media/SEO; DOC-007 publication lifecycle.

**Situation:** Published package version 3 has outdated customer copy. Version 3 must remain historically accurate. Approved replacement text and image rights are available.

**Learner tasks:** Plan safe correction, identify new version/state, complete content checks, and specify review/publication steps.

**Expected decision:** Derive version 4 `DRAFT`, edit/preview/check, submit to independent review, then schedule/publish. Never edit version 3 in place.

**Evidence/rubric:** Immutable history; rights/accessibility/pricing/SEO considered; independent approval; public verification.

### EX-09 — Content publication mistake

**Roles:** Content Editor, Approver, Operations, Manager. **Time:** 30 minutes. **Sources:** DOC-006 retirement/restoration/troubleshooting; DOC-003 incident handling; DOC-007.

**Situation:** A published package has a materially wrong departure description. A prior retained version is accurate. There is no evidence of customer data exposure.

**Learner tasks:** Protect customers, identify incident/owner, choose retirement/correction path, draft customer-safe internal service wording, and define verification.

**Expected decision:** Use the approved retirement/publication workflow; derive a new draft from a retained source for restoration/correction; do not republish retired content in place or direct-edit projection.

**Evidence/rubric:** Fast protection without bypass; immutable versioning; owners/impact; public projection checked.

### EX-10 — System unavailable

**Roles:** All staff, Operations, Administrator, Support, Manager. **Time:** 30 minutes. **Sources:** DOC-003 incidents; DOC-005 outages; role Quick Starts.

**Situation:** Several staff and customers report unavailable booking detail. A Finance decision is pending and travel begins tomorrow. No approved root cause exists.

**Learner tasks:** Record incident facts, prioritise impact, pause unsafe work, assign owners, write an approved holding update, and plan handover/recovery verification.

**Expected decision:** Technical Operations owns service recovery; Operations coordinates; Support communicates. Finance does not decide from stale/offline data. Do not diagnose publicly or invent a service level.

**Evidence/rubric:** Safe incident record; travel/financial impact; no blind retry; clear owners; end-to-end recovery criteria.

### EX-11 — Suspicious proof and fraud claim

**Roles:** Finance, Support, Operations, Security. **Time:** 25 minutes. **Sources:** DOC-003 fraud/security; DOC-004 proof/fraud; DOC-005 security.

**Situation:** Proof metadata shows `SCAN_FAILED`. A colleague says the customer “must be committing fraud” and asks Finance to download the file elsewhere.

**Learner tasks:** Stop unsafe action, correct the claim, preserve safe evidence, and escalate.

**Expected decision:** Keep file closed; scan failure is not fraud proof. Escalate to Security/Technical Operations using metadata/reference only; do not download, forward, accuse, or decide from appearance.

**Evidence/rubric:** All critical controls met; neutral language; minimum evidence; correct urgent route.

### EX-12 — Cross-customer privacy exposure

**Roles:** All staff, Support, Administrator, Security/Privacy, Manager. **Time:** 25 minutes. **Sources:** DOC-002–DOC-006 privacy sections and approved Privacy policy.

**Situation:** A customer reports seeing another customer's booking reference and itinerary details. The reporter has taken a screenshot.

**Learner tasks:** Stop further exposure, communicate safely, collect minimum facts, preserve evidence without redistribution, and escalate immediately.

**Expected decision:** Treat as privacy incident; do not ask the customer to circulate the screenshot or investigate other records. Security/Privacy owns incident response; Support retains safe customer communication.

**Evidence/rubric:** Immediate escalation (critical); no further disclosure; UTC facts/route/reference/impact; no blame or unsupported scope claim.

## 4. Practical labs

### LAB-01 — Locate customer, quote, and owned route

**Roles:** Support, Consultant. **Duration:** 30 minutes. **Outcome:** Find the fictional customer/quote only through an approved training source and explain the next customer action.

1. Verify the fictional caller using the trainer-provided result.
2. Locate `VC-Q-TRAIN-1042`; record state and customer ownership.
3. Check dates, travellers, services, value/currency, and customer-visible notes.
4. Identify whether an acceptance action is eligible; do not execute if the lab is tabletop.
5. Produce a safe case note and explain the next action.

**Pass evidence:** Correct owned record, no excess data, correct DOC-007 interpretation, no promise of confirmation.

### LAB-02 — Locate booking and interpret lifecycle

**Roles:** Support, Consultant, Operations. **Duration:** 30 minutes. **Outcome:** Explain `DEPOSIT_PENDING` using related quote/Financial facts without cross-lifecycle inference.

1. Locate `VC-B-TRAIN-2042` by exact reference.
2. Record booking state, quote context, invoice outstanding, and latest notification separately.
3. Identify owning role for each unanswered question.
4. Draft customer wording and an Operations handoff.

**Pass evidence:** Authoritative state preserved; no “email means confirmed” claim; exact owners/actions.

### LAB-03 — Review payment and case status

**Roles:** Finance, Operations. **Duration:** 40 minutes. **Outcome:** Determine whether a fictional case can start review and whether payment is recorded.

1. Refresh case and proof metadata.
2. Check assignment, case state, proof state, scan state, format, amount/currency/reference.
3. Compare the independent fictional clearing record.
4. State eligible next action and prohibited actions.

**Pass evidence:** Case/proof/Payment distinguished; unsafe proof remains closed; no payment inferred.

### LAB-04 — Approve or reject a sample case

**Roles:** Finance, Supervisor. **Duration:** 60 minutes. **Outcome:** Apply decision checklist to two variants without production effect.

Variant A matches and independently verifies cleared funds. Variant B has a currency mismatch. Assign/start as eligible; document decision reason; simulate one submission; handle a trainer-injected timeout by refreshing before any repeat.

**Pass evidence:** Approve A only; reject/stop B according to approved procedure; truthful attestation; immutable attempt; no duplicate.

### LAB-05 — Reconcile payment consequences

**Roles:** Finance, Operations. **Duration:** 45 minutes. **Outcome:** Reconcile fictional Payment, allocation, Receipt, Ledger, invoice, booking, and notification.

1. Match exact references and currency.
2. Recalculate allocated/unallocated/outstanding totals.
3. Confirm one Receipt and balanced Ledger effect.
4. Check booking milestone and notification separately.
5. Record mismatch escalation without direct edit.

**Pass evidence:** Arithmetic correct; partial/full meaning correct; booking not forced; named owner/next check.

### LAB-06 — Prepare and publish a package version

**Roles:** Content Editor, Approver. **Duration:** 60 minutes. **Outcome:** Simulate `DRAFT → IN_REVIEW → APPROVED → SCHEDULED/PUBLISHED` safely.

Use package `VC-PKG-TRAIN-9042`. Check structured content, fictional pricing, media rights/alternative text, SEO, accessibility, and preview. Submit as Editor; use a separate learner/role for independent review; schedule an unambiguous training instant or simulate publish now; verify fictional public projection.

**Pass evidence:** Only draft edited; version immutable after submission; approval independent; projection checked.

### LAB-07 — Restore a previous version

**Roles:** Content Editor, Approver. **Duration:** 40 minutes. **Outcome:** Correctly restore by derivation.

Given retired version 2 and flawed published version 3, protect public content through the approved retirement decision, derive version 4 `DRAFT` from retained version 2, update required facts, review independently, and verify the new projection.

**Pass evidence:** No `RETIRED → PUBLISHED` in-place transition; source history retained; new version fully checked.

### LAB-08 — Escalate and hand over correctly

**Roles:** All staff. **Duration:** 30 minutes. **Outcome:** Produce an acknowledged, minimum-necessary handoff.

Use one assigned scenario. Record safe reference, verification result, UTC time, facts/current state, impact/travel proximity, actions, prohibited/paused work, receiving owner, escalation reference, customer wording, next update, and residual risk. A peer acts as receiver and must ask one clarification before acknowledgement.

**Pass evidence:** Receiver can continue without exposing unnecessary data; communication ownership explicit.

### LAB-09 — Assess role and permission request

**Roles:** Administrator, Supervisor, Manager. **Duration:** 40 minutes. **Outcome:** Separate least-privilege technical access from business authority.

Compare two fictional requests: a Finance Officer with approved review need and an informal request for broad Administrator access “to help everywhere.” Check requester, owner approval, purpose, permissions, duration/review, segregation, audit reference, and downstream business controls.

**Pass evidence:** Legitimate request routed through approved process; broad request refused/clarified; no credentials recorded; Administrator not treated as Finance authority.

## 5. Facilitator debrief

Ask: What was authoritative? What was missing? What made the action legal or illegal? What customer impact mattered? Which manual owned the procedure? What evidence would change the decision? What must never appear in the handoff? A learner who safely stops for missing authority may outperform one who completes an unsafe action quickly.

## 6. Exercise completion record

| Exercise/lab | Date | Mode | Learner evidence reference | Critical error? | Result | Trainer initials |
|---|---|---|---|:---:|---|---|
|  |  | Guided / Tabletop / Non-production |  | Yes / No | Complete / Remediate |  |

## Related documents

- [Training Manual](TRAINING-MANUAL.md)
- [Training Assessments](TRAINING-ASSESSMENTS.md)
- [Training Certification](TRAINING-CERTIFICATION.md)
- [DOC-007 Status & Lifecycle Reference](../reference/STATUS-LIFECYCLE-REFERENCE.md)
- [DOC-008 Quick Start Guide Pack](../quickstart/QUICK-START-INDEX.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial scenario and lab pack | Draft |
