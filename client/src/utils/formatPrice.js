const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export default function formatPrice(amount) {
  return formatter.format(Number(amount) || 0);
}

// Formatted price, or a [₹ PRICE] placeholder while the real price is not set.
export const priceOrPlaceholder = (amount) => (typeof amount === 'number' ? formatPrice(amount) : '[₹ PRICE]');
