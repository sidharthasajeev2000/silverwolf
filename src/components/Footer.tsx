import { Link } from 'react-router-dom';
import { siteConfig } from '../data/config';
import { asset } from '../utils/asset';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src={asset("logo.png")} alt="" width={36} height={36} />
              Silver<span>wolf</span>
            </div>
            <p className="footer-copy">
              {siteConfig.tagline}. Handled by {siteConfig.ownerName}. Order requests only —
              you will be invoiced separately.
            </p>
            <p className="prop-disclaimer">
              Replica blades and weapons are cosplay / display props only — never functional
              weapons.
            </p>
          </div>
          <div className="footer-col">
            <h3>Shop</h3>
            <Link to="/shop">All products</Link>
            <Link to="/shop?collection=Figurines">Figurines</Link>
            <Link to="/shop?collection=Cosplay">Cosplay</Link>
            <Link to="/shop?collection=Props">Props</Link>
            <Link to="/custom">Custom print</Link>
          </div>
          <div className="footer-col">
            <h3>Info</h3>
            <Link to="/about">About</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/policies">Policies</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.shopName}</span>
          <span>Orders to {siteConfig.orderEmail} — no card payments on-site</span>
        </div>
      </div>
    </footer>
  );
}
