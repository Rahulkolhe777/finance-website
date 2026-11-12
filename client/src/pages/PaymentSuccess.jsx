import { Link, useSearchParams } from 'react-router-dom';

// Display-only page. Payment status is confirmed on the server (gateway
// verification/webhook), never from this URL.
const styles = `
.payment-result {
  padding: clamp(3.5rem, 8vw, 6rem) 0;
  background: linear-gradient(#EAF8F1, #fff);
  color: #0B1B2B;
}
.payment-result__card {
  max-width: 560px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3rem);
  border: 1px solid #D9E5E0;
  border-radius: 24px;
  background: #fff;
  text-align: center;
  box-shadow: 0 20px 44px rgba(11, 27, 43, 0.08);
}
.payment-result__icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #EEF5F2;
  color: #0B7A57;
}
.payment-result__title { margin: 0 0 0.75rem; font-size: clamp(1.75rem, 4vw, 2.25rem); font-weight: 800; letter-spacing: -0.02em; }
.payment-result__text { margin: 0 0 0.5rem; color: #4F5F6B; line-height: 1.7; }
.payment-result__ref { margin: 1rem 0 0; font-size: 0.875rem; color: #4F5F6B; }
.payment-result__steps {
  margin: 1.5rem 0 0;
  padding: 1.25rem 1.25rem 1.25rem 2.5rem;
  border-radius: 16px;
  background: #EEF5F2;
  text-align: left;
  line-height: 1.8;
}
.payment-result__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-top: 1.75rem; }
.payment-result__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 1.75rem;
  border-radius: 9999px;
  font-weight: 700;
}
.payment-result__btn--primary { background: linear-gradient(90deg, #087F58, #0E6E8C); color: #fff; }
.payment-result__btn--primary:hover, .payment-result__btn--primary:focus-visible { color: #fff; }
.payment-result__btn--ghost { border: 1.5px solid #0B1B2B; color: #0B1B2B; }
.payment-result__btn--ghost:hover, .payment-result__btn--ghost:focus-visible { background: #0B1B2B; color: #fff; }
`;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = (searchParams.get('order') || '').replace(/[^\w-]/g, '').slice(0, 64);

  return (
    <section className="payment-result" aria-labelledby="payment-success-title">
      <style>{styles}</style>
      <div className="container">
        <div className="payment-result__card">
          <div className="payment-result__icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h1 id="payment-success-title" className="payment-result__title">Payment successful</h1>
          <p className="payment-result__text">Thank you for subscribing. Your payment has been received.</p>
          {orderId && <p className="payment-result__ref">Order reference: <strong>{orderId}</strong></p>}

          <ol className="payment-result__steps">
            <li>A GST invoice will be sent to your registered email.</li>
            <li>Our team will contact you to activate your service. [EDIT NEXT STEPS]</li>
            <li>Read the <Link to="/legal/investor-charter">Investor Charter</Link> and <Link to="/legal/terms">Terms</Link>.</li>
          </ol>

          <div className="payment-result__actions">
            <Link to="/" className="payment-result__btn payment-result__btn--primary">Go to Home</Link>
            <Link to="/contact" className="payment-result__btn payment-result__btn--ghost">Contact Support</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
