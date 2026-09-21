import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { collections, type Collection } from '../data/products';
import { getLiveProducts } from '../utils/store';
import { Seo } from '../components/Seo';

const filters: Array<'All' | Collection> = ['All', ...collections];

export function Shop() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('collection') || 'All';
  const active = (filters.includes(raw as Collection | 'All') ? raw : 'All') as 'All' | Collection;

  const items = useMemo(() => {
    const list = getLiveProducts();
    if (active === 'All') return list;
    return list.filter((p) => p.collection === active);
  }, [active]);

  function setFilter(c: 'All' | Collection) {
    if (c === 'All') setParams({});
    else setParams({ collection: c });
  }

  return (
    <>
      <Seo
        title="Shop 3D prints"
        description="Browse Silverwolf 3D-printed figurines, cosplay props, and display replicas. Prices in ₹. Request a premade print or customize."
        path="/shop"
      />
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1>Shop</h1>
          <p>Figurines, cosplay pieces, and display props. Request a print per item — invoiced separately.</p>
        </header>

        <div className="filters" role="group" aria-label="Collection filters">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className="filter-btn"
              aria-pressed={active === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <p className="hint" style={{ marginBottom: '1rem' }}>
          Showing {items.length} item{items.length === 1 ? '' : 's'}
          {active !== 'All' ? ` in ${active}` : ''}.
        </p>

        {items.length === 0 ? (
          <div className="alert alert-warn" role="status">
            <p style={{ margin: 0 }}>No products in this collection yet.</p>
            <button type="button" className="btn btn-ghost" style={{ marginTop: '0.75rem' }} onClick={() => setFilter('All')}>
              Show all products
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
