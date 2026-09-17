import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { ProductPhoto } from './ProductPhoto';
import { formatInr } from '../utils/quote';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card product-card">
      <Link to={`/shop/${product.slug}`} className="product-card-link">
        <div className="product-card-art">
          <ProductPhoto product={product} size={160} />
        </div>
        <div className="product-card-body">
          <div className="product-card-meta">
            <span className="badge">{product.collection}</span>
            <span className="price">{formatInr(product.price)}</span>
          </div>
          <h3>{product.name}</h3>
          <p>{product.shortDescription}</p>
        </div>
      </Link>
      <div className="product-card-actions">
        <Link to={`/shop/${product.slug}`} className="btn btn-primary">
          Buy premade
        </Link>
        <Link to={`/shop/${product.slug}?customize=1`} className="btn btn-ghost">
          Customize
        </Link>
      </div>
    </article>
  );
}
