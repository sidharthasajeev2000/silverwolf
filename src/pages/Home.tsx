import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { siteConfig } from '../data/config';
import { getLiveProducts } from '../utils/store';

export function Home() {
  const featured = getLiveProducts()
    .filter((p) => p.featured)
    .slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="hero-eyebrow">3D print workshop</p>
            <h1>
              Collectibles & cosplay props from the <em>Silverwolf</em> bench
            </h1>
            <p className="hero-lead">
              Ready-made figurines, replica props, and custom STL prints. Browse the catalog or
              upload a model for a rough in-browser quote — then send an order request.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">
                Browse shop
              </Link>
              <Link to="/custom" className="btn btn-ghost">
                Custom print
              </Link>
            </div>
          </div>
          <aside className="hero-panel" aria-labelledby="how-title">
            <h2 id="how-title">How it works</h2>
            <ul className="how-list">
              <li>
                <span className="how-num">1</span>
                <div>
                  <strong>Ready-made</strong>
                  <span>Pick a catalog piece, choose material / color / size, request the print.</span>
                </div>
              </li>
              <li>
                <span className="how-num">2</span>
                <div>
                  <strong>Custom STL</strong>
                  <span>
                    Upload a binary STL for a volume-based quote, or paste a Drive / Dropbox /
                    WeTransfer link.
                  </span>
                </div>
              </li>
              <li>
                <span className="how-num">3</span>
                <div>
                  <strong>Invoice later</strong>
                  <span>
                    Submit an order request. {siteConfig.ownerName.split(' ')[0]} confirms and
                    invoices — no card charge on this site.
                  </span>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="page" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title">Featured from the shop</h2>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="cta-band">
            <div>
              <h2>Got your own STL?</h2>
              <p>
                Instant rough quote in the browser for binary STL files. ASCII or link-only
                uploads are welcome too.
              </p>
            </div>
            <Link to="/custom" className="btn btn-primary">
              Start a custom print
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
