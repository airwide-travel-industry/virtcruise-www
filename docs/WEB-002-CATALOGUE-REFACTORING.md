# WEB-002 Catalogue Refactoring

Workstream: WEB-002  
Sprint: 3.7  
Target: v0.8.0  
Frontend baseline: `8eae01a63a3467e9add0dd919c6f99aad964fcca`  
Backend reference baseline: `31260f5361dca04168a54942a6a92020e17ec755`

## Scope

WEB-002 changes only the static customer frontend. It adds no backend catalogue, CMS, database,
editing, pricing administration, deployment or release versioning capability.

## Catalogue audit and changes

All six package records and pages were reviewed for layout, imagery, headings, price presentation,
CTA language, spacing, navigation, duplication, responsive behavior and metadata.

- Featured Tours is the short discovery entry point; Explore All Packages is the complete comparison
  surface with filters, summaries and a visible featured marker.
- Package cards now use consistent `View Package` and `Add to My Trip` actions.
- Detail pages use shared Summary, Duration, Price Panel, Gallery and CTA renderers, followed by
  inclusions/exclusions, itinerary, terms, FAQ and related packages.
- Prices retain the existing indicative `priceFrom` values and explicitly state that availability
  and final cost are confirmed in the quotation.
- Victoria Falls and every other package consume the same structured record. Stable
  `data-package-component` and `data-package-field` hooks allow WEB-003 to bind content later.

## Image remediation

The audit found two duplicated catalogue covers: Dubai reused European City Break and Zanzibar reused
Tropical Paradise. They were replaced with unique Dubai and Zanzibar imagery. Six relevant secondary
gallery images replace unrelated package and office imagery. Every record has a useful cover alt and
per-gallery alt list.

The eight new assets were generated using the built-in image tool with destination-specific,
photorealistic editorial travel prompts, no text, logos, watermarks or identifiable people. Sources
were resized to 1200 px and encoded as WebP. The delivered assets total approximately 1.14 MB versus
approximately 20.8 MB for their PNG sources, a reduction of about 94.5%.

## Car Rental hierarchy

The customer service order is Flights, Holiday Packages, Victoria Falls, Cruises, Accommodation,
Visa Services and Car Rental. Car Rental is last, labelled `Trip add-on`, visually subdued and absent
from package data. Its action adds supporting transport to a trip instead of presenting a primary
package product.

## Files of interest

- `data/packages.json`: frontend package content and media metadata.
- `js/shop.js`: reusable catalogue cards and gallery modal.
- `js/package-page.js`: shared package-detail components and customer flow.
- `css/shop.css`, `css/package-page.css`: responsive catalogue presentation.
- `tests/web002-catalogue.test.mjs`: bounded WEB-002 static acceptance.

