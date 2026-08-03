# WEB-001 Rollback

Target maximum: 15 minutes after a mandatory failure is declared. Preserve the v0.7.0 artifact and
current Airwide production topology before activation; rollback never requires rebuilding.

Restore the timestamped WebDev public-root backup by atomic directory swap where possible. Restore
the prior runtime configuration with the same operation. Revert branded CORS and `FRONTEND_BASE_URL`
to their captured prior values, then restart only through the accepted Airwide procedure. Restore
DNS records and TTLs from the signed pre-change inventory; remove/disable the optional API route
only after clients are back on the prior topology. Purge or revalidate HTML/config caches, not
private API data. Verify Airwide v0.7.0 homepage, package page, API health, login/session/logout,
Manual Finance, email links and no partial WebDev state.

An emergency one-file redirect may point the WebDev root to `https://virtcruise.airwide.co.uk`, but
it is a rollback-only customer continuity measure and not the WEB-001 architecture. Its use needs
incident authority and a later removal check. Never restore database data for a frontend rollback.
