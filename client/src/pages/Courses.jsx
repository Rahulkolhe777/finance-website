import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/common/CourseCard.jsx';
import { COURSE_LEVELS, COURSE_MODES, courses as placeholderCourses } from '../data/courses.js';
import { getCourses } from '../services/courseService.js';

const styles = `
.courses-page {
  --cp-navy: #0B1B2B;
  --cp-emerald: #0B7A57;
  --cp-mint: #EEF5F2;
  --cp-border: #D9E5E0;
  --cp-muted: #5B6B78;
  color: var(--cp-navy);
}
.courses-page__hero {
  background: var(--gradient-hero);
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
  font-family: var(--font-accent);
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
`;

export default function Courses() {
  const [courses, setCourses] = useState(placeholderCourses);
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
                <CourseCard course={course} headingLevel={2} />
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
