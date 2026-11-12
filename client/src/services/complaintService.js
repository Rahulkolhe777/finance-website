import { api } from './api.js';

export const submitComplaint = (complaint) => api.post('/complaints', complaint);

// Month-wise complaint data for a financial year (defaults to the current one on the server).
export const getComplaintStats = (fy) => api.get('/complaints/stats' + (fy ? '?fy=' + encodeURIComponent(fy) : ''));
