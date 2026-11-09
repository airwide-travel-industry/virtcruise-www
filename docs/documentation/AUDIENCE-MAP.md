# Audience Map

| Field | Value |
|---|---|
| Document ID | DOC-001-AM |
| Version | 0.8.0-draft.1 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Purpose

This map defines what each VirtCruise audience needs, which content should serve them, and the language and detail appropriate to that role. A person's permissions remain defined by the product and organisational policy; documentation role names do not grant access.

## 2. Audience needs

| Audience | Primary goals | Needed content | Detail and tone | Principal documents |
|---|---|---|---|---|
| Travellers (Customers) | Plan, book, pay for, and manage travel | Guided tasks, explanations, recovery steps, privacy and help routes | Reassuring, concise, no internal process or jargon | DOC-002, DOC-008 |
| Consultants | Build and manage customer travel arrangements | End-to-end workflows, decision points, exceptions, customer hand-offs | Business-focused and procedural | DOC-003, DOC-007, DOC-008, DOC-009 |
| Finance | Control and evidence financial activity | SOPs, approvals, reconciliation, exception and audit evidence | Precise, control-oriented, unambiguous | DOC-004, DOC-007, DOC-008, DOC-009 |
| Administrators | Manage users, roles, settings, and business configuration | Permission-aware procedures, impact warnings, audit and recovery | Precise, risk-aware | DOC-003–DOC-005, DOC-007–DOC-009 |
| Content Editors | Create, review, and publish content | Editing workflows, lifecycle, media, accessibility, rollback | Task-led, visual, publication-aware | DOC-005, DOC-007–DOC-009 |
| Support Staff | Restore service and communicate clearly | Triage, symptom-to-action guidance, evidence, escalation, safe data handling | Diagnostic and empathetic | DOC-006–DOC-009 |
| Operations | Run services and business workflows reliably | Daily controls, queues, hand-offs, exceptions, continuity, ownership | Operational, measurable, escalation-aware | DOC-003, DOC-006–DOC-010 |
| Technical Administrators | Operate platforms and controlled configuration | System boundaries, access, monitoring, recovery, deployment and rollback references | Technical but product-specific terms defined | DOC-007, DOC-009, DOC-010 |
| Developers | Understand supported behaviour and operational obligations | Lifecycle reference, integration and handover context, traceable sources | Technically exact; avoid unexplained project shorthand | DOC-007, DOC-010 |

## 3. Content access classes

| Class | Intended readers | Distribution rule |
|---|---|---|
| Customer user | Travellers and authorised customer users | Approved customer package after NDA confirmation |
| Customer privileged | Customer administrators, Finance, Content Editors, Support, Operations | Role-appropriate package after NDA and recipient-authority confirmation |
| Technical confidential | Technical Administrators and authorised Developers | Explicit technical access approval; exclude secrets and live credentials |
| Internal working | VirtCruise authors, reviewers, and approvers | Not customer deliverable; draft watermark or status required |

## 4. Audience selection rules

Every document names one primary audience and any secondary audiences. Write prerequisites for the least-informed intended reader. When audiences need different permissions, terminology, or outcomes, create role-specific sections or separate documents rather than conditional steps throughout one procedure.

Do not expose privileged actions to readers who cannot perform them. Provide a hand-off such as “Ask your administrator” and link to the privileged procedure only within an authorised package.

## 5. Coverage matrix

| Document | Traveller | Consultant | Finance | Admin | Editor | Support | Operations | Technical Admin | Developer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| DOC-002 | P | S | — | S | — | S | — | — | — |
| DOC-003 | — | P | S | P | — | S | P | — | — |
| DOC-004 | — | S | P | S | — | S | S | — | — |
| DOC-005 | — | — | — | S | P | S | — | — | — |
| DOC-006 | — | — | S | S | — | P | P | S | S |
| DOC-007 | S | P | P | P | P | P | P | P | P |
| DOC-008 | P | P | P | P | P | P | P | P | — |
| DOC-009 | — | P | P | P | P | P | P | P | S |
| DOC-010 | — | — | S | S | — | P | P | P | P |

`P` = primary audience, `S` = secondary audience, `—` = not an intended audience.

## 6. Audience review

At planning and release, verify that all included content is necessary for the named readers, terms are defined at their level, permissions and hand-offs are accurate, and package access matches the content class.
