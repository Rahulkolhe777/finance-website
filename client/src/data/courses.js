// Course content. Shown until published courses are available from the API
// (the API returns the same shape). Courses: [LIST WITH DETAILS].
// `price` is in INR; null shows a [₹ PRICE] placeholder.

// Courses are not offered yet. Set to true to bring back the homepage section,
// the Courses menu link and the /courses pages.
export const COURSES_ENABLED = false;

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const COURSE_MODES = ['Recorded', 'Live Online'];

const placeholderDetail = (n) => ({
  overview: '[COURSE OVERVIEW]',
  syllabus: [1, 2, 3].map((m) => ({ title: '[MODULE ' + m + ' TITLE]', topics: ['[TOPIC]', '[TOPIC]'] })),
  instructor: { name: '[INSTRUCTOR NAME]', title: '[CREDENTIALS]', bio: '[INSTRUCTOR BIO]', photo: '' },
  faqs: [1, 2, 3].map((q) => ({ question: '[COURSE ' + n + ' QUESTION ' + q + ']', answer: '[ANSWER]' })),
});

// Shape: { slug, title, level, mode, shortDescription, highlights[], price, duration, thumbnail?,
//          overview, syllabus[{ title, topics[] }], instructor{ name, title, bio, photo }, faqs[{ question, answer }] }
export const courses = [
  {
    slug: 'stock-market-basics',
    title: 'Stock Market Basics',
    level: 'Beginner',
    mode: 'Recorded',
    shortDescription: 'Start from zero: how markets work, order types, reading charts and managing risk.',
    highlights: ['Market and broker basics', 'Candlesticks and trends', 'Position sizing and stop-loss'],
    price: null,
    duration: '[DURATION]',
    ...placeholderDetail(1),
  },
  {
    slug: 'technical-analysis-program',
    title: 'Technical Analysis Program',
    level: 'Intermediate',
    mode: 'Live Online',
    shortDescription: 'Learn to find setups for swing and positional trades using price action and indicators.',
    highlights: ['Support, resistance, patterns', 'Entry, target and exit rules', 'Weekly doubt-clearing sessions'],
    price: null,
    duration: '[DURATION]',
    ...placeholderDetail(2),
  },
  {
    slug: 'options-trading-mentorship',
    title: 'Options Trading Mentorship',
    level: 'Advanced',
    mode: 'Live Online',
    shortDescription: 'Understand option pricing, strategies and risk control for index and stock options.',
    highlights: ['Option chain and Greeks', 'Intraday and positional strategies', 'Trading psychology and journaling'],
    price: null,
    duration: '[DURATION]',
    ...placeholderDetail(3),
  },
];
