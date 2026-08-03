import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { deploymentProfile } from '../scripts/deployment-profiles.mjs';

const root = new URL('..', import.meta.url).pathname;
const brandedZip = `${root}dist/virtcruise-www-webdev-v0.8.0-dev.zip`;
const airwideZip = `${root}dist/virtcruise-www-airwide-hotfix-e9662ea.zip`;
const brandedHash = '4577c8de10759ac35d53e4ef89e4cf38a4dd9354e5b6219d4bedf299bdaad418';

const sha256 = async path => createHash('sha256').update(await readFile(path)).digest('hex');
const unzip = path => execFileSync('unzip', ['-p', airwideZip, path], { encoding: 'utf8' });

test('Airwide profile is exact, immutable and separate from branded production', () => {
  assert.deepEqual(deploymentProfile('airwide-hotfix'), {
    stageName: 'virtcruise-www-airwide-hotfix-e9662ea',
    release: 'hotfix-e9662ea',
    publicOrigin: 'https://virtcruise.airwide.co.uk',
    apiOrigin: 'https://api.virtcruise.airwide.co.uk',
    upstreamApiOrigin: 'https://api.virtcruise.airwide.co.uk'
  });
  assert.throws(() => deploymentProfile('untrusted'));
});

test('Airwide build preserves branded artifact and contains only Airwide runtime origins', async () => {
  execFileSync(process.execPath, ['scripts/build-webdev-artifact.mjs', '--profile=airwide-hotfix'], { cwd: root });
  assert.equal(await sha256(brandedZip), brandedHash);
  const runtime = unzip('virtcruise-www-airwide-hotfix-e9662ea/js/runtime-config.js');
  const manifest = JSON.parse(unzip('virtcruise-www-airwide-hotfix-e9662ea/DEPLOYMENT-MANIFEST.json'));
  assert.match(runtime, /https:\/\/virtcruise\.airwide\.co\.uk/);
  assert.match(runtime, /https:\/\/api\.virtcruise\.airwide\.co\.uk/);
  assert.doesNotMatch(runtime, /api\.virtcruisetravels\.com/);
  assert.equal(manifest.publicOrigin, 'https://virtcruise.airwide.co.uk');
  assert.equal(manifest.apiOrigin, 'https://api.virtcruise.airwide.co.uk');
});
