import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../auth';
import { asset } from '../../utils/asset';
import '../admin.css';

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/pricing', label: 'Pricing' },
];

export function AdminLayout() {
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={asset("logo.png")} alt="" width={36} height={36} />
          <div>
            <strong>Silverwolf</strong>
            <span>Admin</span>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Admin">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="admin-nav-link">
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link to="/" className="admin-nav-link">
            View shop
          </Link>
          <button type="button" className="admin-nav-link admin-logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
