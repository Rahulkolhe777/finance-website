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
  { period: 'quarterly', name: 'Quarterly', perLabel: '/ quarter', billedLabel: 'Billed every 3 months', durationDays: 90, quarters: 1, featured: false },
  { period: 'half-yearly', name: 'Half-yearly', perLabel: '/ 6 months', billedLabel: 'Billed every 6 months', durationDays: 182, quarters: 2, featured: false },
  { period: 'yearly', name: 'Yearly', perLabel: '/ year', billedLabel: 'Billed every 12 months', durationDays: 365, quarters: 4, featured: true },
];

const inr = (n) => '₹' + n.toLocaleString('en-IN');

// Saving compared with buying the same length as repeated quarterly plans.
// Percent is rounded down so it never overstates the saving.
export const savingsVsQuarterly = (prices, period) => {
  const p = periods.find((x) => x.period === period);
  const quarterly = prices.quarterly;
  const price = prices[period];
  if (!p || p.quarters <= 1 || typeof quarterly !== 'number' || typeof price !== 'number') return null;
  const amount = quarterly * p.quarters - price;
  if (amount <= 0) return null;
  return { amount, percent: Math.floor((amount / (quarterly * p.quarters)) * 100), label: 'Save ' + inr(amount) + ' (' + Math.floor((amount / (quarterly * p.quarters)) * 100) + '%) vs paying quarterly' };
};

const buildFeatures = (savings) => [
  '25–30 calls a month (subject to market conditions)',
  'Entry, two targets and a stop-loss on every call',
  'Support Monday to Saturday',
  ...(savings ? [savings.label] : []),
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
    savings: savingsVsQuarterly(segment.prices, p.period),
    features: buildFeatures(savingsVsQuarterly(segment.prices, p.period)),
    featured: p.featured,
  }))
);
