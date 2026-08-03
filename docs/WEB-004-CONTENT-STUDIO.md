# WEB-004 Content Studio

Workstream WEB-004 provides a private, `noindex,nofollow` staff application at `/content-studio/`. It uses the accepted WEB-003 management boundary exclusively and does not call catalogue APIs or modify public rendering.

`ROLE_CONTENT_EDITOR`, `ROLE_CONTENT_APPROVER`, and `ROLE_ADMIN` may enter. Anonymous and customer sessions receive explicit denial screens. Backend authorization, independent approval, lifecycle validation, optimistic locking, media validation, audit, and publication remain authoritative.

The application supplies Dashboard, Packages, Drafts, Review Queue, Publication Queue, Media, Pricing, SEO, Version History, Audit, and Settings navigation. Supported workflows include package creation and direct ID opening; draft content, highlights, inclusions, exclusions and CTA editing; pricing and media-metadata registration; SEO editing and preview; desktop/tablet/mobile private preview; version history; submit, approve, reject, schedule, publish, retire and restore commands; and package audit retrieval. All mutation requests carry correlation IDs, while schedule/publish carry idempotency keys.

WEB-003 does not expose package collection/search/pagination, global counts/activity, package archive/delete, media upload/reorder/update, or settings endpoints. Content Studio therefore uses a session-only working set populated by created or directly opened package IDs. It does not fake these unsupported server capabilities.

No public catalogue integration, backend redesign, deployment, or production migration is included.
