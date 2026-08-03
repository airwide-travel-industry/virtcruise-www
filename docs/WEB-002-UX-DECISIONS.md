# WEB-002 UX Decisions

## Discovery and comparison

Featured Tours remains intentionally small: three editorial picks introduce the catalogue. Explore
All Packages remains authoritative and contains all six packages. Introductory copy explains the
handoff, while the complete grid marks featured records instead of duplicating featured marketing
copy or creating a second data source.

## Product hierarchy

Flights and package journeys are customer starting points. Victoria Falls receives explicit service
and package visibility because it is a signature destination. Car Rental is useful only in support
of an itinerary, so it appears last as a subdued `Trip add-on`; it is not a package record.

## Package presentation

- A destination-led hero establishes place, package name, summary, duration and starting price.
- A two-image gallery provides relevant visual context without excessive payload or thumbnail noise.
- Included/not included content precedes itinerary details to answer value questions early.
- The sticky Price Panel keeps indicative price, duration and the quotation caveat together.
- `Build My Quote`, `Add to My Trip` and `Enquire on WhatsApp` represent distinct customer intents.
- Related packages are limited to three and ordered by shared travel styles.

## Responsive and accessible behavior

The layout moves from a two-column content/enquiry grid on desktop to a single flow on tablet. Gallery
images remain paired on tablet and stack on mobile; catalogue cards move from three to two to one
column. Controls use native buttons, links, labels, fieldsets and details elements. Visible focus,
descriptive image alternatives, live result status, keyboard-operable galleries and reduced-motion
rules are retained. Components use `min-width: 0`, bounded grids and fluid images to prevent overflow.

## WEB-003 handoff

WEB-002 deliberately keeps content in the existing frontend JSON. The shared renderer consumes one
package object and exposes stable component/field annotations. WEB-003 may replace the repository
source with CMS-backed data without redesigning these customer components. Editing, publishing,
version history, administrative pricing and persistence remain out of scope here.

