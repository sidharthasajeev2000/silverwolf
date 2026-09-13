import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { collections, type Collection } from '../data/products';
import { getLiveProducts } from '../utils/store';

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

        <div className="product-grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
