# VirtCruise Disaster Recovery Guide

| Field | Value |
|---|---|
| Document ID | DOC-010-DR |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted release baseline v0.7.0 |
| Status | Draft |
| Owner | Platform Owner |
| Reviewer | Operations, Security/Privacy, Database, Finance, Support, and Technical leads |
| Approver | Business Owner |
| Classification | Confidential — VirtCruise Production Operations |
| Last reviewed | 2026-08-03 |

## 1. Purpose and authority

Recover VirtCruise from material infrastructure, data, storage, certificate, DNS, SMTP, or application failure with controlled data loss, secure evidence, explicit ownership, and verified business service. This guide does not supply credentials, live hostnames beyond accepted public endpoints, or policy-owned recovery objectives.

A declaration does not authorise every action. Incident command assigns approved operators and owners. Database restore, DNS cutover, key/certificate action, and data-loss acceptance require their domain approvals. Use [Production Checklists](PRODUCTION-CHECKLISTS.md#9-disaster-recovery-checklist).

## 2. Recovery objectives and priorities

The Business/Platform/Security owners must approve RPO and RTO by service/data class in the restricted register. Until values are approved, do not promise recovery time or acceptable data loss; record the governance blocker.

| Priority | Capability | Reason |
|---:|---|---|
| 1 | Incident command, secure access, evidence, communication, containment | Prevent harm and uncontrolled changes |
| 2 | DNS, network, TLS, NGINX/control boundary | Establish trusted routable service edge |
| 3 | PostgreSQL and private proof/file integrity | Protect authoritative data and evidence |
| 4 | Authentication/security keys/time | Restore safe identity/session boundary |
| 5 | Backend API and static frontend | Restore core customer/staff access |
| 6 | Manual Finance/customer, Finance, booking and operational paths | Restore priority business operations |
| 7 | Scanner, SMTP/outbox, schedulers, monitoring/logging | Resume safe dependent/asynchronous work |
| 8 | Reconciliation, normal capacity, backlog, long-term remediation | Return to controlled steady state |

Priorities may change for active privacy/security exposure, imminent travel, increasing Financial loss, or dependency constraints. Record the decision.

## 3. Command and communication

| Role | Responsibility during recovery |
|---|---|
| Incident Commander | Declares, sets cadence/priorities, approves coordinated restoration/closure |
| Platform Recovery Lead | Infrastructure, network, DNS/TLS/NGINX, service recovery |
| Database/Storage Lead | Database/proof backup selection, restore, integrity evidence |
| Security/Privacy Lead | Containment, access/keys, evidence, exposure, safe restoration |
| Application/Technical Lead | Release/config/schema compatibility and service validation |
| Finance/Operations Lead | Financial/review/booking reconciliation and business acceptance |
| Support Communication Lead | Approved customer/staff communication and case coordination |
| Recorder | UTC timeline, decisions, owners, commands by reference, evidence, risks |

Use an approved incident channel and out-of-band route if primary systems fail. Never place secrets, proof/customer data, private topology, or exploit detail in broad communications.

## 4. Universal recovery sequence

```text
Signal → verify/declare → contain/freeze/preserve → assess failure domain
→ choose recovery point/strategy → prepare clean dependencies
→ restore data/storage → restore security/application/edge
→ validate/reconcile → controlled traffic/writes → monitor/communicate
→ close/postmortem
```

**Figure 1 — Universal recovery sequence.** If validation fails, return to assessment; do not continue to traffic restoration.

### Declaration record

Record incident ID, start/detection UTC, commander/owners, policy severity, affected capabilities/data/regions, current releases/schema/config, last known good time, backup status, proposed RPO/RTO outcome, customer/financial/privacy/travel impact, containment, next update, and approval references.

### Strategy decision

| Condition | Preferred strategy | Prohibited shortcut |
|---|---|---|
| Healthy prior immutable binary; data intact | Controlled application rollback | Database reversal without analysis |
| Host/service lost; backup/data healthy | Rebuild from approved inventory/artifacts/config/secrets | Copy unknown working directory |
| Database corrupt/lost | Isolated point-in-time/full restore then controlled cutover | Edit tables/Flyway history manually |
| Proof storage lost | Restore private storage and reconcile metadata/scan/retention | Accept emailed/local copies |
| DNS/TLS boundary failed | Provider/certificate recovery or approved alternate boundary | Disable TLS or publish private origin |
| SMTP failed | Controlled degraded service/provider recovery; preserve outbox | Blind resend/change business state |

## 5. Infrastructure loss

### Indicators

Host/provider unavailable, filesystem loss, network failure, simultaneous frontend/API/database loss, or management-plane inaccessibility.

### Recovery

1. Confirm failure domain with provider/network evidence and stop automated flapping/rebuild attempts.
2. Invoke vendor recovery and approved break-glass access; record use and rotate/review afterward.
3. Determine whether database/proof storage share the failure domain and preserve available snapshots/logs.
4. Provision/recover a clean approved environment from the restricted server/network inventory.
5. Restore firewall, time, DNS/TLS/NGINX, service identities, volumes, and secret references through owners.
6. Restore database/storage according to sections 6–7; install immutable application artifacts/configuration.
7. Validate direct-port restrictions and every dependency before traffic.
8. Reconcile recovery window, queued work, Financial effects, and customer impact.

### Acceptance

Asset/inventory matches; security baseline passes; authoritative data/storage reconcile; services/monitoring/backups work; technical, Security, Finance/Operations, and incident command approve.

## 6. Database corruption or loss

### Indicators

Integrity errors, unreadable storage, missing/incorrect records across authoritative queries, failed startup/recovery, or confirmed accidental destructive change.

### Containment

Stop or isolate writes as approved; preserve database/WAL/log/snapshot evidence; revoke unsafe automation/access if needed; do not run ad hoc repair or overwrite the only copy.

### Recovery

1. Database Lead identifies corruption scope/last known good time and compares full backup/PITR options.
2. Incident Commander and business/Finance owners approve recovery point and expected data loss/replay/reconciliation plan.
3. Restore to an isolated clean target; verify engine/extension/schema/Flyway compatibility and access controls.
4. Run approved integrity checks, counts, reference uniqueness, Financial reconciliation samples, review/proof metadata linkage, and audit/time checks.
5. Pair with matching application/configuration; validate read-only business paths and safe synthetic checks if separately approved.
6. Quiesce/capture final state as required and cut over under a recorded plan with rollback/fallback.
7. Reconcile transactions/events/notifications between recovery point and incident; never replay blindly or create duplicates.
8. Monitor errors/locks/storage/backups and retain the corrupt source for investigation under policy.

### Acceptance

Recovery point/data loss documented; schema/integrity pass; Finance confirms Payment/allocation/Receipt/Ledger/invoice reconciliation; Operations confirms booking/review/outbox implications; Security confirms access/audit; backups resume.

## 7. Proof or file-storage loss

### Indicators

Unavailable mount/object store, metadata without object, permission failures, capacity exhaustion, corrupt objects, or scanner unable to access private storage.

### Recovery

1. Stop proof viewing/review decisions dependent on affected evidence; never substitute emailed/local copies.
2. Determine metadata/object/capacity/permission/scan scope and security/privacy exposure.
3. Preserve storage/scan/application logs and object metadata without opening unsafe files.
4. Repair service/access only through approved configuration; otherwise restore encrypted backup to isolated private storage.
5. Reconcile database metadata to objects, identities/checksums where maintained, permissions, current/superseded status, quarantine/scan state, retention, and legal holds.
6. Treat restored proof as untrusted according to accepted scan state/process; restore scanner/signature availability.
7. Resume access gradually; Finance confirms current accepted/clean proof availability, not document authenticity or funds.

### Acceptance

No public access; permissions/encryption/capacity healthy; reconciliation exceptions owned; scanner works; audit/retention preserved; Finance/Privacy/Security approve resumed review.

## 8. Certificate expiry or compromise

### Expiry/renewal failure

Confirm system time, affected names/chain/expiry, renewal account/challenge/DNS/HTTP dependency. Renew/reissue via approved owner, install without exposing key, validate NGINX configuration, reload only boundary, verify both public names/trust/expiry, and monitor.

### Private-key compromise

Treat as security incident: contain affected key/access, revoke/reissue through certificate authority, rotate related credentials where required, deploy new key/certificate securely, validate, investigate exposure window, preserve evidence, and communicate under Security direction. Never reuse or share compromised key material.

### Acceptance

Trusted chain/names/current time pass from representative clients; old compromised certificate revoked where applicable; renewal monitoring/register updated; no insecure HTTP workaround remains.

## 9. DNS failure or loss of control

1. Confirm authoritative DNS, registrar/provider status, record/TTL/DNSSEC/challenge behavior, and whether local caching is misleading.
2. Use approved provider recovery/multi-factor/break-glass contacts; treat unauthorised change/account loss as Security incident.
3. Compare records with last approved zone/register; avoid simultaneous unrelated application changes.
4. Restore approved frontend/API records with peer verification and record previous/new values.
5. Verify authoritative and representative recursive results, TLS names, frontend/API health, and propagation; communicate uncertainty without promising global time.
6. Restore intended TTL/security settings after stabilisation.

Do not expose private origin/management addresses or disable TLS to bypass DNS.

## 10. SMTP failure

1. Verify underlying business events independently and inspect authoritative outbox/attempt states.
2. Check SMTP provider status/account/authentication/rate/connection, sender-domain DNS/reputation signals where approved, dispatcher service, queue age, and recent change.
3. Preserve committed intents; do not purge, relabel, blind resend, bypass suppression, or change booking/payment state.
4. Recover credentials/provider/service through approved owners; apply retry policy and idempotency.
5. Give Support approved wording and alternative operational communication only under policy.
6. Validate a controlled message through approved method, then drain/recover gradually while checking duplicates/failures.

Acceptance requires dispatcher/provider health, bounded backlog, correct attempt histories, no duplicate effective messages, and Support/Operations acknowledgement.

## 11. Application service failure

### Triage

Check DNS/TLS/NGINX, public/loopback health, service state/restart count, logs by request ID/time, release/config/schema identity, PostgreSQL, storage/scanner/SMTP, queues/scheduler, resources, and recent changes.

### Recovery choices

- Correct external dependency/capacity only under its runbook.
- Perform one controlled service action after preserving evidence and in-flight/idempotent context.
- Roll back to a verified compatible binary when a release caused failure.
- Restore data only when corruption/loss is established and separately authorised.

Never restart repeatedly, change database records, delete queues, or deploy an unverified build to make health green.

Acceptance requires stable health/restart count, correct identity/schema/config, authentication/ownership, business reads, Manual Finance, queues/outbox/scheduler, storage/scanner/SMTP, safe logs, and observation window.

## 12. Recovery validation matrix

| Domain | Validation | Acceptance owner |
|---|---|---|
| Infrastructure | Inventory, access, firewall, time, capacity, service start order | Platform/Security |
| DNS/TLS/NGINX | Resolution, chain/names/expiry, redirects, config, routes, direct-port denial | Platform/Security |
| Database | Recovery point, schema/Flyway, integrity, access, backup resumed | Database/Technical |
| Proof storage | Metadata/object/permission/scan/retention reconciliation | Security/Finance |
| Application/auth | Release/config identity, health, login/session/CORS/CSRF/ownership | Technical/Security |
| Customer/business | Catalogue, booking/Financial views, Manual Finance, staff queues | Operations/Finance/Support |
| Financial | Payment/allocation/Receipt/Ledger/invoice/account consistency | Finance |
| Async | Outbox, SMTP, scheduler, stale claims, duplicate prevention | Operations/Technical |
| Observability | Logs/metrics/alerts/backups and on-call routes active | Operations/Platform |

## 13. Reconciliation after recovery

Define the recovery window and compare source events to projections/outcomes. Finance reconciles Financial records; Operations reconciles booking/review/notification consequences; Support identifies affected communications; Security/Privacy handles exposure and audit. Do not infer missing work from a dashboard total or replay everything since a guessed time.

Record lost, delayed, duplicated, uncertain, or manual-intervention items with exact safe references and owners. Customer remediation follows approved policy and communication.

## 14. Postmortem and readiness restoration

Within the approved policy window, document timeline, impact, detection, containment, recovery point/strategy, RPO/RTO achieved, validation, facts versus hypotheses, contributing technical/operational/governance factors, helpful/failed controls, customer/data/financial outcome, actions/owners/dates, and residual risk.

Restore normal access, monitoring thresholds, scheduled work, backup protection, vendor status, and on-call handover. Rotate/review break-glass access and temporary credentials/configuration. Update inventory/runbooks only through reviewed documentation/change records.

## 15. Printable disaster-recovery record

| Field | Entry |
|---|---|
| Incident / declaration UTC / commander |  |
| Severity policy reference |  |
| Scope and failure domain |  |
| Last known good / selected recovery point |  |
| Approved RPO/RTO / expected and actual result |  |
| Backup/release/schema/config identifiers |  |
| Containment / evidence references |  |
| Recovery strategy / owners / approvals |  |
| Validation and reconciliation references |  |
| Traffic/write restoration UTC / authority |  |
| Customer communication / residual risk |  |
| Postmortem/action record |  |

## 16. Screenshot placeholders

> **Screenshot required — Figure 2: Disaster recovery command board**  
> Views: Desktop, Tablet, Mobile. Content: fictional incident, recovery priorities, owners, and validation gates. Alternative text: Recovery sequence with current stage and accountable roles. Dependency: approved incident platform; no live topology/customer data.

> **Screenshot required — Figure 3: Isolated restore validation**  
> Views: Desktop, Tablet. Content: fictional backup/recovery point and pass/fail domains. Alternative text: Restore validation matrix before controlled cutover. Dependency: approved backup platform; no credentials/storage paths.

## Related documents

- [Production Handover Guide](PRODUCTION-HANDOVER-GUIDE.md)
- [Production Checklists](PRODUCTION-CHECKLISTS.md)
- [Operations Runbook](OPERATIONS-RUNBOOK.md)
- [DOC-003 Back Office Operations Manual](BACK-OFFICE-OPERATIONS-MANUAL.md)
- [DOC-004 Finance SOP](../finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md)
- [DOC-005 Support Playbook](../support/CUSTOMER-SUPPORT-PLAYBOOK.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial disaster recovery playbook | Draft |
