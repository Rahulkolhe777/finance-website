// Replace the placeholders below with the real registration and contact details.
const SUPPORT_EMAIL = 'support@[YOUR-DOMAIN].com';
const SUPPORT_PHONE = '[YOUR PHONE]';
const SEBI_RA_NO = 'INH000031611';
const BSE_ENLISTMENT_NO = '[NO]';
const KYC_VERIFY_URL = '#'; // [ADD KRA KYC VERIFICATION URL]

const styles = `
.info-bar {
  background: var(--color-navy);
  color: var(--color-on-dark);
  font-size: 0.8125rem;
  line-height: 1.4;
}
.info-bar__inner {
  min-height: var(--infobar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-xs) var(--space-md);
  padding-block: var(--space-xs);
}
.info-bar__group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-xs) var(--space-sm);
}
.info-bar a {
  color: var(--color-on-dark);
  transition: color var(--transition);
}
.info-bar a:hover,
.info-bar a:focus-visible {
  color: var(--color-emerald-on-dark);
}
.info-bar__sep {
  color: var(--color-on-dark-muted);
}
.info-bar__kyc {
  font-weight: 600;
}
@media (max-width: 768px) {
  .info-bar { font-size: 0.75rem; }
  .info-bar__inner { justify-content: center; text-align: center; }
  .info-bar__group { justify-content: center; }
}
`;

export default function InfoBar() {
  return (
    <div className="info-bar">
      <style>{styles}</style>
      <div className="container info-bar__inner">
        <div className="info-bar__group">
          <a href={'mailto:' + SUPPORT_EMAIL}>{SUPPORT_EMAIL}</a>
          <span className="info-bar__sep" aria-hidden="true">|</span>
          <a href={'tel:' + SUPPORT_PHONE.replace(/[^\d+]/g, '')}>{SUPPORT_PHONE}</a>
        </div>
        <div className="info-bar__group">
          <span>SEBI RA No: {SEBI_RA_NO}</span>
          <span className="info-bar__sep" aria-hidden="true">|</span>
          <span>BSE Enlistment No: {BSE_ENLISTMENT_NO}</span>
          <span className="info-bar__sep" aria-hidden="true">|</span>
          <a className="info-bar__kyc" href={KYC_VERIFY_URL} target="_blank" rel="noreferrer">
            Verify KYC
          </a>
        </div>
      </div>
    </div>
  );
}
