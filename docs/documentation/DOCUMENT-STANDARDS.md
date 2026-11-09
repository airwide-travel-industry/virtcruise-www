# Document Standards

| Field | Value |
|---|---|
| Document ID | DOC-001-DS |
| Version | 0.8.0-draft.1 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Document identity and titles

Use a unique `DOC-NNN` program ID for a governed deliverable. Supporting governance files use the parent ID and a short suffix. The H1 is the approved customer-readable title; include the ID in metadata, not in the title. Use one H1 only.

File names use uppercase ASCII words separated by hyphens and end in `.md`, for example `CUSTOMER-USER-GUIDE.md`. Image names use the convention in [Screenshot Standards](SCREENSHOT-STANDARDS.md). Do not encode draft status in the file name; status belongs in metadata.

## 2. Required front matter

Every governed document begins with a metadata table containing Document ID, Version, Status, Owner, Classification, and Last reviewed. Add Product version, Reviewer, Approver, and Publication date when applicable.

Every document includes Purpose, Audience, Scope, Prerequisites where relevant, Related documents, and Change history. Procedures also state expected outcome and escalation or recovery.

## 3. Headings and numbering

Use sentence case headings and no trailing punctuation. Number H2 sections in long reference documents and manuals. Use unnumbered H3/H4 headings within them unless contractual or regulated referencing requires deeper numbering. Do not skip heading levels or exceed H4. Short guides may use unnumbered headings.

Number procedural steps only when order matters. Use bullets for unordered choices or checks. Restart numbering for each task.

## 4. Cross-references

Within Markdown, use descriptive relative links. In prose and exported formats, identify the document and section: “See DOC-004, *Finance Standard Operating Procedures*, ‘Refund approval’.” Never use “click here,” page numbers as the sole reference, or links to a writer's local file system.

Links to engineering evidence are traceability links and must be removed from customer packages unless approved. Do not duplicate authoritative definitions; link to DOC-007.

## 5. Version history and revision control

The canonical source is Git. A logical documentation change is reviewed as one change set and uses a documentation commit subject. The in-document change history records released or review-significant content changes, not spelling-only changes. Follow [Versioning and Review](VERSIONING-AND-REVIEW.md) for states and version rules.

## 6. Terminology

Use the approved terms in [Style Guide](STYLE-GUIDE.md) and DOC-007 when available. Introduce an unavoidable acronym in full on first use, followed by the acronym in parentheses. Do not create synonyms for navigation labels, roles, or business states.

## 7. Callouts

Use only these labels:

> **Note:** Helpful context that is not required to complete the task.

> **Important:** Information required for a correct or successful outcome.

> **Warning:** A credible risk of loss, privacy exposure, financial impact, service interruption, or difficult recovery.

> **Example:** A realistic illustration using fictional data.

Put a callout immediately before the affected action. State the consequence and safe action. Do not use callouts for routine prose or rely on colour alone.

## 8. Screenshots and diagrams

Screenshots follow [Screenshot Standards](SCREENSHOT-STANDARDS.md), have a numbered caption, meaningful alternative text, and a nearby textual explanation. A screenshot supports instructions; it never replaces them.

Diagrams must use a white or transparent background, accessible contrast, readable labels at export size, and a legend for non-standard symbols. Source files are retained beside or beneath the document asset directory. Use these shapes consistently:

| Meaning | Shape | Convention |
|---|---|---|
| Start or end | Rounded rectangle | Verb or outcome label |
| Activity or component | Rectangle | Short noun or verb phrase |
| Decision | Diamond | Question; branches labelled with outcomes |
| Data store or record | Cylinder | Singular business noun |
| External actor/system | Rectangle with dashed border | Name and “external” label |
| Flow | Solid arrow | Direction of activity or dependency |
| Optional/exception flow | Dashed arrow | Label the condition |
| Trust or ownership boundary | Dashed container | Name the owner or boundary |

Diagram types have distinct emphasis:

- business process: roles or swimlanes, decisions, controls, and outcomes;
- architecture: components, boundaries, interfaces, and data direction;
- workflow: state or task sequence, exceptions, and ownership;
- navigation: page hierarchy and permitted routes, not screen decoration;
- deployment: environments, deployable units, dependencies, and trust boundaries, with no credentials or sensitive endpoints.

Figures use `Figure N — Description` and are referenced in nearby text. Include a text summary for complex diagrams.

## 9. Tables

Use tables for comparison and compact mappings, not long prose. Include a header row, keep each cell focused, define abbreviations in the table or nearby text, and avoid merged cells. Provide a list alternative if a table will not read sensibly on a narrow screen.

## 10. Code and literal text

Use inline code for exact UI input, file names, commands, status values, or configuration keys. Use fenced blocks with a language identifier for multi-line code or commands. Customer documents include code only when the audience must use it. Examples must be safe to copy, use fictional values, and contain no tokens, credentials, personal data, or production addresses.

## 11. Folder structure

Store governance in `docs/documentation/`; customer journey guidance in `docs/customer/`; finance controls in `docs/finance/`; operational manuals in `docs/operations/`; support playbooks in `docs/support/`; administration and developer references in `docs/technical/`; learning material in `docs/training/`; and version-bound handover material in `docs/release/`.

For document assets, use `<category>/assets/<document-id>/images/` and `<category>/assets/<document-id>/diagrams/`. Do not copy the same asset into several locations.

## 12. Accessibility and confidentiality

Use meaningful link text, heading order, alt text, sufficient contrast, and instructions that do not depend on colour, location, or vision alone. Identify document classification in metadata. Never include passwords, secrets, live customer records, personal data, private endpoints, or unapproved internal commentary.
