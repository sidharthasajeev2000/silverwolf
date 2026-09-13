import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { siteConfig } from '../data/config';
import { asset } from '../utils/asset';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/custom', label: 'Custom Print' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/policies', label: 'Policies' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={close}>
          <img className="logo-mark" src={asset("logo.png")} alt="" width={40} height={40} />
          {siteConfig.shopName}
        </Link>

        <nav className="nav-desktop" aria-label="Main">
          {links.map((l) =>
            l.to === '/custom' ? (
              <NavLink key={l.to} to={l.to} className="nav-cta" end={l.end}>
                {l.label}
              </NavLink>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.end}>
                {l.label}
              </NavLink>
            ),
          )}
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <nav id="mobile-nav" className={`nav-mobile container ${open ? 'open' : ''}`} aria-label="Mobile">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
