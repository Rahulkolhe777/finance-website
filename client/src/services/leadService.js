import { api } from './api.js';

export const createLead = (lead) => api.post('/leads', lead);

// Callback request from the homepage banner: mobile number + consent only.
export const requestCallback = ({ phone, consent }) =>
  createLead({ phone, consent: Boolean(consent), source: 'callback' });
