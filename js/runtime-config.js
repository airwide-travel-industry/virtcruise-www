const APPROVED_PUBLIC_ORIGIN = 'https://www.virtcruisetravels.com';
const APPROVED_API_ORIGINS = new Set(['https://api.virtcruisetravels.com']);

function exactOrigin(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required`);
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/'
      || url.search || url.hash) throw new Error(`${name} must be an HTTPS origin`);
  return url.origin;
}

export function validateRuntimeConfig(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('VirtCruise public runtime configuration is required');
  }
  const publicOrigin = exactOrigin(value.publicOrigin, 'publicOrigin');
  const apiOrigin = exactOrigin(value.apiOrigin, 'apiOrigin');
  if (publicOrigin !== APPROVED_PUBLIC_ORIGIN) throw new Error('publicOrigin is not approved');
  if (!APPROVED_API_ORIGINS.has(apiOrigin)) throw new Error('apiOrigin is not approved');
  if (typeof value.dynamicCatalogueEnabled !== 'boolean') {
    throw new Error('dynamicCatalogueEnabled must be a boolean');
  }
  return Object.freeze({ publicOrigin, apiOrigin, dynamicCatalogueEnabled: value.dynamicCatalogueEnabled });
}

// This is the single, non-secret production deployment boundary. Artifact generation
// copies it unchanged; local mode remains an explicit query-selected development path.
export const runtimeConfig = validateRuntimeConfig({
  publicOrigin: APPROVED_PUBLIC_ORIGIN,
  apiOrigin: 'https://api.virtcruisetravels.com',
  dynamicCatalogueEnabled: true
});
