# WEB-001 WebDev Deployment

Applies to v0.8.0-dev. No step authorizes production deployment.

## Preconditions

Obtain written change approval. Record authoritative nameservers and current A/AAAA/CNAME records
with `dig +short NS virtcruisetravels.com`, `dig +short A`, `dig +short AAAA` and `dig +short CNAME`
for apex, `www` and `api`. Record TTLs with `dig +noall +answer`. Confirm WebDev document root,
default index, TLS chain/renewal owner, file limit and backup/restore method. Required target policy:
`www` canonical; apex permanent redirect to `www`; `api` terminates valid TLS on Airwide and proxies
to the existing API. Do not change DNS from this procedure without separate authorization.

Observed 2026-08-03 desired changes: preserve the operator-confirmed WebDev target for `www`; create
an authorized `api` record targeting the Airwide TLS/proxy boundary; configure the Cloudflare apex
to permanent-redirect path and query to `https://www.virtcruisetravels.com`; retain TTL 300 for
cutover and restore the captured records on rollback. Cloudflare owns apex certificate termination;
WebDev currently terminates `www`; Airwide must own the API certificate. Exact target record values
require those three operators and are intentionally not guessed.

## Package and upload

Run `npm ci`, `npm test`, then `npm run build:webdev`. Verify the adjacent `.sha256`, extract to an
offline temporary directory, run `sha256sum -c SHA256SUMS`, and inspect `DEPLOYMENT-MANIFEST.json`.
In File Manager download a timestamped archive of every current public-root entry. Upload the zip
outside the live root if possible, validate its outer checksum, extract, validate the inner
inventory, then rename/swap the complete directory. If rename is unavailable, upload immutable
assets first, route directories second, and `index.html`, `robots.txt` and `sitemap.xml` last.
Application files require no manual edits. FTP/SFTP may be used only if WebDev confirms support.

## Activation and validation

Confirm HTML/config are short-lived or `no-cache`, hashed/unchanged assets have bounded cache,
`.js` is JavaScript, `.css` is CSS, `.xml` is XML and images have correct MIME types. Verify `/`,
every physical directory route, all six package files, refresh/direct entry, query strings,
canonical/OG metadata, robots and sitemap. Then verify CORS preflight, registration, verification,
login, refresh, logout and protected browser-back behavior at desktop/tablet/mobile sizes. Abort on
any TLS, route, cookie, CSRF, CORS, console, normal-path network, privacy or overflow failure.

Target headers where supported: CSP with `connect-src 'self' https://api.virtcruisetravels.com` and
required Blob viewing, `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict
Referrer-Policy, minimal Permissions-Policy and correctly owned HSTS. Test CSP before activation.

WEB-001A read-only evidence found Apache serving `www` with `Content-Type`, length, modification and
range headers, but no observed CSP, frame policy, nosniff, Referrer-Policy, Permissions-Policy,
HSTS, compression or explicit cache policy. File Manager document root, upload/rename limit and
`.htaccess` remain operator-only facts. Do not activate the artifact until those capabilities and
the existing-file backup are recorded.
