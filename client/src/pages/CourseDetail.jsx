import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Accordion from '../components/common/Accordion.jsx';
import CheckoutForm from '../components/forms/CheckoutForm.jsx';
import { getCourseBySlug } from '../services/courseService.js';
import { PLACEHOLDER_COURSES, coursePriceLabel } from './Courses.jsx';


const styles = `
.course-detail {
  --cd-navy: #0B1B2B;
  --cd-emerald: #0B7A57;
  --cd-mint: #EEF5F2;
  --cd-border: #D9E5E0;
  --cd-muted: #4F5F6B;
  --cd-gradient: linear-gradient(90deg, #087F58, #0E6E8C);
  color: var(--cd-navy);
}
.course-detail__hero {
  background: linear-gradient(#EAF8F1, #fff);
  padding: clamp(2rem, 5vw, 3.5rem) 0 clamp(2rem, 4vw, 3rem);
}
.course-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 44px;
  margin-bottom: 0.75rem;
  color: var(--cd-emerald);
  font-weight: 600;
}
.course-detail__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.course-detail__tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: #fff;
  border: 1px solid var(--cd-border);
  color: var(--cd-emerald);
  font-size: 0.8125rem;
  font-weight: 700;
}
.course-detail__title {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.course-detail__lead { margin: 0; max-width: 42rem; font-size: 1.0625rem; color: var(--cd-muted); }
.course-detail__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
  padding-block: clamp(1.5rem, 4vw, 2.5rem) clamp(3.5rem, 7vw, 5.5rem);
}
.course-detail__main { display: grid; gap: clamp(2rem, 4vw, 3rem); }
.course-detail__h2 { margin: 0 0 1rem; font-size: clamp(1.5rem, 3vw, 1.875rem); font-weight: 800; letter-spacing: -0.01em; }
.course-detail__text { margin: 0; font-size: 1.0625rem; line-height: 1.75; color: var(--cd-muted); white-space: pre-line; }
.course-detail__topics { margin: 0; padding-left: 1.25rem; display: grid; gap: 0.375rem; }
.course-detail__instructor {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding: 1.5rem;
  border: 1px solid var(--cd-border);
  border-radius: 20px;
  background: var(--cd-mint);
}
.course-detail__avatar {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  background: #fff;
  color: var(--cd-emerald);
}
.course-detail__avatar img { width: 100%; height: 100%; object-fit: cover; }
.course-detail__instructor-name { margin: 0; font-size: 1.125rem; font-weight: 800; }
.course-detail__instructor-title { margin: 0.125rem 0 0.625rem; color: var(--cd-emerald); font-weight: 600; font-size: 0.9375rem; }
.course-detail__aside {
  position: sticky;
  top: calc(var(--header-height) + 1.5rem);
  padding: 1.75rem;
  border: 1px solid var(--cd-border);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 16px 36px rgba(11, 27, 43, 0.08);
}
.course-detail__price { margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
.course-detail__facts { display: grid; gap: 0.625rem; margin: 1.25rem 0; padding: 1.25rem 0; border-block: 1px solid var(--cd-border); }
.course-detail__fact { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.9375rem; }
.course-detail__fact dt { color: var(--cd-muted); }
.course-detail__fact dd { margin: 0; font-weight: 700; text-align: right; }
button.course-detail__enroll { width: 100%; border: 0; font: inherit; font-weight: 700; cursor: pointer; }
.course-detail__enroll {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  border-radius: 9999px;
  background: var(--cd-gradient);
  color: #fff;
  font-weight: 700;
}
.course-detail__enroll:hover, .course-detail__enroll:focus-visible { color: #fff; box-shadow: 0 10px 22px rgba(8, 127, 88, 0.3); }
.course-detail__note { margin: 1rem 0 0; font-size: 0.8125rem; line-height: 1.6; color: var(--cd-muted); }
.course-detail__status { padding: clamp(3rem, 8vw, 5rem) 0; text-align: center; color: var(--cd-muted); }
@media (max-width: 960px) {
  .course-detail__layout { grid-template-columns: 1fr; }
  .course-detail__aside { position: static; order: -1; }
}
@media (max-width: 480px) {
  .course-detail__instructor { flex-direction: column; }
}
`;

export default function CourseDetail() {
  const { slug } = useParams();
  const placeholder = PLACEHOLDER_COURSES.find((c) => c.slug === slug) || null;
  const [course, setCourse] = useState(placeholder);
  const [status, setStatus] = useState(placeholder ? 'ready' : 'loading');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    let active = true;
    const fallback = PLACEHOLDER_COURSES.find((c) => c.slug === slug) || null;
    setCourse(fallback);
    setStatus(fallback ? 'ready' : 'loading');
    setShowCheckout(false);
    getCourseBySlug(slug)
      .then((data) => {
        if (!active) return;
        setCourse(data);
        setStatus('ready');
      })
      .catch(() => {
        if (active && !fallback) setStatus('not-found');
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (status !== 'ready' || !course) {
    return (
      <div className="course-detail">
        <style>{styles}</style>
        <div className="container course-detail__status" role="status">
          {status === 'loading' ? (
            <p>Loading course…</p>
          ) : (
            <>
              <h1 className="course-detail__h2">Course not found</h1>
              <Link to="/courses" className="course-detail__back">← Back to all courses</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const syllabusItems = (course.syllabus || []).map((module, index) => ({
    question: 'Module ' + (index + 1) + ': ' + module.title,
    answer: (
      <ul className="course-detail__topics">
        {(module.topics || []).map((topic, i) => <li key={i}>{topic}</li>)}
      </ul>
    ),
  }));
  const instructor = course.instructor || {};

  return (
    <div className="course-detail">
      <style>{styles}</style>

      <section className="course-detail__hero" aria-labelledby="course-title">
        <div className="container">
          <Link to="/courses" className="course-detail__back">← All courses</Link>
          <div className="course-detail__tags">
            <span className="course-detail__tag">{course.level}</span>
            <span className="course-detail__tag">{course.mode}</span>
          </div>
          <h1 id="course-title" className="course-detail__title">{course.title}</h1>
          {course.shortDescription && <p className="course-detail__lead">{course.shortDescription}</p>}
        </div>
      </section>

      <div className="container course-detail__layout">
        <div className="course-detail__main">
          <section aria-labelledby="course-overview">
            <h2 id="course-overview" className="course-detail__h2">Overview</h2>
            <p className="course-detail__text">{course.overview || '[COURSE OVERVIEW]'}</p>
          </section>

          {syllabusItems.length > 0 && (
            <section aria-labelledby="course-syllabus">
              <h2 id="course-syllabus" className="course-detail__h2">Syllabus</h2>
              <Accordion items={syllabusItems} />
            </section>
          )}

          <section aria-labelledby="course-instructor">
            <h2 id="course-instructor" className="course-detail__h2">Your Instructor</h2>
            <div className="course-detail__instructor">
              <div className="course-detail__avatar">
                {instructor.photo ? (
                  <img src={instructor.photo} alt={instructor.name} loading="lazy" decoding="async" width="80" height="80" />
                ) : (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="course-detail__instructor-name">{instructor.name || '[INSTRUCTOR NAME]'}</h3>
                <p className="course-detail__instructor-title">{instructor.title || '[CREDENTIALS]'}</p>
                <p className="course-detail__text">{instructor.bio || '[INSTRUCTOR BIO]'}</p>
              </div>
            </div>
          </section>

          {Array.isArray(course.faqs) && course.faqs.length > 0 && (
            <section aria-labelledby="course-faq">
              <h2 id="course-faq" className="course-detail__h2">FAQ</h2>
              <Accordion items={course.faqs} />
            </section>
          )}
        </div>

        <aside className="course-detail__aside" aria-label="Enrollment">
          <p className="course-detail__price">{coursePriceLabel(course.price)}</p>
          <dl className="course-detail__facts">
            <div className="course-detail__fact"><dt>Duration</dt><dd>{course.duration || '[DURATION]'}</dd></div>
            <div className="course-detail__fact"><dt>Level</dt><dd>{course.level}</dd></div>
            <div className="course-detail__fact"><dt>Mode</dt><dd>{course.mode}</dd></div>
          </dl>
          {showCheckout ? (
            <CheckoutForm
              key={course.slug}
              purpose="course"
              refId={course.slug}
              idPrefix="course-checkout"
              payLabel={'Pay ' + coursePriceLabel(course.price) + ' & Enroll'}
            />
          ) : (
            <button type="button" className="course-detail__enroll" onClick={() => setShowCheckout(true)}>
              Enroll Now
            </button>
          )}
          <p className="course-detail__note">
            Courses are for education only and are not investment advice. [ADD YOUR EDUCATION DISCLAIMER]
          </p>
        </aside>
      </div>
    </div>
  );
}
