# WEB-005 Acceptance

- Required six browser failures reproduced before implementation: three readiness timeouts and three guest-navigation catalogue 404/console failures.
- Focused browser regression: 15 passed, 0 failed, 0 skipped across desktop/tablet/mobile.
- Full frontend suite: 92 tests, 84 passed, 0 failed, 0 errors, 8 pre-existing operator-gated real-environment skips.
- Backend unit suite: 570 discovered in the unit-mode report set, 0 failures and 0 errors; PostgreSQL-gated classes remain skipped unless explicitly enabled.
- Focused PostgreSQL 18.4 catalogue/content run: public route, security, projection, scheduler, Flyway and Hibernate checks passed with no failure/error/skip in the selected classes.
- Flyway V1–V17 migrated and validated on a disposable UTF-8, UTC, SCRAM cluster; Hibernate schema validation passed.
- Public performance sample used 1,007 projected packages and 500 iterations per operation. Local p50/p95/p99 milliseconds: list 0.1835/0.6722/1.1890, destination 0.0390/0.0520/0.4761, featured 0.0400/0.0540/0.4790, slug 0.3410/0.8609/1.3530. A 12-row page projection was 13,054 bytes. Lock waits and deadlocks were zero.

The eight frontend skips and backend opt-in skips are existing real-environment/operator-gated suites outside WEB-005A; they are not acceptance passes. WEB-005A mandatory focused coverage has zero skips.
