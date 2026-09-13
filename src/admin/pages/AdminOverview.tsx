import { Link } from 'react-router-dom';
import { getLiveProducts, listOrders } from '../../utils/store';

export function AdminOverview() {
  const orders = listOrders();
  const products = getLiveProducts();
  const newCustom = orders.filter((o) => o.status === 'new' && o.payload.type === 'custom-print').length;
  const newCatalog = orders.filter(
    (o) => o.status === 'new' && o.payload.type === 'product-request',
  ).length;
  const newCustomize = orders.filter(
    (o) => o.status === 'new' && o.payload.type === 'customize-request',
  ).length;
  const stats = {
    newCustom,
    newCatalog,
    newCustomize,
    allOrders: orders.length,
    productCount: products.length,
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Overview</h1>
        <p>Inbox &amp; catalog snapshot for this browser.</p>
      </header>
      <div className="admin-stats">
        <Link to="/admin/orders?filter=custom" className="admin-stat-card">
          <span className="admin-stat-label">New custom orders</span>
          <span className="admin-stat-value">{stats.newCustom}</span>
        </Link>
        <Link to="/admin/orders?filter=customize" className="admin-stat-card">
          <span className="admin-stat-label">New customize requests</span>
          <span className="admin-stat-value">{stats.newCustomize}</span>
        </Link>
        <Link to="/admin/orders?filter=catalog" className="admin-stat-card">
          <span className="admin-stat-label">New catalog orders</span>
          <span className="admin-stat-value">{stats.newCatalog}</span>
        </Link>
        <Link to="/admin/orders" className="admin-stat-card">
          <span className="admin-stat-label">All orders</span>
          <span className="admin-stat-value">{stats.allOrders}</span>
        </Link>
        <Link to="/admin/products" className="admin-stat-card">
          <span className="admin-stat-label">Products</span>
          <span className="admin-stat-value">{stats.productCount}</span>
        </Link>
      </div>
    </div>
  );
}
