import { Link, useSearchParams } from 'react-router-dom';

const styles = `
.payment-failed {
  padding: clamp(3.5rem, 8vw, 6rem) 0;
  background: linear-gradient(#FDF3F1, #fff);
  color: #0B1B2B;
}
.payment-failed__card {
  max-width: 560px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3rem);
  border: 1px solid #F1D5CF;
  border-radius: 24px;
  background: #fff;
  text-align: center;
  box-shadow: 0 20px 44px rgba(11, 27, 43, 0.08);
}
.payment-failed__icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #FDECEA;
  color: #B42318;
}
.payment-failed__title { margin: 0 0 0.75rem; font-size: clamp(1.75rem, 4vw, 2.25rem); font-weight: 800; letter-spacing: -0.02em; }
.payment-failed__text { margin: 0 0 0.5rem; color: #4F5F6B; line-height: 1.7; }
.payment-failed__note {
  margin: 1.25rem 0 0;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: #FFF8EC;
  color: #6B4A0E;
  font-size: 0.9375rem;
  line-height: 1.6;
}
.payment-failed__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-top: 1.75rem; }
.payment-failed__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 1.75rem;
  border-radius: 9999px;
  font-weight: 700;
}
.payment-failed__btn--primary { background: linear-gradient(90deg, #087F58, #0E6E8C); color: #fff; }
.payment-failed__btn--primary:hover, .payment-failed__btn--primary:focus-visible { color: #fff; }
.payment-failed__btn--ghost { border: 1.5px solid #0B1B2B; color: #0B1B2B; }
.payment-failed__btn--ghost:hover, .payment-failed__btn--ghost:focus-visible { background: #0B1B2B; color: #fff; }
`;

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const plan = (searchParams.get('plan') || '').replace(/[^a-z0-9-]/gi, '').slice(0, 64);
  const retryPath = plan ? '/pricing?plan=' + plan : '/pricing';

  return (
    <section className="payment-failed" aria-labelledby="payment-failed-title">
      <style>{styles}</style>
      <div className="container">
        <div className="payment-failed__card">
          <div className="payment-failed__icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </div>
          <h1 id="payment-failed-title" className="payment-failed__title">Payment failed</h1>
          <p className="payment-failed__text">Your payment could not be completed. No subscription has been started.</p>
          <p className="payment-failed__note">
            If money was debited from your account, it is usually reversed by your bank within [N] working days.
            If not, please contact us with your transaction reference.
          </p>
          <div className="payment-failed__actions">
            <Link to={retryPath} className="payment-failed__btn payment-failed__btn--primary">Try Again</Link>
            <Link to="/contact" className="payment-failed__btn payment-failed__btn--ghost">Contact Support</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
