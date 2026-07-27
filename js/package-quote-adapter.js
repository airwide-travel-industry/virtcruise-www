const requiredPackageFields = ['id', 'name', 'destination', 'slug'];

function countryFrom(packageData) {
  if (packageData.country) return packageData.country;
  const parts = String(packageData.destination || '').split(',').map(part => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.at(-1) : '';
}

export function packageRequestDetails(packageData, state, {
  source = 'package-shop',
  selectedAddOns = [],
  notes = ''
} = {}) {
  const missing = requiredPackageFields.filter(field => !packageData?.[field]);
  if (missing.length) throw new Error(`Package data is missing: ${missing.join(', ')}`);
  const travellers = state?.travellerCounts || {};
  const travellerTotal = Number(travellers.adults || 0) + Number(travellers.children || 0) + Number(travellers.infants || 0);
  return {
    packageId: packageData.id,
    packageName: packageData.name,
    preferredPackage: packageData.id,
    destination: packageData.destination,
    country: countryFrom(packageData),
    region: packageData.region || '',
    description: packageData.summary || '',
    duration: packageData.duration?.label || '',
    numberOfNights: Number(packageData.duration?.nights || 0),
    price: packageData.priceFrom,
    currency: packageData.currency || 'USD',
    priceBasis: packageData.priceUnit || '',
    image: packageData.image || '',
    inclusions: [...(packageData.inclusions || [])],
    detailUrl: `packages/${packageData.slug}.html`,
    source,
    travellers: travellerTotal || 1,
    adults: Number(travellers.adults || 1),
    children: Number(travellers.children || 0),
    departureDate: state?.tripStartDate || '',
    returnDate: state?.tripEndDate || '',
    availableAddOns: [...(packageData.optionalExtras || [])],
    selectedAddOns: [...selectedAddOns],
    notes
  };
}

export function addPackageRequest(state, packageData, {
  source = 'package-shop',
  selectedAddOns = [],
  notes = '',
  createId = () => `service-${Date.now()}-${Math.random().toString(16).slice(2)}`
} = {}) {
  if (!state || !Array.isArray(state.serviceRequests)) throw new Error('Quote Builder state is unavailable.');
  const existing = state.serviceRequests.find(request =>
    request.serviceType === 'HOLIDAY_PACKAGE'
    && (request.packageId === packageData?.id || request.details?.packageId === packageData?.id || request.details?.preferredPackage === packageData?.id)
  );
  if (existing) return { status: 'already-added', request: existing };
  const details = packageRequestDetails(packageData, state, { source, selectedAddOns, notes });
  const request = {
    id: createId(),
    type: 'package',
    packageId: packageData.id,
    source,
    serviceType: 'HOLIDAY_PACKAGE',
    serviceSlug: 'holiday-packages',
    serviceTitle: packageData.name,
    status: 'SAVED',
    details,
    createdAt: new Date().toISOString()
  };
  state.serviceRequests.push(request);
  state.destination ||= packageData.destination;
  return { status: 'added', request };
}
