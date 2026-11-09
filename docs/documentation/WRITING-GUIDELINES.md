# Writing Guidelines

| Field | Value |
|---|---|
| Document ID | DOC-001-WG |
| Version | 0.8.0-draft.1 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Plan around reader outcomes

Before writing, state who the reader is, what they are trying to achieve, what they already know, what access they have, and what a successful result looks like. Confirm the source product version and accepted engineering dependency. Separate confirmed behaviour from assumptions; no assumption may remain in approved content.

Organise manuals around tasks and decisions, not application components. Put common and low-risk paths first, then exceptions and escalation. Provide concept material only where it helps the reader act safely.

## 2. Write clear procedures

Use a verb-led title such as “Refund a payment.” State the applicable role, prerequisites, starting state, and outcome. Give one action per numbered step, name the exact interface control, and state the expected response when it is not obvious.

Do not hide required actions in notes. Put warnings before the risky step. End with a confirmation check and a safe recovery or escalation path. Never tell readers to bypass permissions, controls, approvals, audit records, or security safeguards.

## 3. Explain decisions and exceptions

For each decision, state the condition, available choice, consequence, and owner. For an error, describe the visible symptom, likely safe checks, information to record, retry limits where relevant, and escalation route. Do not speculate about root cause in customer guidance.

## 4. Use examples safely

Use clearly fictional people, organisations, contact details, booking references, and amounts. Examples should be realistic enough to teach the rule without resembling a real customer or production record. Label exceptions to a rule as exceptions, not examples.

Never use live credentials, tokens, full payment data, personal data, production URLs, or internal security detail. Use reserved domains such as `example.com` and obvious placeholders that cannot be mistaken for valid secrets.

## 5. Write for scanning and accessibility

Lead sections with the answer or outcome. Use short paragraphs, descriptive headings, lists for distinct items, and tables only for genuine comparison. Make link text meaningful out of context. Give every informative image alternative text and explain visual relationships in text.

Do not refer only to colour, shape, or screen position. Include keyboard-neutral language and avoid assuming a pointer device. Expand acronyms on first use and define specialist terms close to their first occurrence.

## 6. Maintain traceability

Keep a working source record for each material claim: accepted workstream evidence, approved business policy, product label, or authoritative reference. Record unresolved questions outside customer-ready prose and assign an owner. Cross-reference an authoritative definition instead of restating it inconsistently.

## 7. Self-review checklist

Before Internal Review, confirm:

- title, metadata, audience, scope, version, and classification are complete;
- every included capability is accepted for the applicable product version;
- navigation labels, roles, statuses, and terminology are exact and consistent;
- instructions state prerequisites, actions, outcome, exceptions, and escalation;
- paragraphs are short and jargon, internal abbreviations, and undefined acronyms are removed;
- callouts are necessary, correctly placed, and use standard labels;
- screenshots, diagrams, tables, examples, and links meet their standards;
- no sensitive, personal, production, secret, or unapproved internal information remains;
- related documents and change history are current;
- a representative reader can complete the task without undocumented knowledge.

## 8. Editorial review method

Read once for factual and workflow correctness, once from the audience's perspective, and once for language and formatting. Then check links, figures, tables, metadata, and privacy separately. Do not combine contradictory reviewer feedback silently; the owner records the decision and rationale.

## 9. Translation readiness

Even when only English is planned, use consistent terms, complete sentences, explicit references, and simple grammar. Avoid wordplay, culturally specific metaphors, embedded text in images, and sentence fragments whose meaning depends on layout.
