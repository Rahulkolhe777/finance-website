import { Link } from 'react-router-dom';
import RiskDisclaimer from '../common/RiskDisclaimer.jsx';

const LEGAL_LINKS = [
  { to: '/legal/privacy-policy', label: 'Privacy Policy' },
  { to: '/legal/user-consent', label: 'User Consent' },
  { to: '/legal/investor-charter', label: 'Investor Charter' },
  { to: '/legal/disclosure', label: 'Disclosure' },
  { to: '/legal/terms', label: 'Terms & Conditions' },
  { to: '/complaint-board', label: 'Complaint Board' },
  { to: '/grievance-redressal', label: 'Grievance Redressal' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <nav className="footer__links">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>
        <RiskDisclaimer />
        <p className="footer__copy">&copy; {new Date().getFullYear()} Research Analyst. All rights reserved.</p>
      </div>
    </footer>
  );
}
