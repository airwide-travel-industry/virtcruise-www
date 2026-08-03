# WEB-004 Acceptance

Status: implementation delivered; acceptance pending environment-backed staff API qualification.

Passed static gates:

- staff route is `noindex,nofollow`;
- anonymous and unauthenticated states render an explicit sign-in/access boundary;
- content roles are explicitly allowlisted;
- dashboard, package, queue, media, pricing, SEO, version, audit, and settings modules are present;
- existing `/api/v1/content/packages` boundary is used for authoring;
- responsive navigation, stacked mobile layouts, labels, focus, ARIA state, and reduced-motion rules
  are present;
- public catalogue files and customer rendering were not modified.

Required follow-up acceptance against a running WEB-003 backend:

- real browser editor, preview, media, pricing, review, approval, scheduling, retirement, and
  restoration journeys;
- real JWT role matrix for editor, approver, administrator, customer, and anonymous users;
- stale-edit conflict and safe API error journeys;
- desktop/tablet/mobile browser and accessibility audit.

WEB-004 does not deploy, migrate production, or begin WEB-005 public catalogue integration.
