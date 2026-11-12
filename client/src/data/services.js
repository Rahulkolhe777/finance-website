// Shape: { id, title, description, icon, available }
// `icon` is a key into the icon set in components/home/ServicesGrid.jsx.
// Only services with `available: true` appear on the site (homepage grid,
// Services page, trial form). Flip a flag when that segment launches.
const ALL_SERVICES = [
  { id: 'advisory', title: 'Advisory', description: '[YOUR TEXT]', icon: 'advisory', available: false },
  { id: 'cash', title: 'Equity Cash', description: 'Swing and positional equity calls with clear targets and stop-loss.', icon: 'cash', available: true },
  { id: 'stock-options', title: 'Stock Options', description: '[YOUR TEXT]', icon: 'stockOptions', available: false },
  { id: 'index-options', title: 'Index Options', description: '[YOUR TEXT]', icon: 'indexOptions', available: false },
  { id: 'commodities', title: 'Commodities', description: '[YOUR TEXT]', icon: 'commodities', available: false },
  { id: 'energy', title: 'Energy', description: '[YOUR TEXT]', icon: 'energy', available: false },
];

export const services = ALL_SERVICES.filter((s) => s.available);
