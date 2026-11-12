import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../common/CourseCard.jsx';
import { courses as placeholderCourses } from '../../data/courses.js';
import { getFeaturedCourses } from '../../services/courseService.js';

const FEATURED_COUNT = 3;

const styles = `
.courses-section {
  --cs-navy: #0B1B2B;
  --cs-emerald: #0B7A57;
  --cs-muted: #5B6B78;

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
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--cs-emerald);
}
.courses-section__sub { margin: 0; color: var(--cs-muted); font-size: 1.0625rem; }
.courses-section__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}
.courses-section__more { margin-top: clamp(2rem, 4vw, 2.75rem); text-align: center; }
.courses-section__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 1.75rem;
  border: 1.5px solid var(--cs-navy);
  border-radius: 9999px;
  background: #fff;
  color: var(--cs-navy);
  font-weight: 600;
  transition: background-color 200ms ease, color 200ms ease;
}
.courses-section__btn:hover,
.courses-section__btn:focus-visible { background: var(--cs-navy); color: #fff; }
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
}
`;

export default function CoursesSection() {
  const [courses, setCourses] = useState(() => placeholderCourses.slice(0, FEATURED_COUNT));

  useEffect(() => {
    let active = true;
    getFeaturedCourses(FEATURED_COUNT)
      .then((items) => {
        if (active && items.length > 0) setCourses(items);
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
              <CourseCard course={course} headingLevel={3} />
            </li>
          ))}
        </ul>

        <div className="courses-section__more">
          <Link to="/courses" className="courses-section__btn">View All Courses</Link>
          <p className="courses-section__disclaimer">
            Courses are for education only and are not investment advice. [ADD YOUR EDUCATION DISCLAIMER]
          </p>
        </div>
      </div>
    </section>
  );
}
