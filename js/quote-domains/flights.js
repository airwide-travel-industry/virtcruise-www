import { requestsByType } from './service-requests.js';
export const flightRequests = state => requestsByType(state, 'FLIGHT');
export const primaryFlight = state => flightRequests(state)[0] || null;
