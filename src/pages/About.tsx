import { Link } from 'react-router-dom';
import { siteConfig } from '../data/config';

export function About() {
  return (
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1>About {siteConfig.shopName}</h1>
          <p>Small-batch 3D printing for collectors and cosplayers.</p>
        </header>
        <div className="prose">
          <p>
            {siteConfig.shopName} is the print shop of {siteConfig.ownerName} — figurines, cosplay
            accessories, and display props made to order, plus custom jobs from your STL files.
          </p>
          <h2>What we make</h2>
          <ul>
            <li>Ready-made catalog pieces across Figurines, Cosplay, and Props</li>
            <li>Custom prints from your models (binary STL preferred for auto-quotes)</li>
            <li>Cosplay / prop replicas only — never functional weapons</li>
          </ul>
          <h2>How ordering works</h2>
          <p>
            This site takes <strong>order requests</strong> only. After you submit, you get a
            confirmation path and a follow-up invoice with final pricing and shipping. Typical
            ready-made lead time: {siteConfig.leadTimeReadyMade}. Custom: {siteConfig.leadTimeCustom}.
          </p>
          <p>{siteConfig.shippingNote}</p>
          <p>
            Questions? See the <Link to="/faq">FAQ</Link> or{' '}
            <Link to="/policies">Policies</Link>. Ready to print?{' '}
            <Link to="/shop">Browse the shop</Link> or{' '}
            <Link to="/custom">start a custom order</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
