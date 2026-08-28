export const deploymentProfiles = Object.freeze({
  webdev: Object.freeze({
    stageName: 'virtcruise-www-webdev-v0.8.0-dev',
    release: 'v0.8.0-dev',
    publicOrigin: 'https://www.virtcruisetravels.com',
    apiOrigin: 'https://api.virtcruisetravels.com',
    upstreamApiOrigin: 'https://api.virtcruise.airwide.co.uk'
  }),
  'production-beta': Object.freeze({
    stageName: 'virtcruise-www-0.8.0-beta.2',
    release: '0.8.0-beta.2',
    publicOrigin: 'https://virtcruise.airwide.co.uk',
    apiOrigin: 'https://api.virtcruise.airwide.co.uk',
    upstreamApiOrigin: 'https://api.virtcruise.airwide.co.uk',
    productionRuntime: true
  }),
  'production-beta3': Object.freeze({
    stageName: 'virtcruise-www-0.8.0-beta.3',
    release: '0.8.0-beta.3',
    publicOrigin: 'https://virtcruise.airwide.co.uk',
    apiOrigin: 'https://api.virtcruise.airwide.co.uk',
    upstreamApiOrigin: 'https://api.virtcruise.airwide.co.uk',
    productionRuntime: true
  }),
  'reconciled-v21': Object.freeze({
    stageName: 'virtcruise-www-0.8.0-beta.3-hotfix-v21-frontend-reconciled-001',
    release: '0.8.0-beta.3-hotfix-v21-frontend-reconciled-001',
    publicOrigin: 'https://virtcruise.airwide.co.uk',
    apiOrigin: 'https://api.virtcruise.airwide.co.uk',
    upstreamApiOrigin: 'https://api.virtcruise.airwide.co.uk',
    productionRuntime: true
  })
});

export function deploymentProfile(name = 'webdev') {
  const profile = deploymentProfiles[name];
  if (!profile) throw new Error(`Unknown deployment profile: ${name}`);
  return profile;
}
