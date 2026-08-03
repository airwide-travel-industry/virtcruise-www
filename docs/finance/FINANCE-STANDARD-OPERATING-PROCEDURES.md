# VirtCruise Finance Standard Operating Procedures

| Field | Value |
|---|---|
| Document ID | DOC-004 |
| Version | 0.8.0-draft.1 |
| Source-system version | VirtCruise v0.7.0 and accepted Sprint 3.7 workstreams |
| Sprint | 3.7 |
| Status | Draft — Internal Review |
| Owner | Finance Manager |
| Intended approvers | Finance Director, Business Owner, Operations Manager, Security/Privacy Lead, Internal Audit |
| Classification | Confidential — VirtCruise Finance |
| Last reviewed | 2026-08-03 |

> **Warning:** This draft is for authorised Finance and assurance roles after non-disclosure agreement confirmation and role-based access approval. It defines proposed Finance controls for internal review; pending policy values are not approved operational authority.

## Contents

1. [Purpose](#1-purpose)
2. [Finance responsibilities](#2-finance-responsibilities)
3. [Segregation of duties](#3-segregation-of-duties)
4. [Manual Finance Mode](#4-manual-finance-mode)
5. [Receiving payment instructions](#5-receiving-payment-instructions)
6. [Bank account administration](#6-bank-account-administration)
7. [Payment verification](#7-payment-verification)
8. [Review case assessment](#8-review-case-assessment)
9. [Proof assessment](#9-proof-assessment)
10. [Approval decision](#10-approval-decision)
11. [Rejection decision](#11-rejection-decision)
12. [Replacement proof policy](#12-replacement-proof-policy)
13. [Partial payments](#13-partial-payments)
14. [Full payments](#14-full-payments)
15. [Receipts](#15-receipts)
16. [Booking Confirmation](#16-booking-confirmation)
17. [Reconciliation](#17-reconciliation)
18. [Notifications](#18-notifications)
19. [Fraud detection](#19-fraud-detection)
20. [Customer communication](#20-customer-communication)
21. [Privacy](#21-privacy)
22. [Audit](#22-audit)
23. [Escalation](#23-escalation)
24. [End-of-day controls](#24-end-of-day-controls)
25. [Month-end controls](#25-month-end-controls)
26. [Exception handling](#26-exception-handling)
27. [Policy-owned values](#27-policy-owned-values)
28. [Frequently asked Finance questions](#28-frequently-asked-finance-questions)
29. [Glossary](#29-glossary)
30. [Appendices](#30-appendices)

## 1. Purpose

### Purpose

These Standard Operating Procedures (SOPs) define how Finance makes safe, consistent, evidence-based decisions about customer payments. DOC-003 explains how authorised staff operate released controls; DOC-004 defines the business checks, authority, judgement, evidence, review, escalation, and assurance required around those actions.

### Scope

These SOPs govern:

- customer payment-instruction control in production Manual Finance Mode;
- bank-account governance without publishing real bank details;
- independent cleared-funds verification;
- review, proof, approval, rejection, and replacement policy;
- partial and full payment consequences;
- Receipts, booking milestone checks, reconciliation, notifications, fraud escalation, privacy, audit, and periodic controls.

They reflect VirtCruise v0.7.0 and accepted Sprint 3.7 evidence. They do not create software capability and do not authorise direct editing of financial or booking records.

### Five states Finance must distinguish

| State | Meaning | What it does not prove |
|---|---|---|
| Proof received | A document reached the controlled process | Authenticity, cleared funds, Payment, or confirmation |
| Cleared funds | The approved bank/reconciliation source shows money received and available in the correct account | That a Payment, allocation, Receipt, or booking update completed |
| Payment recorded | An authoritative Financial Payment exists | Full invoice settlement or Booking Confirmation |
| Receipt issued | One Receipt exists for an eligible recorded Payment | That all balances are settled or the booking is confirmed |
| Booking confirmed | The booking itself lawfully reached `CONFIRMED` | That every later travel obligation is complete |

### Non-authorisation

Finance must never assume that proof means payment, that approval means a Payment exists, that a paid invoice means a booking is confirmed, or that a visible system control grants business authority.

**Expected outcome:** Every Finance decision identifies its authoritative evidence, decision owner, and separate downstream outcomes.

### Related documents

[DOC-003, *Back Office Operations Manual*](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md), [Finance Checklists](FINANCE-CHECKLISTS.md), and [Finance Policy-Owned Values](FINANCE-POLICY-OWNED-VALUES.md).

## 2. Finance responsibilities

### Purpose

Define Finance accountability from instruction issuance through reconciliation and assurance.

### Finance Officer

- verify customer, booking, invoice, amount, currency, reference, destination account, and cleared funds;
- assess current proof and review cycle without treating proof as bank evidence;
- make decisions within the approved authority schedule;
- create factual internal reasons and customer-safe wording;
- monitor downstream results and escalate exceptions;
- preserve confidentiality and audit evidence.

### Finance Supervisor

- control assignment, workload, overdue items, handover, and decision quality;
- approve or review decisions required by the authority schedule;
- resolve policy interpretation and conflicts;
- coordinate fraud, privacy, integration, and notification escalation;
- review daily reconciliation and control exceptions.

### Finance Manager

- own these SOPs and the policy-owned-values register;
- maintain authority, bank-account, reconciliation, SLA, retention, and exception policies;
- approve periodic reconciliation and month-end evidence within authority;
- ensure segregation, staffing, training, access review, and audit remediation;
- recommend Self Service or multi-bank readiness to the Business Owner without activating it directly.

### Internal Auditor

- assess design and operation of controls independently;
- sample decisions and trace evidence without changing operational records;
- report exceptions through the approved assurance route;
- avoid becoming the operator or approver of sampled work.

### Operations Manager

- coordinate cross-team availability, exception ownership, handover, and customer impact;
- avoid making Finance decisions unless separately appointed and authorised;
- preserve Finance ownership of cleared-funds and payment decisions.

**Expected outcome:** Accountability is clear and no one performs a task solely because it is urgent.

### Related documents

[Segregation of duties](#3-segregation-of-duties) and [Escalation](#23-escalation).

## 3. Segregation of duties

### Purpose

Reduce error, fraud, concealment, and unauthorised change by separating incompatible duties.

### Minimum control principles

1. The person proposing a bank-account change must not be its sole approver and publisher.
2. The person verifying cleared funds may approve a review only within an approved authority schedule and any required dual-control threshold.
3. A person must not approve their own access, authority limit, bank-account change, exception waiver, or audit finding closure.
4. Reconciliation preparation and reconciliation approval must be separated where the approved control schedule requires it.
5. Refund initiation and approval must follow the future approved refund authority schedule.
6. Internal Audit must not operate, approve, or correct the transactions it audits.
7. Administrator access does not automatically create Finance decision authority.

### Conflict-of-interest response

1. Stop the decision when personal involvement, prior preparation, customer relationship, or other conflict could affect independence.
2. Record a bounded conflict declaration through the approved route.
3. Reassign the decision to an authorised independent officer.
4. Preserve the original evidence and audit trail.

> **Important:** Exact approval thresholds and dual-control conditions are pending policy-owned values. Consult [Finance Policy-Owned Values](FINANCE-POLICY-OWNED-VALUES.md); do not invent a threshold.

**Expected outcome:** No individual can create, approve, conceal, and reconcile the same high-risk change without an independent control.

### Related documents

[Audit](#22-audit), [Bank account administration](#6-bank-account-administration), and [Approval decision](#10-approval-decision).

## 4. Manual Finance Mode

### Purpose

Control the currently released production payment process and distinguish it from conditional future Self Service.

### Current production policy

Production launches in `MANUAL_FINANCE`. The customer contacts Finance using the approved route and quotes the booking or invoice reference and currency shown in their account. Finance verifies the context and supplies effective, approved bank instructions outside the customer self-service flow.

The customer website does not display bank account details, create a review case, or accept proof upload in this mode. Giving instructions, receiving a message, or viewing customer proof does not record a Payment and does not confirm a booking.

### Manual Finance decision flow

```text
Customer contacts Finance with reference and currency
        ↓
Finance verifies customer, booking, invoice, and approved account
        ↓
Finance supplies controlled effective-dated instructions
        ↓
Customer transfers through their bank
        ↓
Finance independently verifies cleared funds
        ↓
Authorised Financial recording and allocation process
        ↓
Receipt → booking milestone evaluation → customer notification
```

**Figure 1 — Manual Finance decision flow.** The system and business checks remain separate; the payment cannot progress from customer proof alone.

### Future functionality — Self Service

Conditional Self Service supports approved bank instructions, review-case creation, proof upload, and a conservative replacement lifecycle. It is not active in production. Activation requires an approved bank workbook, policy-owned values, operational readiness, segregation review, customer wording approval, monitoring, and a controlled change authorised by the Business Owner.

**Expected outcome:** Customers receive correct instructions, and Finance makes no payment or confirmation statement before independent verification and authoritative processing.

### Screenshot placeholder

> **Screenshot placeholder 1 — Manual Finance customer hand-off**
> Reference only; DOC-004 is not a software manual. Use fictional invoice reference, currency, and approved test contact data. Show no bank account number. Desktop, Tablet, and Mobile captures required after WEB-006 acceptance.

### Related documents

[DOC-002, “Manual Finance Mode”](../customer/CUSTOMER-USER-GUIDE.md#14-manual-finance-mode), [DOC-003, “Manual Finance Mode”](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md#10-manual-finance-mode), and [Receiving payment instructions](#5-receiving-payment-instructions).

## 5. Receiving payment instructions

### Purpose

Ensure the customer receives the correct bank instructions for the correct legal entity, currency, and effective date.

### Issue instructions

1. Receive the customer request through the approved Finance route.
2. Obtain the authoritative booking or invoice reference and currency.
3. Verify customer ownership through the approved source; do not rely on a displayed name alone.
4. Confirm the invoice is valid, outstanding, and eligible for bank transfer.
5. Select the bank instruction from the restricted approved account register by legal entity, currency, and effective date.
6. Have a second authorised person verify the instruction where the approved policy requires dual control.
7. Send the controlled template through the approved channel.
8. Ask the customer to use the exact reference and confirm that payment remains unrecorded until cleared funds are verified.
9. Record the instruction version or restricted policy reference, issue time, and officer according to policy.

### Finance must never

- copy bank details from memory, an earlier booking, personal notes, or an uncontrolled spreadsheet;
- give test-bank details;
- send an account for a different currency or legal entity;
- change instructions because a customer requests urgency;
- state that the booking is reserved or confirmed solely because instructions were issued.

**Expected outcome:** The customer receives one current, authorised instruction tied to the correct reference and currency.

### Related documents

[Bank account administration](#6-bank-account-administration), [Customer communication](#20-customer-communication), and [Fraud detection](#19-fraud-detection).

## 6. Bank account administration

### Purpose

Govern creation, change, approval, publication, and retirement of bank instructions without exposing real account details in this SOP.

### Required roles

| Control role | Responsibility | Must not be sole owner of |
|---|---|---|
| Proposer | Submits justified bank/account/currency change with effective date | Approval and publication |
| Verifier | Independently confirms bank evidence and legal-entity/currency ownership | Proposal |
| Approver | Accepts business and fraud risk under authority | Technical publication alone |
| Publisher/maintainer | Applies the approved effective-dated instruction through controlled change | Approval of their own change |
| Post-change reviewer | Confirms customer and reconciliation behavior after effective date | Original proposal where independence is required |

### Change process

1. Create a controlled change request without placing real account details in ordinary tickets or this repository.
2. Record legal entity, currency, purpose, reconciliation identifier, effective date, expiry/retirement date, source bank evidence, and rollback instruction in the restricted register.
3. Obtain independent verification directly through the approved bank/treasury route.
4. Obtain Finance and Business approval under the authority schedule.
5. Schedule publication through the controlled production-change process.
6. Communicate the cutover to Finance, Operations, Support, and affected approved customer channels.
7. Verify the new instruction and confirm the old instruction is no longer presented after the cutover.
8. Monitor reconciliation and fraud indicators.
9. Retain the superseded version and approval evidence.

### Multi-bank future

The accepted product can present currency-specific Self Service instructions after approved activation. Multi-bank routing, fallback, reconciliation identifiers, and effective dates remain policy-owned. Do not activate or publish them from this SOP.

> **Warning:** Never place real bank account numbers, international transfer codes, or restricted reconciliation identifiers in screenshots, ordinary messages, or this document.

**Expected outcome:** Every bank instruction is independently verified, approved, effective-dated, traceable, and safely retired.

### Screenshot placeholder

> **Screenshot placeholder 2 — Bank-account change control**
> Use a fully fictional register with masked values and recorded roles/effective dates. No production account data. Desktop capture only after Finance and Security approve the template.

### Related documents

[Policy-owned values](#27-policy-owned-values), [Segregation of duties](#3-segregation-of-duties), and future DOC-010.

## 7. Payment verification

### Purpose

Establish cleared funds independently and match them to the correct customer obligation.

### Mandatory verification

Finance must confirm all of the following through approved sources:

- the bank transaction is posted and cleared, not merely pending or advised;
- destination account is the approved account for the legal entity and currency;
- currency and cleared amount are exact;
- value/settlement date falls within relevant effective-date rules;
- transfer reference matches the authoritative booking/invoice reference;
- payer/customer context is consistent or an approved third-party-payer policy applies;
- the invoice exists, belongs to the customer, and has the applicable outstanding balance;
- the transaction is not already recorded, allocated, refunded, reversed, or under investigation;
- any partial, full, overpayment, unknown-payment, or currency-mismatch policy is satisfied.

### Finance must never assume

- a bank screenshot proves cleared funds;
- a proof file is genuine because it passed malware scanning;
- a familiar customer or amount can replace reference matching;
- same-day transfer means same-day settlement;
- a duplicate reference represents a second legitimate payment;
- an unexplained overpayment can be allocated automatically.

### Verification record

Record the approved bank/reconciliation reference, check time and time zone, officer, amount, currency, destination account identifier from the restricted register, and exception/escalation reference where required. Do not copy full bank data into general comments.

**Expected outcome:** Finance can demonstrate independently that the correct cleared funds exist before an approval or Financial record is permitted.

### Related documents

[Approval decision](#10-approval-decision), [Reconciliation](#17-reconciliation), and [Finance Checklists](FINANCE-CHECKLISTS.md#2-approval-checklist).

## 8. Review case assessment

### Purpose

Decide whether a review case is ready for Finance judgement and identify the authoritative cycle.

### Assess the case

1. Confirm the case was created through an authorised context; production Manual Finance customers cannot create one through the website.
2. Identify the current review status and whether it is terminal.
3. Confirm the assigned Finance Officer has authority and no conflict of interest.
4. Match customer, booking, invoice, amount, currency, destination account, and transfer reference.
5. Identify the current review cycle and current proof.
6. Check deadline, SLA, prior replacement use, and any fraud/privacy escalation.
7. Confirm independent bank/reconciliation evidence can be obtained.
8. Choose approval, rejection, replacement-eligible rejection, or escalation only after all mandatory facts are available.

### Status interpretation

`PROOF_RECEIVED` means evidence arrived; `UNDER_REVIEW` means Finance review started; `APPROVED` and `REJECTED` are review decisions; `EXPIRED` and `CANCELLED` close the case. None of these statuses alone creates or reverses a Payment.

**Expected outcome:** The officer reviews the right customer, obligation, transfer, and proof cycle under valid authority.

### Screenshot placeholder

> **Screenshot placeholder 3 — Finance review context**
> Reference the accepted DOC-003 case-detail capture with fictional identifiers and amounts. Include no real proof or bank detail. Desktop, Tablet, and Mobile after WEB-006.

### Related documents

[Proof assessment](#9-proof-assessment), [Approval decision](#10-approval-decision), and DOC-003, “Bank transfer review cases.”

## 9. Proof assessment

### Purpose

Use proof as supporting evidence while keeping cleared-funds verification independent.

### Assess current proof

1. Confirm the file is the current proof for the active review cycle.
2. Confirm it is accepted and clean before viewing.
3. Review legibility, apparent integrity, amount, currency, reference, payer details, destination details, transaction date, and consistency with the claim.
4. Compare the proof with the authoritative invoice and restricted approved bank-account record.
5. Compare separately with the cleared bank transaction.
6. Record only necessary factual observations.
7. Escalate altered, duplicate, suspicious, mismatched, or unsafe proof.

PDF, JPEG, and PNG are accepted viewable formats when clean. A clean scan means only that the scanner did not block the file under current controls. It does not authenticate a bank, prove a transfer, establish identity, or demonstrate settlement.

### Unacceptable evidence response

- Unreadable or incomplete: reject under approved wording and assess replacement eligibility.
- Mismatched: pause and assess fraud/escalation before deciding.
- Superseded: do not use; locate current proof.
- Scan failed/quarantined/missing: do not open; escalate technical/security handling.
- Proof absent in Manual Finance: follow approved Manual Finance evidence policy; do not solicit through an insecure channel.

**Expected outcome:** Proof supports but never replaces the bank/reconciliation source.

### Related documents

[Fraud detection](#19-fraud-detection), [Replacement proof policy](#12-replacement-proof-policy), and [Privacy](#21-privacy).

## 10. Approval decision

### Purpose

Approve only a fully matched, independently verified payment claim within authority.

### Mandatory checks

Finance must verify customer, booking, invoice, amount, currency, transfer reference, destination account, cleared funds, current proof, current review cycle, duplicate risk, exception policy, fraud indicators, and authority threshold. Use the controlled [Approval checklist](FINANCE-CHECKLISTS.md#2-approval-checklist).

### Decision standard

Approval is appropriate only when:

- all required facts agree;
- cleared funds are independently verified;
- current proof is acceptable where proof is part of the workflow;
- no unresolved fraud, privacy, duplicate, overpayment, or policy exception exists;
- required secondary approval is recorded; and
- the officer can state a concise factual reason and truthfully attest to verification.

### Approval wording

> **Example — requires Finance approval:** “Approved after independent verification of cleared funds in the authorised destination account. Customer, booking, invoice, reference, amount, currency, and current proof cycle match.”

Do not include full bank details or unnecessary customer data in the reason.

### Approval and consequence flow

```text
Finance approval decision
        ↓
Approved event committed
        ↓
Payment created → exact invoice allocation → one Receipt
        ↓
Balanced Ledger effect and payment summaries
        ↓
Booking milestone evaluation
        ↓
Eligible payment, Receipt, and confirmation notifications
```

**Figure 2 — Approval and downstream consequences.** Each consequence must be verified separately; processing can be eventual.

### After decision

Confirm one terminal approval, then monitor downstream processing. If the outcome is ambiguous, refresh and investigate; never submit a second approval blindly.

**Expected outcome:** One authorised approval produces one coherent, traceable downstream result without duplicate effects.

### Screenshot placeholder

> **Screenshot placeholder 4 — Approval attestation**
> Reference DOC-003 approval dialog using fictional case data and no real bank details. Desktop, Tablet, and Mobile after WEB-006.

### Related documents

[Payment verification](#7-payment-verification), [Partial payments](#13-partial-payments), and DOC-003, “Approving a bank transfer review.”

## 11. Rejection decision

### Purpose

Reject unsupported claims consistently while separating customer-safe wording from internal analysis.

### Valid rejection grounds

Subject to approved Finance policy, valid grounds can include:

- wrong customer, booking, or invoice;
- amount or currency mismatch;
- wrong or missing transfer reference;
- unapproved destination account;
- no independently verified cleared funds;
- duplicate or already processed transaction;
- unreadable, incomplete, inconsistent, or non-current proof;
- proof not accepted/clean;
- current cycle expired or otherwise ineligible;
- unresolved fraud/security concern requiring terminal handling.

These are policy examples, not an approved exhaustive reason-code list. Customer approval of wording may still be required.

### Decide and communicate

1. Complete the [Rejection checklist](FINANCE-CHECKLISTS.md#3-rejection-checklist).
2. Record a factual internal reason.
3. Determine replacement eligibility separately.
4. Use bounded customer-safe wording that describes the correctable issue without investigation details.
5. Choose terminal rejection when replacement is unauthorised or unsafe.
6. Confirm the final state and required notification/escalation.

> **Example — requires Finance approval:** “We could not verify the payment using the current information. Please use the approved Finance contact route and quote your booking reference.”

> **Example — requires Finance approval:** “The current document does not clearly show the required transfer reference. If your account offers replacement, submit one document by the displayed deadline.”

**Expected outcome:** Rejection is justified, auditable, private, and communicated without promising an unavailable remedy.

### Related documents

[Replacement proof policy](#12-replacement-proof-policy), [Customer communication](#20-customer-communication), and DOC-003, “Rejecting a bank transfer review.”

## 12. Replacement proof policy

### Purpose

Offer one controlled correction opportunity without changing the underlying transfer or erasing the first decision.

### Accepted policy

- one replacement only;
- customer deadline of 7 days from the eligible request;
- proof-only correction;
- first review cycle remains immutable;
- original proof becomes superseded;
- replacement becomes the current proof after accepted scanning;
- review SLA restarts for the second cycle under the approved SLA policy;
- all checks repeat independently; and
- no Financial consequence exists before successful approval.

### Eligibility decision

Replacement can be permitted only when the underlying transfer claim is unchanged, the issue can reasonably be corrected by proof alone, no previous replacement was used, the case is lifecycle-eligible, and no fraud/security concern requires terminal handling.

Do not reopen approved, expired, cancelled, financially completed, or otherwise terminal ineligible cases. Production Manual Finance customers cannot upload replacement through the website; use the approved Manual Finance evidence policy instead.

### Replacement flow

```text
First-cycle rejection
        ↓
Finance explicitly permits one replacement
        ↓
Customer submits within 7 days in authorised Self Service
        ↓
Original proof stays immutable and becomes superseded
        ↓
New current proof passes scanning; review SLA restarts
        ↓
Second independent review → approve or terminal outcome
```

**Figure 3 — Conservative replacement flow.** The transfer and financial claim never change, and the first cycle is not rewritten.

**Expected outcome:** One eligible replacement receives a fully independent second review without premature Financial effects.

### Related documents

[Finance Checklists](FINANCE-CHECKLISTS.md#4-replacement-checklist), [Proof assessment](#9-proof-assessment), and DOC-003, “Replacement proof and resubmission.”

## 13. Partial payments

### Purpose

Record only the exact cleared amount, preserve the remaining obligation, and prevent premature confirmation.

### Policy

1. Verify the exact partial amount and currency as cleared funds.
2. Confirm the invoice and approved policy allow the treatment; do not invent a permitted minimum or percentage.
3. Approve the claim only for the exact transferred amount.
4. Confirm one Payment and exact allocation for that amount.
5. Confirm one Receipt for that Payment.
6. Confirm the remaining invoice balance.
7. Confirm the booking remains at the lawful stage, which may be `DEPOSIT_PENDING`.
8. Confirm no premature Booking Confirmation notification exists.
9. Communicate the recorded amount and remaining balance without promising later confirmation.

Accepted evidence demonstrates partial-to-full behavior, but the example amounts are not Finance policy. Deposit percentage, minimum payment, treatment of underpayments, and confirmation threshold remain in [Finance Policy-Owned Values](FINANCE-POLICY-OWNED-VALUES.md).

**Expected outcome:** The exact partial payment and one Receipt are recorded, the remaining balance remains visible, and booking status does not advance unlawfully.

### Related documents

[Full payments](#14-full-payments), [Receipts](#15-receipts), and [Booking Confirmation](#16-booking-confirmation).

## 14. Full payments

### Purpose

Complete the obligation through a distinct verified payment and verify lawful downstream progression.

### Policy

1. Verify the second/final transfer independently, including its distinct reference where applicable.
2. Confirm the final amount equals the approved remaining obligation or follow an approved exception policy.
3. Apply the complete approval standard.
4. Confirm a second Payment and final allocation.
5. Confirm a separate Receipt for the second Payment.
6. Confirm cumulative allocations settle the invoice.
7. Confirm booking milestone evaluation reaches `CONFIRMED` only if all applicable booking and deposit conditions are satisfied.
8. Confirm one Booking Confirmation notification for the legal transition.

Two distinct payments must remain 2 Payments with one Receipt each. They must not be collapsed into one Payment or produce repeated confirmation.

**Expected outcome:** The invoice is fully allocated, the final Receipt exists, and confirmation occurs exactly once when lawful.

### Related documents

[Partial payments](#13-partial-payments), [Booking Confirmation](#16-booking-confirmation), and [Notifications](#18-notifications).

## 15. Receipts

### Purpose

Ensure every eligible Payment has one accurate Receipt and avoid confusing it with bank or invoice evidence.

### Control standard

- One eligible recorded Payment produces one Receipt.
- The Receipt must match Payment, booking reference where available, amount, currency, and issued status.
- A bank transfer confirmation is not a VirtCruise Receipt.
- An invoice is not a Receipt.
- A Receipt does not by itself prove full settlement or Booking Confirmation.
- Receipt PDF download is not released; do not promise it.

### Missing or duplicate Receipt

1. Confirm the Payment exists and is eligible.
2. Check downstream processing and notification state.
3. Search for the Receipt by authoritative Payment reference.
4. Escalate a missing or duplicate result; do not issue a manual substitute through an unapproved route.
5. Communicate only the authoritative result.

**Expected outcome:** Receipts are complete, unique per Payment, accurately linked, and customer communication matches availability.

### Related documents

[Reconciliation](#17-reconciliation), [Notifications](#18-notifications), and DOC-002, “Receipts.”

## 16. Booking Confirmation

### Purpose

Prevent Finance from promising or forcing confirmation before authoritative booking conditions are satisfied.

### Confirmation policy

Finance may state that a booking is confirmed only when the authoritative booking record is `CONFIRMED`. Cleared funds, review approval, Payment recording, Receipt issuance, or invoice settlement are necessary in some journeys but are not alone sufficient.

### Verify confirmation

1. Confirm relevant Payments and allocations.
2. Confirm invoice balance and policy treatment.
3. Confirm booking milestone evaluation completed.
4. Confirm the booking itself shows `CONFIRMED`.
5. Confirm exactly one eligible confirmation notification intent for that transition.
6. Use the approved wording in [Appendix D](#appendix-d-safe-customer-wording).

If Financial state is correct but the booking is not projected, escalate. Do not manually change booking status or send a confirmation message as a workaround.

**Expected outcome:** Booking Confirmation is communicated only from authoritative booking state and only once.

### Related documents

[Full payments](#14-full-payments), [Notifications](#18-notifications), and DOC-003, “Booking progression.”

## 17. Reconciliation

### Purpose

Demonstrate that bank activity, Payments, allocations, Receipts, Ledger effects, invoices, and exceptions agree.

### Daily reconciliation

1. Obtain the approved bank/reconciliation source for each legal entity and currency.
2. Confirm opening position and approved cut-off.
3. Match cleared receipts to recorded Payments using controlled references.
4. Match each Payment to exact allocation and Receipt.
5. Confirm balanced Ledger effect through the authorised source.
6. Confirm invoice balance and booking payment summary.
7. Identify unknown, unallocated, duplicate, reversed, partial, overpaid, and missing items.
8. Assign each break a safe reference, owner, action, and due time.
9. Obtain supervisor review/sign-off under approved policy.

### Reconciliation principles

- Reconcile separately by currency and approved bank account.
- Do not combine currencies or calculate unsupported exchange conversion.
- Do not force-match on amount alone.
- Do not clear a break by directly editing Financial records.
- Retain evidence under the approved schedule.

Exact timetable, cut-off, tolerance, materiality, and sign-off rules are policy-owned and pending approval.

**Expected outcome:** Every cleared bank item is matched or controlled as an exception, and every recorded Payment has complete consequences.

### Related documents

[Month-end controls](#25-month-end-controls), [Exception handling](#26-exception-handling), and [Finance Policy-Owned Values](FINANCE-POLICY-OWNED-VALUES.md).

## 18. Notifications

### Purpose

Confirm that customer messages follow authoritative financial and booking events without duplication.

### Expected notifications

Accepted processing can produce payment-recorded, Receipt-issued, and Booking Confirmation messages. Conditional Self Service can also communicate proof received, rejection, and replacement request. A message must not precede its authoritative business event.

### Control response

1. Confirm the source Payment, Receipt, review, or booking event.
2. Check the approved notification operations source for intent and delivery state.
3. Allow controlled retry policy to run.
4. Escalate failed, uncertain, cancelled, suppressed, or manual-intervention states.
5. Do not resend uncertain delivery blindly.
6. Use approved manual communication only when an authorised owner confirms it will not duplicate or contradict automation.

The released Finance interface does not provide notification operations. DOC-004 defines Finance responsibility for the business message, not technical delivery recovery.

**Expected outcome:** Each event produces the intended bounded customer message once, or a controlled exception with an owner.

### Related documents

[Customer communication](#20-customer-communication), [Exception handling](#26-exception-handling), and future DOC-010.

## 19. Fraud detection

### Purpose

Identify warning signs, pause decisions, and escalate without conducting a criminal investigation.

### Warning signs

- customer, payer, booking, invoice, amount, currency, destination account, or reference mismatch;
- unknown payment or third-party payer without approved policy;
- duplicate, reused, altered, or inconsistent proof;
- repeated transfer reference or apparent duplicate Payment;
- changed bank details, unusual urgency, secrecy, or pressure to bypass controls;
- proof that conflicts with cleared bank activity;
- unexpected overpayment, refund destination change, or request to return funds elsewhere;
- malware/scan alert or unauthorised access;
- exposure of another customer's financial data.

### Response

1. Pause the decision and any related instruction or customer commitment.
2. Preserve records, current proof metadata, references, timestamps, and audit history.
3. Record objective observations only.
4. Avoid accusation, investigation disclosure, or promise.
5. Escalate through the approved Security and Finance route.
6. Follow the authorised decision owner and record disposition.

Do not contact a bank, law-enforcement body, or third party outside approved fraud/compliance policy. This SOP does not define criminal investigation procedures.

**Expected outcome:** Suspicion is contained and escalated with evidence intact and customer confidentiality protected.

### Related documents

[Finance Checklists](FINANCE-CHECKLISTS.md#5-fraud-and-suspicion-checklist), [Privacy](#21-privacy), and [Escalation](#23-escalation).

## 20. Customer communication

### Purpose

Use accurate, approved wording that reflects current authority and business state.

### Communication rules

1. Verify the customer and safe reference.
2. Check proof, cleared-funds, Payment, Receipt, invoice, booking, and notification states separately.
3. State only the latest authoritative customer-visible fact.
4. Give one safe next action and an approved contact route.
5. Avoid unapproved timelines and bank details from memory.
6. Record the communication as required without copying unnecessary personal data.

### Required distinctions

- “We received your document” is not “We received your payment.”
- “Funds are being verified” is not “Payment recorded.”
- “Payment recorded” is not “Invoice fully paid.”
- “Receipt issued” is not “Booking confirmed.”
- “Booking confirmed” must follow authoritative booking state.

### Prohibited content

Do not disclose internal comments, reviewer identity, fraud indicators, audit detail, bank verification methods, system architecture, or another customer. Do not blame colleagues or promise a refund, cancellation outcome, replacement, SLA, or confirmation without authority.

Business wording examples in this draft require Finance and customer-communication approval before use.

**Expected outcome:** Customer communication is truthful, calm, minimal, and consistent with DOC-002.

### Related documents

[Appendix D](#appendix-d-safe-customer-wording), [DOC-002](../customer/CUSTOMER-USER-GUIDE.md), and [Rejection decision](#11-rejection-decision).

## 21. Privacy

### Purpose

Protect proof, financial, customer, staff, audit, and bank-account information throughout Finance work.

### Policy controls

- Access only records needed for an assigned task.
- Treat proof and financial details as confidential.
- Store restricted bank registers only in approved controlled locations.
- Do not copy records to personal devices, ordinary email, messaging, unapproved spreadsheets, or local folders.
- Share screens using one approved application window and hide unrelated data.
- Print only when approved; collect immediately, store securely, and dispose through confidential waste.
- Mask screenshots using fictional data where possible and opaque replacement where unavoidable; blur is not acceptable.
- Apply approved retention and legal-hold schedules; never choose a retention period ad hoc.
- Report wrong-customer access, misdirected messages, lost print, local retention, or unauthorised disclosure immediately.

### Proof access

Malware-clean proof remains private and potentially fraudulent. View it only through the controlled viewer, close it after need, and do not forward it. Internal comments and audit records are not customer-visible.

**Expected outcome:** Finance uses the minimum data required, preserves restricted records, and reports exposure promptly.

### Screenshot placeholder

> **Screenshot placeholder 5 — Privacy-safe Finance evidence**
> Show a fully fictional, opaque-masked sample at DOC-001 desktop profile. Capture only after a second-person privacy inspection; no real proof or bank account data.

### Related documents

[DOC-001 Screenshot Standards](../documentation/SCREENSHOT-STANDARDS.md), [Audit](#22-audit), and future DOC-006.

## 22. Audit

### Purpose

Maintain evidence that decisions were authorised, complete, accurate, timely, and reviewable.

### Required audit evidence

- operator and assigned role;
- case, booking, invoice, Payment, and Receipt references as applicable;
- decision time and time zone;
- amount and currency;
- restricted reference to the approved destination account;
- cleared-funds verification evidence/reference;
- current proof and review-cycle identity;
- decision reason, attestation, secondary approval, exception, and escalation;
- downstream Payment, allocation, Receipt, Ledger, booking, and notification results;
- reconciliation and periodic sign-off.

### Audit rules

1. Record facts at the time of the control.
2. Never alter, delete, backdate, or conceal an audit record.
3. Correct an error through the approved additive correction process.
4. Keep Internal Audit independent from operation and approval.
5. Provide only authorised evidence and preserve privacy.
6. Track findings to a named owner, due date, disposition, and independent closure review.

**Expected outcome:** An independent reviewer can reconstruct the decision without relying on memory or private files.

### Related documents

[Segregation of duties](#3-segregation-of-duties), [Reconciliation](#17-reconciliation), and [Month-end controls](#25-month-end-controls).

## 23. Escalation

### Purpose

Route policy, financial, security, customer, and service exceptions to an authorised decision owner.

### Escalation categories

| Condition | Primary decision owner | Finance action while pending |
|---|---|---|
| Authority/threshold unclear | Finance Supervisor/Manager | Pause decision; preserve evidence |
| Bank-account or currency mismatch | Finance Manager/Treasury owner | Do not issue or approve instructions |
| Fraud/security suspicion | Security and Finance Manager | Pause and restrict communication |
| Privacy exposure | Privacy/Security contact | Contain and report immediately |
| Unknown/unallocated/overpaid funds | Finance Supervisor | Hold controlled exception; do not force allocation/refund |
| Integration/booking/notification failure | Operations/Technical Operations | Preserve authoritative state; do not repeat blindly |
| Customer complaint or terms dispute | Support/Business Owner with Finance | State verified financial facts only |
| Policy-owned value pending | Named policy owner/approver | Do not choose an ad hoc value |

Contact details and response SLAs belong in the restricted approved contact register, not this SOP.

### Escalate

1. State the safe reference, current facts, decision required, impact, and deadline.
2. Exclude proof content, full bank details, authentication information, and speculation.
3. Assign a named role and next review time.
4. Preserve the authoritative record while awaiting direction.
5. Record the decision and approval reference.

**Expected outcome:** The right authority makes the decision before Finance proceeds.

### Related documents

[Finance Policy-Owned Values](FINANCE-POLICY-OWNED-VALUES.md) and [Appendix C](#appendix-c-escalation-template).

## 24. End-of-day controls

### Purpose

Close daily Finance work with complete ownership, reconciliation, privacy, and handover.

### Controls

1. Complete or hand over every assigned decision.
2. Escalate overdue, ambiguous, suspicious, and policy-blocked work.
3. Reconcile cleared bank items to Payments or controlled exceptions under the approved cut-off.
4. Review missing downstream records and failed/uncertain notifications.
5. Record partial balances, replacement deadlines, unknown funds, and next actions.
6. Confirm no proof, bank report, customer record, spreadsheet extract, print, or local file remains outside approved storage.
7. Obtain required supervisor sign-off.
8. Close protected viewers and sign out.

Use [Finance Checklists, “End-of-day checklist”](FINANCE-CHECKLISTS.md#6-end-of-day-checklist).

**Expected outcome:** Every exception has an owner and no confidential evidence remains uncontrolled.

### Related documents

[Daily reconciliation](#17-reconciliation), [Exception handling](#26-exception-handling), and DOC-003, “End-of-day controls.”

## 25. Month-end controls

### Purpose

Provide complete, independently reviewed period-end financial evidence.

### Controls

1. Confirm the approved month-end calendar, cut-off, responsible roles, and materiality policy.
2. Reconcile every approved bank account and currency.
3. Trace Payments to allocations, Receipts, Ledger effects, invoices, and booking summaries.
4. Review unknown, unallocated, duplicate, reversed, refunded, partial, overpaid, and aged exceptions.
5. Review approvals around cut-off for authority, cleared-funds evidence, duplicates, and downstream completion.
6. Review bank-account register changes and effective dates.
7. Review segregation exceptions, access changes, overdue decisions, fraud/privacy incidents, and audit findings.
8. Review notification failures with customer or financial impact.
9. Apply approved retention and legal-hold controls.
10. Record unresolved items, owner, financial impact, due date, and approval.
11. Obtain independent preparer/reviewer sign-off.

Exact close date, timetable, sampling, tolerance, and materiality remain policy-owned.

**Expected outcome:** Period-end balances and exceptions are complete, explained, owned, and independently signed off.

### Related documents

[Finance Checklists](FINANCE-CHECKLISTS.md#7-month-end-checklist), [Audit](#22-audit), and [Policy-owned values](#27-policy-owned-values).

## 26. Exception handling

### Purpose

Control non-standard financial events without bypassing authoritative workflows.

| Exception | Finance decision standard | Required action | Prohibited response |
|---|---|---|---|
| Unknown payment | Do not allocate without sufficient identification | Hold in approved exception state and investigate through policy | Guess customer from amount/name alone |
| Unallocated payment | Payment exists but allocation is incomplete/unsupported | Reconcile references and escalate authorised allocation recovery | Edit allocation directly |
| Underpayment | Apply approved partial/deposit policy | Record exact eligible amount and remaining balance | Mark invoice paid |
| Overpayment | Apply approved overpayment/refund policy | Preserve excess as controlled exception | Refund automatically or to changed account |
| Currency mismatch | Do not convert or allocate without approved policy | Escalate to Finance Manager | Invent exchange rate |
| Duplicate proof/reference | Possible duplicate or fraud | Pause, compare Payment/audit records, escalate | Approve as new because proof looks different |
| Reversal/chargeback | Financial position may change | Follow approved reversal policy and assess booking impact | Delete original Payment/Receipt |
| Approved review, missing Payment | Downstream processing incomplete | Check integration status and escalate | Approve again |
| Payment recorded, missing Receipt | Receipt consequence incomplete | Check downstream state and escalate | Create an unofficial receipt |
| Invoice paid, booking not confirmed | Booking projection/policy incomplete | Check milestone state and escalate | Confirm manually or tell customer it is confirmed |
| Notification uncertain | Delivery state unknown | Check authoritative attempt state | Resend blindly |
| Bank instruction discrepancy | Potential fraud/control failure | Stop instructions and escalate | Choose the most familiar details |

**Expected outcome:** Exceptions remain visible, controlled, and owned until an authorised resolution is recorded.

### Related documents

[Fraud detection](#19-fraud-detection), [Escalation](#23-escalation), and future DOC-010.

## 27. Policy-owned values

### Purpose

Prevent software defaults, examples, staff memory, and urgent cases from becoming unapproved Finance policy.

### Values owned by Finance policy

- deposit percentage, minimum, and rounding;
- officer authority and dual-control thresholds;
- refund and cancellation eligibility, charges, authority, timetable, and wording;
- approved bank accounts, currencies, legal entities, effective dates, and reconciliation identifiers;
- retention and legal-hold periods;
- reconciliation cut-off, timetable, tolerance, and materiality;
- review and escalation SLAs;
- contact and escalation routes;
- overpayment, underpayment, unknown payment, reversal, and currency mismatch treatment;
- Self Service activation and multi-bank routing readiness.

### Use the register

1. Open [Finance Policy-Owned Values](FINANCE-POLICY-OWNED-VALUES.md).
2. Locate the required value and check status, owner, approver, policy reference, and effective date.
3. Use it only when status is approved and the transaction date falls within its effective period.
4. Pause and escalate a pending, expired, suspended, or conflicting value.
5. Preserve superseded versions for audit.

> **Warning:** A placeholder, example, test amount, or software capability is not an approved value.

**Expected outcome:** Every material Finance judgement uses a current controlled policy or is paused for approval.

### Related documents

[Bank account administration](#6-bank-account-administration), [Segregation of duties](#3-segregation-of-duties), and [Finance Policy-Owned Values](FINANCE-POLICY-OWNED-VALUES.md).

## 28. Frequently asked Finance questions

### Purpose

Give concise Finance policy answers. Follow the full SOP and approved values for an actual decision.

### Responsibilities and segregation

1. **What is DOC-004 for?**
   It defines Finance decision policy and business controls; DOC-003 explains system operation.
2. **Does a visible approval control grant authority?**
   No. The authority schedule, segregation rules, and case state must also permit the decision.
3. **Can an Administrator approve because the portal allows access?**
   Only if separately appointed and authorised under Finance policy.
4. **Can the same person propose, approve, and publish bank details?**
   No. Separate those duties according to the approved control schedule.
5. **Can Internal Audit correct a transaction it samples?**
   No. Audit remains independent and reports findings to the operational owner.
6. **What should I do with a conflict of interest?**
   Stop, declare it through the approved route, and reassign to an independent authorised officer.
7. **Where are approval thresholds defined?**
   In the approved policy-owned-values register, not in software or this draft.
8. **Can urgency override segregation?**
   No. Escalate to an authorised decision owner.

### Manual Finance and instructions

9. **What payment mode is currently released in production?**
   Manual Finance Mode.
10. **What does the customer see in Manual Finance Mode?**
    Approved contact information, their reference and currency, and unpaid/unconfirmed wording—no bank details or proof upload.
11. **Does giving bank instructions record payment?**
    No.
12. **May I copy bank details from an older customer email?**
    No. Use the restricted effective-dated approved register.
13. **What reference must the customer provide?**
    The authoritative booking or invoice reference shown through the approved customer context.
14. **Can I send details for another currency if the customer requests it?**
    No. Verify the invoice and use only the approved account for its currency/legal entity.
15. **Who approves a bank-account change?**
    The roles in the approved bank-account responsibility and authority schedule; values remain pending in the register.
16. **Can Finance activate Self Service?**
    Not alone. It requires Business approval, controlled configuration, and operational readiness.

### Verification and proof

17. **What is cleared funds?**
    Money independently verified as posted and available in the correct approved bank account.
18. **Is a bank screenshot cleared-funds evidence?**
    No. It is proof supplied by a customer, not the authoritative bank/reconciliation source.
19. **Does a clean malware scan prove payment?**
    No.
20. **What must Finance match before approval?**
    Customer, booking, invoice, amount, currency, reference, account, cleared funds, current proof/cycle, duplicate risk, and authority.
21. **Can I rely on customer name and amount alone?**
    No. Use authoritative references and independent identifiers.
22. **What if proof and bank activity disagree?**
    Pause the decision and escalate; bank/reconciliation evidence remains authoritative for cleared funds.
23. **Can I view superseded proof for the current decision?**
    No. Use current proof; history may be retained for authorised audit.
24. **What if proof is unreadable?**
    Apply approved rejection wording and assess replacement eligibility.
25. **What if proof is missing or scan failed?**
    Do not use an outside copy; pause and escalate technical/security handling.
26. **What if the payer differs from the customer?**
    Apply an approved third-party-payer policy or escalate; do not assume legitimacy.

### Approval, rejection, and replacement

27. **What does approval mean?**
    Finance accepted the review after required checks; downstream processing remains separate.
28. **Is approval a Payment?**
    No.
29. **Can I approve when cleared funds are pending?**
    No.
30. **What should an approval reason contain?**
    A concise factual statement that required matching and independent cleared-funds verification succeeded.
31. **What if approval returns an uncertain result?**
    Refresh and inspect authoritative state; do not submit again blindly.
32. **What are valid rejection reasons?**
    Policy-supported factual mismatches, missing verification, unacceptable evidence, duplicates, ineligibility, or unresolved risk.
33. **Can the customer see internal comments?**
    No.
34. **May a rejection mention suspected fraud?**
    Not unless Security and approved communication policy authorise it.
35. **Is replacement automatic after rejection?**
    No. Finance must explicitly permit it and the case must be eligible.
36. **How many replacements are accepted?**
    One.
37. **What is the replacement deadline?**
    Seven days under the accepted lifecycle; use the explicit case deadline.
38. **Can replacement change the amount or reference?**
    No. It changes proof only.
39. **What happens to first proof?**
    It remains immutable and becomes superseded.
40. **Does replacement create a Payment?**
    No; there is no Financial effect before approval.

### Payments, Receipts, and bookings

41. **What happens after successful approval processing?**
    One Payment, exact allocation, one Receipt, balanced Ledger effect, milestone evaluation, and eligible notifications.
42. **Can downstream processing take time?**
    Yes. Verify each outcome separately.
43. **What if the Payment is missing?**
    Check integration state and escalate; do not approve again.
44. **How is a partial payment handled?**
    Record and allocate the exact cleared amount, issue one Receipt, retain the remaining balance, and avoid premature confirmation.
45. **Does partial payment confirm the booking?**
    Not necessarily; it may remain `DEPOSIT_PENDING` under applicable policy.
46. **How is the final payment handled?**
    Verify it independently, record a distinct Payment and Receipt, settle the invoice, and verify milestone evaluation.
47. **How many Receipts do 2 Payments produce?**
    Two—one per Payment.
48. **Is an invoice a Receipt?**
    No.
49. **Does a Receipt prove the invoice is fully paid?**
    Not by itself; check allocations and balance.
50. **When may Finance say the booking is confirmed?**
    Only when the authoritative booking status is `CONFIRMED`.

### Reconciliation, fraud, and exceptions

51. **Can Finance reconcile by amount alone?**
    No. Use references, account, currency, dates, and other approved identifiers.
52. **Can different currencies be combined?**
    No.
53. **What is an unknown payment?**
    Cleared money that cannot yet be matched safely to an authorised customer obligation.
54. **May Finance allocate an unknown payment to the most likely customer?**
    No. Hold it under approved exception policy and investigate through controlled routes.
55. **What should happen with overpayment?**
    Apply the approved overpayment/refund policy; do not refund automatically.
56. **What indicates possible fraud?**
    Mismatches, altered/duplicate proof, reused references, unusual urgency, unknown funds, changed bank details, or bypass requests.
57. **Should Finance investigate criminal conduct?**
    No. Preserve evidence and escalate through approved Security/compliance routes.
58. **Can Finance resend an uncertain notification?**
    Not until authoritative delivery state and resend authority are confirmed.
59. **What if a policy value is blank or pending?**
    Pause and escalate to its owner; do not choose a value.
60. **What must happen at month end?**
    Complete bank-to-Financial reconciliation, exception review, segregation/authority review, retention checks, and independent sign-off under approved policy.

**Expected outcome:** Finance obtains a safe policy answer and follows the full control before deciding.

### Related documents

[Finance Checklists](FINANCE-CHECKLISTS.md), [Finance Policy-Owned Values](FINANCE-POLICY-OWNED-VALUES.md), and [Exception handling](#26-exception-handling).

## 29. Glossary

### Purpose

Use consistent Finance terms in decisions, reconciliation, audit, and customer communication.

| Term | Finance definition |
|---|---|
| Allocation | The exact portion of a recorded Payment applied to an invoice. |
| Approval Authority | The approved limit and conditions under which a role can make a Finance decision. |
| Audit Trail | Immutable evidence of actions, actors, reasons, times, and outcomes. |
| Bank Account Register | Restricted, approved, effective-dated source of destination accounts by legal entity and currency. |
| Booking Confirmation | The authoritative booking outcome `CONFIRMED`, separate from review approval and payment recording. |
| Cleared Funds | Money verified as posted and available in the approved destination bank account. |
| Current Proof | The proof eligible for the active review cycle. |
| Deposit | A policy-defined part-payment required toward a booking. Exact percentages or amounts are policy-owned. |
| Deposit Pending | A booking stage where applicable deposit conditions are not yet satisfied. |
| Dual Control | Requirement for 2 appropriately authorised people to perform or approve separate parts of a control. |
| Effective Date | The date/time from which an approved policy value or bank instruction may be used. |
| Exception | An item that cannot complete through the normal approved control and requires named ownership. |
| Full Payment | Cumulative eligible allocations that settle the applicable invoice obligation. |
| Ledger | Balanced Financial record of the accounting effect of authorised processing. |
| Manual Finance | Current production mode where Finance supplies bank instructions directly and independently verifies funds. |
| Materiality | Approved threshold used to determine the significance and escalation of a variance; value is policy-owned. |
| Notification Intent | Authoritative record that an eligible business event requires a customer message. |
| Partial Payment | An eligible recorded amount that leaves an invoice balance outstanding. |
| Payment | Authoritative Financial record created after eligible approved processing. |
| Policy-Owned Value | Business-controlled value that software or staff must not invent, such as a threshold, account, or SLA. |
| Proof | Customer-supplied document supporting a transfer claim; it does not establish cleared funds. |
| Receipt | Record issued for one eligible recorded Payment. |
| Reconciliation | Matching bank activity with Payments, allocations, Receipts, Ledger effects, invoices, and controlled exceptions. |
| Replacement Proof | The one proof-only correction allowed within 7 days when explicitly eligible. |
| Review Case | Controlled record linking a transfer claim, obligation, proof cycle, reviewer, SLA, and decision. |
| Review Cycle | One immutable proof-and-decision round; an eligible replacement creates a second cycle. |
| Segregation of Duties | Separation of incompatible tasks to prevent one person controlling and concealing an outcome. |
| Self Service | Conditional customer bank-transfer capability not active in production Manual Finance Mode. |
| Service Level Agreement (SLA) | Approved target for response or review; exact values are policy-owned. |
| Superseded Proof | Earlier proof retained for history but ineligible for the current decision. |
| Unknown Payment | Cleared bank receipt not yet safely matched to an authorised customer obligation. |

**Expected outcome:** Finance distinguishes evidence, banking state, Financial records, booking state, policy, and communication.

### Related documents

DOC-003, “Glossary,” DOC-002, “Glossary,” and future DOC-007.

## 30. Appendices

### Purpose

Provide concise controlled summaries without replacing the companion checklists or policy register.

### Appendix A — Finance decision evidence matrix

| Decision | Mandatory evidence | Independent check | Required result |
|---|---|---|---|
| Issue bank instructions | Customer/reference/currency and restricted approved account version | Account effective-date verification | Controlled instruction sent |
| Approve review | Full checklist, current proof/cycle, authority | Cleared funds in approved source | One terminal approval |
| Reject review | Factual mismatch/ineligibility and authority | Current facts and policy | Terminal or explicitly replaceable rejection |
| Permit replacement | Correctable proof-only issue, no prior replacement | Lifecycle and fraud check | One 7-day opportunity |
| Record partial outcome | Approved exact amount | Payment/allocation/Receipt/balance | Remaining obligation retained |
| Confirm full outcome | Cumulative settlement and booking policy | Booking milestone and notification | One lawful confirmation |

### Appendix B — Segregation matrix template

| Activity | Preparer/proposer | Verifier | Approver | Publisher/operator | Independent reviewer | Approved policy reference |
|---|---|---|---|---|---|---|
| Bank-account change | `[Role]` | `[Role]` | `[Role]` | `[Role]` | `[Role]` | `[Pending]` |
| Approval threshold change | `[Role]` | `[Role]` | `[Role]` | `[Role]` | `[Role]` | `[Pending]` |
| Daily reconciliation | `[Role]` | `[Role]` | `[Role]` | Not applicable | `[Role]` | `[Pending]` |
| Refund | `[Role]` | `[Role]` | `[Role]` | `[Role]` | `[Role]` | `[Pending]` |
| Month-end close | `[Role]` | `[Role]` | `[Role]` | Not applicable | Internal Audit | `[Pending]` |

### Appendix C — Escalation template

| Safe reference | Current authoritative facts | Decision required | Risk/customer impact | Owner | Next review time | Approval/disposition |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

### Appendix D — Safe customer wording

All examples require Finance and customer-communication approval before use.

| Situation | Policy example |
|---|---|
| Instructions supplied | “We have provided the approved payment instructions for your reference and currency. No payment is recorded until Finance verifies cleared funds.” |
| Proof received | “We received your document. This does not yet mean that payment has been verified.” |
| Under review | “Finance is independently checking the payment information and funds.” |
| Rejected | “We could not verify the payment using the current information. Please follow the approved next step provided to you.” |
| Replacement offered | “You may provide one replacement document within the displayed 7-day period. The transfer details must remain unchanged.” |
| Payment recorded | “Finance has verified and recorded the Payment. Review the current amount and currency in your Financial Portal.” |
| Receipt issued | “A Receipt has been issued for the recorded Payment.” |
| Booking confirmed | “Your booking now shows as Confirmed. Please review the current booking details.” |
| Delay | “Processing is taking longer than expected. Please do not transfer or submit again unless Finance instructs you.” |

### Appendix E — Screenshot capture register

| Placeholder | Subject | Data rule | Views | Dependency |
|---:|---|---|---|---|
| 1 | Manual Finance hand-off | Fictional reference/contact; no bank details | Desktop/Tablet/Mobile | WEB-006 |
| 2 | Bank-account change control | Fully fictional restricted register | Desktop | Finance/Security template approval |
| 3 | Finance review context | Fictional case; no real proof | Desktop/Tablet/Mobile | DOC-003/WEB-006 |
| 4 | Approval attestation | Fictional identifiers and amount | Desktop/Tablet/Mobile | DOC-003/WEB-006 |
| 5 | Privacy-safe evidence | Opaque-masked fictional sample | Desktop | Second-person privacy review |
| 6 | Reconciliation control | Fictional one-currency records | Desktop/Tablet | Approved staff financial source |

> **Screenshot placeholder 6 — Reconciliation control**
> Show fictional bank receipt, Payment, allocation, Receipt, and exception references in one currency. No production bank information. Capture only after the approved staff source and WEB-006 are accepted.

### Appendix F — Controlled checklist index

- [Daily Finance checklist](FINANCE-CHECKLISTS.md#1-daily-finance-checklist)
- [Approval checklist](FINANCE-CHECKLISTS.md#2-approval-checklist)
- [Rejection checklist](FINANCE-CHECKLISTS.md#3-rejection-checklist)
- [Replacement checklist](FINANCE-CHECKLISTS.md#4-replacement-checklist)
- [Fraud and suspicion checklist](FINANCE-CHECKLISTS.md#5-fraud-and-suspicion-checklist)
- [End-of-day checklist](FINANCE-CHECKLISTS.md#6-end-of-day-checklist)
- [Month-end checklist](FINANCE-CHECKLISTS.md#7-month-end-checklist)

**Expected outcome:** Appendices support consistent decisions while controlled policies and companion records remain authoritative.

## Related documents

- [DOC-001, *VirtCruise Documentation Architecture*](../documentation/DOCUMENTATION-ARCHITECTURE.md)
- [DOC-002, *VirtCruise Customer User Guide*](../customer/CUSTOMER-USER-GUIDE.md)
- [DOC-003, *Back Office Operations Manual*](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md)
- [DOC-004-CL, *Finance Checklists*](FINANCE-CHECKLISTS.md)
- [DOC-004-PV, *Finance Policy-Owned Values*](FINANCE-POLICY-OWNED-VALUES.md)
- [Financial Portal](../FINANCIAL-PORTAL.md)
- [Finance Operations Portal](../FINANCE-OPERATIONS-PORTAL.md)
- [Manual Finance Launch Mode](../MANUAL-FINANCE-LAUNCH-MODE.md)
- [Bank Transfer Commercial Qualification](../BANK-TRANSFER-COMMERCIAL-QUALIFICATION.md)
- [Finance documentation index](README.md)

## Scope exclusions and future manuals

DOC-004 does not replace:

- DOC-003, Back Office Operations Manual;
- DOC-005, Content Studio User Guide;
- DOC-006, Customer Support Playbook;
- DOC-007, Status & Lifecycle Reference;
- DOC-009, Training Manual; or
- DOC-010, Production Handover Guide.

It contains no software-operation walkthrough beyond necessary policy context, production credentials, real bank-account numbers, raw database instructions, deployment guidance, or technical recovery commands.

## Review record

| Gate | Responsible role | Decision | Date | Evidence/notes |
|---|---|---|---|---|
| Author self-review | Documentation Lead | Complete | 2026-08-03 | Policy separation, terminology, links, confidentiality, and PDF reviewed |
| Finance policy review | Finance Manager | Pending | — | Approve policy statements and owned values |
| Finance authority review | Finance Director | Pending | — | Approve authority, segregation, and escalation model |
| Operations review | Operations Manager | Pending | — | Approve hand-offs and exception ownership |
| Security/privacy review | Security/Privacy Lead | Pending | — | Approve bank, proof, fraud, privacy, and retention controls |
| Internal Audit review | Internal Audit | Pending | — | Assess control design and auditability |
| Business approval | Business Owner | Pending | — | Required before controlled internal publication |
| Publication | Publisher | Pending | — | Confirm NDA and role-based distribution |

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial Finance Standard Operating Procedures for internal review | Draft — Internal Review |
