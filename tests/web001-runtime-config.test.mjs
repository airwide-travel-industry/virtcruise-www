import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runtimeConfig, validateRuntimeConfig } from '../js/runtime-config.js';

test('production origins are exact, branded, HTTPS and immutable', () => {
  assert.deepEqual(runtimeConfig, {
    publicOrigin: 'https://www.virtcruisetravels.com',
    apiOrigin: 'https://api.virtcruisetravels.com',
    dynamicCatalogueEnabled: true
  });
  assert.equal(Object.isFrozen(runtimeConfig), true);
});

test('runtime configuration fails closed for absent, malformed, insecure or injected origins', () => {
  for (const value of [null, {},
    { publicOrigin: 'http://www.virtcruisetravels.com', apiOrigin: runtimeConfig.apiOrigin, dynamicCatalogueEnabled: true },
    { publicOrigin: runtimeConfig.publicOrigin, apiOrigin: 'http://api.virtcruisetravels.com', dynamicCatalogueEnabled: true },
    { publicOrigin: runtimeConfig.publicOrigin, apiOrigin: 'https://evil.example', dynamicCatalogueEnabled: true },
    { publicOrigin: 'https://www.virtcruisetravels.com@evil.example', apiOrigin: runtimeConfig.apiOrigin, dynamicCatalogueEnabled: true },
    { publicOrigin: runtimeConfig.publicOrigin, apiOrigin: 'https://api.virtcruisetravels.com/path', dynamicCatalogueEnabled: true },
    { publicOrigin: runtimeConfig.publicOrigin, apiOrigin: runtimeConfig.apiOrigin, dynamicCatalogueEnabled: 'true' }]) {
    assert.throws(() => validateRuntimeConfig(value));
  }
});
