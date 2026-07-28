# Frontend Deployment v0.2.0

## Hosting roles

- Customer-facing production: https://virtcruise.airwide.co.uk, served directly by NGINX.
- Preview artifact: GitHub Pages workflow `.github/workflows/deploy-pages.yml`.
- Production API: https://api.virtcruise.airwide.co.uk.

GitHub Pages is not the production custom-domain host. Its manual workflow publishes a static preview
and must not be confused with the NGINX release cutover.

## Production release layout

```text
/var/www/virtcruise/releases/<commit>/
/var/www/virtcruise/current -> releases/<commit>
```

v0.2.0:

- Current: `/var/www/virtcruise/releases/5fda61df4d4f414a5058bf08ad6ff1b65ebd857e`
- Previous: `/var/www/virtcruise/releases/b3abeaf989ffb3f8e9ea74101dead7040650f0e1`

## Clean artifact procedure

1. Verify a clean `main`, the expected commit, and immutable `v0.2.0` tag.
2. Export only `.nojekyll`, `index.html`, `css/`, `data/`, `images/`, `js/` and `packages/` from the
   tag with `git archive`. Do not copy the working tree.
3. Exclude repository metadata, workflows, documentation, screenshots, logs, editor files and
   environment files.
4. Produce a sorted per-file SHA-256 manifest and deterministic archive.
5. Upload to a temporary server path and verify the archive checksum before extraction.
6. Extract into a new release directory; never overwrite an unverifiable existing directory.
7. Verify every manifest entry server-side.
8. Apply `root:www-data`, `0750` directories and `0640` files. NGINX can read but not modify releases.

## Atomic cutover

Create a replacement symlink beside `current`, then atomically rename it over `current`. Run
`sudo nginx -t`; reload only after validation succeeds:

```bash
sudo nginx -t
sudo systemctl reload nginx
readlink -f /var/www/virtcruise/current
```

Do not restart unrelated services and do not delete prior releases.

## Validation

- Confirm HTTP redirects to HTTPS and the homepage returns 200.
- Compare public `index.html` and `js/api-client.js` to release checksums using a cache-busting query.
- Confirm all six `packages/*.html` pages, JavaScript, CSS, JSON and representative images return 200.
- Use a clean browser profile at desktop, tablet and mobile sizes.
- Confirm packages come from the production API and no CORS or console errors occur.
- Submit one scoped quote, observe one canonical POST with an idempotency key, verify replay, then
  remove only its test records through an internal controlled process.

HTML is configured as non-cacheable. The existing static asset policy allows JavaScript and CSS to
remain cached for one day; use cache-busting during release validation and account for recently
cached clients when investigating stale behavior.

## Rollback

```bash
sudo ln -sfn releases/b3abeaf989ffb3f8e9ea74101dead7040650f0e1 /var/www/virtcruise/current
sudo nginx -t
sudo systemctl reload nginx
curl --fail https://virtcruise.airwide.co.uk/
```

Rollback changes only the frontend symlink. It does not roll back the API or database.

## GitHub Pages preview

The manual workflow checks out the repository, stages the public directories, includes `.nojekyll`,
uploads a Pages artifact and deploys to the `github-pages` environment. The backend CORS allow-list
is intentionally limited to the production frontend; the preview is not an alternative production
origin.
