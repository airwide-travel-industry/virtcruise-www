# VirtCruise Production Checklists

| Field | Value |
|---|---|
| Document ID | DOC-010-CL |
| Version | 0.8.0-draft.1 |
| Product version | v0.8.0 target; accepted release baseline v0.7.0 |
| Status | Draft |
| Owner | Operations Lead |
| Classification | Confidential — VirtCruise Production Operations |
| Last reviewed | 2026-08-03 |

## 1. Use and evidence

These checklists prompt approved runbooks; they do not grant access or replace judgment, policy, the [Production Handover Guide](PRODUCTION-HANDOVER-GUIDE.md), or the [Operations Runbook](OPERATIONS-RUNBOOK.md). Record `Yes`, `No`, or `N/A` with evidence. Resolve applicability with the activity owner. A blocking `No`, unknown rollback, missing authority, or missing recoverable backup stops the activity.

Never attach secrets, environment contents, proof/customer data, private host inventory, or raw query strings. Use approved references.

## 2. Deployment checklist

### Identity and authority

- [ ] Change/release reference, scope, window, environment, approver, deployer, verifier, acceptance owner, incident commander, and rollback authority recorded.
- [ ] Approved immutable frontend/backend versions, tags/commits, manifests, checksums, provenance, release notes, and known limitations match.
- [ ] Current and previous frontend/backend/schema/configuration identities and compatibility recorded from authoritative inventory.
- [ ] Required access is individual, least-privilege, tested, and time-bounded/elevated under policy.

### Readiness

- [ ] Architecture/dependency/configuration/schema/route/mode changes reviewed by affected owners.
- [ ] `MANUAL_FINANCE` baseline and Finance/Support readiness confirmed; no unauthorised `SELF_SERVICE` activation.
- [ ] Recent database, proof/file, and configuration backups succeeded; restore evidence is current against approved RPO/RTO.
- [ ] Rollback target, trigger, steps, data/schema boundary, authority, and validation rehearsed/reviewed.
- [ ] Baseline DNS/TLS/frontend/API/NGINX/backend/PostgreSQL/storage/scanner/SMTP/outbox/scheduler/log/capacity health captured.
- [ ] Customer/staff impact, maintenance/alert suppression, support wording, stakeholder and next-update plan approved.

### Stage and activate

- [ ] Artifact transferred to restricted temporary location and checksum verified before extraction.
- [ ] New immutable release path created; no existing release or working tree overwritten.
- [ ] Server-side manifest, ownership/modes, configuration references, capacity, and schema migration plan verified without exposing secrets.
- [ ] Backend/database action follows approved backend runbook; migration pre/post state recorded; successful additive migration not treated as rollback target.
- [ ] NGINX configuration validates before atomic frontend link switch/reload; unrelated services remain untouched.
- [ ] Every command/action and deviation recorded with UTC time and peer verification.

### Acceptance and closure

- [ ] DNS/TLS/redirects, public frontend/assets/package routes, API health, exact release/checksums, and direct-port restrictions pass.
- [ ] Authentication/session/CORS/CSRF and ownership boundaries pass through an approved safe validation.
- [ ] Catalogue, customer/Finance portals, Manual Finance, queues/outbox/scheduler, proof storage/scanner, SMTP, database, logs, disk/memory/CPU show expected state.
- [ ] No unapproved production write test was used; any approved synthetic transaction has exact cleanup/audit evidence.
- [ ] Technical and business acceptance recorded; observation window/alerts/customer impact monitored.
- [ ] Change closed or rollback invoked; evidence, inventory, Support handover, risks, and follow-up updated.

## 3. Rollback checklist

- [ ] Incident/change and rollback authority, trigger, customer/security/financial impact, and communication owner recorded.
- [ ] Current active targets/checksums/schema/configuration and in-flight queues/work preserved before change.
- [ ] Prior immutable frontend/backend targets and application/schema/config compatibility verified.
- [ ] Frontend, backend, configuration, and data recovery scopes explicitly separated.
- [ ] Database restore is excluded unless separately approved with recovery point/data-loss/reconciliation plan.
- [ ] Frontend prior target selected atomically; NGINX syntax validated before reload.
- [ ] Backend prior target selected only through approved backend service runbook; no repeated restart.
- [ ] Successful additive Flyway migrations remain unless an approved database recovery plan states otherwise.
- [ ] DNS/TLS/frontend/API/authentication/Manual Finance/portals/queues/outbox/storage/scanner/SMTP/database/logs/capacity validated.
- [ ] Data/Financial/customer effects reconciled and duplicate/out-of-order effects checked.
- [ ] Support/customer update and incident status issued through approved owner.
- [ ] Failed release retained for evidence; rollback outcome, residual risk, follow-up/postmortem recorded.

## 4. Backup checklist

### Configuration

- [ ] Approved RPO/RTO, scope, schedule/time zone, retention, encryption, location/failure domain, owner/backup owner, and alert route recorded.
- [ ] PostgreSQL backup/PITR method, roles/extensions/schema needs, and consistency controls documented.
- [ ] Private proof/file backup preserves metadata/object linkage, permissions, encryption, retention/legal holds, and scanner-state handling.
- [ ] Immutable application artifacts/manifests/checksums and non-secret configuration are recoverable.
- [ ] Secret/JWT/SMTP key recovery uses approved secret manager/security process, not ordinary backup/export.
- [ ] NGINX/TLS/DNS/monitoring/log/audit configuration and recovery ownership included as policy requires.

### Execution and evidence

- [ ] Backup destination capacity, credentials by reference, encryption, write protection/immutability, and network access healthy.
- [ ] Job completed without unresolved warning; start/end, size/count, checksum/catalogue, recovery point, and target recorded.
- [ ] Backup monitoring/age alerts and failure escalation function.
- [ ] Backup can be located/decrypted by authorised backup owner without displaying secrets.
- [ ] Retention removed only eligible backups and preserved holds/audit requirements.
- [ ] Last isolated restore test/date/result meets policy; failures/gaps have owners/dates.

## 5. Restore checklist

- [ ] Incident/change, authority, scope, target recovery point/version, approved RPO/RTO, expected data loss, customer/Finance/privacy impact recorded.
- [ ] Affected writes/traffic quiesced or isolated where required; evidence preserved.
- [ ] Clean isolated restore target, capacity, network/security controls, and operators available.
- [ ] Backup identity, chain/completeness, checksum, encryption access, schema/config/application compatibility verified.
- [ ] Platform/DNS/TLS/secret references restored by approved owners before dependent service.
- [ ] PostgreSQL restored and validated for engine, schema/Flyway history, integrity, counts, roles/access, time, and reconciliation.
- [ ] Proof/files restored and metadata/object identities, permissions, retention/holds, quarantine/scan state, missing objects, and capacity reconciled.
- [ ] Application artifacts/configuration, NGINX, monitoring, scheduled tasks, scanner, SMTP/outbox restored in dependency order.
- [ ] Health, logs, authentication/ownership, catalogue, Manual Finance, portals, Financial totals, review cases, outbox/notifications, proof controls pass.
- [ ] Security, Finance/Operations, technical, and incident-command acceptance obtained as affected.
- [ ] Traffic/writes re-enabled in controlled stages with enhanced monitoring and communication.
- [ ] Recovery window reconciled; evidence, lost/unreplayed work, residual risk, and postmortem recorded.

## 6. Daily operations checklist

- [ ] Read handover, incidents, changes, vendor notices, travel-imminent/customer/financial risks; confirm on-call owners/routes.
- [ ] Check external DNS/TLS/frontend/API health and certificate expiry alert.
- [ ] Check NGINX/backend/PostgreSQL/proof storage/ClamAV/SMTP service availability and recent failures/restarts.
- [ ] Check database backup age/result, storage/disk/inodes, connections/locks, and capacity trend.
- [ ] Check proof scan failures/missing objects/storage capacity and keep unsafe proof closed.
- [ ] Check outbox pending/retry/failed/uncertain/manual-intervention and scheduler last success/stale claims; no blind resend/replay.
- [ ] Check review/integration/projection/Financial reconciliation queues through approved operations sources.
- [ ] Confirm production remains approved `MANUAL_FINANCE` and contact route/customer wording is operational.
- [ ] Review security/privacy/authentication/logging/monitoring anomalies without copying sensitive content.
- [ ] Assign owners/next checks to exceptions and issue approved Support handover.
- [ ] At end of day, reconcile changes/incidents, hand over open work, secure sessions/evidence, and record status.

## 7. Weekly maintenance checklist

- [ ] Review service/capacity/error/latency/queue/backup trends and recurring incidents.
- [ ] Review available OS/runtime/PostgreSQL/NGINX/ClamAV/vendor advisories under change policy; do not patch ad hoc.
- [ ] Verify ClamAV signature currency/scan health and proof storage access/capacity.
- [ ] Verify backup catalogue, failure alerts, retention behavior, and next restore test.
- [ ] Review certificate/DNS/vendor account health and expiry/renewal lead times.
- [ ] Review scheduler/outbox stale work and controlled recovery evidence.
- [ ] Review individual/privileged access changes and departed/changed-role actions with access owner.
- [ ] Validate dashboards/alerts/runbook links/on-call routes and one rotating alert path.
- [ ] Review open changes, postmortem actions, known risks, and Support/Finance trends.
- [ ] Record owner/date for every gap; do not silently carry an unknown.

## 8. Monthly maintenance checklist

- [ ] Review inventory accuracy: servers, services, versions, ports, directories, storage, certificates, DNS, backups, vendors, owners.
- [ ] Review release/backend/schema/configuration dependency matrix and rollback targets.
- [ ] Review capacity forecast for database, proof/file storage, backups, logs, memory, CPU, and network.
- [ ] Review RPO/RTO, retention, severity, alerts, maintenance, Finance SLA/mode/contact, and other policy-owned values for approval/currency.
- [ ] Complete scheduled isolated restore sample or confirm due date; track data/application/business validation.
- [ ] Review secret/key/certificate rotation schedule and recovery access through Security without exporting values.
- [ ] Review firewall/direct-port/CORS/admin-route/Swagger/TLS/log-safety controls.
- [ ] Reconcile backup, audit/log retention, legal hold, proof retention, and privacy access.
- [ ] Review incident/problem trends, postmortem actions, vendor resilience, and single points of failure.
- [ ] Update handover package/registers only through documentation/change review; obtain owner approval.

## 9. Disaster recovery checklist

- [ ] Detect/declare incident; assign Incident Commander, severity under policy, technical/domain/communication owners and review cadence.
- [ ] Protect life/safety/data; contain exposure/corruption/unsafe writes; preserve logs, releases, configuration identities, and evidence.
- [ ] Determine affected infrastructure/data/services, failure domain, dependencies, business/customer/Finance/privacy impact.
- [ ] Select approved recovery strategy and recovery point against RPO/RTO; obtain data-loss and cutover authority.
- [ ] Verify backups, secret/DNS/certificate/vendor access, clean recovery capacity, and rollback/fallback of recovery.
- [ ] Recover in priority order: control/security, routing/TLS, database/storage integrity, authentication, API/frontend, business operations, notifications, full monitoring.
- [ ] Validate every restored component and reconcile Financial/review/proof/outbox/booking consequences separately.
- [ ] Restore traffic/writes in controlled stages; monitor and communicate approved facts.
- [ ] Record unmet RPO/RTO, lost/delayed work, customer remediation, residual risk, and follow-up.
- [ ] Complete postmortem, action ownership, inventory/runbook updates, evidence retention, and recovery-access cleanup.

## 10. Checklist record

| Checklist | Activity reference | Date/time UTC | Operator | Verifier | Blocking No/N/A rationale | Result/follow-up |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## Related documents

- [Production Handover Guide](PRODUCTION-HANDOVER-GUIDE.md)
- [Operations Runbook](OPERATIONS-RUNBOOK.md)
- [Disaster Recovery Guide](DISASTER-RECOVERY-GUIDE.md)
- [DOC-003 Back Office Operations Manual](BACK-OFFICE-OPERATIONS-MANUAL.md)
- [DOC-004 Finance SOP](../finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial controlled production checklist set | Draft |
