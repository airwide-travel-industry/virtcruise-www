import { requestsByType } from './service-requests.js';

export const packageRequests = state => requestsByType(state, 'HOLIDAY_PACKAGE');

export function estimatedPackagePrice(state) {
  const prices = packageRequests(state).reduce((groups, request) => {
    const price = Number(request.details?.price);
    if (!Number.isFinite(price)) return groups;
    const currency = String(request.details?.currency || 'USD').toUpperCase();
    groups[currency] = (groups[currency] || 0) + price;
    return groups;
  }, {});
  const entries = Object.entries(prices);
  if (!entries.length) return null;
  if (entries.length > 1) return { mixed: true, prices };
  return { amount: entries[0][1], currency: entries[0][0], mixed: false };
}
