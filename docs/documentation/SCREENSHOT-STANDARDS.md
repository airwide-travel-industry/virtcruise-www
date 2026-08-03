# Screenshot Standards

| Field | Value |
|---|---|
| Document ID | DOC-001-SS |
| Version | 0.8.0-draft.1 |
| Status | Draft |
| Owner | Documentation Lead |
| Classification | Customer confidential — NDA required |
| Last reviewed | 2026-08-03 |

## 1. Purpose

These standards make screenshots consistent, legible, accessible, version-aware, and safe for customer distribution. Use a screenshot only when it clarifies orientation, recognition, or a complex visual state better than text.

## 2. Capture profiles

| Profile | Viewport | Device pixel ratio | Capture requirement |
|---|---:|---:|---|
| Desktop | 1440 × 900 CSS pixels | 1× | Default for desktop workflows; browser content only unless browser controls matter |
| Tablet | 1024 × 1366 CSS pixels | 1× | Portrait by default; use landscape only when the documented task requires it |
| Mobile | 390 × 844 CSS pixels | 1× | Portrait default representative viewport |

Capture PNG for interface detail. Use SVG for authored diagrams where safe and supported. Do not enlarge a low-resolution capture. Crop to the relevant product area while retaining enough navigation context for orientation.

Record the viewport, browser family, product version/build, theme, locale, and capture date in the asset review record. Use the default supported theme and English locale unless the document explicitly covers another variant.

## 3. Stable capture state

Use an approved non-production environment with seeded fictional data. Reset zoom to 100%, close unrelated tabs and overlays, hide developer tools, use a clean supported browser, and capture a complete stable state. Avoid transient notifications unless they are the subject of the instruction.

## 4. Privacy and masking

Screenshots must contain no real names, addresses, contact details, dates of birth, passport information, booking data, financial details, authentication data, tokens, internal host names, or other sensitive information. Prefer fictional data at source over masking.

If masking is unavoidable, use an opaque solid block or replace the value before capture. Blur and pixelation are not acceptable because source data may remain recognisable or recoverable. After annotation and export, a second person must inspect the final flattened image at 100% and at magnification. Remove image metadata where the publication process does not already do so.

## 5. Highlighting and annotation

Use one numbered marker per referenced control and explain the numbers in adjacent text. Use a 3 px high-contrast outline with sufficient padding; do not obscure labels or states. Use arrows only when an outline cannot identify the target. Never rely on colour alone. Do not use decorative shadows, freehand circles, or more than five annotations in one image.

The standard highlight colour is dark blue `#005A9C` on light backgrounds and light cyan `#66D9EF` on dark backgrounds, paired with a number or textual label. A warning annotation uses a warning icon plus text, not red alone.

## 6. File naming and storage

Use lowercase names:

```text
<document-id>-<section>-<sequence>-<device>-v<product-version>.<ext>
doc-002-manage-booking-01-desktop-v0.8.0.png
```

Use two-digit sequence numbers, `desktop`, `tablet`, or `mobile`, and the product version shown. Store files in `<category>/assets/<document-id>/images/`. Do not overwrite an image for a different product version; add the new version and remove the old one only when no maintained document references it.

## 7. Captions and alternative text

Number figures in order: `Figure 3 — Select View booking from My Trips.` Alternative text states the relevant interface and outcome, not “screenshot of.” Keep instructions complete without the image. Decorative images are not permitted in task procedures.

## 8. Version review

At every product release, compare each maintained screenshot with the accepted interface for labels, layout, content, and state. Replace it when a reader could be misled. A layout difference that does not affect the task may remain only after owner review and with the applicable product version clearly stated.

## 9. Approval checklist

- Correct capture profile and supported interface state.
- Fictional data only; final image passed privacy inspection.
- Exact current labels and navigation.
- Highlighting is limited, numbered, and accessible.
- File name, product version, caption, alt text, and storage are correct.
- Text remains sufficient if the image is unavailable.
