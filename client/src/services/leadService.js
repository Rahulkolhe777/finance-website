import { api } from './api.js';

export const createLead = (lead) => api.post('/leads', lead);
