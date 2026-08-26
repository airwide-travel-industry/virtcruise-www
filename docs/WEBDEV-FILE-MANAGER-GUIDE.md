# WebDev File Manager Guide

Sign in using operator-managed credentials; never paste them into tickets, terminals or Git. Locate
and record the public document root. Select all existing public entries and use the provider's
archive/download feature to create an off-host timestamped backup. Do not delete the live copy.

Upload the WEB-001 zip to a non-public temporary directory, compare its SHA-256 with the supplied
file, extract it, and verify `SHA256SUMS`. Ensure the archive's top-level contents—not an extra
nested project directory—will become the public root. Prefer a directory rename/swap. If unavailable,
follow the ordered upload in the deployment guide. Confirm permissions allow web-server read but
not public write. Never upload `.git`, `node_modules`, tests, environment files, keys or logs.

After activation open the homepage and representative nested routes in a private browser window,
refresh them, and inspect MIME/cache headers. On failure stop, restore the backup, and follow the
rollback checklist. Record timestamps and checksums, never credentials.

WEB-001A did not receive File Manager authorization or credentials and therefore performed no
upload, extraction, staging or public-root inspection. These remain mandatory operator steps.
