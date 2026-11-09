# Document Templates

| Field | Value |
|---|---|
| Document ID | DOC-001-DT |
| Version | 0.8.0-draft.1 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Standard document template

```markdown
# [Approved document title]

| Field | Value |
|---|---|
| Document ID | DOC-[NNN] |
| Version | [product version]-draft.[N] |
| Product version | [applicable version or range] |
| Status | Draft |
| Owner | [role or named owner] |
| Reviewer | [role or named reviewer] |
| Approver | [role or named approver] |
| Classification | Customer confidential — NDA required |
| Last reviewed | YYYY-MM-DD |

## 1. Purpose
[Reader outcome and business reason.]

## 2. Audience
[Primary and secondary roles.]

## 3. Scope
### Included
- [Included subject]
### Excluded
- [Explicit boundary]

## 4. Prerequisites
- [Access, knowledge, or earlier task]

## 5. [Content organised by reader task]

## Related documents
- [DOC-NNN, title and relative link]

## Change history
| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| [version] | YYYY-MM-DD | [author] | Initial draft | Draft |
```

## 2. Procedure template

```markdown
### [Verb-led task title]

**Applies to:** [role]
**Prerequisites:** [access, state, and inputs]
**Expected outcome:** [observable result]

> **Warning:** [Consequence and safe action, when needed.]

1. [Open/select/enter an exact item.]
2. [Action and expected response.]
3. [Confirm the outcome.]

**If this does not work:** [safe recovery, evidence to collect, and escalation route]
```

## 3. Reference topic template

```markdown
## [Concept or object]

[One-sentence definition.]

| Property/state | Meaning | Set by | Next valid action/state |
|---|---|---|---|
| [value] | [business meaning] | [role/system] | [value/action] |

**Used by:** [roles and workflows]
**Related:** [authoritative cross-references]
```

## 4. Quick start template

```markdown
# [Role] quick start

**For:** [role]
**Time:** About [N] minutes
**Outcome:** [first useful result]

## Before you begin
- [Access and safe sample data]

## Complete your first [task]
1. [Action]
2. [Action]
3. [Verify result]

## What to do next
- [Next task and link]

## Get help
[Support route and information safe to provide]
```

## 5. Review record template

```markdown
| Gate | Responsible role | Decision | Date | Evidence/notes |
|---|---|---|---|---|
| Content review | Reviewer | Pending | — | — |
| Business approval | Approver | Pending | — | — |
| Customer approval | Customer approver | Not required/Pending | — | — |
| Publication | Publisher | Pending | — | — |
```

## 6. Diagram specification template

Before creating a diagram, record its purpose, intended audience, diagram type, actors/components, boundaries, start and end, exceptional flows, accessibility summary, source-file location, and product version. A reviewer must be able to compare the diagram to its stated source of truth.

## 7. Template use

Copy only the template appropriate to the content. Remove placeholder text and unused optional fields. Do not weaken required metadata, safety, classification, review, or change-history fields.
