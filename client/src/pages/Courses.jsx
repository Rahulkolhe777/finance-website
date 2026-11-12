import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCourses } from '../services/courseService.js';
import formatPrice from '../utils/formatPrice.js';

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const COURSE_MODES = ['Recorded', 'Live Online'];

// Courses: [LIST WITH DETAILS]. Shown until published courses come from the API;
// CourseDetail.jsx uses the same entries as its fallback.
const placeholderDetail = (n) => ({
  overview: '[COURSE OVERVIEW]',
  syllabus: [1, 2, 3].map((m) => ({ title: '[MODULE ' + m + ' TITLE]', topics: ['[TOPIC]', '[TOPIC]'] })),
  instructor: { name: '[INSTRUCTOR NAME]', title: '[CREDENTIALS]', bio: '[INSTRUCTOR BIO]', photo: '' },
  faqs: [1, 2, 3].map((q) => ({ question: '[COURSE ' + n + ' QUESTION ' + q + ']', answer: '[ANSWER]' })),
});

export const PLACEHOLDER_COURSES = [
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

export const coursePriceLabel = (price) => (typeof price === 'number' ? formatPrice(price) : '[₹ PRICE]');

const styles = `
.courses-page {
  --cp-navy: #0B1B2B;
  --cp-emerald: #0B7A57;
  --cp-mint: #EEF5F2;
  --cp-border: #D9E5E0;
  --cp-muted: #5B6B78;
  --cp-gradient: linear-gradient(90deg, #087F58, #0E6E8C);
  color: var(--cp-navy);
}
.courses-page__hero {
  background: linear-gradient(#EAF8F1, #fff);
  padding: clamp(3rem, 7vw, 4.5rem) 0 clamp(1.5rem, 3vw, 2rem);
  text-align: center;
}
.courses-page__title {
  margin: 0 0 0.75rem;
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.courses-page__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--cp-emerald);
}
.courses-page__sub { margin: 0 auto; max-width: 36rem; color: var(--cp-muted); font-size: 1.0625rem; }
.courses-page__body { padding-block: 1rem clamp(3.5rem, 7vw, 5.5rem); }
.courses-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 2rem;
  margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
}
.courses-filters__group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  border: 0;
}
.courses-filters__legend {
  float: left;
  margin-right: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cp-muted);
}
.courses-filters__btn {
  min-height: 44px;
  padding: 0 1.125rem;
  border: 1px solid var(--cp-border);
  border-radius: 9999px;
  background: var(--cp-mint);
  color: var(--cp-navy);
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
}
.courses-filters__btn:hover { border-color: var(--cp-emerald); }
.courses-filters__btn:focus-visible { outline: 2px solid var(--cp-emerald); outline-offset: 2px; }
.courses-filters__btn[aria-pressed='true'] { background: var(--cp-navy); border-color: var(--cp-navy); color: #fff; }
.courses-page__count { margin: 0 0 1rem; text-align: center; color: var(--cp-muted); font-size: 0.875rem; }
.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}
.cp-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--cp-border);
  border-radius: 20px;
  background: #fff;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.cp-card:hover,
.cp-card:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(11, 27, 43, 0.1), 0 4px 6px -4px rgba(11, 27, 43, 0.1);
}
.cp-card__media {
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #DDF3EA, var(--cp-mint));
  color: var(--cp-muted);
  font-size: 0.8125rem;
  font-weight: 600;
}
.cp-card__media img { width: 100%; height: 100%; object-fit: cover; }
.cp-card__body { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; padding: 1.5rem; }
.cp-card__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.cp-card__tag {
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background: var(--cp-mint);
  color: var(--cp-emerald);
  font-size: 0.75rem;
  font-weight: 700;
}
.cp-card__tag--mode { background: #fff; border: 1px solid var(--cp-border); color: var(--cp-navy); }
.cp-card__title { margin: 0; font-size: 1.1875rem; font-weight: 700; }
.cp-card__title a { color: inherit; }
.cp-card__title a:hover { color: var(--cp-emerald); }
.cp-card__desc { margin: 0; color: var(--cp-muted); font-size: 0.9375rem; line-height: 1.6; }
.cp-card__points { display: grid; gap: 0.375rem; margin: 0; padding: 0; list-style: none; font-size: 0.875rem; }
.cp-card__points li { display: flex; gap: 0.5rem; }
.cp-card__points svg { flex-shrink: 0; margin-top: 0.2em; color: var(--cp-emerald); }
.cp-card__footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--cp-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.cp-card__price { display: block; font-size: 1.25rem; font-weight: 800; }
.cp-card__duration { font-size: 0.8125rem; color: var(--cp-muted); }
.cp-card__cta {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 1.375rem;
  border-radius: 9999px;
  background: var(--cp-gradient);
  color: #fff;
  font-weight: 600;
  font-size: 0.9375rem;
}
.cp-card__cta:hover, .cp-card__cta:focus-visible { color: #fff; box-shadow: 0 8px 18px rgba(8, 127, 88, 0.3); }
.courses-page__empty {
  padding: 3rem 1rem;
  border: 1px dashed var(--cp-border);
  border-radius: 20px;
  text-align: center;
  color: var(--cp-muted);
}
.courses-page__empty button {
  margin-top: 0.75rem;
  min-height: 44px;
  padding: 0 1.25rem;
  border: 1.5px solid var(--cp-navy);
  border-radius: 9999px;
  background: #fff;
  color: var(--cp-navy);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.courses-page__disclaimer {
  max-width: 44rem;
  margin: 2rem auto 0;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--cp-muted);
}
@media (max-width: 1024px) { .courses-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) {
  .courses-grid { grid-template-columns: 1fr; }
  .courses-filters { justify-content: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .cp-card { transition: none; }
  .cp-card:hover, .cp-card:focus-within { transform: none; }
}
`;

export default function Courses() {
  const [courses, setCourses] = useState(PLACEHOLDER_COURSES);
  const [searchParams, setSearchParams] = useSearchParams();
  const level = COURSE_LEVELS.includes(searchParams.get('level')) ? searchParams.get('level') : '';
  const mode = COURSE_MODES.includes(searchParams.get('mode')) ? searchParams.get('mode') : '';

  useEffect(() => {
    let active = true;
    getCourses()
      .then((items) => {
        if (active && Array.isArray(items) && items.length > 0) setCourses(items);
      })
      .catch(() => {
        // API unavailable: keep placeholder courses.
      });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () => courses.filter((c) => (!level || c.level === level) && (!mode || c.mode === mode)),
    [courses, level, mode]
  );

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const filterGroup = (key, legend, options, current) => (
    <fieldset className="courses-filters__group">
      <legend className="courses-filters__legend">{legend}</legend>
      {['', ...options].map((option) => (
        <button
          key={option || 'all'}
          type="button"
          className="courses-filters__btn"
          aria-pressed={current === option}
          onClick={() => setFilter(key, option)}
        >
          {option || 'All'}
        </button>
      ))}
    </fieldset>
  );

  return (
    <div className="courses-page">
      <style>{styles}</style>

      <section className="courses-page__hero" aria-labelledby="courses-page-title">
        <div className="container">
          <h1 id="courses-page-title" className="courses-page__title">
            Our <span className="courses-page__accent">Courses</span>
          </h1>
          <p className="courses-page__sub">Learn to trade with structured, step-by-step programs</p>
        </div>
      </section>

      <div className="container courses-page__body">
        <div className="courses-filters" role="group" aria-label="Filter courses">
          {filterGroup('level', 'Level', COURSE_LEVELS, level)}
          {filterGroup('mode', 'Mode', COURSE_MODES, mode)}
        </div>

        <p className="courses-page__count" role="status">
          Showing {visible.length} of {courses.length} courses
        </p>

        {visible.length === 0 ? (
          <div className="courses-page__empty">
            <p>No courses match these filters.</p>
            <button type="button" onClick={() => setSearchParams({}, { replace: true })}>Clear filters</button>
          </div>
        ) : (
          <ul className="courses-grid">
            {visible.map((course) => (
              <li key={course.slug}>
                <article className="cp-card">
                  <div className="cp-card__media">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} loading="lazy" decoding="async" width="640" height="360" />
                    ) : (
                      <span>[COURSE IMAGE]</span>
                    )}
                  </div>
                  <div className="cp-card__body">
                    <div className="cp-card__tags">
                      <span className="cp-card__tag">{course.level}</span>
                      <span className="cp-card__tag cp-card__tag--mode">{course.mode}</span>
                    </div>
                    <h2 className="cp-card__title">
                      <Link to={'/courses/' + course.slug}>{course.title}</Link>
                    </h2>
                    <p className="cp-card__desc">{course.shortDescription}</p>
                    {Array.isArray(course.highlights) && course.highlights.length > 0 && (
                      <ul className="cp-card__points">
                        {course.highlights.slice(0, 3).map((point) => (
                          <li key={point}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="cp-card__footer">
                      <div>
                        <span className="cp-card__price">{coursePriceLabel(course.price)}</span>
                        <span className="cp-card__duration">{course.duration || '[DURATION]'}</span>
                      </div>
                      <Link to={'/courses/' + course.slug} className="cp-card__cta" aria-label={'Enroll now in ' + course.title}>
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        <p className="courses-page__disclaimer">
          Courses are for education only and are not investment advice. [ADD YOUR EDUCATION DISCLAIMER]
        </p>
      </div>
    </div>
  );
}
