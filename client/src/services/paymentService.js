import { api } from './api.js';

// payload: { purpose: 'plan' | 'course', refId: <plan or course slug>, name, email, phone }
// The amount is decided by the server from the plan/course, never sent from here.
export const createOrder = (payload) => api.post('/payments/order', payload);

export const verifyPayment = (orderId) => api.post('/payments/verify', { orderId });

export const getPaymentStatus = (orderId) => api.get('/payments/' + encodeURIComponent(orderId) + '/status');

// Creates the order and sends the browser to the gateway's hosted checkout.
// Resolves only if no redirect happened (throws on API errors).
export const startCheckout = async (payload) => {
  const order = await createOrder(payload);
  if (!order || !order.redirectUrl) throw new Error('Could not start checkout. Please try again.');
  window.location.assign(order.redirectUrl);
  return order;
};
