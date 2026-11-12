import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedCourses } from '../../services/courseService.js';
import formatPrice from '../../utils/formatPrice.js';

// Shown until published courses are available from the API.
const PLACEHOLDER_COURSES = [
  {
    slug: 'stock-market-basics',
    title: 'Stock Market Basics',
    level: 'Beginner',
    mode: 'Recorded',
    description: 'Start from zero: how markets work, order types, reading charts and managing risk.',
    highlights: ['Market and broker basics', 'Candlesticks and trends', 'Position sizing and stop-loss'],
    price: '[₹ PRICE]',
    duration: '[DURATION]',
  },
  {
    slug: 'technical-analysis-program',
    title: 'Technical Analysis Program',
    level: 'Intermediate',
    mode: 'Live Online',
    description: 'Learn to find setups for swing and positional trades using price action and indicators.',
    highlights: ['Support, resistance, patterns', 'Entry, target and exit rules', 'Weekly doubt-clearing sessions'],
    price: '[₹ PRICE]',
    duration: '[DURATION]',
  },
  {
    slug: 'options-trading-mentorship',
    title: 'Options Trading Mentorship',
    level: 'Advanced',
    mode: 'Live Online',
    description: 'Understand option pricing, strategies and risk control for index and stock options.',
    highlights: ['Option chain and Greeks', 'Intraday and positional strategies', 'Trading psychology and journaling'],
    price: '[₹ PRICE]',
    duration: '[DURATION]',
  },
];

const toCard = (course) => ({
  slug: course.slug,
  title: course.title,
  level: course.level || '[LEVEL]',
  mode: course.mode || '[MODE]',
  description: course.shortDescription || course.description || '[YOUR TEXT]',
  highlights: Array.isArray(course.highlights) && course.highlights.length ? course.highlights.slice(0, 3) : [],
  price: typeof course.price === 'number' ? formatPrice(course.price) : '[₹ PRICE]',
  duration: course.duration || '[DURATION]',
  image: course.thumbnail,
});

const styles = `
.courses-section {
  --cs-navy: #0B1B2B;
  --cs-emerald: #0B7A57;
  --cs-mint: #EEF5F2;
  --cs-border: #D9E5E0;
  --cs-muted: #5B6B78;
  --cs-gradient: linear-gradient(90deg, #087F58, #0E6E8C);

  background: #fff;
  padding: clamp(3.5rem, 7vw, 5.5rem) 0;
}
.courses-section__head {
  text-align: center;
  max-width: 40rem;
  margin: 0 auto clamp(2rem, 4vw, 3rem);
}
.courses-section__title {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--cs-navy);
}
.courses-section__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--cs-emerald);
}
.courses-section__sub {
  margin: 0;
  color: var(--cs-muted);
  font-size: 1.0625rem;
}
.courses-section__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}
.course-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--cs-border);
  border-radius: 20px;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.course-card:hover,
.course-card:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(11, 27, 43, 0.1), 0 4px 6px -4px rgba(11, 27, 43, 0.1);
}
.course-card__media {
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #DDF3EA, var(--cs-mint));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cs-muted);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.course-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.course-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
}
.course-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.course-card__tag {
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background: var(--cs-mint);
  color: var(--cs-emerald);
  font-size: 0.75rem;
  font-weight: 700;
}
.course-card__tag--mode {
  background: #fff;
  border: 1px solid var(--cs-border);
  color: var(--cs-navy);
}
.course-card__title {
  margin: 0;
  font-size: 1.1875rem;
  font-weight: 700;
  color: var(--cs-navy);
}
.course-card__desc {
  margin: 0;
  color: var(--cs-muted);
  font-size: 0.9375rem;
  line-height: 1.6;
}
.course-card__points {
  display: grid;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
  color: var(--cs-navy);
}
.course-card__points li {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}
.course-card__points svg {
  flex-shrink: 0;
  margin-top: 0.2em;
  color: var(--cs-emerald);
}
.course-card__footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--cs-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.course-card__price {
  display: block;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--cs-navy);
}
.course-card__duration {
  font-size: 0.8125rem;
  color: var(--cs-muted);
}
.courses-section__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 1.375rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9375rem;
  white-space: nowrap;
  transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease, color 200ms ease;
}
.courses-section__btn--primary {
  background: var(--cs-gradient);
  color: #fff;
}
.courses-section__btn--primary:hover,
.courses-section__btn--primary:focus-visible {
  color: #fff;
  box-shadow: 0 8px 18px rgba(8, 127, 88, 0.3);
}
.courses-section__btn--outline {
  min-height: 48px;
  padding: 0 1.75rem;
  border: 1.5px solid var(--cs-navy);
  color: var(--cs-navy);
  background: #fff;
}
.courses-section__btn--outline:hover,
.courses-section__btn--outline:focus-visible {
  background: var(--cs-navy);
  color: #fff;
}
.courses-section__more {
  margin-top: clamp(2rem, 4vw, 2.75rem);
  text-align: center;
}
.courses-section__disclaimer {
  max-width: 44rem;
  margin: 1rem auto 0;
  font-size: 0.8125rem;
  color: var(--cs-muted);
}
@media (max-width: 1024px) {
  .courses-section__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .courses-section__list { grid-template-columns: 1fr; }
  .course-card__body { padding: 1.25rem; }
}
@media (prefers-reduced-motion: reduce) {
  .course-card,
  .courses-section__btn { transition: none; }
  .course-card:hover,
  .course-card:focus-within { transform: none; }
}
`;

export default function CoursesSection() {
  const [courses, setCourses] = useState(PLACEHOLDER_COURSES);

  useEffect(() => {
    let active = true;
    getFeaturedCourses(3)
      .then((items) => {
        if (active && items.length > 0) setCourses(items.map(toCard));
      })
      .catch(() => {
        // API unavailable: keep placeholder courses.
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="courses-section" aria-labelledby="courses-section-title">
      <style>{styles}</style>
      <div className="container">
        <header className="courses-section__head">
          <h2 id="courses-section-title" className="courses-section__title">
            Our <span className="courses-section__accent">Courses</span>
          </h2>
          <p className="courses-section__sub">Learn to trade with structured, step-by-step programs</p>
        </header>

        <ul className="courses-section__list">
          {courses.map((course) => (
            <li key={course.slug}>
              <article className="course-card">
                <div className="course-card__media">
                  {course.image ? (
                    <img src={course.image} alt={course.title} loading="lazy" decoding="async" width="640" height="360" />
                  ) : (
                    <span>[COURSE IMAGE]</span>
                  )}
                </div>

                <div className="course-card__body">
                  <div className="course-card__tags">
                    <span className="course-card__tag">{course.level}</span>
                    <span className="course-card__tag course-card__tag--mode">{course.mode}</span>
                  </div>

                  <h3 className="course-card__title">{course.title}</h3>
                  <p className="course-card__desc">{course.description}</p>

                  {course.highlights.length > 0 && (
                    <ul className="course-card__points">
                      {course.highlights.map((point) => (
                        <li key={point}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="course-card__footer">
                    <div>
                      <span className="course-card__price">{course.price}</span>
                      <span className="course-card__duration">{course.duration}</span>
                    </div>
                    <Link
                      to={'/courses/' + course.slug}
                      className="courses-section__btn courses-section__btn--primary"
                      aria-label={'Enroll now in ' + course.title}
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="courses-section__more">
          <Link to="/courses" className="courses-section__btn courses-section__btn--outline">View All Courses</Link>
          <p className="courses-section__disclaimer">
            Courses are for education only and are not investment advice. [ADD YOUR EDUCATION DISCLAIMER]
          </p>
        </div>
      </div>
    </section>
  );
}
