# VirtCruise Operations Runbook

| Field | Value |
|---|---|
| Document ID | DOC-010-RB |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted release baseline v0.7.0 |
| Status | Draft |
| Owner | Operations Lead |
| Classification | Confidential — VirtCruise Production Operations |
| Last reviewed | 2026-08-03 |

## 1. Runbook use

These runbooks define outcomes, gates, safe checks, decision points, and evidence for authorised operators. Resolve exact hosts, service units, release targets, configuration paths, monitoring tools, and approved commands from the restricted inventory/change record. Never substitute historic example values for current production.

Before any mutation: record authority/reference, current state, impact, operator/verifier, backup/rollback, and expected outcome. Do not display secrets/environment files or collect proof/customer data in evidence.

```text
Alert/request → verify authority and state → safe read-only diagnosis
→ choose runbook/owner → change only under approval → validate end to end
→ record/handover or escalate
```

**Figure 1 — Operations runbook control flow.** An unknown value or unsafe state returns to owner/escalation; it never becomes an assumption.

## RB-01 — Controlled release and deployment

**Trigger:** Approved production release/change. **Owner:** Release Manager. **Approvals:** Change/Business owner and affected Platform/Security/Finance/Operations owners. **Checklist:** [Deployment](PRODUCTION-CHECKLISTS.md#2-deployment-checklist).

### Preconditions

Immutable artifacts/manifests/checksums and release notes accepted; current/previous targets and schema/config compatibility known; backups/restore evidence current; rollback tested/reviewed; participants/communications/monitoring ready.

### Procedure

1. Open change bridge/record; capture baseline health and active frontend link with `readlink -f /var/www/virtcruise/current` where inventory confirms path.
2. Verify artifact checksum before/after restricted transfer; extract only to a new release directory; verify manifest and approved ownership/modes.
3. Execute backend/schema/configuration steps only from the accepted backend release record; record Flyway pre/post state and service identity.
4. Before frontend cutover, run `sudo nginx -t`; stop if not valid.
5. Create/verify replacement link beside `current`, atomically select the approved release using the reviewed host-specific command, and `sudo systemctl reload nginx` only after validation.
6. Verify active link, public checksums with cache-busting, DNS/TLS/redirects, frontend/assets/packages, API health, logs, auth/ownership, portals, Manual Finance, queues/storage/scanner/SMTP/database/resources.
7. Obtain technical/business acceptance and monitor approved observation window.

### Failure/rollback

Stop on checksum/manifest/schema/config/health/security/data/Finance/customer gate failure. Preserve evidence and invoke RB-02 under authority. Never overwrite release directories or reverse successful additive migration automatically.

### Evidence

Change ID, artifacts/checksums, target paths by reference, config/schema versions, operators/times, commands/actions, validation, acceptance/rollback decision, incidents and follow-up.

## RB-02 — Release rollback

**Trigger:** Predefined release failure or Incident Commander decision. **Owner:** Release Manager/Incident Commander. **Checklist:** [Rollback](PRODUCTION-CHECKLISTS.md#3-rollback-checklist).

1. Record trigger/impact and freeze unrelated changes.
2. Capture current frontend/backend/schema/config and in-flight/outbox/scheduler state.
3. Verify prior immutable targets/checksums and compatibility; distinguish data recovery.
4. For frontend, validate NGINX configuration, atomically select verified prior release, validate/reload, and confirm link/public checksums.
5. For backend, follow approved backend rollback/service procedure; retain applied compatible additive migrations.
6. Validate complete service and reconcile customer/Financial/async consequences.
7. Communicate, monitor, retain failed release/evidence, and open postmortem/follow-up.

Escalate to DR rather than rollback if data/storage/security integrity is compromised.

## RB-03 — Service health triage

**Trigger:** Failed health check, customer/staff outage, alert, high errors/latency. **Owner:** Operations/Platform.

1. Record UTC signal, scope, release/change, impact, request IDs, and known incident.
2. Check DNS/TLS/public frontend/API bounded health, then NGINX/upstream/backend/database/dependencies/resources in order.
3. Compare public failure with loopback/internal approved checks to locate boundary.
4. Inspect query-safe logs around the time/reference; never search/paste secrets or raw customer payload.
5. Check storage/scanner/SMTP/outbox/scheduler and recent changes.
6. Select owner: DNS/cert/NGINX, backend, database, storage/security, SMTP, or vendor.
7. Perform no repeated restart. One controlled service action requires incident/change authority and preserved state.
8. Validate end to end and record root cause as unconfirmed until evidence supports it.

Escalate/declare incident for multi-customer, integrity/security/privacy, Financial, travel-imminent, repeated, or unknown high-impact condition.

## RB-04 — Backup failure

**Trigger:** Failed/late/partial backup, checksum/catalogue/target/capacity alert, restore-test overdue. **Owner:** Backup/Database/Storage owner.

1. Determine affected scope, last known successful recovery point, current RPO risk, and whether database/proof/config backups share cause.
2. Preserve job/storage/security logs; check target availability/capacity, credentials by status/reference, encryption, network, locks/concurrency, retention, and recent change.
3. Do not delete the last good backup or print secret values to troubleshoot.
4. Fix only through approved vendor/config/storage procedure; rerun only when concurrent/prior outcome is known.
5. Verify new backup catalogue/checksum/recovery point and schedule/perform proportionate isolated restore validation.
6. Escalate immediately if RPO may be exceeded, all copies/failure domains affected, proof/financial data at risk, or compromise suspected.

## RB-05 — Controlled restore

**Trigger:** Approved restore test or incident recovery. **Owner:** Database/Storage Recovery Lead. **Checklist:** [Restore](PRODUCTION-CHECKLISTS.md#5-restore-checklist).

1. Record recovery point/version, scope, RPO/RTO/data loss, approvals, isolation and validation plan.
2. Verify backup chain/checksum/encryption access/compatibility and clean capacity.
3. Restore database into isolation using the approved database-specific procedure; validate schema/Flyway/integrity/access/reconciliation.
4. Restore proof/files privately and reconcile metadata/object/permissions/retention/scan state.
5. Restore matching application/config/edge/dependencies/monitoring; validate read-only first.
6. Obtain Security/Finance/Operations/technical acceptance; cut over/re-enable traffic/writes in controlled stages.
7. Reconcile recovery window/outbox/Financial/booking/review/notifications; monitor and document.

No generic database restore command is supplied because format, topology, PITR, credentials, service units, and target are inventory/backup-specific.

## RB-06 — Notification backlog or failure

**Trigger:** Pending/retry age/count, failed/uncertain/manual-intervention, provider alert, customer delivery pattern. **Owner:** Notification Operations/Technical Operations.

1. Verify underlying business event and intent/attempt by safe reference.
2. Determine affected event types/time range/count without exposing recipients/bodies.
3. Check dispatcher service, SMTP provider/account/connectivity, sender DNS/reputation where approved, queue claim/stale state, retry/suppression policy, and recent change.
4. Do not blind resend, purge, relabel, bypass suppression, or alter business state.
5. Recover provider/service/credential via approved owner; release retry/backlog gradually under idempotent policy.
6. Verify accepted attempts, failures, duplicates, backlog trend, logs/alerts and Support wording.

Escalate security for credential/account compromise; Operations/Support for customer impact; vendor through approved account owner.

## RB-07 — Scheduled task missed, stuck, or overlapping

**Trigger:** Missed last-success, abnormal duration, stale claim, overlapping execution, queue not progressing. **Owner:** Scheduled-task/component owner.

1. Identify exact task, schedule/time zone, last known success, claimed work, idempotency/concurrency contract, dependencies, impact.
2. Preserve scheduler/worker/log/queue references and check service/time/database/locks/storage/resources/recent changes.
3. Do not manually start another copy or delete/reset claims until prior outcome and recovery procedure are known.
4. Apply approved stale-claim/recovery action with peer and audit; otherwise escalate to Technical Lead.
5. Verify one effective execution, downstream reconciliation, next scheduled run and alert reset.

Review-case expiry/retention/notification tasks also require their business/policy owner.

## RB-08 — Security or privacy alert

**Trigger:** Suspected compromise, secret/token exposure, malicious proof, unauthorised access, wrong-customer data, audit tampering. **Owner:** Security/Privacy Incident Lead.

1. Stop further exposure/unsafe access; preserve minimum facts, UTC time, safe identifiers and original evidence location.
2. Declare through approved urgent route; restrict communication to need-to-know.
3. Do not open/forward suspicious proof, copy exposed data, rotate/delete evidence without Security direction, or accuse a person.
4. Under Security authority, isolate accounts/services/keys/network/data and preserve chain of custody.
5. Coordinate recovery/rotation/customer/legal actions through approved policy.
6. Validate containment, access, audit, service integrity and monitoring before restoration.

## RB-09 — Capacity pressure

**Trigger:** Disk/inode/database/proof/backup/log memory/CPU/connection/queue pressure. **Owner:** Platform/Database/Storage owner.

1. Record resource, trend/rate, affected service/data, threshold policy, current impact, recent change.
2. Identify legitimate growth versus leak/stuck work/attack and shared failure domains.
3. Protect database/proof/audit/backups first; do not delete data/logs/backups or truncate queues ad hoc.
4. Use approved capacity expansion, retention, rotation, query/workload, or traffic-control procedure with rollback.
5. Verify service/data integrity, backups, alerts/trends, and root problem follow-up.

Escalate before critical exhaustion, not after writes fail. Retention/legal-hold changes need owners.

## RB-10 — Manual Finance capability/configuration incident

**Trigger:** Capability not `MANUAL_FINANCE`, contact details/reference/currency absent/unsafe, unexpected self-service controls, or unstaffed Finance route. **Owner:** Finance/Operations with Technical Operations.

1. Capture customer-safe symptom/reference/time without bank/customer sensitive values.
2. Verify authenticated capability, current release/configuration identifier, affected currency/path, recent change and Support reports.
3. If unexpected bank details/proof controls or privacy/security risk appears, contain customer exposure and declare incident.
4. Finance verifies approved source values through restricted process; Technical Operations compares configuration without printing it.
5. Correct only under approved configuration/change record with backup, peer, restart/rollback, and customer impact plan.
6. Verify `MANUAL_FINANCE`, escaped approved contact instructions, owned reference/currency, unpaid/unconfirmed wording, absence of self-service controls, Support readiness.

Never activate `SELF_SERVICE` as incident workaround.

## RB-11 — Certificate or DNS alert

**Trigger:** Expiry lead-time, renewal failure, invalid chain/name, resolution failure, unauthorised record. **Owner:** Certificate/DNS Owner; Security if compromise.

1. Verify system time, authoritative DNS/certificate metadata, provider status and approved register.
2. Distinguish cache/propagation, certificate renewal, NGINX install, provider/account compromise and application failure.
3. Use approved renewal/reissue/DNS change with peer, prior values, rollback and protected key handling.
4. Validate NGINX before reload; check representative resolvers/clients, TLS chain/names/expiry, redirects, frontend/API.
5. Update register/alerts/change/incident and monitor propagation.

Do not disable TLS, expose private origins, or paste private keys/recovery credentials.

## RB-12 — Database availability or integrity alert

**Trigger:** Database down, connection/lock/storage pressure, integrity/corruption signal, schema mismatch. **Owner:** Database Administrator/Technical Lead.

1. Preserve error/time/release/schema/change and determine availability versus integrity.
2. Stop unsafe writes/changes and declare DR immediately for suspected corruption/data loss.
3. For availability, check service/storage/resources/connections/locks/network/credentials status and recent release/migration under approved access.
4. Do not kill transactions, edit records/Flyway history, vacuum/repair/restart repeatedly, or restore without database owner plan.
5. Recover through approved database procedure or DR; validate schema/integrity/access/application/Financial reconciliation/backups.

## 2. Shift handover runbook

At shift end, record current service/backup/certificate/capacity health, active incidents/changes, open alerts/manual interventions, release/schema/config identity, scheduled work, Finance/Support/customer/travel risk, owners, actions taken, prohibited/paused actions, next checks/updates, evidence links, and acknowledgement. Close privileged sessions and secure temporary evidence.

## 3. Runbook execution record

| Runbook | Change/incident | Trigger/scope | Start/end UTC | Operator/verifier | Pre-state | Actions/evidence | Validation/outcome | Handover/follow-up |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 4. Screenshot placeholders

> **Screenshot required — Figure 2: Health-triage dashboard**  
> Views: Desktop, Tablet, Mobile. Content: fictional DNS/TLS/NGINX/API/database/dependency signals. Alternative text: Layered service health triage from public edge to dependencies. Dependency: approved monitoring platform; redact topology.

> **Screenshot required — Figure 3: Release execution record**  
> Views: Desktop, Tablet. Content: fictional change, immutable targets, gates, rollback, and acceptance. Alternative text: Controlled release record with peer verification. Dependency: approved change system.

## Related documents

- [Production Handover Guide](PRODUCTION-HANDOVER-GUIDE.md)
- [Production Checklists](PRODUCTION-CHECKLISTS.md)
- [Disaster Recovery Guide](DISASTER-RECOVERY-GUIDE.md)
- [Production Beta Operations](../PRODUCTION-BETA.md)
- [Frontend Operations](../OPERATIONS-v0.2.0.md)
- [Frontend Deployment](../DEPLOYMENT-v0.2.0.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial production operations runbook set | Draft |
