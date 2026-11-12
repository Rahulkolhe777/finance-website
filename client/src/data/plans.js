// Segment ids and plan slugs match the server Plan model (segment + period).
// Only segments with `available: true` are shown on the site. Set a segment
// to true (and add its prices) when you launch it.
// `prices` are INR for the whole period; null shows a [₹ PRICE] placeholder.

const ALL_SEGMENTS = [
  { id: 'cash', label: 'Cash', available: true, prices: { quarterly: 8999, 'half-yearly': 14999, yearly: 24999 } },
  { id: 'stock-options', label: 'Stock Options', available: false, prices: {} },
  { id: 'index-options', label: 'Index Options', available: false, prices: {} },
  { id: 'commodities', label: 'Commodities', available: false, prices: {} },
  { id: 'energy', label: 'Energy', available: false, prices: {} },
];

export const segments = ALL_SEGMENTS.filter((s) => s.available).map(({ id, label }) => ({ id, label }));

// Billing periods offered. `featured` marks the BEST VALUE card (lowest cost per month).
export const periods = [
  { period: 'quarterly', name: 'Quarterly', perLabel: '/ quarter', billedLabel: 'Billed every 3 months', durationDays: 90, discount: null, featured: false },
  { period: 'half-yearly', name: 'Half-yearly', perLabel: '/ 6 months', billedLabel: 'Billed every 6 months', durationDays: 182, discount: '[X]', featured: false },
  { period: 'yearly', name: 'Yearly', perLabel: '/ year', billedLabel: 'Billed every 12 months', durationDays: 365, discount: '[X]', featured: true },
];

const buildFeatures = (discount) => [
  '25–30 calls a month (subject to market conditions)',
  'Entry, two targets and a stop-loss on every call',
  'Support Monday to Saturday',
  ...(discount ? [discount + '% discount on single payment'] : []),
];

// Shape: { slug, segment, period, name, price, perLabel, billedLabel, durationDays, features: [], featured }
export const plans = ALL_SEGMENTS.filter((s) => s.available).flatMap((segment) =>
  periods.map((p) => ({
    slug: segment.id + '-' + p.period,
    segment: segment.id,
    period: p.period,
    name: p.name,
    price: segment.prices[p.period] ?? null,
    perLabel: p.perLabel,
    billedLabel: p.billedLabel,
    durationDays: p.durationDays,
    features: buildFeatures(p.discount),
    featured: p.featured,
  }))
);
