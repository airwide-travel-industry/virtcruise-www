import { requestsByType } from './service-requests.js';
export const transferRequests = state => requestsByType(state, 'TRANSFER');
