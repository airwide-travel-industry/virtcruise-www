export const deploymentProfiles = Object.freeze({
  webdev: Object.freeze({
    stageName: 'virtcruise-www-webdev-v0.8.0-dev',
    release: 'v0.8.0-dev',
    publicOrigin: 'https://www.virtcruisetravels.com',
    apiOrigin: 'https://api.virtcruisetravels.com',
    upstreamApiOrigin: 'https://api.virtcruise.airwide.co.uk'
  }),
  'airwide-hotfix': Object.freeze({
    stageName: 'virtcruise-www-airwide-hotfix-e9662ea',
    release: 'hotfix-e9662ea',
    publicOrigin: 'https://virtcruise.airwide.co.uk',
    apiOrigin: 'https://api.virtcruise.airwide.co.uk',
    upstreamApiOrigin: 'https://api.virtcruise.airwide.co.uk'
  })
});

export function deploymentProfile(name = 'webdev') {
  const profile = deploymentProfiles[name];
  if (!profile) throw new Error(`Unknown deployment profile: ${name}`);
  return profile;
}
