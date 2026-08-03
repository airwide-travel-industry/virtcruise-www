# WEB-004 Content Studio UX

Content Studio is a restrained business application: navy staff header, persistent workspace navigation, white operational panels, dense responsive tables, visible statuses, and direct primary actions. It has no decorative animation.

The package workspace separates stable identity creation from version editing. Staff can open an authoritative package by UUID, edit a mutable draft, add pricing/media metadata, manage SEO, inspect history/audit, preview responsive presentation, and invoke role-appropriate lifecycle commands. Immutable versions disable draft saving. Backend failures and optimistic conflicts remain visible without pretending an operation succeeded.

At 760px the sidebar becomes a keyboard-operated disclosure and tables become labelled records. At 430px cards and actions stack. Controls retain visible labels and touch-sized targets; focus-visible uses a high-contrast ring; live errors use alerts; reduced-motion removes transitions and animation.

Collection-wide search, sort, pagination, dashboards, queues, recent activity, archive/delete, and persistent settings require management APIs absent from WEB-003. Current counts and filters apply only to packages opened during the browser session. Native reason prompts are functional but should become focus-managed application dialogs during hardening.
