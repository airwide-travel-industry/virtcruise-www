# Operations Quick Start

| Field | Value |
|---|---|
| Document ID | DOC-008-OP |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted behavior through v0.7.0 |
| Status | Draft |
| Owner | Operations Lead |
| Classification | Confidential — VirtCruise Internal Operations |
| Last reviewed | 2026-08-03 |

## Purpose

Run safe daily checks, coordinate queues and notifications, manage incidents, and hand over unresolved work without changing authoritative state directly.

## Who should use this guide

Operations staff and supervisors using approved monitoring and operational sources. No distinct released Operations role route is established in v0.7.0 evidence; access is policy dependent.

> **Important:** This guide does not replace DOC-002 through DOC-007, DOC-009, or DOC-010. Use DOC-003 for full procedures and DOC-007 for lifecycle meaning.

## Daily workflow

```text
Morning control check → Queue/exception triage → Coordinate owners
→ Monitor Financial/booking/notification consequences → Incident response
→ Reconcile and end-of-day handover
```

## Top 10 tasks

1. **Complete morning controls.** Check approved service health, handovers, travel-imminent work, review/Financial exceptions, integrations, projections, notifications, proof storage, and known incidents.
2. **Triage queues.** Distinguish lifecycle state from unassigned, assigned, overdue, retry, failed, stale, quarantined, or manual-intervention queue conditions.
3. **Confirm ownership.** Assign or route work only through approved controls. A queue item without a role owner is an escalation need, not permission to act outside authority.
4. **Monitor review consequences.** Compare review, proof, Payment, allocation, Receipt, Ledger, booking, and notification records separately; never infer one from another.
5. **Monitor notifications.** Check authoritative intent/attempt state through approved monitoring. Do not resend uncertain messages or bypass `SUPPRESSED`.
6. **Handle booking progression exceptions.** Verify Financial outcomes and booking policy, preserve status history, then route projection failures. Never force `CONFIRMED`.
7. **Open an incident.** Record UTC start, scope, customer/financial/travel impact, safe symptoms, affected capability, current states, references, and initial owner.
8. **Coordinate response.** Protect customers/data, pause unsafe work, issue only approved service wording, track decisions/owners, and avoid speculative diagnosis.
9. **Escalate by domain.** Finance owns Financial decisions; Security/Privacy owns exposure/malware; Technical Operations owns service/integration recovery; Management owns serious business decisions.
10. **Close or hand over.** Verify authoritative recovery, reconcile related records, confirm communications, record residual risk and next check, and obtain owner acknowledgement.

## Quick checklist

### Start-of-day checklist

- [ ] Read prior handover and confirm monitoring/escalation routes.
- [ ] Check service, queue, proof, integration, projection, notification, reconciliation, and travel risks.
- [ ] Assign a named owner and next check to every material exception.

### Top task checklist

- [ ] Identify owning object, state, queue condition, impact, and exact reference.
- [ ] Refresh; compare related authoritative records separately.
- [ ] Apply only your authorised procedure and retry limit.
- [ ] Escalate with safe evidence and obtain acknowledgement.
- [ ] Verify outcome, audit trail, customer communication, and residual risk.

### End-of-day checklist

- [ ] Reconcile completed work and unresolved downstream exceptions.
- [ ] Hand over open incidents, manual interventions, overdue/travel-imminent work, and next checks.
- [ ] Confirm customer updates have an owner; secure records and sign out.

## Common mistakes

- Treating queue labels or dashboard totals as business lifecycle state.
- Replaying integration/notification work or approving a case to “unstick” processing.
- Editing a booking/Financial record instead of resolving the owning workflow.
- Declaring recovery before authoritative records, monitoring, and customer impact agree.

## Do's and don'ts

### Things you should always do

- Preserve current state, safe references, time, impact, decisions, and named ownership.
- Use approved incident wording and minimum necessary information.
- Verify recovery end to end across the affected authoritative records.

### Things you must never do

- Share proof, secrets, customer data, internal recipient lists, or speculative causes broadly.
- Bypass Finance, Security/Privacy, access, audit, or lifecycle controls.
- Invent severity, service levels, retry limits, thresholds, or recovery commands.

## Escalation

| Issue | Owner | Escalate when | Do not escalate when |
|---|---|---|---|
| Review/Financial decision | Finance Supervisor | Decision authority, mismatch, duplicate, reconciliation, or policy issue | Normal eligible Finance work has an owner |
| Service/integration/projection | Technical Operations | Automation stops, repeats, conflicts, or exceeds approved window | Normal processing is observable within policy |
| Notification | Notification Operations | Failed, uncertain, suppressed-policy question, or manual intervention | Valid pending/retry state is within policy |
| Privacy/security/proof safety | Security/Privacy | Immediately on exposure, compromise, malware, or unsafe proof | Proof is simply awaiting accepted scanning |
| Customer/travel impact | Support/Operations Manager | Coordinated customer update or urgent travel decision is needed | The normal owner and approved wording suffice |

DOC-003 is the primary operating procedure; DOC-004 controls Financial approval/reconciliation. Escalation supplements ownership—it does not transfer responsibility silently.

## Screenshot placeholder

> **Screenshot required — Figure 1: Operations daily control board**  
> Views: Desktop, Tablet, Mobile. Content: fictional service/queue/notification/incident conditions and named owners. Alternative text: Operations checks from morning triage to end-of-day handover. Dependency: accepted monitoring view; no live operational data.

## Related manuals

- [DOC-002, Customer User Guide](../customer/CUSTOMER-USER-GUIDE.md) — customer impact/wording.
- [DOC-003, Operations Manual](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md) — mandatory daily and incident procedures.
- [DOC-004, Finance SOP](../finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md) — financial decisions/reconciliation.
- [DOC-005, Support Playbook](../support/CUSTOMER-SUPPORT-PLAYBOOK.md) — communication/escalation.
- [DOC-006, Content Studio Guide](../content/CONTENT-STUDIO-USER-GUIDE.md) — publication operations.
- [DOC-007, Status & Lifecycle Reference](../reference/STATUS-LIFECYCLE-REFERENCE.md) — state and queue distinctions.

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial role Quick Start | Draft |
