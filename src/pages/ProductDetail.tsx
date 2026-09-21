import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { OrderForm } from '../components/OrderForm';
import { ProductPhoto } from '../components/ProductPhoto';
import { getLiveProducts } from '../utils/store';
import { formatInr } from '../utils/quote';
import { buildCustomizeSummary, buildProductOrderSummary } from '../utils/orderSubmit';
import { Seo } from '../components/Seo';

export function ProductDetail() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const product = useMemo(
    () => (slug ? getLiveProducts().find((p) => p.slug === slug) : undefined),
    [slug],
  );
  const mode = params.get('customize') === '1' ? 'customize' : 'listed';

  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [sizeId, setSizeId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [alteration, setAlteration] = useState('');

  useEffect(() => {
    if (!product) return;
    setMaterial(product.materials[0] ?? '');
    setColor(product.colors[0] ?? '');
    setSizeId(product.sizes[0]?.id ?? '');
    setQuantity(1);
  }, [product?.id]);

  const size = useMemo(
    () => product?.sizes.find((s) => s.id === sizeId) ?? product?.sizes[0],
    [product, sizeId],
  );

  if (!product) {
    return (
      <div className="page">
        <Seo
          title="Product not found"
          description="That product is not in the Silverwolf catalog."
          path={slug ? `/shop/${slug}` : '/shop'}
          noIndex
        />
        <div className="container">
          <h1>Product not found</h1>
          <p className="prose">That slug is not in the catalog.</p>
          <Link to="/shop" className="btn btn-primary">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const unitPrice = product.price + (size?.priceDelta ?? 0);
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.imageUrl || 'https://silverwolf.in/logo-mark.jpg',
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'Silverwolf' },
    offers: {
      '@type': 'Offer',
      url: `https://silverwolf.in/shop/${product.slug}`,
      priceCurrency: 'INR',
      price: String(unitPrice),
      availability: 'https://schema.org/PreOrder',
    },
  };


  function setMode(next: 'listed' | 'customize') {
    if (next === 'customize') setParams({ customize: '1' });
    else setParams({});
  }

  return (
    <div className="page">
      <Seo
        title={product.name}
        description={product.shortDescription || `${product.name} — 3D print from Silverwolf. Prices in ₹.`}
        path={`/shop/${product.slug}`}
        type="product"
        image={product.imageUrl || 'https://silverwolf.in/logo-mark.jpg'}
        jsonLd={productJsonLd}
      />
      <div className="container">
        <p className="hint" style={{ marginBottom: '1rem' }}>
          <Link to="/shop">Shop</Link> / {product.collection} / {product.name}
        </p>
        <div className="detail-grid">
          <div className="detail-art">
            <ProductPhoto product={product} size={280} />
          </div>
          <div className="detail-info">
            <span className="badge">{product.collection}</span>
            <h1>{product.name}</h1>
            <p className="prose" style={{ marginBottom: '0.5rem' }}>
              {product.description}
            </p>
            {product.amazonUrl ? (
              <p className="hint">
                Also listed on{' '}
                <a href={product.amazonUrl} target="_blank" rel="noreferrer">
                  Amazon
                </a>
              </p>
            ) : null}
            {product.collection === 'Cosplay' || product.art === 'katana' || product.art === 'blade' ? (
              <p className="alert alert-warn" style={{ marginBottom: '1rem' }}>
                Prop / cosplay replica only — not a functional weapon.
              </p>
            ) : null}
            <p className="detail-price price">
              {formatInr(unitPrice * quantity)}
              {quantity > 1 ? (
                <span className="hint"> ({quantity} × {formatInr(unitPrice)})</span>
              ) : null}
            </p>

            <div className="variant-group">
              <label id="mat-label">Material</label>
              <div className="variant-options" role="group" aria-labelledby="mat-label">
                {product.materials.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="variant-chip"
                    aria-pressed={material === m}
                    onClick={() => setMaterial(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="variant-group">
              <label id="color-label">Color</label>
              <div className="variant-options" role="group" aria-labelledby="color-label">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="variant-chip"
                    aria-pressed={color === c}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="variant-group">
              <label id="size-label">Size</label>
              <div className="variant-options" role="group" aria-labelledby="size-label">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="variant-chip"
                    aria-pressed={sizeId === s.id}
                    onClick={() => setSizeId(s.id)}
                  >
                    {s.label}
                    {s.priceDelta ? ` (${s.priceDelta > 0 ? '+' : ''}${formatInr(s.priceDelta)})` : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="qty">Quantity</label>
              <div className="qty-stepper">
                <button
                  type="button"
                  className="qty-btn"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <input
                  id="qty"
                  type="text"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(e) => {
                    const n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                    if (Number.isNaN(n)) return;
                    setQuantity(Math.min(50, Math.max(1, n)));
                  }}
                />
                <button
                  type="button"
                  className="qty-btn"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="buy-paths" role="tablist" aria-label="How do you want this toy">
              <button
                type="button"
                className="buy-path"
                aria-pressed={mode === 'listed'}
                onClick={() => setMode('listed')}
              >
                <strong>Buy premade</strong>
                <span>This exact toy, as shown.</span>
              </button>
              <button
                type="button"
                className="buy-path"
                aria-pressed={mode === 'customize'}
                onClick={() => setMode('customize')}
              >
                <strong>Customize</strong>
                <span>Change this same toy. We contact you.</span>
              </button>
            </div>

            {mode === 'listed' ? (
              <div className="order-panel">
                <h2>Buy premade</h2>
                <p className="hint" style={{ marginBottom: '0.75rem' }}>
                  Same piece as listed. Submit a request and we invoice you — nothing is charged on
                  this site.
                </p>
                {product.amazonUrl ? (
                  <p style={{ marginBottom: '1rem' }}>
                    <a
                      className="btn btn-primary"
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Buy premade on Amazon
                    </a>
                  </p>
                ) : null}
                <OrderForm
                  submitLabel="Buy premade (request invoice)"
                  buildPayload={({ name, email, shippingCountry, notes }) => {
                    const summary = buildProductOrderSummary({
                      productName: product.name,
                      material,
                      color,
                      size: size?.label ?? '',
                      quantity,
                      unitPrice,
                      name,
                      email,
                      shippingCountry,
                      notes,
                    });
                    return {
                      type: 'product-request',
                      name,
                      email,
                      shippingCountry,
                      details: notes,
                      summary,
                      product: product.slug,
                      material,
                      color,
                      size: size?.label,
                      quantity,
                      unitPrice,
                    };
                  }}
                />
              </div>
            ) : (
              <div className="order-panel">
                <h2>Customize</h2>
                <p className="hint" style={{ marginBottom: '0.75rem' }}>
                  Describe the change. We will contact you about the alteration — nothing is charged
                  here.
                </p>
                <div className="field">
                  <label htmlFor="alter">What should we change?</label>
                  <textarea
                    id="alter"
                    required
                    rows={4}
                    value={alteration}
                    onChange={(e) => setAlteration(e.target.value)}
                    placeholder="Color, size, extra parts, paint, a different pose…"
                  />
                </div>
                <OrderForm
                  submitLabel="Send customize request"
                  validate={() =>
                    alteration.trim() ? null : 'Describe the change you want.'
                  }
                  buildPayload={({ name, email, shippingCountry, notes }) => {
                    const change = alteration.trim();
                    const summary = buildCustomizeSummary({
                      productName: product.name,
                      alteration: change,
                      material,
                      color,
                      size: size?.label ?? '',
                      quantity,
                      name,
                      email,
                      shippingCountry,
                      notes,
                    });
                    return {
                      type: 'customize-request',
                      name,
                      email,
                      shippingCountry,
                      details: change,
                      summary,
                      product: product.slug,
                      productName: product.name,
                      alteration: change,
                      material,
                      color,
                      size: size?.label,
                      quantity,
                      extraNotes: notes,
                    };
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
