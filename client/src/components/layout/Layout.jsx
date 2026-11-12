import { Outlet } from 'react-router-dom';
import InfoBar from './InfoBar.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import WhatsAppButton from '../common/WhatsAppButton.jsx';
import useScrollTop from '../../hooks/useScrollTop.js';

export default function Layout() {
  useScrollTop();
  return (
    <>
      <InfoBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
