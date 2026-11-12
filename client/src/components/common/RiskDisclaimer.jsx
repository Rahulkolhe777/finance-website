const styles = `
.risk-disclaimer {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: #5B6B78;
}
.risk-disclaimer p { margin: 0 0 0.5rem; }
.risk-disclaimer p:last-child { margin-bottom: 0; }
.risk-disclaimer--dark { color: #9FB0C0; }
.risk-disclaimer__label {
  font-weight: 700;
  color: inherit;
}
.risk-disclaimer--dark .risk-disclaimer__label { color: #E5ECF2; }
`;

// Full SEBI risk disclaimer. variant: 'light' (on white) | 'dark' (on navy)
export default function RiskDisclaimer({ variant = 'light', className = '' }) {
  return (
    <div className={'risk-disclaimer' + (variant === 'dark' ? ' risk-disclaimer--dark' : '') + (className ? ' ' + className : '')}>
      <style>{styles}</style>
      <p>
        <span className="risk-disclaimer__label">Risk Disclaimer: </span>
        Investments in securities market are subject to market risks. Read all the related documents carefully
        before investing. Registration granted by SEBI and certification from NISM in no way guarantee
        performance of the intermediary or provide any assurance of returns to investors.
      </p>
      <p>[PASTE FULL RISK DISCLAIMER]</p>
    </div>
  );
}
