# VirtCruise Documentation Master Index

| Field | Value |
|---|---|
| Document ID | DOC-011 |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted documentation through DOC-010 |
| Status | Draft |
| Owner | Documentation Lead |
| Reviewer | Document owners, Operations, Finance, Support, Content, Learning and Development, Platform, and Business leads |
| Approver | Business Owner |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## Contents

1. [Welcome](#1-welcome)
2. [Purpose of the documentation suite](#2-purpose-of-the-documentation-suite)
3. [Documentation philosophy](#3-documentation-philosophy)
4. [Audience guide](#4-audience-guide)
5. [Document relationships](#5-document-relationships)
6. [Reading paths](#6-reading-paths)
7. [Document catalogue](#7-document-catalogue)
8. [Version matrix](#8-version-matrix)
9. [Document ownership](#9-document-ownership)
10. [Review schedule](#10-review-schedule)
11. [Cross-reference index](#11-cross-reference-index)
12. [Appendices](#12-appendices)

## 1. Welcome

This is the cover page and authoritative navigation guide for the VirtCruise documentation suite. Start with your audience in section 4 or a task keyword in section 11. Use the recommended reading path; then follow links to the owning document rather than relying on summaries here.

> **Important:** Workstream acceptance and document publication state are different. DOC-001–DOC-010 are accepted programme baselines, while their current file metadata remains `Draft` or `Draft — Internal Review`. Distribution and operational use must follow DOC-001 review, approval, classification, and publication controls.

This index does not rewrite or replace any existing document. If an index summary and an owning document differ, stop, use the owning document/current approved policy, and report the index inconsistency to the Documentation Lead.

## 2. Purpose of the documentation suite

The suite enables a reader to:

- understand how documentation is governed;
- complete customer journeys safely;
- operate business, Finance, Support, content, and production workflows;
- use one authoritative lifecycle vocabulary;
- become productive through role Quick Starts;
- learn, practise, assess, and certify competence; and
- assume controlled production ownership and recovery responsibility.

The suite separates four kinds of authority:

| Authority | Owning source | What it controls |
|---|---|---|
| Documentation governance | DOC-001 | Structure, style, review, publication, audiences, lifecycle |
| Business/customer procedure | DOC-002–DOC-006 | Role-specific tasks, controls, communication, escalation |
| Status/transition semantics | DOC-007 | Canonical states, legal transitions, terminality, visibility |
| Enablement and operations | DOC-008–DOC-010 | Desk reference, training/certification, production ownership/recovery |

## 3. Documentation philosophy

1. **One owner per truth.** Link to an authoritative definition or procedure; do not duplicate it.
2. **Reader outcomes first.** Organise information around safe tasks and decisions.
3. **Evidence before assertion.** Separate accepted, planned, conditional, policy-owned, and unsupported behavior.
4. **Authoritative state before projection.** DOC-007 controls lifecycle terminology; emails, queues, badges, and summaries do not replace owning records.
5. **Least privilege and minimum data.** A document never grants application access or business authority.
6. **Exceptions are first-class.** State when to stop, what not to do, who owns recovery, and what evidence to preserve.
7. **Markdown is canonical.** PDF is a controlled portable format; source changes follow DOC-001 lifecycle.
8. **No fabricated evidence.** Screenshot placeholders remain placeholders until controlled capture.
9. **Immutable history.** Do not silently edit released material; review, version, supersede, archive, or retire it under governance.

## 4. Audience guide

Read the **Start** document first, then the sequence in **Continue**. “As needed” documents support specialist tasks.

| Audience | Start | Continue | As needed / reason |
|---|---|---|---|
| Customer | [DOC-002 Customer User Guide](customer/CUSTOMER-USER-GUIDE.md) | [DOC-008 Customer Quick Start](quickstart/CUSTOMER-QUICK-START.md) | DOC-007 customer-visible statuses for clarification |
| Consultant | [DOC-008 Consultant Quick Start](quickstart/CONSULTANT-QUICK-START.md) | DOC-003 → DOC-005 Support → DOC-007 → DOC-009 | Role boundaries, customer communication, lifecycle, training |
| Finance | [DOC-004 Finance SOP](finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md) | DOC-003 → DOC-007 → DOC-008 Finance → DOC-009 | Operational coordination, status law, desk guide, certification |
| Support | [DOC-006 Support Playbook](support/CUSTOMER-SUPPORT-PLAYBOOK.md) | DOC-002 → DOC-003 → DOC-007 → DOC-008 Support → DOC-009 | Customer view, escalation, lifecycle, quick work, training |
| Content Editor | [DOC-005 Content Studio Guide](content/CONTENT-STUDIO-USER-GUIDE.md) | DOC-007 → DOC-008 Content Editor → DOC-009 | Publication states, desk guide, training |
| Operations | [DOC-003 Operations Manual](operations/BACK-OFFICE-OPERATIONS-MANUAL.md) | DOC-004 → DOC-006 → DOC-007 → DOC-008 Operations → DOC-010 | Finance/Support coordination, lifecycle, daily work, production |
| Administrator | [DOC-008 Administrator Quick Start](quickstart/ADMINISTRATOR-QUICK-START.md) | DOC-003 role matrix → DOC-007 → DOC-009 → DOC-010 as authorised | Access boundary, lifecycle, assessment, production operations |
| Trainer | [DOC-009 Training Manual](training/TRAINING-MANUAL.md) | DOC-008 → relevant DOC-002–DOC-006 → DOC-007 | Teach role workflow from owning source; assess safely |
| Management | [DOC-001 Documentation Architecture](documentation/DOCUMENTATION-ARCHITECTURE.md) | DOC-003 → DOC-004 → DOC-006 → DOC-009 → DOC-010 | Governance, operational/financial/support risk, competence, handover |
| DevOps | [DOC-010 Production Handover](operations/PRODUCTION-HANDOVER-GUIDE.md) | DOC-003 → DOC-004 → DOC-005 Support where customer impact applies → DOC-007 | Production ownership with business/lifecycle context; not a developer guide |

The detailed [Documentation Map](DOCUMENTATION-MAP.md) expands audiences by tasks and “do not use for” boundaries.

## 5. Document relationships

### Programme dependency spine

```text
DOC-001 Governance
    ↓
DOC-002 Customer
    ↓
DOC-003 Operations
    ↓
DOC-004 Finance
    ↓
DOC-005 Content
    ↓
DOC-006 Support
    ↓
DOC-007 Status & Lifecycle ──────────────┐
    ↓                                   │ authoritative terms
DOC-008 Quick Starts ← role manuals ────┤
    ↓                                   │
DOC-009 Training ← Quick Starts/manuals ┤
    ↓                                   │
DOC-010 Production Handover ← Ops/Finance/Support/Status
```

**Figure 1 — Governed dependency spine and principal cross-references.** The vertical sequence shows programme construction, not a requirement that every reader read every document. Role documents cross-reference later authority where accepted.

### Relationship rules

- DOC-001 governs every document's form, lifecycle, classification, ownership, review, and publication.
- DOC-002 describes the customer-facing journey.
- DOC-003 coordinates Back Office operations and exceptions.
- DOC-004 owns Finance procedures and controls.
- DOC-005 owns content preparation/publication procedure.
- DOC-006 owns Support communication and escalation.
- DOC-007 owns status and transition meaning across all roles.
- DOC-008 condenses first-hour tasks but never replaces manuals.
- DOC-009 trains and assesses application of existing sources.
- DOC-010 owns production handover/operation/recovery and references business manuals for impact.

## 6. Reading paths

### Customer

```text
DOC-002 Customer User Guide → DOC-008 Customer Quick Start
→ DOC-007 customer-visible status section when status meaning is needed
```

### Finance

```text
DOC-004 Finance SOP → DOC-003 Operations Manual → DOC-007 Status Reference
→ DOC-008 Finance Quick Start → DOC-009 Finance training/certification
```

### Support

```text
DOC-006 Support Playbook → DOC-002 Customer Guide → DOC-003 escalation
→ DOC-007 Status Reference → DOC-008 Support Quick Start → DOC-009
```

### Content Editor

```text
DOC-005 Content Studio Guide → DOC-007 publication lifecycle
→ DOC-008 Content Editor Quick Start → DOC-009 Content module
```

### Operations

```text
DOC-003 Operations Manual → DOC-004 Finance → DOC-006 Support
→ DOC-007 Status Reference → DOC-008 Operations Quick Start
→ DOC-009 Training → DOC-010 Production Handover (authorised production roles)
```

### Administrator

```text
DOC-008 Administrator Quick Start → DOC-003 Role Matrix
→ DOC-007 authority boundaries → DOC-009 Administrator assessment
→ DOC-010 production scope when separately authorised
```

### Trainer and supervisor

```text
DOC-009 Training Manual → exercises → assessments → certification
→ DOC-008 role guide → applicable DOC-002–DOC-006 manual → DOC-007
```

### Management and Platform/DevOps

```text
Management: DOC-001 → DOC-003/004/006 → DOC-009 → DOC-010
Platform/DevOps: DOC-010 → runbook/checklists/DR → DOC-003/004/006/007 context
```

There are eight principal reading paths: Customer, Consultant/Support (separated in the audience map), Finance, Content Editor, Operations, Administrator, Trainer/Supervisor, and Management/Platform. The [Documentation Map](DOCUMENTATION-MAP.md) provides ten explicit audience paths.

## 7. Document catalogue

Page values are actual PDF pages where a primary PDF exists. DOC-001 is estimated from its eight governed Markdown sources. DOC-008 includes its index and seven two-page role PDFs. DOC-009 and DOC-010 combine actual primary PDF pages with estimated companion pages at approximately 500 words/page.

| Document | Title | Purpose | Audience | Est./actual pages | Version | Owner | Dependencies | Related documents |
|---|---|---|---|---:|---|---|---|---|
| DOC-001 | [Documentation Architecture](documentation/DOCUMENTATION-ARCHITECTURE.md) | Govern structure, writing, screenshots, audiences, review, publication, and lifecycle | Authors, reviewers, approvers, publishers, managers | ~15 suite pages | 0.8.0-draft.1 | Documentation Lead | Accepted programme scope | All documents |
| DOC-002 | [Customer User Guide](customer/CUSTOMER-USER-GUIDE.md) | Guide customers through account, packages, quotes, bookings, Finance, receipts, support | Customers, Support, Consultants | 46 actual | 0.8.0-draft.1 | Documentation Lead | DOC-001, accepted customer behavior | DOC-006, DOC-007, DOC-008 |
| DOC-003 | [Back Office Operations Manual](operations/BACK-OFFICE-OPERATIONS-MANUAL.md) | Coordinate daily Operations, review cases, exceptions, incidents, and handover | Operations, Finance, Support supervisors, Administrators | 48 actual | 0.8.0-draft.1 | Operations Lead | DOC-001, DOC-002, v0.7.0 | DOC-004, DOC-006, DOC-007, DOC-010 |
| DOC-004 | [Finance Standard Operating Procedures](finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md) | Define Finance segregation, verification, decisions, reconciliation, controls | Finance, supervisors, assurance, Operations | 42 actual | 0.8.0-draft.1 | Finance Manager | DOC-001–DOC-003, financial evidence | DOC-007, DOC-008, DOC-009, DOC-010 |
| DOC-005 | [Content Studio User Guide](content/CONTENT-STUDIO-USER-GUIDE.md) | Define accepted/planned package content, version, review, publication workflows | Content Editors, Approvers, Marketing, Accessibility | 36 actual | 0.8.0-draft.1 | Content Manager | DOC-001, accepted content contracts | DOC-007, DOC-008, DOC-009 |
| DOC-006 | [Customer Support Playbook](support/CUSTOMER-SUPPORT-PLAYBOOK.md) | Standardise verification, customer communication, issue handling, escalation | Support, Consultants, supervisors, Operations | 34 actual | 0.8.0-draft.1 | Customer Support Lead | DOC-001–DOC-004, DOC-002 customer view | DOC-007, DOC-008, DOC-009, DOC-010 |
| DOC-007 | [Status & Lifecycle Reference](reference/STATUS-LIFECYCLE-REFERENCE.md) | Own lifecycle names, visibility, transition legality, terminality, meanings | All roles, Product, Engineering/Operations | 11 actual | 0.8.0-draft.1 | Documentation Lead | DOC-001–DOC-006, accepted evidence | DOC-008–DOC-010 |
| DOC-008 | [Quick Start Guide Pack](quickstart/QUICK-START-INDEX.md) | Provide seven first-hour role desk references | Customers and all staff roles | 16 actual across 8 PDFs | 0.8.0-draft.1 | Documentation Lead | DOC-001–DOC-007 | DOC-009, owning manuals |
| DOC-009 | [Training Manual](training/TRAINING-MANUAL.md) | Define onboarding, role transition, refreshers, assessment, certification | Staff, trainers, supervisors, managers | ~27; manual 10 actual | 0.8.0-draft.1 | Learning and Development Lead | DOC-001–DOC-008 | Exercises, assessments, certification |
| DOC-010 | [Production Handover Guide](operations/PRODUCTION-HANDOVER-GUIDE.md) | Transfer safe production operation, maintenance, incident, backup, restore, DR ownership | Operations, DevOps, System Administrators, Platform/Support/Technical leads | ~24; guide 11 actual | 0.8.0-draft.1 | Platform Owner | DOC-001–DOC-009, production evidence | Checklists, runbook, DR guide |

Appendix A catalogues all 40 governed source documents. PDFs are controlled alternate formats listed in Appendix B.

## 8. Version matrix

“Current Version” and “Status” are copied from document metadata. “Next Review” applies the DOC-001 maximum cadence from the last review: six months for high-risk Finance/production sources, twelve months elsewhere. Material change triggers an earlier review.

| Document | Current Version | Status | Owner | Last Review | Next Review |
|---|---|---|---|---|---|
| DOC-001 | 0.8.0-draft.1 | Draft | Documentation Lead | 2026-08-03 | 2027-08-03 or earlier trigger |
| DOC-002 | 0.8.0-draft.1 | Draft | Documentation Lead | 2026-08-03 | 2027-08-03 or earlier trigger |
| DOC-003 | 0.8.0-draft.1 | Draft — Internal Review | Operations Lead | 2026-08-03 | 2027-08-03 or earlier trigger |
| DOC-004 | 0.8.0-draft.1 | Draft — Internal Review | Finance Manager | 2026-08-03 | 2027-02-03 or earlier trigger |
| DOC-005 | 0.8.0-draft.1 | Draft — Internal Review | Content Manager | 2026-08-03 | 2027-08-03 or earlier trigger |
| DOC-006 | 0.8.0-draft.1 | Draft — Internal Review | Customer Support Lead | 2026-08-03 | 2027-08-03 or earlier trigger |
| DOC-007 | 0.8.0-draft.1 | Draft | Documentation Lead | 2026-08-03 | 2027-08-03 or earlier trigger |
| DOC-008 | 0.8.0-draft.1 | Draft | Documentation Lead | 2026-08-03 | 2027-08-03 or earlier trigger |
| DOC-009 | 0.8.0-draft.1 | Draft | Learning and Development Lead | 2026-08-03 | 2027-08-03 or earlier trigger |
| DOC-010 | 0.8.0-draft.1 | Draft | Platform Owner | 2026-08-03 | 2027-02-03 or earlier trigger |

This matrix is navigation metadata, not an approval record. See each document and DOC-001 Versioning and Review.

## 9. Document ownership

| Role | Accountability |
|---|---|
| Author | Creates accurate, traceable, audience-appropriate content; performs self-review; resolves findings; does not invent unsupported facts |
| Reviewer | Checks subject accuracy, usability, terminology, security/privacy, links, evidence, and scope; labels findings/blockers |
| Approver | Accepts business risk, scope, and readiness for the named lifecycle stage; records approval or rejection |
| Business Owner | Owns business intent, policy alignment, risk acceptance, funding/priority, and final business readiness |
| Technical Owner | Confirms architecture/runtime/operational accuracy and feasibility without overriding business/policy ownership |
| Document Owner | Maintains currency, review cadence, inbound/outbound links, supersession, archive/retirement, and change triggers |
| Publisher | Verifies fixed approved version, classification/recipients, package/links/privacy, publication record, and immutable release |

One person may hold several roles only where segregation permits. An author must not be the sole approver of a customer release. Finance, production, security/privacy, and certification documents require proportionate specialist review.

## 10. Review schedule

### Lifecycle

| State | Meaning | Normal next state |
|---|---|---|
| Draft | Being authored; incomplete or unapproved | Internal Review |
| Review | Fixed candidate under internal and, where required, customer review | Approved or back to Draft |
| Approved | Required approvers accepted; not yet necessarily published | Released |
| Released | Immutable current published source for authorised audience | Archived or Retired through decision |
| Archived | Superseded historical version retained and clearly not current | Retention/disposal under policy |
| Retired | Withdrawn from current use with replacement/reason recorded | Remains controlled historical record |

DOC-001 formally names `Internal Review`, optional `Customer Review`, `Approved`, `Released`, and `Archive`; “Review” and “Archived” above are navigation groupings. “Retired” is the governed withdrawal decision, not silent deletion.

### Cadence and triggers

- Finance and production/high-risk procedure: review at least every six months.
- Other released documents: review at least every twelve months.
- Review earlier after product, navigation, role, contract, policy, legal/regulatory, vendor, architecture, security/privacy, incident, audit, customer/support insight, or linked-authority change.
- Record `No change required` with evidence; it does not indefinitely extend mandatory review.
- Update this master index whenever a document ID/title/path/status/version/owner/dependency/replacement changes.

## 11. Cross-reference index

| Keyword | Start here | Then read |
|---|---|---|
| Account / login / password reset | DOC-002 | DOC-006 Support; DOC-009 security/training |
| Administrator / permissions / least privilege | DOC-003 role matrix | DOC-008 Administrator; DOC-009; DOC-010 security |
| Architecture | DOC-010 architecture summary for production | DOC-001 for documentation; accepted architecture evidence linked from DOC-010 |
| Backup | DOC-010 Production Checklists | Disaster Recovery Guide; Operations Runbook RB-04/RB-05 |
| Bank transfer / proof | DOC-004 Finance SOP | DOC-003; DOC-007 review/proof lifecycle |
| Booking / Booking Confirmation | DOC-002 customer view | DOC-003 operations; DOC-007 booking lifecycle |
| Certificates / TLS | DOC-010 Production Handover | DR certificate scenario; Operations Runbook RB-11 |
| Change management | DOC-010 | Production Checklists / Runbook |
| ClamAV / malware scan | DOC-010 | DOC-003 proof handling; DOC-004; DR storage scenario |
| Communication / complaints | DOC-006 Support Playbook | DOC-009 communication/customer-service modules |
| Content Studio | DOC-005 Content Studio Guide | DOC-008 Content Editor; DOC-009 |
| Customer Portal | DOC-002 | DOC-006 Support; DOC-003 operational boundary |
| Deployment / release | DOC-010 | Production Checklists; Operations Runbook RB-01 |
| Disaster recovery / restore | DOC-010 DR Guide | Production Checklists; Runbook RB-05 |
| DNS / NGINX | DOC-010 | Operations Runbook RB-11/RB-01 |
| Finance / reconciliation | DOC-004 | DOC-003; DOC-007; DOC-008 Finance |
| Glossary / terminology | DOC-007 Status Glossary | Role manual glossary for procedure context |
| Incident response / outage | DOC-010 for production | DOC-003 operations; DOC-006 customer communication |
| Ledger / allocation / Receipt | DOC-004 | DOC-007 payment/receipt; DOC-002 customer view |
| Logging / monitoring / health | DOC-010 | Operations Runbook RB-03/RB-08/RB-09 |
| Manual Finance | DOC-004 | DOC-002 customer guidance; DOC-007; DOC-010 production mode |
| Notifications / outbox / SMTP | DOC-007 lifecycle | DOC-003/DOC-004 operations; DOC-010 RB-06 |
| Package / pricing / media / SEO | DOC-005 | DOC-007 publication; DOC-008 Content Editor |
| PostgreSQL / database | DOC-010 | DR database scenario; Runbook RB-12/RB-05 |
| Publication / versions / restore content | DOC-005 | DOC-007 content lifecycle |
| Quick Start | DOC-008 Index | Owning detailed manual |
| Review case / approval / rejection | DOC-004 | DOC-003; DOC-007 transition matrix |
| Roles / escalation | DOC-003 role matrix | DOC-006 Support escalation; DOC-008 role guide |
| Security / privacy | Relevant role manual | DOC-009 common modules; DOC-010 production controls |
| Status / transition / terminal state | DOC-007 | Owning procedure for the action |
| Support | DOC-006 | DOC-002; DOC-003; DOC-007 |
| Training / assessment / certification | DOC-009 | DOC-008 and applicable role manuals |

## 12. Appendices

### Appendix A — Complete governed source catalogue

Estimated pages use approximately 500 words/page when no PDF exists. Purpose, audience, dependencies, and related documents are concise navigation descriptions; the linked source remains authoritative.

| Document | Title/link | Purpose | Audience | Pages | Version/status | Owner | Dependencies | Related |
|---|---|---|---|---:|---|---|---|---|
| DOC-001 | [Documentation Architecture](documentation/DOCUMENTATION-ARCHITECTURE.md) | Govern suite | Documentation roles/management | ~3 | 0.8.0-draft.1 / Draft | Documentation Lead | Programme scope | All |
| DOC-001-AM | [Audience Map](documentation/AUDIENCE-MAP.md) | Map audiences/access | Authors/publishers | ~2 | 0.8.0-draft.1 / Draft | Documentation Lead | DOC-001 | DOC-008/011 |
| DOC-001-DS | [Document Standards](documentation/DOCUMENT-STANDARDS.md) | Define mandatory format | Authors/reviewers | ~2 | 0.8.0-draft.1 / Draft | Documentation Lead | DOC-001 | Templates/style |
| DOC-001-DT | [Document Templates](documentation/DOCUMENT-TEMPLATES.md) | Supply controlled templates | Authors | ~2 | 0.8.0-draft.1 / Draft | Documentation Lead | Standards | All authored docs |
| DOC-001-SS | [Screenshot Standards](documentation/SCREENSHOT-STANDARDS.md) | Govern safe captures | Authors/reviewers | ~2 | 0.8.0-draft.1 / Draft | Documentation Lead | Standards/privacy | All placeholders |
| DOC-001-SG | [Style Guide](documentation/STYLE-GUIDE.md) | Govern terminology/style | All authors | ~2 | 0.8.0-draft.1 / Draft | Documentation Lead | DOC-001 | DOC-007 |
| DOC-001-VR | [Versioning and Review](documentation/VERSIONING-AND-REVIEW.md) | Govern lifecycle/review | Owners/reviewers/publishers | ~2 | 0.8.0-draft.1 / Draft | Documentation Lead | DOC-001 | All |
| DOC-001-WG | [Writing Guidelines](documentation/WRITING-GUIDELINES.md) | Define reader/task writing | Authors/reviewers | ~2 | 0.8.0-draft.1 / Draft | Documentation Lead | Standards | All |
| DOC-002 | [Customer User Guide](customer/CUSTOMER-USER-GUIDE.md) | Full customer journey | Customer/Support/Consultant | 46 actual | 0.8.0-draft.1 / Draft | Documentation Lead | DOC-001/accepted UI | DOC-006/007/008 |
| DOC-003 | [Back Office Operations Manual](operations/BACK-OFFICE-OPERATIONS-MANUAL.md) | Daily business operations | Operations/Finance/Support | 48 actual | 0.8.0-draft.1 / Internal Review | Operations Lead | DOC-001/002/v0.7.0 | DOC-004/006/007/010 |
| DOC-003-RM | [Back Office Role Matrix](operations/BACK-OFFICE-ROLE-MATRIX.md) | Define access boundaries | Staff/supervisors | ~3 | 0.8.0-draft.1 / Internal Review | Operations Lead | DOC-003 | DOC-008/009 |
| DOC-003-DC | [Daily Back Office Checklist](operations/DAILY-BACK-OFFICE-CHECKLIST.md) | Daily controls | Operations | ~2 | 0.8.0-draft.1 / Internal Review | Operations Lead | DOC-003 | DOC-010 |
| DOC-004 | [Finance SOP](finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md) | Finance controls/procedures | Finance/assurance | 42 actual | 0.8.0-draft.1 / Internal Review | Finance Manager | DOC-001–003 | DOC-007–010 |
| DOC-004-CL | [Finance Checklists](finance/FINANCE-CHECKLISTS.md) | Evidence Finance work | Finance/supervisors | ~3 | 0.8.0-draft.1 / Internal Review | Finance Manager | DOC-004 | DOC-003/007 |
| DOC-004-PV | [Finance Policy-Owned Values](finance/FINANCE-POLICY-OWNED-VALUES.md) | Register unresolved policy values | Finance/business owners | ~3 | 0.8.0-draft.1 / Internal Review | Finance Manager | DOC-004/policy | DOC-010 values |
| DOC-005 | [Content Studio User Guide](content/CONTENT-STUDIO-USER-GUIDE.md) | Content lifecycle/procedures | Editors/Approvers | 36 actual | 0.8.0-draft.1 / Internal Review | Content Manager | DOC-001/content contracts | DOC-007–009 |
| DOC-005-PC | [Content Publishing Checklist](content/CONTENT-PUBLISHING-CHECKLIST.md) | Gate publication | Editors/Approvers | ~2 | 0.8.0-draft.1 / Internal Review | Content Manager | DOC-005 | DOC-007 |
| DOC-005-QR | [Content Studio Quick Reference](content/CONTENT-STUDIO-QUICK-REFERENCE.md) | Condense content tasks | Editors/Approvers | ~2 | 0.8.0-draft.1 / Internal Review | Content Manager | DOC-005 | DOC-008 Content |
| DOC-006 | [Customer Support Playbook](support/CUSTOMER-SUPPORT-PLAYBOOK.md) | Support procedures/communication | Support/supervisors | 34 actual | 0.8.0-draft.1 / Internal Review | Customer Support Lead | DOC-001–004 | DOC-007–010 |
| DOC-006-CL | [Support Checklists](support/SUPPORT-CHECKLISTS.md) | Evidence safe support | Support | ~2 | 0.8.0-draft.1 / Internal Review | Customer Support Lead | DOC-006 | DOC-003/007 |
| DOC-006-EM | [Support Escalation Matrix](support/SUPPORT-ESCALATION-MATRIX.md) | Route issues to owners | Support/Operations | ~2 | 0.8.0-draft.1 / Internal Review | Customer Support Lead | DOC-006/003/004 | DOC-010 incidents |
| DOC-007 | [Status & Lifecycle Reference](reference/STATUS-LIFECYCLE-REFERENCE.md) | Own state semantics | All roles | 11 actual | 0.8.0-draft.1 / Draft | Documentation Lead | DOC-001–006 | DOC-008–010 |
| DOC-007-GL | [Status Glossary](reference/STATUS-GLOSSARY.md) | Controlled terms | All roles | ~4 | 0.8.0-draft.1 / Draft | Documentation Lead | DOC-007 | All manuals |
| DOC-007-TM | [Status Transition Matrix](reference/STATUS-TRANSITION-MATRIX.md) | Legal/prohibited edges | Operations/Product/technical | ~4 | 0.8.0-draft.1 / Draft | Documentation Lead | DOC-007 | DOC-003–005 |
| DOC-008 | [Quick Start Index](quickstart/QUICK-START-INDEX.md) | Select role desk guide | All readers | 2 actual | 0.8.0-draft.1 / Draft | Documentation Lead | DOC-001–007 | DOC-009 |
| DOC-008-CU | [Customer Quick Start](quickstart/CUSTOMER-QUICK-START.md) | First customer session | Customers | 2 actual | 0.8.0-draft.1 / Draft | Customer Experience Lead | DOC-002/007 | DOC-006 |
| DOC-008-CO | [Consultant Quick Start](quickstart/CONSULTANT-QUICK-START.md) | First-hour Consultant work | Consultants | 2 actual | 0.8.0-draft.1 / Draft | Operations Lead | DOC-003/006/007 | DOC-009 |
| DOC-008-FI | [Finance Quick Start](quickstart/FINANCE-QUICK-START.md) | First-hour Finance work | Finance | 2 actual | 0.8.0-draft.1 / Draft | Finance Lead | DOC-004/007 | DOC-009 |
| DOC-008-CE | [Content Editor Quick Start](quickstart/CONTENT-EDITOR-QUICK-START.md) | First-hour content work | Content Editors | 2 actual | 0.8.0-draft.1 / Draft | Content Lead | DOC-005/007 | DOC-009 |
| DOC-008-SU | [Support Quick Start](quickstart/SUPPORT-QUICK-START.md) | First-hour Support work | Support | 2 actual | 0.8.0-draft.1 / Draft | Customer Support Lead | DOC-006/007 | DOC-009 |
| DOC-008-OP | [Operations Quick Start](quickstart/OPERATIONS-QUICK-START.md) | First-hour Operations work | Operations | 2 actual | 0.8.0-draft.1 / Draft | Operations Lead | DOC-003/007 | DOC-009/010 |
| DOC-008-AD | [Administrator Quick Start](quickstart/ADMINISTRATOR-QUICK-START.md) | First-hour access coordination | Administrators | 2 actual | 0.8.0-draft.1 / Draft | Operations Lead | DOC-003/007 | DOC-009/010 |
| DOC-009 | [Training Manual](training/TRAINING-MANUAL.md) | Official curriculum | Staff/trainers/managers | 10 actual | 0.8.0-draft.1 / Draft | Learning and Development Lead | DOC-001–008 | Assessment/certification |
| DOC-009-EX | [Training Exercises](training/TRAINING-EXERCISES.md) | Scenarios/labs | Learners/trainers | ~5 | 0.8.0-draft.1 / Draft | Learning and Development Lead | DOC-009/manuals | DOC-009-AS |
| DOC-009-AS | [Training Assessments](training/TRAINING-ASSESSMENTS.md) | 112 questions/answers | Learners/assessors | ~8 | 0.8.0-draft.1 / Draft | Learning and Development Lead | DOC-009 | DOC-009-CE |
| DOC-009-CE | [Training Certification](training/TRAINING-CERTIFICATION.md) | Certify/sign off competence | Supervisors/managers | ~4 | 0.8.0-draft.1 / Draft | Learning and Development Lead | DOC-009/assessment | DOC-001 review |
| DOC-010 | [Production Handover Guide](operations/PRODUCTION-HANDOVER-GUIDE.md) | Transfer production ownership | Operations/DevOps/Platform | 11 actual | 0.8.0-draft.1 / Draft | Platform Owner | DOC-001–009/production evidence | DOC-010 companions |
| DOC-010-CL | [Production Checklists](operations/PRODUCTION-CHECKLISTS.md) | Evidence operational controls | Operators/verifiers | ~4 | 0.8.0-draft.1 / Draft | Operations Lead | DOC-010 | Runbook/DR |
| DOC-010-DR | [Disaster Recovery Guide](operations/DISASTER-RECOVERY-GUIDE.md) | Recover major failures | Incident/recovery teams | ~5 | 0.8.0-draft.1 / Draft | Platform Owner | DOC-010/inventory/policy | Checklist/runbook |
| DOC-010-RB | [Operations Runbook](operations/OPERATIONS-RUNBOOK.md) | Triage/recover components | Operations/DevOps | ~4 | 0.8.0-draft.1 / Draft | Operations Lead | DOC-010/inventory | Checklists/DR |

### Appendix B — PDF format register

| Workstream | PDF files | Pages |
|---|---|---:|
| DOC-002 | `customer/CUSTOMER-USER-GUIDE.pdf` | 46 |
| DOC-003 | `operations/BACK-OFFICE-OPERATIONS-MANUAL.pdf` | 48 |
| DOC-004 | `finance/FINANCE-STANDARD-OPERATING-PROCEDURES.pdf` | 42 |
| DOC-005 | `content/CONTENT-STUDIO-USER-GUIDE.pdf` | 36 |
| DOC-006 | `support/CUSTOMER-SUPPORT-PLAYBOOK.pdf` | 34 |
| DOC-007 | `reference/STATUS-LIFECYCLE-REFERENCE.pdf` | 11 |
| DOC-008 | Index plus seven role PDFs under `quickstart/` | 16 total |
| DOC-009 | `training/TRAINING-MANUAL.pdf` | 10 |
| DOC-010 | `operations/PRODUCTION-HANDOVER-GUIDE.pdf` | 11 |
| DOC-011 | `DOCUMENTATION-MASTER-INDEX.pdf` | Generated with this source; see final report |

DOC-001 governance currently has no programme PDF requirement. Markdown remains canonical for every entry.

### Appendix C — Search and navigation rules

- Search by canonical term first: exact status in backticks, document ID, role, screen/control, business reference, or incident topic.
- Prefer the keyword index, then the catalogue, then the owning document's contents.
- Search `DOC-007` before interpreting a lifecycle term and the owning manual before acting.
- Do not use README files, release evidence, acceptance records, or historic deployment examples as replacements for the governed programme documents.
- Report broken links, stale titles, duplicate definitions, or ownership conflicts to the Documentation Lead with the source/target paths.

### Appendix D — Related governance

- [Documentation Map](DOCUMENTATION-MAP.md)
- [DOC-001 Documentation Architecture](documentation/DOCUMENTATION-ARCHITECTURE.md)
- [Document Standards](documentation/DOCUMENT-STANDARDS.md)
- [Audience Map](documentation/AUDIENCE-MAP.md)
- [Versioning and Review](documentation/VERSIONING-AND-REVIEW.md)

### Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial authoritative documentation-suite cover and index | Draft |
