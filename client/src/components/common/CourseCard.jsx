import { memo } from 'react';
import { Link } from 'react-router-dom';
import { priceOrPlaceholder } from '../../utils/formatPrice.js';

const styles = `
.course-card {
  --cc-navy: #0B1B2B;
  --cc-emerald: #0B7A57;
  --cc-mint: #EEF5F2;
  --cc-border: #D9E5E0;
  --cc-muted: #5B6B78;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--cc-border);
  border-radius: 20px;
  color: var(--cc-navy);
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.course-card:hover,
.course-card:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(11, 27, 43, 0.1), 0 4px 6px -4px rgba(11, 27, 43, 0.1);
}
.course-card__media {
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #DDF3EA, var(--cc-mint));
  color: var(--cc-muted);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.course-card__media img { width: 100%; height: 100%; object-fit: cover; }
.course-card__body { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; padding: 1.5rem; }
.course-card__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.course-card__tag { padding: 0.25rem 0.625rem; border-radius: 9999px; background: var(--cc-mint); color: var(--cc-emerald); font-size: 0.75rem; font-weight: 700; }
.course-card__tag--mode { background: #fff; border: 1px solid var(--cc-border); color: var(--cc-navy); }
.course-card__title { margin: 0; font-size: 1.1875rem; font-weight: 700; }
.course-card__title a { color: inherit; }
.course-card__title a:hover { color: var(--cc-emerald); }
.course-card__desc { margin: 0; color: var(--cc-muted); font-size: 0.9375rem; line-height: 1.6; }
.course-card__points { display: grid; gap: 0.375rem; margin: 0; padding: 0; list-style: none; font-size: 0.875rem; }
.course-card__points li { display: flex; gap: 0.5rem; align-items: flex-start; }
.course-card__points svg { flex-shrink: 0; margin-top: 0.2em; color: var(--cc-emerald); }
.course-card__footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--cc-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.course-card__price { display: block; font-size: 1.25rem; font-weight: 800; }
.course-card__duration { font-size: 0.8125rem; color: var(--cc-muted); }
.course-card__cta {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 1.375rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, #087F58, #0E6E8C);
  color: #fff;
  font-weight: 600;
  font-size: 0.9375rem;
  white-space: nowrap;
}
.course-card__cta:hover, .course-card__cta:focus-visible { color: #fff; box-shadow: 0 8px 18px rgba(8, 127, 88, 0.3); }
@media (max-width: 640px) { .course-card__body { padding: 1.25rem; } }
@media (prefers-reduced-motion: reduce) {
  .course-card { transition: none; }
  .course-card:hover, .course-card:focus-within { transform: none; }
}
`;

// Course card used on the homepage and the Courses page.
// headingLevel: 2 or 3, to fit the page's heading outline.
function CourseCard({ course, headingLevel = 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const detailPath = '/courses/' + course.slug;
  const highlights = Array.isArray(course.highlights) ? course.highlights.slice(0, 3) : [];

  return (
    <article className="course-card">
      <style>{styles}</style>
      <div className="course-card__media">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} loading="lazy" decoding="async" width="640" height="360" />
        ) : (
          <span>[COURSE IMAGE]</span>
        )}
      </div>

      <div className="course-card__body">
        <div className="course-card__tags">
          <span className="course-card__tag">{course.level || '[LEVEL]'}</span>
          <span className="course-card__tag course-card__tag--mode">{course.mode || '[MODE]'}</span>
        </div>
        <Heading className="course-card__title">
          <Link to={detailPath}>{course.title}</Link>
        </Heading>
        <p className="course-card__desc">{course.shortDescription || '[YOUR TEXT]'}</p>

        {highlights.length > 0 && (
          <ul className="course-card__points">
            {highlights.map((point) => (
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
            <span className="course-card__price">{priceOrPlaceholder(course.price)}</span>
            <span className="course-card__duration">{course.duration || '[DURATION]'}</span>
          </div>
          <Link to={detailPath} className="course-card__cta" aria-label={'Enroll now in ' + course.title}>
            Enroll Now
          </Link>
        </div>
      </div>
    </article>
  );
}

export default memo(CourseCard);
