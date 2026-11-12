import CallbackForm from '../forms/CallbackForm.jsx';

const styles = `
.callback-banner {
  padding: clamp(2.5rem, 5vw, 4rem) 0 clamp(3.5rem, 7vw, 5.5rem);
  background: #fff;
}
.callback-banner__box {
  position: relative;
  overflow: hidden;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 5vw, 3rem);
  border-radius: 24px;
  background: #0B1B2B;
  color: #fff;
  text-align: center;
}
.callback-banner__box::before,
.callback-banner__box::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.callback-banner__box::before {
  width: 320px;
  height: 320px;
  top: -160px;
  right: -80px;
  background: radial-gradient(circle, rgba(14, 110, 140, 0.35), transparent 70%);
}
.callback-banner__box::after {
  width: 280px;
  height: 280px;
  bottom: -150px;
  left: -60px;
  background: radial-gradient(circle, rgba(8, 127, 88, 0.35), transparent 70%);
}
.callback-banner__content { position: relative; z-index: 1; }
.callback-banner__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.callback-banner__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: #3DD39B;
}
.callback-banner__line {
  margin: 0 auto 1.75rem;
  max-width: 32rem;
  color: #C9D5DF;
  font-size: 1.0625rem;
}
`;

export default function CallbackBanner() {
  return (
    <section className="callback-banner" aria-labelledby="callback-banner-title">
      <style>{styles}</style>
      <div className="container">
        <div className="callback-banner__box">
          <div className="callback-banner__content">
            <h2 id="callback-banner-title" className="callback-banner__title">
              Request a <span className="callback-banner__accent">Call Back</span>
            </h2>
            <p className="callback-banner__line">Leave your mobile number and our team will call you.</p>
            <CallbackForm />
          </div>
        </div>
      </div>
    </section>
  );
}
