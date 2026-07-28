import { requestsByType } from './service-requests.js';
export const accommodationRequests = state => requestsByType(state, 'ACCOMMODATION');
export const primaryAccommodation = state => accommodationRequests(state)[0] || null;
