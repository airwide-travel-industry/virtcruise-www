import { requestsByType } from './service-requests.js';
export const visaRequests = state => requestsByType(state, 'VISA');
