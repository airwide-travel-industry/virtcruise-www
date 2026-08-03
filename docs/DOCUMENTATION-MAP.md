# VirtCruise Documentation Map

| Field | Value |
|---|---|
| Document ID | DOC-011-MAP |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted documentation through DOC-010 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Purpose

Provide a compact visual and task map of the VirtCruise documentation suite. Use the [Documentation Master Index](DOCUMENTATION-MASTER-INDEX.md) for catalogue metadata, versions, ownership, review, and keyword search.

## 2. Suite topology

```text
                         ┌──────────────────────┐
                         │ DOC-001 Governance   │
                         └──────────┬───────────┘
                                    │ governs all
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
     DOC-002 Customer        DOC-003 Operations       DOC-005 Content
            │                 │          │                   │
            │                 ▼          ▼                   │
            │            DOC-004 Finance DOC-006 Support     │
            └───────────────────────┬────────────────────────┘
                                    ▼
                       DOC-007 Status & Lifecycle
                                    │ authoritative terms
                      ┌─────────────┼──────────────┐
                      ▼             ▼              ▼
              DOC-008 Quick   DOC-009 Training  DOC-010 Production
                 Starts         & Certification    Handover/Recovery
                      └─────────────┴──────────────┘
                              role enablement
```

**Figure 1 — Functional dependency map.** Cross-role manuals converge on DOC-007 terminology. DOC-008–DOC-010 consume existing procedures; they do not redefine them.

## 3. Document-to-document map

| Document | Depends on / consumes | Supplies to | Must not replace |
|---|---|---|---|
| DOC-001 | Programme/evidence requirements | Standards, templates, lifecycle and audience governance for all | Business/application procedure |
| DOC-002 | DOC-001, accepted customer behavior | Customer perspective to Support, Operations, Quick Starts, Training | Finance/Operations internal procedure |
| DOC-003 | DOC-001/002, accepted operations | Role/queue/incident/escalation context to Finance, Support, Training, Production | Finance policy, lifecycle authority, production handover |
| DOC-004 | DOC-001–003, accepted Financial evidence | Finance controls to Operations, Support, Training, Production | Booking/service state definition outside Finance |
| DOC-005 | DOC-001, accepted content contracts | Content/version/publication procedure to Quick Starts/Training | DOC-007 state definitions or released UI claims |
| DOC-006 | DOC-001–004, customer/operations context | Communication/escalation to Quick Starts, Training, Production incidents | Finance decisions or technical recovery |
| DOC-007 | Accepted evidence across DOC-001–006 | Canonical statuses/transitions to all later/role documents | Owning procedures/policies |
| DOC-008 | DOC-002–007 | First-hour role paths to DOC-009 learners | Detailed manuals or authority/access |
| DOC-009 | DOC-002–008 | Curriculum, practice, assessment, certification | Production access or operational procedure |
| DOC-010 | DOC-001–009 plus accepted production evidence | Production ownership, runbooks, checklists, DR | Business manuals, backend release-specific instructions, live inventory |

## 4. Audience-to-task map

| Audience | First document | Routine tasks | Exception/specialist source | Lifecycle source | Training/desk source |
|---|---|---|---|---|---|
| Customer | DOC-002 | Account, packages, quote, booking, Finance, Portal, Support | DOC-006 through Support | DOC-007 customer-visible section | DOC-008 Customer |
| Consultant | DOC-008 Consultant | Customer/quote/booking communication in approved source | DOC-003/DOC-006; Finance to DOC-004 | DOC-007 | DOC-009 Consultant assessment |
| Finance | DOC-004 | Manual Finance, review/proof, decisions, reconciliation | DOC-003 incidents/queues; DOC-010 production dependency | DOC-007 | DOC-008 Finance; DOC-009 |
| Support | DOC-006 | Verification, common issues, complaints, communication | DOC-003 escalation; DOC-004 Finance; DOC-010 outage handover | DOC-007 | DOC-008 Support; DOC-009 |
| Content Editor | DOC-005 | Draft/version/pricing/media/SEO/review/publication | DOC-003 incident coordination | DOC-007 publication lifecycle | DOC-008 Content; DOC-009 |
| Operations | DOC-003 | Daily controls, queues, handovers, business incidents | DOC-004/006; DOC-010 production incidents | DOC-007 | DOC-008 Operations; DOC-009 |
| Administrator | DOC-008 Administrator | Access/recovery coordination within approved policy | DOC-003 role matrix; DOC-010 for authorised production | DOC-007 boundaries | DOC-009 Administrator |
| Trainer | DOC-009 | Facilitate modules/exercises/assessment/certification | Each owning manual; DOC-001 governance | DOC-007 | DOC-008 role orientation |
| Management | DOC-001 | Governance, readiness, risk, approval | DOC-003/004/006/009/010 | DOC-007 for state risk | DOC-009 Manager/Supervisor |
| DevOps | DOC-010 | Health, release, backup, restore, security, incidents | Restricted inventory/backend release record; business impact via DOC-003/004/006 | DOC-007 for async/business state | DOC-008 Operations; DOC-009 if certified role requires |

## 5. Ten audience reading paths

```text
Customer:       DOC-002 → DOC-008-CU → DOC-007 (status question)
Consultant:     DOC-008-CO → DOC-003 → DOC-006 → DOC-007 → DOC-009
Finance:        DOC-004 → DOC-003 → DOC-007 → DOC-008-FI → DOC-009
Support:        DOC-006 → DOC-002 → DOC-003 → DOC-007 → DOC-008-SU → DOC-009
Content Editor: DOC-005 → DOC-007 → DOC-008-CE → DOC-009
Operations:     DOC-003 → DOC-004 → DOC-006 → DOC-007 → DOC-008-OP → DOC-010
Administrator:  DOC-008-AD → DOC-003-RM → DOC-007 → DOC-009 → DOC-010 if authorised
Trainer:        DOC-009 → DOC-008 → assigned DOC-002–006 → DOC-007
Management:     DOC-001 → DOC-003/004/006 → DOC-009 → DOC-010
DevOps:         DOC-010 → DOC-010-RB/CL/DR → DOC-003/004/006/007 context
```

**Figure 2 — Audience reading paths.** Arrows indicate recommended order, not permission or mandatory access.

## 6. Task router

| “I need to…” | Use | Avoid using as substitute |
|---|---|---|
| create/sign in/manage a customer account | DOC-002 | DOC-010 authentication operations |
| explain a booking status | DOC-007 then DOC-002/DOC-006 | Email/dashboard alone |
| run daily Back Office work | DOC-003 and DOC-003-DC | Quick Start alone |
| verify/approve/reject a transfer review | DOC-004 and its checklists; DOC-007 | Proof appearance or Support note |
| publish/retire/restore package content | DOC-005 and DOC-005-PC; DOC-007 | Content Quick Start alone |
| handle a complaint/password/outage report | DOC-006 | Production runbook customer diagnosis |
| determine whether a transition is legal | DOC-007-TM | A historic manual/status badge |
| start a role in the first hour | DOC-008 role guide | Training certification/access approval |
| train, assess, or certify staff | DOC-009 companions | Attendance or production access |
| deploy, roll back, back up, restore, recover | DOC-010 companions and live restricted inventory | Historic example commands/paths alone |
| author/review/publish documentation | DOC-001 companions | Existing document copied without template/review |

## 7. Cross-reference density map

| Source | Customer | Operations | Finance | Content | Support | Status | Quick | Training | Production |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| DOC-001 Governance | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| DOC-002 Customer | — | ● | ● | ○ | ● | ● | ● | ● | ○ |
| DOC-003 Operations | ● | — | ● | ○ | ● | ● | ● | ● | ● |
| DOC-004 Finance | ● | ● | — | ○ | ● | ● | ● | ● | ● |
| DOC-005 Content | ○ | ○ | ○ | — | ○ | ● | ● | ● | ○ |
| DOC-006 Support | ● | ● | ● | ○ | — | ● | ● | ● | ● |
| DOC-007 Status | ● | ● | ● | ● | ● | — | ● | ● | ● |
| DOC-008 Quick | ● | ● | ● | ● | ● | ● | — | ● | ○ |
| DOC-009 Training | ● | ● | ● | ● | ● | ● | ● | — | ● |
| DOC-010 Production | ○ | ● | ● | ○ | ● | ● | ● | ● | — |

Legend: `●` principal relationship; `○` contextual relationship; `—` same document/domain. This map describes navigation, not a claim that every file contains a direct hyperlink in both directions.

## 8. Authority conflicts

Use this precedence when two sources appear inconsistent:

1. Approved law/regulation/contract and current approved policy for its owned value.
2. Accepted owning service/production state for runtime fact.
3. DOC-007 for lifecycle semantics and transition documentation.
4. Owning role manual for procedure: DOC-002 customer, DOC-003 Operations, DOC-004 Finance, DOC-005 Content, DOC-006 Support, DOC-010 Production.
5. DOC-001 for documentation governance.
6. DOC-008/DOC-009 summaries and training aids.
7. This index/map for navigation only.

Stop and escalate rather than choosing the most convenient source. Record the conflict, affected paths/versions, owner, and safe interim action.

## 9. Maintenance map

| Change | Review at minimum |
|---|---|
| Document ID/title/path/owner/status/version | DOC-011 Master Index and Map; inbound links |
| Lifecycle/state/transition | DOC-007, all affected role/Quick Start/training/production references |
| Customer behavior/navigation | DOC-002, DOC-006, relevant DOC-008/009 |
| Finance policy/workflow | DOC-004, DOC-003/006/007/008/009/010 |
| Content contract/publication | DOC-005, DOC-007/008/009 |
| Operations role/escalation | DOC-003, DOC-006/008/009/010 |
| Production architecture/release/recovery | DOC-010 companions, DOC-003/004/006/009, restricted inventory |
| Documentation standard/lifecycle | DOC-001 companions, all templates/index metadata |

## 10. Map quality checklist

- [x] DOC-001–DOC-010 appear exactly once in the dependency spine.
- [x] Ten requested audiences have a first document and ordered path.
- [x] DOC-005 Content and DOC-006 Support follow authoritative metadata.
- [x] DOC-007 is shown as status/transition authority.
- [x] Quick Starts and Training are shown as complements, not replacements.
- [x] Production documentation is separated from developer guidance/live inventory.
- [x] Navigation summaries state precedence and conflict handling.
- [x] All local linked targets exist at author review.

## Related documents

- [Documentation Master Index](DOCUMENTATION-MASTER-INDEX.md)
- [DOC-001 Audience Map](documentation/AUDIENCE-MAP.md)
- [DOC-001 Documentation Architecture](documentation/DOCUMENTATION-ARCHITECTURE.md)
- [DOC-007 Status & Lifecycle Reference](reference/STATUS-LIFECYCLE-REFERENCE.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial suite dependency, audience, and task map | Draft |
