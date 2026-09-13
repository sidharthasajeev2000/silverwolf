import type { Product } from '../data/products';
import { ProductArt } from './ProductArt';

export function ProductPhoto({
  product,
  size = 160,
  className,
}: {
  product: Product;
  size?: number;
  className?: string;
}) {
  if (product.imageUrl) {
    return (
      <img
        className={className ? `${className} product-photo` : 'product-photo'}
        src={product.imageUrl}
        alt={product.name}
      />
    );
  }
  return <ProductArt product={product} size={size} />;
}
