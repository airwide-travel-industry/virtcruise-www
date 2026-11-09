# Content Studio Quick Reference

| Field | Value |
|---|---|
| Document ID | DOC-005-QR |
| Version | 0.8.0-draft.1 |
| Source-system version | VirtCruise v0.7.0 with accepted WEB-003 content contracts |
| Status | Draft — Internal Review |
| Owner | Content Manager |
| Intended approvers | Product Manager, Marketing Lead, Business Owner |
| Classification | Confidential — VirtCruise Internal Content Operations |
| Last reviewed | 2026-08-03 |

> **Important:** Content Studio is **Planned**. This reference describes the intended staff workflow over accepted WEB-003 contracts; it is not evidence of a released screen.

## Role summary

| Role | Accepted authority |
|---|---|
| Content Editor | Create package/draft, edit draft, add version-scoped pricing and media, preview, and submit |
| Content Approver | Review, reject, approve, schedule, publish, retire, restore, and view broader audit |
| Administrator | Governed editor/approver capabilities; no silent workflow bypass or self-approval |
| Marketing/Product Manager | Business review and content input; application authority requires an accepted role |
| Anonymous/customer | Effective published projection only |

## Lifecycle

```text
DRAFT → IN_REVIEW → APPROVED → SCHEDULED → PUBLISHED → RETIRED
   │         └→ REJECTED
   └→ DISCARDED (lifecycle defined; staff command not yet exposed)
```

- Only `DRAFT` is editable.
- Submission seals the version.
- The submitter cannot approve their own version.
- A rejected version remains immutable; derive a new numbered draft.
- Restore creates a new numbered draft from retained content; it does not rewrite history.
- Immediate publish can move `APPROVED` directly to `PUBLISHED`.
- Schedule cancellation is architecturally planned but has no accepted explicit command.

## Accepted package types

| Customer concept | Accepted type |
|---|---|
| Holiday Packages | `HOLIDAY_PACKAGE` |
| Victoria Falls | `VICTORIA_FALLS` |
| Cruises | `CRUISE` |
| Accommodation | `ACCOMMODATION` |
| Flights | `FLIGHT` |
| Visa Services | `VISA_SERVICE` |
| Trip Add-ons | `TRIP_ADD_ON` |
| Car Rental | Use `TRIP_ADD_ON`; it is not a primary catalogue package |

## Before submission

- Complete title, summary, description, destination, duration, and featured choice.
- Review structured highlights, inclusions, exclusions, itinerary, terms, FAQs, SEO, and call to action.
- Add an effective display price or approved **Price on request** entry.
- Add at least one validated clean public media item with rights and meaningful alt text.
- Preview the intended public result.
- Resolve conflicts from another editor by refreshing and reapplying the intended change.

## Pricing reminder

- Use a 3-letter currency code.
- Choose either a non-negative amount or **Price on request**, never both.
- State display basis and selection key.
- Add a clear customer-safe qualifier when needed.
- Check validity dates at the publication time.
- Catalogue pricing never recalculates quotes, bookings, invoices, or ledgers.

## Media reminder

- Media is version-scoped and immutable by object/checksum.
- Replacement creates a new media item/reference.
- Record rights, role, order, alt text, visibility, and validation state.
- Only clean, non-private media can contribute to publication.
- Numeric recommended sizes and automatic transformations are not approved; follow the future media policy.

## Publication choices

| Choice | Requirement | Result |
|---|---|---|
| Publish now | Independent approval, valid price, clean public media, reason | New effective public projection |
| Schedule | Same requirements plus future unambiguous time | Planned activation at the UTC-backed time |
| Retire | Published version, approval, reason | Public projection removed; history retained |
| Restore | Retained source version and reason | New draft with next version number |

## Recovery rules

- Conflict: refresh the authoritative draft/version; do not overwrite blindly.
- Validation failure: correct the draft; do not bypass.
- Rejection: derive a new draft and address the reason.
- Failed schedule: Operations observes and recovers under future accepted procedures; do not publish a duplicate blindly.
- Wrong live content: assess retirement or restore-to-new-draft workflow; application rollback is separate.

## Related documents

- [DOC-005, *Content Studio User Guide*](CONTENT-STUDIO-USER-GUIDE.md)
- [DOC-005-PC, *Content Publishing Checklist*](CONTENT-PUBLISHING-CHECKLIST.md)
- [DOC-003, *Back Office Operations Manual*](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md)

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial planned Content Studio quick reference | Draft — Internal Review |
