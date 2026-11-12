// Segment ids and plan slugs match the server Plan model (segment + period).
// Replace placeholders ([N], [X], null prices) with your real values.
// `price` is the INR amount for the whole period; null shows a [₹ PRICE] placeholder.

export const segments = [
  { id: 'cash', label: 'Cash' },
  { id: 'stock-options', label: 'Stock Options' },
  { id: 'index-options', label: 'Index Options' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'energy', label: 'Energy' },
];

const PERIODS = [
  { period: 'monthly', name: 'Monthly', perLabel: '/ month', billedLabel: 'Billed every month', discount: null, featured: false },
  { period: 'quarterly', name: 'Quarterly', perLabel: '/ quarter', billedLabel: 'Billed every 3 months', discount: '[X]', featured: true },
  { period: 'half-yearly', name: 'Half-yearly', perLabel: '/ 6 months', billedLabel: 'Billed every 6 months', discount: '[X]', featured: false },
];

const buildFeatures = (discount) => [
  '[N] calls a day',
  'Entry, two targets and a stop-loss on every call',
  'Support Monday to Saturday',
  ...(discount ? [discount + '% discount on single payment'] : []),
];

// Shape: { slug, segment, period, name, price, perLabel, billedLabel, features: [], featured }
export const plans = segments.flatMap((segment) =>
  PERIODS.map((p) => ({
    slug: segment.id + '-' + p.period,
    segment: segment.id,
    period: p.period,
    name: p.name,
    price: null,
    perLabel: p.perLabel,
    billedLabel: p.billedLabel,
    features: buildFeatures(p.discount),
    featured: p.featured,
  }))
);
