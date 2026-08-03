# WEB-004 Content Studio

Workstream: WEB-004  
Sprint: 3.7  
Target: v0.8.0

Content Studio is a staff-only frontend surface over the existing WEB-003 Content Management
contracts. It is deliberately separate from the public catalogue and is marked `noindex,nofollow`.

The `/content-studio/` route checks the current authenticated user before rendering. Only
`ROLE_CONTENT_EDITOR`, `ROLE_CONTENT_APPROVER`, and `ROLE_ADMIN` may enter. Customers, anonymous
visitors, and unrelated staff roles receive an access boundary. The frontend does not make
authorization decisions for publication; it submits commands to the backend, where role separation,
approval, optimistic locking, validation, and audit remain authoritative.

The shell includes Dashboard, Packages, Drafts, Review Queue, Publication Queue, Media, Pricing, SEO,
Version History, Audit, and Settings navigation. Package creation uses `POST /api/v1/content/packages`;
package reads and commands remain bounded by the existing WEB-003 API. No public catalogue rendering
or package JSON was changed.

Responsive behavior uses a collapsible mobile workspace navigation, stacked forms and tables, and
touch-sized controls. Labels, focus-visible states, current-navigation state, status/live messaging,
semantic headings, noindex metadata, and reduced-motion rules are included. Browser acceptance is
defined in `tests/web004-content-studio.test.mjs`.
