import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/courses', label: 'Courses' },
  { to: '/pricing', label: 'Pricing & Payments' },
  { to: '/contact', label: 'Contact Us' },
];
const TRIAL_PATH = '/free-trial';

const navLinkClass = ({ isActive }) => 'header__link' + (isActive ? ' is-active' : '');

const styles = `
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background: var(--color-bg);
  border-bottom: 1px solid transparent;
  transition: box-shadow var(--transition), border-color var(--transition);
}
.header.is-scrolled {
  box-shadow: var(--shadow-header);
  border-bottom-color: var(--color-border);
}
.header__inner {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
}
.header__logo {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--color-navy);
  letter-spacing: -0.01em;
  flex-shrink: 0;
}
.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}
.header__link {
  display: inline-flex;
  align-items: center;
  min-height: var(--touch-target);
  padding: 0 var(--space-sm);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
  border-radius: var(--radius);
  transition: color var(--transition), background-color var(--transition);
}
.header__link:hover,
.header__link:focus-visible {
  color: var(--color-emerald);
}
.header__link.is-active {
  color: var(--color-emerald);
  font-weight: 600;
}
.header__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--touch-target);
  padding: 0 1.5rem;
  border-radius: var(--radius-pill);
  background: var(--gradient-cta);
  color: #fff;
  font-weight: 600;
  font-size: 0.9375rem;
  white-space: nowrap;
  box-shadow: 0 6px 16px rgba(11, 122, 87, 0.25);
  transition: transform var(--transition), box-shadow var(--transition);
}
.header__cta:hover,
.header__cta:focus-visible {
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(11, 122, 87, 0.32);
}
.header__toggle {
  display: none;
  width: var(--touch-target);
  height: var(--touch-target);
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: var(--color-navy);
  cursor: pointer;
}
.header__toggle:hover { background: var(--color-bg-alt); }
.header__overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: var(--color-overlay);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition);
}
.header__overlay.is-open {
  opacity: 1;
  pointer-events: auto;
}
.header__drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-drawer);
  width: min(320px, 85vw);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-md) calc(var(--space-lg) + env(safe-area-inset-bottom, 0px));
  background: var(--color-bg);
  box-shadow: -8px 0 24px rgba(15, 29, 43, 0.18);
  transform: translateX(100%);
  transition: transform 260ms ease;
  overflow-y: auto;
}
.header__drawer.is-open { transform: translateX(0); }
.header__drawer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header__drawer .header__nav {
  flex-direction: column;
  align-items: stretch;
}
.header__drawer .header__link {
  padding: 0 var(--space-md);
  font-size: 1rem;
}
.header__drawer .header__link.is-active {
  background: var(--color-emerald-light);
}
.header__desktop-only { display: flex; }
@media (max-width: 1024px) {
  .header__desktop-only { display: none; }
  .header__toggle { display: inline-flex; }
}
@media (min-width: 1025px) {
  .header__overlay,
  .header__drawer { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .header__drawer,
  .header__overlay,
  .header__cta { transition: none; }
}
`;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setIsMenuOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  return (
    <header className={'header' + (isScrolled ? ' is-scrolled' : '')}>
      <style>{styles}</style>
      <div className="container header__inner">
        <Link to="/" className="header__logo" aria-label="Home">[LOGO]</Link>

        <nav className="header__nav header__desktop-only" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to={TRIAL_PATH} className="header__cta header__desktop-only">Instant Trial Form</Link>

        <button
          type="button"
          className="header__toggle"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-drawer"
          onClick={openMenu}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className={'header__overlay' + (isMenuOpen ? ' is-open' : '')} onClick={closeMenu} aria-hidden="true" />

      <aside
        id="mobile-drawer"
        className={'header__drawer' + (isMenuOpen ? ' is-open' : '')}
        aria-label="Mobile menu"
        aria-hidden={!isMenuOpen}
        inert={isMenuOpen ? undefined : ''}
      >
        <div className="header__drawer-top">
          <Link to="/" className="header__logo" onClick={closeMenu}>[LOGO]</Link>
          <button type="button" className="header__toggle" style={{ display: 'inline-flex' }} aria-label="Close menu" onClick={closeMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className="header__nav" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClass} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Link to={TRIAL_PATH} className="header__cta" onClick={closeMenu}>Instant Trial Form</Link>
      </aside>
    </header>
  );
}
