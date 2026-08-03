import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deploymentProfile } from './deployment-profiles.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
const profileName = process.argv.find(value => value.startsWith('--profile='))?.split('=', 2)[1] || 'webdev';
const profile = deploymentProfile(profileName);
const stage = join(output, profile.stageName);
const zip = `${stage}.zip`;
const publicOrigin = profile.publicOrigin;
const runtimeRoots = ['index.html', 'account', 'auth', 'bank-transfer', 'bookings', 'css', 'dashboard',
  'data', 'finance', 'financial', 'forgot-password', 'images', 'js', 'notifications', 'packages',
  'preferences', 'profile', 'quotes', 'register', 'reset-password', 'signin', 'travellers', 'trips',
  'verify-email', 'robots.txt', 'sitemap.xml'];

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else result.push(path);
  }
  return result;
}

function canonicalPath(path) {
  const name = relative(stage, path).replaceAll('\\', '/');
  if (name === 'index.html') return '/';
  if (name.startsWith('packages/') && name.endsWith('.html')) return `/${name}`;
  return `/${name.replace(/index\.html$/, '')}`;
}

await mkdir(output, { recursive: true });
await rm(stage, { recursive: true, force: true });
await rm(zip, { force: true });
await rm(`${zip}.sha256`, { force: true });
await mkdir(stage, { recursive: true });
for (const name of runtimeRoots) {
  const source = join(root, name);
  try { await stat(source); } catch { throw new Error(`Required runtime entry is missing: ${name}`); }
  await cp(source, join(stage, name), { recursive: true, preserveTimestamps: false });
}
await rm(join(stage, 'images', '.gitkeep'), { force: true });

const runtimeConfigPath = join(stage, 'js', 'runtime-config.js');
let runtimeConfig = await readFile(runtimeConfigPath, 'utf8');
runtimeConfig = runtimeConfig
  .replaceAll('https://www.virtcruisetravels.com', profile.publicOrigin)
  .replaceAll('https://api.virtcruisetravels.com', profile.apiOrigin);
await writeFile(runtimeConfigPath, runtimeConfig);

for (const publicFile of ['robots.txt', 'sitemap.xml']) {
  const path = join(stage, publicFile);
  const content = (await readFile(path, 'utf8'))
    .replaceAll('https://www.virtcruisetravels.com', profile.publicOrigin);
  await writeFile(path, content);
}

for (const path of (await files(stage)).filter(value => extname(value) === '.html')) {
  let html = await readFile(path, 'utf8');
  const canonical = `${publicOrigin}${canonicalPath(path)}`;
  const metadata = `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="Virtcruise Travels">`;
  html = html.replace(/<\/head>/i, `${metadata}</head>`);
  await writeFile(path, html);
}

const runtimeEntryCount = (await files(stage)).length;
await writeFile(join(stage, 'DEPLOYMENT-MANIFEST.json'), `${JSON.stringify({
  release: profile.release, publicOrigin, apiOrigin: profile.apiOrigin,
  upstreamApiOrigin: profile.upstreamApiOrigin, routeStrategy: 'physical-index-files',
  generatedAt: '1980-01-01T00:00:00.000Z', checksummedEntries: runtimeEntryCount + 1
}, null, 2)}\n`);

const inventory = [];
for (const path of (await files(stage)).sort()) {
  const body = await readFile(path);
  inventory.push(`${createHash('sha256').update(body).digest('hex')}  ${relative(stage, path).replaceAll('\\', '/')}`);
}
await writeFile(join(stage, 'SHA256SUMS'), `${inventory.join('\n')}\n`);

execFileSync('find', [stage, '-exec', 'touch', '-h', '-t', '198001010000.00', '{}', '+']);
execFileSync('zip', ['-X', '-q', '-r', zip, stage.slice(output.length + 1)], { cwd: output });
const zipHash = createHash('sha256').update(await readFile(zip)).digest('hex');
await writeFile(`${zip}.sha256`, `${zipHash}  ${zip.split('/').at(-1)}\n`);
console.log(`${zip}\n${zipHash}\n${inventory.length + 1} staged files`);
