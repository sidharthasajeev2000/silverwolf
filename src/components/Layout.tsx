import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SceneBackground } from './SceneBackground';
import '../styles/layout.css';
import '../styles/pages.css';

export function Layout() {
  return (
    <>
      <SceneBackground />
      <div className="site-shell">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
