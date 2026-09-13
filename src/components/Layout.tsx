import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import '../styles/layout.css';
import '../styles/pages.css';

export function Layout() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
