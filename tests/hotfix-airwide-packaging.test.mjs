import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { deploymentProfile } from '../scripts/deployment-profiles.mjs';

const root = new URL('..', import.meta.url).pathname;
const brandedZip = `${root}dist/virtcruise-www-webdev-v0.8.0-dev.zip`;
const airwideZip = `${root}dist/virtcruise-www-0.8.0-beta.2.zip`;

const sha256 = async path => createHash('sha256').update(await readFile(path)).digest('hex');
const unzip = path => execFileSync('unzip', ['-p', airwideZip, path], { encoding: 'utf8' });

test('Airwide production-beta profile has exact immutable release identity', () => {
  assert.deepEqual(deploymentProfile('production-beta'), {
    stageName: 'virtcruise-www-0.8.0-beta.2',
    release: '0.8.0-beta.2',
    publicOrigin: 'https://virtcruise.airwide.co.uk',
    apiOrigin: 'https://api.virtcruise.airwide.co.uk',
    upstreamApiOrigin: 'https://api.virtcruise.airwide.co.uk',
    productionRuntime: true
  });
  assert.throws(() => deploymentProfile('untrusted'));
});

test('Airwide build preserves branded artifact and contains only Airwide runtime origins', async () => {
  execFileSync(process.execPath, ['scripts/build-webdev-artifact.mjs'], { cwd: root });
  const brandedHash = await sha256(brandedZip);
  execFileSync(process.execPath, ['scripts/build-webdev-artifact.mjs', '--profile=production-beta'], { cwd: root });
  assert.equal(await sha256(brandedZip), brandedHash);
  const runtime = unzip('virtcruise-www-0.8.0-beta.2/js/runtime-config.js');
  const manifest = JSON.parse(unzip('virtcruise-www-0.8.0-beta.2/DEPLOYMENT-MANIFEST.json'));
  assert.match(runtime, /https:\/\/virtcruise\.airwide\.co\.uk/);
  assert.match(runtime, /https:\/\/api\.virtcruise\.airwide\.co\.uk/);
  assert.doesNotMatch(runtime, /api\.virtcruisetravels\.com/);
  assert.equal(manifest.publicOrigin, 'https://virtcruise.airwide.co.uk');
  assert.equal(manifest.apiOrigin, 'https://api.virtcruise.airwide.co.uk');
  assert.equal(manifest.release, '0.8.0-beta.2');
  assert.equal(manifest.productionRuntime, true);
});

test('production-beta archive excludes every development runtime path', () => {
  const listing = execFileSync('unzip', ['-Z1', airwideZip], { encoding: 'utf8' });
  assert.doesNotMatch(listing, /mock-api|\/data\//i);
  const extracted = execFileSync('unzip', ['-p', airwideZip], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  assert.doesNotMatch(extracted, /hotfix-e9662ea|localhost|127\.0\.0\.1|0\.0\.0\.0|api=local|api=mock|mock-api|development preview/i);
  assert.doesNotMatch(extracted, /https:\/\/(?:www\.)?virtcruisetravels\.com/);
});
