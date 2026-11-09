# VirtCruise Documentation Architecture

| Field | Value |
|---|---|
| Document ID | DOC-001 |
| Version | 0.8.0-draft.1 |
| Sprint | 3.7 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Purpose

This document defines the documentation system for VirtCruise. It governs how customer-facing and internal documents are planned, written, reviewed, approved, published, maintained, and retired. It does not describe or change application behaviour.

## 2. Principles

VirtCruise documentation must be audience-led, task-oriented, version-specific, secure, accessible, and traceable to an approved product capability. A reader should be able to identify the document owner, applicable product version, approval state, and related material from every released document.

Customer-deliverable documents are confidential and may be distributed only after NDA confirmation. Internal drafts must not be presented as product commitments.

## 3. Information architecture

```text
docs/
├── documentation/  # Governance, standards, templates, and roadmap
├── customer/       # Traveller and customer-facing guidance
├── finance/        # Finance procedures and controls
├── operations/     # Back-office and production operations
├── support/        # Support diagnosis and service playbooks
├── technical/      # Technical administration and developer references
├── training/       # Role-based learning material and quick starts
└── release/        # Version-specific release and handover material
```

Each category has an index describing its audience and intended documents. A document's primary home is determined by its principal audience; links, rather than copies, serve secondary audiences.

## 4. Document suite and roadmap

| ID | Document | Purpose | Primary audience | Scope | Dependencies | Estimated size | Acceptance criteria |
|---|---|---|---|---|---|---:|---|
| DOC-002 | Customer User Guide | Help travellers search, quote, book, pay, and manage trips | Travellers | Supported customer journeys, navigation, errors, privacy, and accessibility | WEB-001 Customer experience; WEB-004 Finance experience; DOC-007 | 60–90 pages | All released traveller journeys covered; steps validated against accepted UI; privacy-safe screenshots; customer and Support review complete |
| DOC-003 | Back Office Operations Manual | Enable controlled daily booking operations | Consultants, Operations, Administrators | Quote and booking handling, queues, exceptions, roles, and operational controls | WEB-002 Back office; WEB-004 Finance experience; DOC-007 | 80–120 pages | Every released operational workflow has owner, prerequisites, steps, result, exception path, and escalation; Operations approval complete |
| DOC-004 | Finance Standard Operating Procedures | Define repeatable and auditable finance work | Finance, Administrators | Invoices, deposits, payments, bank transfers, receipts, refunds, reconciliation, and exception handling | WEB-004 Finance experience; DOC-003; DOC-007 | 70–110 pages | Procedures identify control points and evidence; segregation-of-duties review complete; Finance approval complete |
| DOC-005 | Content Studio User Guide | Explain safe creation and publication of content | Content Editors, Administrators | Content lifecycle, editing, preview, publication, rollback, media, and permissions | WEB-003 Content Studio; DOC-007 | 45–70 pages | All released editor tasks covered; permissions and publication states verified; Content owner approval complete |
| DOC-006 | Customer Support Playbook | Standardise diagnosis, communication, escalation, and recovery | Support Staff, Operations | Intake, triage, known symptoms, evidence, customer communications, escalation, and closure | WEB-001 to WEB-005 affected features; DOC-002–DOC-005; DOC-007 | 70–100 pages | Severity and routing model approved; no secrets or sensitive data requested; top support scenarios rehearsed; Support approval complete |
| DOC-007 | Status & Lifecycle Reference | Provide one authoritative vocabulary for business states and transitions | All operational roles, Technical Administrators, Developers | Quote, booking, payment, content, support, and release states; allowed transitions and ownership | WEB-001 to WEB-005 domain behaviour | 35–55 pages | State names match accepted product behaviour; transition owners and terminal states identified; Product and Engineering approval complete |
| DOC-008 | Quick Start Guides | Get each role to its first successful outcome quickly | All user roles | Short role-specific entry points, access, first task, and next steps | DOC-002–DOC-007; corresponding released WEB capabilities | 2–6 pages per role | One guide per supported role; completable without undocumented knowledge; tested by a representative reader; links resolve |
| DOC-009 | Training Manual | Support instructor-led and self-directed role training | Trainers, Consultants, Operations, Support, Administrators | Learning objectives, modules, exercises, scenarios, assessment, and facilitator notes | WEB-006 Training environment/readiness; DOC-002–DOC-008 | 100–150 pages | Objectives and assessments align; exercises use non-production data; facilitator and learner paths reviewed; Training approval complete |
| DOC-010 | Production Handover Guide | Transfer an approved release into supported operation | Operations, Technical Administrators, Support, Developers | Ownership, topology references, configuration boundaries, monitoring, backup, recovery, deployment, rollback, and support readiness | WEB-007 Production readiness; DOC-006–DOC-009; release evidence | 60–90 pages | Owners accept responsibilities; operational readiness evidence linked; rollback and escalation paths approved; no credentials embedded |

Sizes are planning ranges, not acceptance targets. “WEB-001” through “WEB-007” are dependency categories inferred for planning because an authoritative Sprint 3.7 WEB register is not present in this repository. Before drafting each future DOC, its owner must replace category labels with the approved workstream title, scope, and acceptance source.

## 5. Dependency model

```text
WEB-001 Customer experience ───────► DOC-002 ─┐
WEB-002 Back office ───────────────► DOC-003  │
WEB-003 Content Studio ────────────► DOC-005  ├─► DOC-008 ─► DOC-009
WEB-004 Finance experience ────────► DOC-004  │
WEB-005 Service and lifecycle ─────► DOC-006  │
WEB-001..005 domain behaviour ─────► DOC-007 ─┘
WEB-006 Training readiness ─────────────────────► DOC-009
WEB-007 Production readiness ───────────────────► DOC-010
DOC-006..009 + release evidence ────────────────► DOC-010
```

A dependency is ready only when its scope and acceptance evidence are available. Documentation may begin earlier, but statements about unfinished behaviour must be labelled as assumptions and removed or confirmed before approval.

## 6. Document layers

1. **Governance:** this architecture and its companion standards.
2. **Reference:** authoritative terminology, states, permissions, and concepts.
3. **Task guidance:** procedures and user guides organised around reader goals.
4. **Learning:** quick starts, courses, exercises, and assessment.
5. **Release-specific:** handover, compatibility, and change information.

## 7. Ownership and source of truth

Every document has one accountable owner and one canonical Markdown source in this repository. Product behaviour is sourced from accepted workstream evidence, not inferred from draft screens. Business controls require the relevant business owner. Technical claims require a Technical Administrator or Engineering reviewer. Published derivatives must identify their source version and must not become independent editable copies.

## 8. Navigation and cross-document rules

Each released document must include metadata, purpose, audience, scope, prerequisites, related documents, and change history. Relative links are used within the repository. Cross-references use the document ID, title, and section name, for example: “See DOC-007, *Status & Lifecycle Reference*, ‘Payment states’.” Links to internal engineering evidence must not appear in a customer package unless specifically approved.

## 9. Quality gates

Before release, confirm:

- content covers its approved scope and excludes unconfirmed functionality;
- terminology, role names, navigation labels, and state names are consistent;
- instructions suit the named audience and state prerequisites and outcomes;
- cross-references, tables, figures, and document metadata are correct;
- screenshots and examples contain no personal, confidential, credential, or production data;
- required author, reviewer, approver, and customer decisions are recorded;
- the release package contains only approved customer-deliverable material.

## 10. Companion standards

- [Audience Map](AUDIENCE-MAP.md)
- [Document Standards](DOCUMENT-STANDARDS.md)
- [Document Templates](DOCUMENT-TEMPLATES.md)
- [Style Guide](STYLE-GUIDE.md)
- [Screenshot Standards](SCREENSHOT-STANDARDS.md)
- [Versioning and Review](VERSIONING-AND-REVIEW.md)
- [Writing Guidelines](WRITING-GUIDELINES.md)

## 11. DOC-001 completion boundary

DOC-001 establishes structure and governance only. It does not author DOC-002 through DOC-010, change software, validate product behaviour, or approve customer publication. The next recommended workstream is DOC-002 after WEB-001 scope and accepted journeys are available.

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Established documentation architecture for Sprint 3.7 | Draft |
