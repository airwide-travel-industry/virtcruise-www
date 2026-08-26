# Frontend Packaging

Build the production-beta artifact with:

```text
npm ci
npm run build:production-beta
```

Output:

- `dist/virtcruise-www-0.8.0-beta.2.zip`
- `dist/virtcruise-www-0.8.0-beta.2.zip.sha256`

The build uses deterministic timestamps, sorted per-file checksums and ZIP metadata stripping.
Every run recreates its stage directory and archive. The production overlay is guarded by exact
source-input assertions so an upstream runtime change cannot silently bypass hardening.

Production policy:

- release identity is `0.8.0-beta.2`;
- public origin is `https://virtcruise.airwide.co.uk`;
- the sole application API origin is `https://api.virtcruise.airwide.co.uk`;
- production, Dynamic Catalogue, Content Studio and Control Tower are enabled/present;
- local, mock and development runtime behavior is removed;
- mock implementation and mock catalogue data are excluded;
- source maps and secrets are excluded;
- canonical and Open Graph URLs use the Airwide public origin.

Run `node --test tests/hotfix-airwide-packaging.test.mjs tests/production-beta-browser.test.mjs`
after every packaging change. Compare two clean-build ZIP SHA-256 values before release acceptance.
