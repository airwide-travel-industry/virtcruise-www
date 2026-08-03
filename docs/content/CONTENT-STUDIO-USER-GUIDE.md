# VirtCruise Content Studio User Guide

| Field | Value |
|---|---|
| Document ID | DOC-005 |
| Version | 0.8.0-draft.1 |
| Source-system version | VirtCruise v0.7.0 with accepted WEB-003 content contracts |
| Sprint | 3.7 |
| Status | Draft — Internal Review |
| Owner | Content Manager |
| Intended approvers | Product Manager, Marketing Lead, Content Approver, Accessibility Reviewer, Business Owner |
| Classification | Confidential — VirtCruise Internal Content Operations |
| Last reviewed | 2026-08-03 |

> **Important:** Content Studio is **Planned** and is not a released staff interface. This guide documents the intended user experience over accepted content-management architecture and WEB-003 behavior. Screen names, layouts, and controls remain placeholders until an accepted Content Studio workstream delivers them.

## Contents

1. [Introduction](#1-introduction)
2. [Content Studio overview](#2-content-studio-overview)
3. [Roles and permissions](#3-roles-and-permissions)
4. [Package catalogue overview](#4-package-catalogue-overview)
5. [Creating a package](#5-creating-a-package)
6. [Editing drafts](#6-editing-drafts)
7. [Package versions](#7-package-versions)
8. [Version history](#8-version-history)
9. [Publishing workflow](#9-publishing-workflow)
10. [Scheduling publication](#10-scheduling-publication)
11. [Retiring content](#11-retiring-content)
12. [Restoring previous versions](#12-restoring-previous-versions)
13. [Managing pricing](#13-managing-pricing)
14. [Managing galleries](#14-managing-galleries)
15. [Managing cover images](#15-managing-cover-images)
16. [Managing highlights](#16-managing-highlights)
17. [Managing destinations](#17-managing-destinations)
18. [Managing Featured Tours](#18-managing-featured-tours)
19. [Managing Explore All Packages](#19-managing-explore-all-packages)
20. [Trip Add-ons](#20-trip-add-ons)
21. [SEO fields](#21-seo-fields)
22. [Previewing content](#22-previewing-content)
23. [Review and approval](#23-review-and-approval)
24. [Common publishing mistakes](#24-common-publishing-mistakes)
25. [Troubleshooting](#25-troubleshooting)
26. [Best practices](#26-best-practices)
27. [Frequently asked questions](#27-frequently-asked-questions)
28. [Glossary](#28-glossary)
29. [Appendices](#29-appendices)

## 1. Introduction

### Purpose

This guide prepares authorised staff to maintain the VirtCruise package catalogue safely using the planned Content Studio. It explains editorial decisions, version history, independent approval, publication, pricing presentation, media, SEO, retirement, and recovery in plain English.

### Audience

- Content Editors who create and revise catalogue content;
- Marketing staff who prepare customer-facing copy and campaigns;
- Product Managers who own package positioning and commercial approval;
- Administrators who govern access without bypassing workflow; and
- Content Approvers who independently review and publish.

Marketing and Product Manager are business audiences, not accepted application roles by themselves. They require an assigned `ROLE_CONTENT_EDITOR`, `ROLE_CONTENT_APPROVER`, or governed Administrator role to act in the future studio.

### Scope boundary

The accepted WEB-003 content service supports package creation, numbered drafts, draft editing, preview data, review submission, approval/rejection, immediate/scheduled publication, retirement, restore-to-new-draft, pricing, media metadata, and audit history. The graphical Content Studio remains planned.

This guide does not cover software implementation, supplier inventory, checkout, bookings, financial accounting, dynamic pricing, general website pages, or production deployment.

**Expected result:** Readers understand which rules are accepted and which interface behavior is planned.

### Screenshot placeholder

> **Screenshot placeholder 1 — Planned Content Studio landing page**
> Views: Desktop, Tablet, Mobile. State: no customer data; fictional package totals.
> Alternative text: Planned Content Studio starting page showing catalogue work, reviews, schedules, and access role.
> Capture only after an accepted Content Studio interface workstream.

### Related chapters

[Content Studio overview](#2-content-studio-overview), [Roles and permissions](#3-roles-and-permissions), and [Scope exclusions](#scope-exclusions-and-future-manuals).

## 2. Content Studio overview

### Purpose

Understand the planned editorial workspace and its accepted source of truth.

Content Management is the editorial source of truth. The public catalogue contains only the effective published result. Drafts, review reasons, approvals, future schedules, private media, internal pricing identifiers, and audit details must never appear to anonymous visitors.

### Planned workspace areas

The planned studio is expected to organise these accepted capabilities:

- package catalogue and stable identity;
- draft editor and structured content;
- version history and authenticated preview;
- pricing and media attached to a version;
- review and independent approval;
- immediate and scheduled publication;
- retirement and restore-to-new-draft;
- audit history.

No exact menu, dashboard, route, notification, bulk action, or visual layout is accepted. These remain planned design choices.

### Editorial-to-public flow

```text
Editor creates or derives a DRAFT
        ↓
Editor completes content, pricing, media, SEO, and preview
        ↓
Editor submits → immutable IN_REVIEW version
        ↓
Independent Approver rejects or approves
        ↓
Approved version publishes now or is scheduled
        ↓
One effective customer-safe catalogue projection
```

**Figure 1 — Planned editorial-to-public flow.** Draft and review information stays private; only the effective publication becomes public.

**Expected result:** Staff understand that the studio submits controlled changes but does not own or bypass lifecycle rules.

### Related chapters

[Package catalogue overview](#4-package-catalogue-overview), [Publishing workflow](#9-publishing-workflow), and [Previewing content](#22-previewing-content).

## 3. Roles and permissions

### Purpose

Separate authoring, approval, administration, business review, and public access.

| Role/audience | Accepted or planned responsibility | Prohibited boundary |
|---|---|---|
| Content Editor | Create packages/drafts, edit permitted drafts, add pricing/media, preview, submit | Approve, publish, retire, or restore through approver commands |
| Content Approver | Review, reject, approve, schedule, publish, retire, restore, broader audit | Approve their own submitted version |
| Administrator | Governed editor/approver capability and audit access | Silent workflow bypass or self-approval; emergency action requires break-glass policy |
| Marketing | Prepare copy, campaign intent, imagery, and SEO recommendations | Application change without an accepted role |
| Product Manager | Own product positioning, commercial review, and business decision | Application publication without approver authority |
| Anonymous/customer | Read only the effective public package | Draft, preview, review, schedule, private media, or audit access |

### Planned access procedure

1. Sign in through the approved staff route when the studio is released.
2. Confirm the displayed identity and accepted role.
3. Open only packages assigned to your editorial group or permitted scope.
4. Stop if a required action is unavailable; do not borrow access or ask an Administrator to bypass the lifecycle.
5. Report suspected access errors through the future Support process.

**Expected result:** Each person performs only the action assigned to their accepted role.

### Screenshot placeholder

> **Screenshot placeholder 2 — Planned role-aware navigation**
> Views: Desktop, Tablet, Mobile. State: fictional Editor and Approver examples.
> Alternative text: Planned Content Studio navigation showing different authoring and approval capabilities by role.
> Dependency: accepted Content Studio interface and access review.

### Related chapters

[Review and approval](#23-review-and-approval), [Version history](#8-version-history), and future DOC-007.

## 4. Package catalogue overview

### Purpose

Understand stable packages, accepted package types, and public discoverability.

A package has a permanent business identity and monotonically numbered versions. Published changes must not rewrite historical quotes, bookings, invoices, or Ledger records that already captured their own accepted snapshot.

### Accepted package types

| Catalogue concept | Accepted type | Primary package? |
|---|---|---:|
| Holiday Packages | `HOLIDAY_PACKAGE` | Yes |
| Victoria Falls | `VICTORIA_FALLS` | Yes |
| Cruises | `CRUISE` | Yes |
| Accommodation | `ACCOMMODATION` | Yes |
| Flights | `FLIGHT` | Yes |
| Visa Services | `VISA_SERVICE` | Yes |
| Trip Add-ons | `TRIP_ADD_ON` | No |
| Car Rental | `TRIP_ADD_ON` | No; maintain as a Trip Add-on |

### Public catalogue behavior

Only effective published packages appear in public package lists, Featured Tours, destination/type filters, and slug lookup. Draft, rejected, approved-but-unpublished, scheduled-future, retired, and discarded versions are not public.

The current catalogue sorts list results by title. No accepted manual ordering control exists for **Explore All Packages**. Featured status is versioned and determines eligibility for the Featured Tours collection once published.

**Expected result:** Staff classify the package correctly and understand when it can become publicly discoverable.

### Related chapters

[Managing Featured Tours](#18-managing-featured-tours), [Managing Explore All Packages](#19-managing-explore-all-packages), and [Trip Add-ons](#20-trip-add-ons).

## 5. Creating a package

### Purpose

Create one stable package identity and its first numbered draft.

### Accepted required information

- unique business code, maximum 80 characters;
- canonical lowercase slug containing letters/numbers with hyphens between words, maximum 120 characters;
- accepted package type;
- editorial owner, maximum 100 characters;
- title, maximum 200 characters;
- summary, maximum 1,000 characters;
- description;
- destination, maximum 200 characters;
- duration of at least 1 day; and
- featured choice.

Title, summary, and description accept plain text, not HTML markup.

### Planned create procedure

1. Confirm that the package is genuinely new and not a new version of an existing package.
2. Obtain an approved permanent business code.
3. Choose the correct package type; classify Car Rental as `TRIP_ADD_ON`.
4. Create a concise canonical slug.
5. Assign the editorial owner.
6. Enter the initial title, summary, description, destination, duration, and featured choice.
7. Review for duplication, spelling, customer promises, and confidential information.
8. Create the package through the planned studio.
9. Confirm version 1 exists as `DRAFT`.

> **Warning:** Business codes and stable identities are never reused. Published packages are retired, not deleted.

**Expected result:** One package identity and version 1 draft exist without public visibility.

### Screenshot placeholder

> **Screenshot placeholder 3 — Planned Create Package form**
> Views: Desktop, Tablet, Mobile. State: empty fields plus fictional type choices.
> Alternative text: Planned form for business code, slug, package type, owner, title, summary, description, destination, duration, and featured choice.
> Dependency: accepted Content Studio interface.

### Related chapters

[Editing drafts](#6-editing-drafts), [Package versions](#7-package-versions), and [Content Publishing Checklist](CONTENT-PUBLISHING-CHECKLIST.md#1-new-package-checklist).

## 6. Editing drafts

### Purpose

Change only mutable drafts and resolve concurrent edits without overwriting another person's work.

### Editable draft content

Accepted draft content includes title, summary, description, destination, duration, featured status, highlights, inclusions, exclusions, itinerary, terms, FAQs, SEO metadata, call to action, pricing, and media.

### Planned edit procedure

1. Open the correct package and confirm the version is `DRAFT`.
2. Confirm its version number and source version.
3. Make one coherent set of editorial changes.
4. Review structured sections, pricing, and media together.
5. Save through the planned studio.
6. Preview the customer-safe result.
7. Record the editorial reason where the future interface requires it.

Only a draft can be edited. Submission seals the version. A rejected version is not reopened; derive a new draft and address the rejection.

### Conflict handling

If another editor changed the draft first, the accepted service rejects the stale save. Refresh the authoritative draft, compare changes, reapply only the intended edits, and save again. Do not repeatedly overwrite or use an older browser copy.

**Expected result:** The latest draft contains an intentional, conflict-safe edit and remains private.

### Related chapters

[Package versions](#7-package-versions), [Previewing content](#22-previewing-content), and [Troubleshooting](#25-troubleshooting).

## 7. Package versions

### Purpose

Use immutable versions to preserve exactly what was reviewed and published.

### Accepted lifecycle

```text
DRAFT → IN_REVIEW → APPROVED → SCHEDULED → PUBLISHED → RETIRED
   │         └→ REJECTED
   └→ DISCARDED
```

**Figure 2 — Accepted WEB-003 package version lifecycle.** Only the draft is editable. Immediate publication can move an approved version directly to published.

Version numbers increase within one package. A new version is derived from a retained source version and receives the next number. Submitted and later versions are immutable.

### Lifecycle notes

- `DRAFT`: editable and private.
- `IN_REVIEW`: sealed and awaiting an independent decision.
- `REJECTED`: immutable; derive a new draft.
- `APPROVED`: immutable and eligible to publish or schedule.
- `SCHEDULED`: approved and planned for a future instant.
- `PUBLISHED`: current/effective when its publication is active.
- `RETIRED`: removed from public catalogue; history retained.
- `DISCARDED`: draft lifecycle outcome. The accepted service defines the state, but no staff discard command is exposed; the studio control is planned only after an accepted contract.

Schedule cancellation back to approved is included in the architecture but has no accepted explicit management command. Treat it as planned, not available.

**Expected result:** Editors and approvers understand exactly which version can change and which must remain preserved.

### Related chapters

[Version history](#8-version-history), [Publishing workflow](#9-publishing-workflow), and [Restoring previous versions](#12-restoring-previous-versions).

## 8. Version history

### Purpose

Compare retained versions, decisions, and publication history without rewriting the past.

### Accepted history information

Version history includes version number, lifecycle state, full version content, pricing, media, and the source from which a new draft was derived. Editorial audit records actor, roles, action, before/after states, reason, correlation reference, result, and time.

### Planned review procedure

1. Open the package's planned **Version History** area.
2. Identify the current published version and latest draft/review version.
3. Select the version to inspect.
4. Compare its content, pricing, media, featured status, and lifecycle state.
5. Review audit history if your role permits it.
6. Use restore only when the retained version is an appropriate starting point.

Audit history must not include raw media, storage locations, credentials, or unnecessary content bodies. Content audit is separate from Booking and Finance audit.

**Expected result:** Staff can explain how the package reached its current state and select the correct source for future work.

### Screenshot placeholder

> **Screenshot placeholder 4 — Planned Version History**
> Views: Desktop, Tablet, Mobile. State: fictional versions 1–4 with mixed lifecycle states.
> Alternative text: Planned version list showing number, state, source, decision, and current published marker.
> Dependency: accepted Content Studio history design.

### Related chapters

[Package versions](#7-package-versions), [Restoring previous versions](#12-restoring-previous-versions), and [Review and approval](#23-review-and-approval).

## 9. Publishing workflow

### Purpose

Move a complete draft through independent review to one atomic public result.

### Planned editor workflow

1. Complete the [Publishing Checklist](CONTENT-PUBLISHING-CHECKLIST.md#2-publishing-checklist).
2. Preview the intended customer-safe result.
3. Confirm an effective price or **Price on request** entry exists.
4. Confirm at least one validated clean, non-private media item exists.
5. Submit the draft with a concise review reason.
6. Confirm state becomes `IN_REVIEW` and stop editing that version.

### Planned approver workflow

1. Verify you did not submit the version.
2. Compare the sealed version with the current published version.
3. Review content, price validity, media/rights/accessibility, SEO, call to action, and business approval.
4. Reject with a reason or approve with a reason.
5. If approved, choose immediate publication or an authorised future schedule.
6. Confirm the resulting state and public projection after the transition.

Publication validates the complete version and changes the public result as one controlled transition. It must not expose partial content or rewrite historic quotes/bookings.

**Expected result:** An independent approver makes one auditable decision and only a complete valid version becomes public.

### Screenshot placeholder

> **Screenshot placeholder 5 — Planned review and publish decision**
> Views: Desktop, Tablet, Mobile. State: fictional `IN_REVIEW` version compared with current publication.
> Alternative text: Planned approval workspace showing content comparison, validation, reason, reject, approve, publish, and schedule choices.
> Dependency: accepted Content Studio approval design.

### Related chapters

[Review and approval](#23-review-and-approval), [Scheduling publication](#10-scheduling-publication), and [Content Publishing Checklist](CONTENT-PUBLISHING-CHECKLIST.md).

## 10. Scheduling publication

### Purpose

Prepare an approved version to become public at an unambiguous future time.

### Accepted rules

- Only an approved version can be scheduled.
- Effective time must be in the future.
- All stored times use Coordinated Universal Time (UTC).
- The planned studio must display the selected business time zone and its abbreviation/offset.
- Ambiguous or nonexistent daylight-saving times must be rejected rather than guessed.
- Optional effective-until/withdrawal time can be recorded by the accepted schedule data, but customer behavior and future studio control require approval.

### Planned schedule procedure

1. Confirm the version is `APPROVED` and still publishable at the target time.
2. Choose the approved business time zone.
3. Enter the future date and time.
4. Review the displayed UTC equivalent and offset.
5. Add the publication reason.
6. Confirm optional expiry/retirement intent where supported and approved.
7. Schedule once and confirm state `SCHEDULED`.
8. Arrange post-publication checks and an owner for schedule failure.

The accepted scheduler is replay-safe and exposes failed work to operations, but no Content Studio schedule-monitoring screen exists. Planned recovery must not create duplicate publication.

**Expected result:** One approved version is scheduled for one clear instant with a review owner.

### Related chapters

[Publishing workflow](#9-publishing-workflow), [Troubleshooting](#25-troubleshooting), and future DOC-010.

## 11. Retiring content

### Purpose

Remove a published package from public discovery while preserving history and customer records.

### Planned retirement procedure

1. Confirm the package/version currently published.
2. Obtain business approval and record the retirement reason.
3. Assess campaigns, links, Featured Tours, quotes, bookings, and customer communication.
4. Confirm the package should be unavailable rather than replaced by a new publication.
5. Retire through the planned approver control.
6. Confirm the active public projection is removed.
7. Confirm retained versions and audit remain available.
8. Follow the approved public missing/retired-link policy when defined.

Retirement must not change historic quotes, bookings, invoices, or other accepted snapshots.

### Delete policy

A package with publication history must never be deleted. No accepted package-delete command exists. Draft discard is a defined lifecycle outcome but lacks an accepted staff command. Any future deletion/discard control must follow an approved retention and audit policy.

**Expected result:** The package is no longer publicly discoverable, but its stable identity, versions, and audit remain intact.

### Related chapters

[Restoring previous versions](#12-restoring-previous-versions), [Content Publishing Checklist](CONTENT-PUBLISHING-CHECKLIST.md#5-retirement-checklist), and [Troubleshooting](#25-troubleshooting).

## 12. Restoring previous versions

### Purpose

Reuse retained content safely without mutating history or silently rolling back a publication.

### Accepted restore behavior

Restore derives a new `DRAFT` from a retained source version. The new draft receives the next version number and copies its content, pricing, and media references into the new version context. It must be reviewed, approved, and published normally.

### Planned restore procedure

1. Identify the current public issue and decide whether retirement is needed first.
2. Open **Version History** and preview the retained source.
3. Confirm its pricing/media remain suitable and rights remain valid.
4. Add a factual restore reason.
5. Create the restored draft through the planned control.
6. Review every copied field and update outdated content in the new draft.
7. Preview, submit, obtain independent approval, and publish.

Restore is not direct rollback and does not change an old version. Production application rollback and data restore are separate technical incident activities outside this guide.

**Expected result:** A new reviewable draft preserves the source history and can become a fresh publication only after normal controls.

### Related chapters

[Version history](#8-version-history), [Publishing workflow](#9-publishing-workflow), and future DOC-010.

## 13. Managing pricing

### Purpose

Present clear catalogue prices without performing Financial accounting or supplier/inventory pricing.

### Accepted pricing information

- 3-letter currency code;
- either a non-negative amount or **Price on request**, never both;
- display basis, such as the customer-facing unit/basis approved by Product;
- selection key for the applicable market/occupancy option;
- optional customer-safe qualifier, maximum 500 characters;
- optional valid-from and valid-until instants; and
- display order.

Publication requires at least one price entry effective at the publication time. Overlap for the same selection key must be rejected unless an approved deterministic policy exists.

### Planned pricing procedure

1. Confirm commercial approval and intended currency.
2. Choose amount or **Price on request**.
3. Enter display basis and selection key consistently.
4. Add an honest qualifier, including price caveats such as “from” or occupancy basis only when approved and accurate.
5. Enter validity dates if needed and confirm they cover publication.
6. Order multiple entries intentionally.
7. Preview the customer wording in context.

Catalogue pricing never updates a submitted quote, booking, invoice, Payment, Receipt, or Ledger. Financial accounting belongs in DOC-004.

**Expected result:** Customers see an effective, unambiguous currency/price/basis presentation without unsupported promises.

### Screenshot placeholder

> **Screenshot placeholder 6 — Planned pricing editor and preview**
> Views: Desktop, Tablet, Mobile. State: fictional price and **Price on request** examples; no live commercial values.
> Alternative text: Planned pricing area showing currency, amount or price on request, basis, qualifier, validity, order, and preview.
> Dependency: accepted Content Studio pricing design.

### Related chapters

[Previewing content](#22-previewing-content), [Best practices](#26-best-practices), and DOC-004.

## 14. Managing galleries

### Purpose

Create an accessible, rights-cleared, version-specific media sequence.

### Accepted media information

Media records a managed object/reference, content type, size, dimensions where available, role, order, alt text, rights, validation state, and public/private flag. Bytes and checksum are immutable; replacement creates a new media item/reference.

### Planned gallery procedure

1. Select images with approved provenance and rights.
2. Optimise them before managed upload according to the future media policy.
3. Add each item to the current draft only.
4. Choose the intended gallery role when the future studio defines approved values.
5. Set a clear display order without unexplained duplicates.
6. Write meaningful alt text and an optional useful caption where the future schema supports captions.
7. Confirm validation is clean and public media is not private.
8. Preview desktop, tablet, and mobile order/crops.

### Recommended sizes

No numeric image dimensions, aspect ratios, file-size targets, or accepted media-role list are defined in PLAN-001/WEB-003. These are **Planned policy-owned values**. Do not invent them. Until approved, choose a high-quality source, do not upscale, and follow the current approved Marketing/media brief.

Automatic image transformation is an explicit architecture non-goal. Optimisation occurs through an approved content process, not an assumed studio pipeline.

**Expected result:** The gallery contains ordered, accessible, clean, public, rights-cleared media for the current version.

### Related chapters

[Managing cover images](#15-managing-cover-images), [Content Publishing Checklist](CONTENT-PUBLISHING-CHECKLIST.md#3-image-checklist), and [Previewing content](#22-previewing-content).

## 15. Managing cover images

### Purpose

Select a clear primary image while respecting the accepted media boundary.

The architecture supports media roles and order but does not define an accepted cover-role value or enforce one cover image. The planned studio must not present a mandatory **Cover** control until an accepted media-role policy exists.

### Planned cover procedure

1. Select a rights-cleared image representative of the actual destination/package.
2. Confirm quality at intended desktop, tablet, and mobile crops.
3. Assign the approved future cover role and order.
4. Write alt text describing relevant customer information, not “image of.”
5. Confirm the image is clean, non-private, and part of the current version.
6. Preview title and call-to-action readability without embedding important text in the image.

Do not use misleading stock imagery, watermarked assets, distorted crops, text-heavy images, or a low-resolution file enlarged for display.

**Expected result:** The planned primary image accurately represents the package and remains accessible across viewports.

### Related chapters

[Managing galleries](#14-managing-galleries), [SEO fields](#21-seo-fields), and [Best practices](#26-best-practices).

## 16. Managing highlights

### Purpose

Summarise the most valuable, accurate package features for scanning.

Highlights are accepted version-scoped structured content, but WEB-003 does not define a customer-editor schema, item limits, icon set, or studio control. The exact interface is planned.

### Planned highlight procedure

1. Identify features that are genuinely included or clearly qualified.
2. Write short, parallel statements using consistent grammar.
3. Avoid repeating the title, destination, or price.
4. Separate highlights from inclusions, which define what the customer receives.
5. Avoid “best,” “guaranteed,” “luxury,” or availability claims without approval/evidence.
6. Preview order and readability.

**Expected result:** Highlights help customers scan the package without changing its terms or promising unavailable services.

### Related chapters

[Best practices](#26-best-practices), [Editing drafts](#6-editing-drafts), and [Previewing content](#22-previewing-content).

## 17. Managing destinations

### Purpose

Use consistent customer-facing destination text and understand the boundary of destination management.

The accepted package version contains a required destination text field. The public catalogue can filter by destination text. WEB-003 does not expose a separate Content Studio workflow for creating or editing destination master records.

### Planned destination procedure

1. Use the approved customer-facing destination name.
2. Follow the current naming convention for city, region, and country.
3. Keep spelling/capitalisation consistent across package title, description, itinerary, SEO, and media captions.
4. Confirm the destination filter groups the package as intended in public validation.
5. Escalate a new destination-master requirement rather than creating an unsupported structure.

**Expected result:** Destination wording is consistent and the published package appears under the intended public filter.

### Related chapters

[Package catalogue overview](#4-package-catalogue-overview), [SEO fields](#21-seo-fields), and [Managing Explore All Packages](#19-managing-explore-all-packages).

## 18. Managing Featured Tours

### Purpose

Control whether an effective published version appears in the Featured Tours collection.

Featured status is a versioned Boolean choice. A package appears in the public featured collection only when the effective published version has featured enabled.

### Planned featured procedure

1. Obtain Marketing/Product approval for featured placement.
2. Open or create the intended draft.
3. Set the planned featured choice.
4. Review cover/gallery suitability, price validity, destination, and call to action.
5. Preview the Featured Tours context when the planned studio supports it.
6. Submit and publish through normal independent approval.
7. Confirm the public featured collection after publication.

No accepted featured ranking, capacity, start/end campaign field, or drag-and-drop ordering exists. Current public ordering is by title. Use scheduled version publication for a future featured change only when the complete version is approved and the business impact is understood.

**Expected result:** Featured Tours contains only effective published packages intentionally marked featured.

### Related chapters

[Managing Explore All Packages](#19-managing-explore-all-packages), [Scheduling publication](#10-scheduling-publication), and [Best practices](#26-best-practices).

## 19. Managing Explore All Packages

### Purpose

Understand how packages enter the full public catalogue and which controls do not yet exist.

**Explore All Packages** represents the effective published catalogue. Content Editors do not add an item to a separate list. Publishing a valid package makes it eligible; retirement removes its public projection.

### Planned validation procedure

1. Publish the approved version.
2. Open the public catalogue after expected cache freshness.
3. Confirm title, destination, type, featured status, price, and public media.
4. Confirm destination and type filters.
5. Open the canonical slug and verify details.
6. Confirm no draft, rejected, approved-only, scheduled-future, or retired content appears.

No accepted manual catalogue ordering, pinning, pagination configuration, or bulk category editor exists. Current ordering is by title.

**Expected result:** Every effective published package appears once with accurate public content and no private version information.

### Related chapters

[Publishing workflow](#9-publishing-workflow), [Managing destinations](#17-managing-destinations), and [Managing Featured Tours](#18-managing-featured-tours).

## 20. Trip Add-ons

### Purpose

Classify supporting travel products correctly without presenting them as primary packages.

`TRIP_ADD_ON` is an accepted package type outside the primary package set. Car Rental must be maintained as a Trip Add-on, not a primary catalogue package.

### Planned add-on procedure

1. Confirm the content supports or extends a trip rather than functioning as the main package.
2. Select `TRIP_ADD_ON`.
3. For Car Rental, state the service accurately without changing its type to Accommodation, Flight, or Holiday Package.
4. Complete title, summary, description, destination, duration, price presentation, media, SEO, and call to action as applicable.
5. Make availability, eligibility, and fulfilment caveats clear.
6. Preview and submit through normal workflow.

WEB-003 does not define a package-to-add-on relationship, cross-sell placement, inventory, or booking attachment workflow. These are planned only if a later accepted workstream supplies them.

**Expected result:** Add-ons are clearly classified and do not mislead customers about primary package content or booking availability.

### Related chapters

[Package catalogue overview](#4-package-catalogue-overview), [Managing pricing](#13-managing-pricing), and [Best practices](#26-best-practices).

## 21. SEO fields

### Purpose

Prepare accurate search/social metadata within the accepted SEO contract boundary.

SEO metadata is accepted as version-scoped structured content and appears in the public projection. WEB-003 does not define its field schema. The planned Content Studio must not claim support for individual fields until an accepted schema exists.

### Planned SEO content

Prepare these common fields for future schema review:

- SEO title;
- SEO description;
- canonical URL intent based on the canonical slug;
- Open Graph title and description;
- Open Graph/featured image reference; and
- keywords only if explicitly supported.

These are **Planned**, not currently confirmed studio fields.

### Slug and canonical URL

The canonical slug is accepted at package creation. The accepted management contract does not provide a post-creation slug-edit command. Architecture requires explicit redirect/alias policy for a changed slug, and public slug aliases can resolve. Do not promise staff slug changes until an accepted command and review procedure exist.

### Planned SEO review

1. Align title/description with real package content.
2. Avoid duplicated titles, keyword stuffing, clickbait, unsupported price/availability, and hidden text.
3. Select a rights-cleared social image.
4. Confirm canonical intent and existing slug history.
5. Preview customer/search/social presentation only when the future interface supports it.

**Expected result:** SEO preparation is accurate and ready for an accepted schema without inventing unsupported fields.

### Screenshot placeholder

> **Screenshot placeholder 7 — Planned SEO editor**
> Views: Desktop, Tablet, Mobile. State: fictional metadata clearly labelled planned.
> Alternative text: Planned SEO workspace for title, description, canonical intent, social metadata, image, and supported keywords.
> Dependency: accepted SEO schema and Content Studio interface.

### Related chapters

[Creating a package](#5-creating-a-package), [Managing cover images](#15-managing-cover-images), and [Content Publishing Checklist](CONTENT-PUBLISHING-CHECKLIST.md#4-seo-checklist).

## 22. Previewing content

### Purpose

Review the intended public projection privately before submission or publication.

Authenticated version preview is accepted. The graphical, responsive Content Studio preview remains planned. Preview must remain private and must not create a public URL or expose private media.

### Planned preview procedure

1. Open the exact draft/version to review.
2. Select the planned preview control.
3. Review title, summary, description, destination, duration, highlights, inclusions, exclusions, itinerary, terms, FAQs, and call to action.
4. Review effective pricing for the intended publication time.
5. Review only public media, order, alt text, and responsive crops.
6. Review featured, catalogue-detail, and SEO/social contexts where supported.
7. Compare against the current public version.
8. Return to the draft for corrections or submit the sealed version.

Preview is evidence for review, not public publication. A preview token/link must not be copied into public or ordinary channels.

**Expected result:** Reviewers understand exactly what customers should see without exposing the version publicly.

### Screenshot placeholder

> **Screenshot placeholder 8 — Planned responsive preview**
> Views: Desktop, Tablet, Mobile. State: fictional complete package with valid price and public media.
> Alternative text: Planned private preview comparing catalogue card, package detail, Featured Tours, pricing, and responsive media.
> Dependency: accepted Content Studio preview interface.

### Related chapters

[Publishing workflow](#9-publishing-workflow), [Managing pricing](#13-managing-pricing), and [Managing galleries](#14-managing-galleries).

## 23. Review and approval

### Purpose

Apply independent, attributable approval to the exact sealed version.

### Editor submission standard

The Editor completes content, pricing, media, accessibility, SEO preparation, preview, and checklist; resolves validation; then submits with a factual reason. Submission makes the version immutable.

### Approver decision standard

1. Confirm the submitter is not the approver.
2. Confirm the version under review is the intended sealed version.
3. Compare it with the current published version and approved Product/Marketing brief.
4. Check customer accuracy, inclusions/exclusions, pricing validity, media rights/clean status/alt text, SEO, call to action, featured intent, and legal/terms approval.
5. Reject with a specific actionable reason or approve with a factual reason.
6. Choose publish/schedule only after approval and operational readiness.

An Administrator must not silently self-approve or bypass controls. Emergency action requires an explicitly approved break-glass policy, reason, and audit; no such user procedure is approved in this guide.

**Expected result:** A different authorised person reviews and approves exactly what may become public.

### Screenshot placeholder

> **Screenshot placeholder 9 — Planned approval decision**
> Views: Desktop, Tablet, Mobile. State: fictional sealed version with submitter and approver separated.
> Alternative text: Planned approval decision showing validation results, comparison, reason, reject, approve, publish, and schedule boundaries.
> Dependency: accepted Content Studio approval interface.

### Related chapters

[Roles and permissions](#3-roles-and-permissions), [Publishing workflow](#9-publishing-workflow), and [Content Publishing Checklist](CONTENT-PUBLISHING-CHECKLIST.md#2-publishing-checklist).

## 24. Common publishing mistakes

### Purpose

Prevent errors that could mislead customers, break links, or weaken audit history.

| Mistake | Safe correction |
|---|---|
| Creating a package instead of a new version | Stop and use the existing stable package identity |
| Classifying Car Rental as a primary package | Use `TRIP_ADD_ON` |
| Editing an approved/published/rejected version | Derive a new numbered draft |
| Approving your own submission | Reassign to an independent approver |
| Publishing with expired/future-invalid pricing | Add an effective approved price or **Price on request** entry |
| Publishing private/unclean media | Replace with validated clean public media in a draft |
| Missing/weak alt text | Describe the relevant information or purpose |
| Treating preview as public publication | Complete approval and publication; validate public catalogue separately |
| Changing slug without alias policy | Stop; no accepted post-create command exists |
| Deleting published history | Retire; preserve versions and audit |
| Assuming schedule time zone | Use explicit zone/offset and reject ambiguity |
| Expecting publication to update bookings/prices | Historical records retain their snapshots |
| Inventing gallery sizes or SEO fields | Wait for approved policy/schema |
| Blindly retrying a conflict or publish | Refresh authoritative state and verify result |

**Expected result:** Staff recognise common risks and choose a lifecycle-safe correction.

### Related chapters

[Troubleshooting](#25-troubleshooting), [Package versions](#7-package-versions), and [Best practices](#26-best-practices).

## 25. Troubleshooting

### Purpose

Recover from planned studio and accepted lifecycle problems without bypassing controls.

| Symptom | Likely meaning | Safe action | Do not |
|---|---|---|---|
| Access denied | Role does not permit action | Confirm assigned role and escalate access | Borrow another account |
| Save conflict | Another change used a newer draft revision | Refresh, compare, and reapply intended edits | Overwrite blindly |
| Cannot edit | Version is not a draft | Derive a new draft | Try to reopen immutable version |
| Submission rejected | Required/valid content is missing | Correct the draft and resubmit | Bypass validation |
| Self-approval denied | Submitter and approver are same person | Assign independent approver | Use Administrator to evade separation |
| Publish blocked by pricing | No effective price at transition time | Correct pricing in a new/eligible draft | Invent a price |
| Publish blocked by media | No clean public media | Add validated, rights-cleared public media | Mark unsafe/private media public |
| Scheduled time rejected | Time is not future or is ambiguous | Choose a valid explicit zone/time | Guess daylight-saving interpretation |
| Schedule failed | Automated transition did not complete | Preserve state and escalate to Operations | Create repeated publication attempts |
| Public page unchanged | Cache freshness or publication may be pending/failed | Check authoritative publication and approved operations status | Republish blindly |
| Wrong live content | Published version is incorrect | Assess retirement or restore-to-new-draft | Edit published version directly |
| Retired slug missing | Retired content is no longer publicly resolved | Follow approved retired-link policy | Recreate identity with same code |

The planned studio must present customer-safe errors and support references, not technical details.

**Expected result:** The authoritative lifecycle remains intact and every unresolved problem has an owner.

### Screenshot placeholder

> **Screenshot placeholder 10 — Planned validation and conflict messages**
> Views: Desktop, Tablet, Mobile. State: fictional validation, access denial, and edit conflict.
> Alternative text: Planned Content Studio messages explaining a missing requirement, denied action, or changed draft with safe recovery.
> Dependency: accepted Content Studio error design.

### Related chapters

[Editing drafts](#6-editing-drafts), [Scheduling publication](#10-scheduling-publication), and future DOC-006/DOC-010.

## 26. Best practices

### Purpose

Create content that is accurate, consistent, accessible, useful, and ready for search and translation.

### Writing style

- Use plain English, active voice, short paragraphs, and customer-focused benefits.
- Follow DOC-001 terminology and DOC-002 customer vocabulary.
- Keep inclusions, exclusions, terms, and caveats explicit.
- Do not use developer language, internal shorthand, or unsupported superlatives.

### Package naming and descriptions

- Use a distinctive, stable title and consistent destination name.
- Make the summary useful on a catalogue card and the description useful on the detail page.
- State duration, audience, experience, and important limitations accurately.
- Avoid promises of availability or Booking Confirmation.

### Pricing and calls to action

- State currency, basis, and qualifier together.
- Use “from” or **Price on request** only when approved and accurate.
- Use a specific, honest call to action such as requesting a quote; do not imply instant booking/payment when unavailable.

### Images and accessibility

- Use rights-cleared, high-quality, representative media.
- Write meaningful alt text and useful captions.
- Avoid embedded text, decorative repetition, misleading crops, and colour-only meaning.
- Review responsive presentation and reading order.

### SEO

- Align metadata with visible content.
- Prefer useful, specific language over repeated keywords.
- Protect canonical slug history and avoid duplicate pages.

**Expected result:** Content supports customer decisions without misleading, excluding, or overwhelming them.

### Related chapters

[DOC-001 Style Guide](../documentation/STYLE-GUIDE.md), [Managing pricing](#13-managing-pricing), [Managing galleries](#14-managing-galleries), and [SEO fields](#21-seo-fields).

## 27. Frequently asked questions

### Purpose

Answer common planned Content Studio questions concisely.

### Access and roles

1. **Is Content Studio available now?**
   No. The graphical staff interface is planned; WEB-003 content contracts and lifecycle are accepted.
2. **Who can create or edit drafts?**
   A Content Editor or governed Administrator with accepted editor authority.
3. **Who can approve and publish?**
   A Content Approver or governed Administrator with approver authority.
4. **Can Marketing publish without a content role?**
   No. Marketing is an audience, not an accepted application permission by itself.
5. **Can an Editor approve their own submission?**
   No.
6. **Can an Administrator bypass approval?**
   Not silently. Emergency action requires an approved break-glass policy and audit.
7. **Can customers see drafts or previews?**
   No. They see only effective published catalogue content.

### Packages and types

8. **What is a package?**
   A stable catalogue identity with retained numbered content versions.
9. **When should I create a new package?**
   Only for a genuinely new business identity; revisions belong in a new version.
10. **What package types are accepted?**
    Holiday Package, Victoria Falls, Cruise, Accommodation, Flight, Visa Service, and Trip Add-on.
11. **How is Car Rental classified?**
    As `TRIP_ADD_ON`, not a primary package.
12. **Can I change package type later?**
    No accepted post-creation type-change command exists; escalate before creation if uncertain.
13. **What is the business code?**
    A permanent unique business identity that must not be reused.
14. **What is the slug?**
    The lowercase hyphenated public locator for a package.
15. **Can I edit the slug after creation?**
    Not through accepted WEB-003 management commands. A future change needs alias/redirect policy and an accepted command.

### Drafts and versions

16. **Which version can I edit?**
    Only `DRAFT`.
17. **What happens on submission?**
    The draft becomes immutable `IN_REVIEW`.
18. **Can I edit a rejected version?**
    No. Derive a new numbered draft and address the reason.
19. **How are version numbers assigned?**
    They increase monotonically within the package.
20. **What is a source version?**
    The retained version copied as the starting point for a new draft.
21. **What if another Editor changed the draft?**
    Refresh, compare, and reapply your intended change; do not overwrite blindly.
22. **Can I discard a draft?**
    `DISCARDED` is defined, but no accepted staff command exists. Treat the control as planned.
23. **Does restore overwrite the selected version?**
    No. It creates a new draft with the next number.

### Review and publication

24. **What must exist before publication?**
    Independent approval, an effective price or price-on-request, and at least one clean public media item, plus valid content.
25. **Can an approved version publish immediately?**
    Yes, through an authorised approver publication command.
26. **Can publication be scheduled?**
    Yes, for a future unambiguous instant.
27. **Which time zone is stored?**
    UTC; the future studio must clearly display selected business time zone and offset.
28. **Can a schedule be cancelled?**
    Architecture plans that transition, but no accepted explicit command exists yet.
29. **What happens to the previous public version?**
    It is retired/superseded in history while the new publication becomes effective.
30. **Can 2 versions be public at once?**
    At most one effective public publication may exist per package at an instant.
31. **What does retirement do?**
    Removes the public projection while preserving package identity, versions, and audit.
32. **Can a published package be deleted?**
    No.
33. **Does publishing update old quotes or bookings?**
    No. Historical records retain their accepted snapshots.

### Pricing and media

34. **Is catalogue pricing Financial accounting?**
    No. It is customer presentation for a package version.
35. **Can I enter amount and Price on request together?**
    No. Choose one.
36. **Can a negative amount be entered?**
    No.
37. **What is display basis?**
    The approved customer-facing unit/context for the price.
38. **What if pricing expires before publication?**
    Publication must be blocked until an effective entry exists.
39. **Can pricing recalculate a booking?**
    No.
40. **What media is required to publish?**
    At least one validated clean, non-private media item.
41. **Can private media become public automatically?**
    No.
42. **Can I replace media bytes in place?**
    No. Replacement creates a new media item/reference.
43. **What image sizes should I use?**
    No numeric standard is approved in the accepted architecture; follow the future approved media policy.
44. **Is automatic image resizing available?**
    No transformation pipeline is implied by the architecture.
45. **What makes useful alt text?**
    It describes the relevant information/purpose without repeating “image of.”
46. **Are captions accepted fields?**
    Captions are requested for the future guide, but the accepted media contract has no caption field; treat them as planned pending schema.

### Catalogue, SEO, and recovery

47. **How does a package enter Explore All Packages?**
    It becomes eligible when an approved version is effectively published.
48. **How is Featured Tours controlled?**
    By the featured choice on the effective published version.
49. **Can I manually order Featured Tours?**
    No accepted ranking/order control exists; current public ordering is by title.
50. **Can I manually order Explore All Packages?**
    No accepted control exists; current ordering is by title.
51. **Can I manage destination master records?**
    No separate accepted Content Studio destination-management workflow exists.
52. **Which SEO fields are supported?**
    SEO structured content exists, but individual field schema is not accepted. Title, description, canonical, Open Graph, image, and keywords remain planned pending schema.
53. **Are keywords supported?**
    Only if a future accepted SEO schema explicitly includes them.
54. **What if preview looks correct but public content is old?**
    Confirm publication state and approved cache/operations status; do not republish blindly.
55. **What if a scheduled publication fails?**
    Preserve the schedule/state and escalate to Operations; retries must not duplicate publication.
56. **What if the wrong version is live?**
    Assess retirement or restore-to-new-draft; do not edit the published version directly.
57. **Can I restore directly to public?**
    No. Restore creates a draft that follows normal review and publication.
58. **Can I put HTML in title or description?**
    No. Accepted package text rejects HTML markup.
59. **Where can I see editorial audit?**
    Accepted audit data exists; the graphical history view is planned and permission-limited.
60. **What should I do if this guide and the future interface differ?**
    Stop, preserve the current state, and ask the Content Manager/Product Owner to reconcile the accepted behavior before proceeding.

**Expected result:** Readers can identify the supported rule, planned limitation, or correct escalation.

### Related chapters

[Troubleshooting](#25-troubleshooting), [Content Studio Quick Reference](CONTENT-STUDIO-QUICK-REFERENCE.md), and [Content Publishing Checklist](CONTENT-PUBLISHING-CHECKLIST.md).

## 28. Glossary

### Purpose

Use consistent editorial and publication terms.

| Term | Meaning |
|---|---|
| Alt text | Short text conveying an image's relevant information or purpose for people who cannot see it. |
| Approval | Independent acceptance of a sealed version before publication/scheduling. |
| Audit history | Append-only record of actor, role, action, states, reason, result, reference, and time. |
| Business code | Permanent unique business identity for a package. |
| Call to action | Customer-facing instruction for the next step, such as requesting a quote. |
| Canonical URL | Preferred public address for content, derived from the canonical slug under approved policy. |
| Catalogue | Public read-only collection of effective published package projections. |
| Content Approver | Accepted role that reviews and controls approval/publication actions. |
| Content Editor | Accepted role that creates, edits, previews, and submits drafts. |
| Cover image | Planned primary visual role; exact role value/policy is not yet accepted. |
| Draft | Only editable, private lifecycle state. |
| Effective price | Version price valid at the intended publication time. |
| Featured Tour | Effective published package whose version has featured enabled. |
| Gallery | Planned ordered presentation of version-scoped public media. |
| Highlight | Short version-scoped feature summary; exact studio schema is planned. |
| Immutable version | Submitted or later snapshot that cannot be edited. |
| Media rights | Evidence that VirtCruise may use and publish a media item. |
| Open Graph | Planned social-sharing metadata pending an accepted SEO schema. |
| Package | Stable catalogue identity across all numbered versions. |
| Package type | Accepted classification such as Holiday Package, Cruise, or Trip Add-on. |
| Price on request | Approved public pricing choice used instead of an amount. |
| Preview | Private view of an intended customer-safe version before publication. |
| Publication | Immutable record that an approved version became effective publicly. |
| Restore | Creation of a new draft derived from a retained version. |
| Retire | Remove a published package from public discoverability while preserving history. |
| Schedule | Approved instruction to publish at a future unambiguous instant. |
| SEO | Search-engine-oriented metadata and content practices; exact studio field schema is planned. |
| Slug | Unique lowercase hyphenated public locator for a package. |
| Trip Add-on | Supporting catalogue type; Car Rental belongs here rather than as a primary package. |
| Version | Numbered package content snapshot with its own pricing and media. |

**Expected result:** Staff use the same words for package identity, version state, review, media, and public visibility.

### Related chapters

[Package versions](#7-package-versions), [Publishing workflow](#9-publishing-workflow), and future DOC-007.

## 29. Appendices

### Purpose

Provide concise planned references and controlled capture requirements.

### Appendix A — Lifecycle reference

| State | Editable | Public | Next accepted outcome |
|---|:---:|:---:|---|
| `DRAFT` | Yes | No | `IN_REVIEW`; `DISCARDED` is defined but no accepted staff command exists |
| `IN_REVIEW` | No | No | `APPROVED` or `REJECTED` |
| `REJECTED` | No | No | Derive a new draft |
| `APPROVED` | No | No | `SCHEDULED` or `PUBLISHED` |
| `SCHEDULED` | No | Not before effective publication | `PUBLISHED`; cancel-to-approved command remains planned |
| `PUBLISHED` | No | Yes when active | `RETIRED` when removed/replaced |
| `RETIRED` | No | No | Derive a new draft if restoring |
| `DISCARDED` | No | No | Terminal draft history |

### Appendix B — Package field summary

| Area | Accepted information | Planned/unsupported boundary |
|---|---|---|
| Identity | Business code, slug, type, editorial owner | Post-create code/type/slug edit not accepted |
| Core content | Title, summary, description, destination, duration, featured | HTML markup rejected |
| Structured content | Highlights, inclusions, exclusions, itinerary, terms, FAQs, call to action | Studio schemas/limits not yet defined |
| Pricing | Currency, amount/price-on-request, basis, selection, qualifier, validity, order | No accounting/inventory/dynamic pricing |
| Media | Reference, type, size/dimensions, role/order, alt text, rights, validation, privacy | Caption/cover-role values and numeric recommendations not defined |
| SEO | Structured metadata | Individual title/description/canonical/Open Graph/keywords schema planned |

### Appendix C — Publication decision summary

| Decision | Who | Required checks | Result |
|---|---|---|---|
| Submit | Editor | Draft complete, previewed, valid | Immutable `IN_REVIEW` |
| Reject | Independent Approver | Specific reason | Immutable `REJECTED`; new draft needed |
| Approve | Independent Approver | Content, commercial, media, accessibility, SEO | Immutable `APPROVED` |
| Publish now | Approver | Approved, effective price, clean public media | Effective `PUBLISHED` projection |
| Schedule | Approver | Same plus future unambiguous time | `SCHEDULED` then effective publication |
| Retire | Approver | Published version, impact, reason | Public projection removed/history retained |
| Restore | Approver | Retained source, reason | New numbered `DRAFT` |

### Appendix D — Screenshot capture register

| Placeholder | Subject | Views | Data/privacy requirement | Dependency |
|---:|---|---|---|---|
| 1 | Studio landing page | Desktop/Tablet/Mobile | Fictional totals and staff identity | Future Content Studio |
| 2 | Role-aware navigation | Desktop/Tablet/Mobile | Fictional roles | Future Content Studio/access review |
| 3 | Create Package | Desktop/Tablet/Mobile | Empty/fictional fields | Future Content Studio |
| 4 | Version History | Desktop/Tablet/Mobile | Fictional versions/audit | Future Content Studio |
| 5 | Review/publish | Desktop/Tablet/Mobile | Fictional sealed content | Future Content Studio |
| 6 | Pricing | Desktop/Tablet/Mobile | Fictional values | Future Content Studio |
| 7 | SEO | Desktop/Tablet/Mobile | Clearly planned schema | Accepted SEO schema |
| 8 | Responsive preview | Desktop/Tablet/Mobile | Fictional package/media | Future Content Studio preview |
| 9 | Approval | Desktop/Tablet/Mobile | Fictional separated actors | Future Content Studio |
| 10 | Errors/conflict | Desktop/Tablet/Mobile | No technical/private detail | Future Content Studio |

All screenshots follow DOC-001 profiles, use approved non-production fictional data, exclude tokens/storage paths/private media, record product build/theme/locale/date, and receive a second-person privacy review.

### Appendix E — Checklist index

- [New Package Checklist](CONTENT-PUBLISHING-CHECKLIST.md#1-new-package-checklist)
- [Publishing Checklist](CONTENT-PUBLISHING-CHECKLIST.md#2-publishing-checklist)
- [Image Checklist](CONTENT-PUBLISHING-CHECKLIST.md#3-image-checklist)
- [SEO Checklist](CONTENT-PUBLISHING-CHECKLIST.md#4-seo-checklist)
- [Retirement Checklist](CONTENT-PUBLISHING-CHECKLIST.md#5-retirement-checklist)

**Expected result:** Appendices provide lifecycle, field, publication, screenshot, and checklist reference without presenting the future studio as released.

## Related documents and source evidence

- [DOC-001, *VirtCruise Documentation Architecture*](../documentation/DOCUMENTATION-ARCHITECTURE.md)
- [DOC-002, *VirtCruise Customer User Guide*](../customer/CUSTOMER-USER-GUIDE.md)
- [DOC-003, *Back Office Operations Manual*](../operations/BACK-OFFICE-OPERATIONS-MANUAL.md)
- [DOC-004, *Finance Standard Operating Procedures*](../finance/FINANCE-STANDARD-OPERATING-PROCEDURES.md)
- [DOC-005-QR, *Content Studio Quick Reference*](CONTENT-STUDIO-QUICK-REFERENCE.md)
- [DOC-005-PC, *Content Publishing Checklist*](CONTENT-PUBLISHING-CHECKLIST.md)
- PLAN-001, *Package Content Management Architecture* — accepted architecture source in the WEB-003 worktree; not linked in the controlled customer repository.
- WEB-003 package content, lifecycle, publication, pricing, media, and catalogue documentation — accepted engineering source in the WEB-003 worktree; not copied into this package.

## Scope exclusions and future manuals

DOC-005 does not replace:

- DOC-003, Back Office Operations Manual;
- DOC-004, Finance Standard Operating Procedures;
- DOC-006, Customer Support Playbook;
- DOC-007, Status & Lifecycle Reference;
- DOC-009, Training Manual; or
- DOC-010, Production Handover Guide.

It does not cover supplier inventory, contract management, dynamic pricing, checkout, localisation, multi-tenancy, general-purpose website pages, financial accounting, booking operations, media-transformation pipelines, software development, deployment, database administration, or production recovery.

## Review record

| Gate | Responsible role | Decision | Date | Evidence/notes |
|---|---|---|---|---|
| Author self-review | Documentation Lead | Complete | 2026-08-03 | Planned-state labels, terminology, links, privacy, and PDF reviewed |
| Architecture review | Product/Architecture Owner | Pending | — | Confirm PLAN-001/WEB-003 alignment |
| Content usability review | Content Manager/Editors | Pending | — | Validate future task flow and field language |
| Marketing/Product review | Marketing Lead/Product Manager | Pending | — | Approve naming, media, SEO, and commercial wording |
| Accessibility review | Accessibility Reviewer | Pending | — | Approve alt-text/media/preview guidance |
| Security/privacy review | Security/Privacy Lead | Pending | — | Approve media and preview controls |
| Business approval | Business Owner | Pending | — | Required before controlled internal publication |
| Publication | Publisher | Pending | — | Content Studio remains planned; do not present guide as live |

## Change history

| Version | Date | Author | Change | Status |
|---|---|---|---|---|
| 0.8.0-draft.1 | 2026-08-03 | Documentation Lead | Initial planned Content Studio User Guide for internal review | Draft — Internal Review |
