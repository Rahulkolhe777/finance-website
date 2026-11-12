import { Outlet } from 'react-router-dom';
import InfoBar from './InfoBar.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import WhatsAppButton from '../common/WhatsAppButton.jsx';
import TrialPopup from '../common/TrialPopup.jsx';
import useScrollTop from '../../hooks/useScrollTop.js';

const styles = `
.skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  z-index: 1000;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  background: #0B1B2B;
  color: #fff;
  font-weight: 700;
}
.skip-link:focus { top: calc(0.75rem + env(safe-area-inset-top, 0px)); color: #fff; }
`;

export default function Layout() {
  useScrollTop();
  return (
    <>
      <style>{styles}</style>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <InfoBar />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <TrialPopup />
    </>
  );
}
