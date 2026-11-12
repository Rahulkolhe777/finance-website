import { api } from './api.js';

export const createOrder = (payload) => api.post('/payments/order', payload);
export const verifyPayment = (payload) => api.post('/payments/verify', payload);
