# VirtCruise Style Guide

| Field | Value |
|---|---|
| Document ID | DOC-001-SG |
| Version | 0.8.0-draft.1 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Voice and language

Use plain English, a professional business tone, and customer-friendly language. Address the reader as “you” in task guidance. Use “we” only when it clearly means VirtCruise or the reader's service provider. Prefer active voice and concrete verbs.

Keep paragraphs to one idea and normally three sentences or fewer. Put the action before background detail. Avoid developer jargon, internal abbreviations, undefined acronyms, humour that may not translate, idioms, blame, and promises about unapproved future functionality.

## 2. Capitalization

Use sentence case for titles, headings, table headers, callouts, and button descriptions unless the product label differs. Capitalise the product name `VirtCruise` exactly. Capitalise a role only when it is the formal role label in the product or begins a sentence; otherwise use lower case.

Reproduce navigation and control labels exactly, with bold formatting: Select **My Trips**, then **View booking**. Do not capitalise generic concepts such as booking, quote, payment, customer, or release.

## 3. Typography

- Use **bold** for exact interface labels and sparingly for key lead-ins.
- Use `monospace` for literal values, statuses, commands, paths, and data entered by a reader.
- Use *italics* for document titles on first or formal reference.
- Use numerals for measurements, versions, dates, times, money, and steps.
- Write dates as `3 August 2026` in prose and `2026-08-03` in metadata.
- Include time zone for operational times, for example `14:30 UTC`.
- Include currency code when ambiguity is possible, for example `GBP 250.00`.
- Do not use underlining, all caps for emphasis, or colour as the only meaning.

Use the serial comma. Use an en dash for ranges and an em dash sparingly for interruption. Use a non-breaking conceptual form in prose where supported, but never alter exact product labels.

## 4. Product and navigation naming

The product is `VirtCruise`, never `Virt Cruise`, `VC`, or “the platform” when the product name is clearer. Use “website” for the customer-facing web experience and the approved product label for each privileged workspace once confirmed.

For paths, write the sequence with `>`: **Bookings** > **Payments**. Use “select” for buttons, links, tabs, and menu items; “enter” for typed values; “choose” for one option from a set; and “clear” for removing a selection. Avoid “click,” because readers may use touch, keyboard, or assistive technology.

## 5. Role naming

Use these canonical audience names:

| Canonical name | Use for | Avoid |
|---|---|---|
| traveller | A customer arranging or managing personal travel | end user, pax, punter |
| consultant | A travel consultant serving customers | agent, sales user unless formally named |
| finance user | A person performing finance work | finance guy, accountant unless qualification matters |
| administrator | A business administrator | admin, superuser |
| content editor | A person managing content | CMS user |
| support staff | A person handling support work | support agent when “agent” is ambiguous |
| operations user | A person running business or service operations | ops user in customer text |
| technical administrator | A person operating technical services | tech admin, DevOps |
| developer | A software developer | dev |

When a product permission label differs, state the exact label and explain the audience term once.

## 6. Preferred terminology

| Prefer | Avoid or qualify | Reason |
|---|---|---|
| sign in / sign out | log in / log out | Consistent action wording |
| select | click, tap, hit | Input-method neutral |
| booking reference | ID, PNR unless formally applicable | Customer-readable |
| email address | email ID | Plain English |
| unavailable | disabled, greyed out | Explain the observable state; use technical term only if necessary |
| error message | exception | Audience-appropriate |
| resolve / correct | fix when responsibility is unclear | Neutral and specific |
| must | should, where mandatory | Clear obligation |
| can | may, for capability | Plain English |

DOC-007 becomes authoritative for lifecycle and business-state terminology. Until it is approved, writers must copy exact accepted product labels and flag conflicts for Product review.

## 7. Error and support language

Describe what happened, what the reader can safely do, and where to get help. Do not blame the reader. Do not ask for passwords, full payment details, authentication tokens, or unnecessary personal data. State which non-sensitive identifiers and timestamps are useful for escalation.

## 8. Inclusive and accessible language

Use role or person-first descriptions relevant to the task. Avoid assumptions about gender, family structure, ability, location, or technical experience. Explain icons by label or purpose, not appearance alone. Do not use spatial-only directions such as “on the right” without naming the control.
