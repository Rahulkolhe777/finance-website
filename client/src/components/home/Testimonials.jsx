import { useCallback, useEffect, useRef, useState } from 'react';
import { testimonials } from '../../data/testimonials.js';

const STAR_PATH = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9L12 2.5z';

const styles = `
.testimonials {
  --tm-navy: #0B1B2B;
  --tm-emerald: #0B7A57;
  --tm-mint: #EEF5F2;
  --tm-border: #D9E5E0;
  --tm-muted: #5B6B78;
  --tm-star: #B7791F;

  background: #fff;
  padding: clamp(3.5rem, 7vw, 5.5rem) 0;
}
.testimonials__head {
  text-align: center;
  max-width: 40rem;
  margin: 0 auto clamp(2rem, 4vw, 3rem);
}
.testimonials__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--tm-navy);
}
.testimonials__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--tm-emerald);
}
.testimonials__track {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}
.testimonial-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  padding: 1.75rem;
  background: var(--tm-mint);
  border: 1px solid var(--tm-border);
  border-radius: 20px;
}
.testimonial-card__stars {
  display: flex;
  gap: 0.125rem;
  color: var(--tm-star);
}
.testimonial-card__stars .is-empty { color: var(--tm-border); }
.testimonial-card__quote {
  margin: 0;
  flex: 1;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--tm-navy);
}
.testimonial-card__author {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  border-top: 1px solid var(--tm-border);
}
.testimonial-card__name {
  font-weight: 800;
  font-style: normal;
  color: var(--tm-navy);
}
.testimonial-card__profession {
  font-size: 0.875rem;
  color: var(--tm-muted);
}
.testimonials__dots {
  display: none;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 1rem;
}
.testimonials__dot {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.testimonials__dot::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--tm-border);
  transition: width 200ms ease, background-color 200ms ease;
}
.testimonials__dot[aria-current='true']::before {
  width: 22px;
  background: var(--tm-emerald);
}
.testimonials__dot:focus-visible {
  outline: 2px solid var(--tm-emerald);
  outline-offset: -6px;
  border-radius: 9999px;
}
.testimonials__disclaimer {
  max-width: 44rem;
  margin: clamp(1.5rem, 3vw, 2.25rem) auto 0;
  text-align: center;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--tm-muted);
}
@media (max-width: 768px) {
  .testimonials__track {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--space-md);
    margin-inline: calc(-1 * var(--space-md));
    padding: 0.25rem var(--space-md) 0.5rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .testimonials__track::-webkit-scrollbar { display: none; }
  .testimonials__track > li {
    flex: 0 0 85%;
    scroll-snap-align: start;
  }
  .testimonials__dots { display: flex; }
}
@media (prefers-reduced-motion: reduce) {
  .testimonials__dot::before { transition: none; }
}
`;

export default function Testimonials() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track which card is snapped into view (mobile carousel only).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const card = track.firstElementChild;
        if (!card) return;
        const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || '0');
        setActiveIndex(Math.min(testimonials.length - 1, Math.max(0, Math.round(track.scrollLeft / step))));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goTo = useCallback((index) => {
    const card = trackRef.current?.children[index];
    if (!card) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    trackRef.current.scrollTo({
      left: card.offsetLeft - trackRef.current.offsetLeft - parseFloat(getComputedStyle(trackRef.current).paddingLeft),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <style>{styles}</style>
      <div className="container">
        <header className="testimonials__head">
          <h2 id="testimonials-title" className="testimonials__title">
            What Clients <span className="testimonials__accent">Say</span>
          </h2>
        </header>

        <ul ref={trackRef} className="testimonials__track" aria-label="Client testimonials">
          {testimonials.map((item, index) => (
            <li key={item.id} aria-label={'Testimonial ' + (index + 1) + ' of ' + testimonials.length}>
              <figure className="testimonial-card">
                <div className="testimonial-card__stars" role="img" aria-label={'Rated ' + item.rating + ' out of 5'}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <svg key={n} className={n <= item.rating ? '' : 'is-empty'} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={STAR_PATH} />
                    </svg>
                  ))}
                </div>
                <blockquote className="testimonial-card__quote">{item.content}</blockquote>
                <figcaption className="testimonial-card__author">
                  <cite className="testimonial-card__name">{item.name}</cite>
                  <span className="testimonial-card__profession">{item.profession}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="testimonials__dots" aria-label="Choose testimonial">
          {testimonials.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="testimonials__dot"
              aria-label={'Show testimonial ' + (index + 1)}
              aria-current={index === activeIndex}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <p className="testimonials__disclaimer">[ADD YOUR SEBI-COMPLIANT TESTIMONIAL DISCLAIMER]</p>
      </div>
    </section>
  );
}
