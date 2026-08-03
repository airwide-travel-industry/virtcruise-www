# Versioning and Review

| Field | Value |
|---|---|
| Document ID | DOC-001-VR |
| Version | 0.8.0-draft.1 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Document lifecycle

| State | Meaning | Entry criteria | Permitted distribution | Exit authority |
|---|---|---|---|---|
| Draft | Content is being authored and may be incomplete | Owner and scope assigned | Authors and nominated contributors | Author submits |
| Internal Review | Content is complete enough for subject, editorial, security, and business review | Self-review complete; open assumptions marked | Internal reviewers only | Reviewer recommends |
| Customer Review | A controlled candidate is ready for customer feedback | Internal findings resolved; NDA and recipient confirmed | Named customer reviewers and internal team | Customer approver responds |
| Approved | Required approvers accept the content | Decisions and conditions recorded; no blocking findings | Approved stakeholders; not yet the released package unless publication is complete | Publisher releases |
| Released | Immutable version is the current published source | Approval, packaging, link/privacy checks, and publication record complete | Authorised audience according to classification | Owner supersedes or retires |
| Archive | Version is superseded or retired and retained for traceability | Replacement or retirement decision recorded | Controlled historical access; clearly marked not current | Records owner disposes under policy |

“Customer Review” is optional when the document owner records that customer approval is not required. A document cannot move directly from Draft to Released.

## 2. Version scheme

Released documents align their major and minor number to the applicable VirtCruise product release where behaviour matters, for example `0.8.0`. Draft iterations append `-draft.N`; review candidates append `-review.N`. An approved unpublished candidate may use `-approved.N`. The released form removes the suffix.

For governance content not bound to application behaviour, increment:

- major for a breaking governance or audience contract change;
- minor for a new standard, template, or material scope;
- patch for a compatible clarification or correction.

Do not silently edit a released package. Correct it in source, complete proportionate review, issue a new version, and retain the superseded version in the publication record.

## 3. Roles

| Role | Accountability |
|---|---|
| Author | Plans and writes accurate, audience-appropriate content; resolves findings |
| Reviewer | Checks subject accuracy, usability, editorial quality, security/privacy, links, and evidence |
| Approver | Accepts business risk, scope, and readiness for publication |
| Customer approver | Accepts customer suitability or records required changes when customer approval is in scope |
| Publisher | Verifies approval, creates the controlled package, records publication, and limits distribution |
| Document owner | Maintains currency, schedules review, manages supersession, and initiates retirement |

One person may fill more than one role only when business controls allow it. The author must not be the sole approver of a customer release.

## 4. Review workflow

1. The owner records purpose, audience, scope, dependencies, classification, reviewers, approver, and target product version.
2. The author creates content from accepted sources and records assumptions and traceability.
3. The author performs the quality checklist and submits a fixed version for Internal Review.
4. Subject, editorial, privacy/security, and audience reviewers record findings as blocking or advisory.
5. The author resolves blocking findings and records dispositions. Material changes are re-reviewed.
6. The approver records approval or rejection. If required, the publisher sends the fixed candidate to named customer reviewers after confirming NDA coverage.
7. Customer feedback is resolved and the customer approver records approval, conditions, or rejection.
8. The publisher verifies final content, version, classification, approvals, links, packaging, and absence of draft/internal material.
9. The publisher releases the immutable package and records its location, audience, date, source commit, and checksum where used.
10. The owner monitors dependencies and starts review when a trigger occurs.

## 5. Review criteria

Reviewers verify consistency, completeness, naming, cross-references, audience suitability, technical and business accuracy, accessibility, confidentiality, and version applicability. Procedures also require observable outcomes, safe exception handling, and clear escalation.

## 6. Change history

Each document contains:

| Version | Date | Author | Change | Status |
|---|---|---|---|---|

Describe reader-visible or governance-significant change, not file mechanics. The repository history remains the detailed revision record. The publication record links a release to its source commit and approvals.

## 7. Review cadence and triggers

Review released documents at least every 12 months, or sooner when product behaviour, navigation, roles, regulation, business control, support insight, security guidance, branding, or a linked authoritative source changes. High-risk finance and production procedures should be reviewed at least every 6 months.

An owner assesses every relevant product release. “No change required” is a valid recorded outcome but does not extend a mandatory review indefinitely.

## 8. Retirement and archive

The owner proposes retirement, identifies the replacement or explains why none exists, assesses inbound links and customer impact, and obtains approver consent. The publisher removes the document from current navigation, marks archived copies with status and replacement, and preserves the publication and approval record. Never delete a released record solely because it is no longer current.

## 9. Publication controls

Before customer publication, confirm NDA coverage, named recipients, correct access class, customer approval requirement, and removal of internal comments, engineering-only links, credentials, personal data, and tracked changes. Publish only the approved version and keep evidence of what was distributed.
