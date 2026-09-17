import { useMemo, useState, type FormEvent } from 'react';
import {
  collections,
  type Collection,
  type Product,
  type ProductVariant,
} from '../../data/products';
import { getLiveProducts, resetProducts, saveProducts } from '../../utils/store';
import { formatInr } from '../../utils/quote';

const ART_OPTIONS: Product['art'][] = [
  'wolf',
  'figure',
  'katana',
  'mask',
  'armor',
  'helm',
  'dragon',
  'shield',
  'staff',
  'creature',
  'crown',
  'blade',
];

function emptyProduct(): Product {
  return {
    id: `p-${Date.now()}`,
    slug: '',
    name: '',
    collection: 'Figurines',
    price: 0,
    shortDescription: '',
    description: '',
    featured: false,
    accent: '#ff1a1a',
    art: 'figure',
    materials: ['PLA'],
    colors: ['Matte Black'],
    sizes: [{ id: 'std', label: 'Standard', priceDelta: 0 }],
    imageUrl: '',
    amazonUrl: '',
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function AdminProducts() {
  const [tick, setTick] = useState(0);
  const products = useMemo(() => {
    void tick;
    return getLiveProducts();
  }, [tick]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  function refresh() {
    setTick((t) => t + 1);
  }

  function persist(next: Product[]) {
    saveProducts(next);
    refresh();
  }

  function startAdd() {
    setIsNew(true);
    setEditing(emptyProduct());
  }

  function startEdit(p: Product) {
    setIsNew(false);
    setEditing(JSON.parse(JSON.stringify(p)) as Product);
  }

  function onRemove(id: string) {
    if (!confirm('Remove this product from the live catalog overlay?')) return;
    persist(products.filter((p) => p.id !== id));
    if (editing?.id === id) {
      setEditing(null);
      setIsNew(false);
    }
  }

  function onReset() {
    if (!confirm('Reset catalog to seed products (clears local overlay)?')) return;
    resetProducts();
    setEditing(null);
    setIsNew(false);
    refresh();
  }

  function onSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const cleaned: Product = {
      ...editing,
      slug: editing.slug.trim() || slugify(editing.name),
      name: editing.name.trim(),
      shortDescription: editing.shortDescription.trim(),
      description: editing.description.trim(),
      materials: editing.materials.map((m) => m.trim()).filter(Boolean),
      colors: editing.colors.map((c) => c.trim()).filter(Boolean),
      sizes: editing.sizes.length
        ? editing.sizes
        : [{ id: 'std', label: 'Standard', priceDelta: 0 }],
    };
    if (!cleaned.name || !cleaned.slug) {
      alert('Name and slug are required.');
      return;
    }
    const others = products.filter((p) => p.id !== cleaned.id);
    if (others.some((p) => p.slug === cleaned.slug)) {
      alert('Slug already in use.');
      return;
    }
    if (isNew) {
      persist([...products, cleaned]);
    } else {
      persist(products.map((p) => (p.id === cleaned.id ? cleaned : p)));
    }
    setEditing(null);
    setIsNew(false);
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header admin-page-header-row">
        <div>
          <h1>Products</h1>
          <p>Edits save to localStorage and show on the live shop.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            Reset to seed
          </button>
          <button type="button" className="btn btn-primary" onClick={startAdd}>
            Add product
          </button>
        </div>
      </header>

      {editing ? (
        <ProductEditor
          product={editing}
          isNew={isNew}
          onChange={setEditing}
          onCancel={() => {
            setEditing(null);
            setIsNew(false);
          }}
          onSave={onSave}
        />
      ) : null}

      <ul className="admin-product-list">
        {products.map((p) => (
          <li key={p.id} className="admin-product-row">
            {p.imageUrl ? (
              <img className="admin-thumb" src={p.imageUrl} alt="" />
            ) : (
              <span className="admin-thumb admin-thumb-empty">No photo</span>
            )}
            <div>
              <strong>{p.name}</strong>
              <span className="hint">
                {p.collection} · {formatInr(p.price)} · /{p.slug}
                {p.featured ? ' · featured' : ''}
              </span>
            </div>
            <div className="admin-header-actions">
              <button type="button" className="btn btn-ghost" onClick={() => startEdit(p)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn-ghost admin-danger-btn"
                onClick={() => onRemove(p.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductEditor({
  product,
  isNew,
  onChange,
  onCancel,
  onSave,
}: {
  product: Product;
  isNew: boolean;
  onChange: (p: Product) => void;
  onCancel: () => void;
  onSave: (e: FormEvent) => void;
}) {
  function set<K extends keyof Product>(key: K, value: Product[K]) {
    onChange({ ...product, [key]: value });
  }

  function setSizes(sizes: ProductVariant[]) {
    set('sizes', sizes);
  }

  return (
    <form className="admin-panel" onSubmit={onSave}>
      <h2>{isNew ? 'Add product' : 'Edit product'}</h2>
      <div className="field-row">
        <div className="field">
          <label htmlFor="pname">Name</label>
          <input
            id="pname"
            value={product.name}
            onChange={(e) => {
              const name = e.target.value;
              onChange({
                ...product,
                name,
                slug: isNew && !product.slug ? slugify(name) : product.slug,
              });
            }}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="pslug">Slug</label>
          <input
            id="pslug"
            value={product.slug}
            onChange={(e) => set('slug', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="field-row field-row-3">
        <div className="field">
          <label htmlFor="pcol">Collection</label>
          <select
            id="pcol"
            value={product.collection}
            onChange={(e) => set('collection', e.target.value as Collection)}
          >
            {collections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pprice">Price (₹)</label>
          <input
            id="pprice"
            type="number"
            min={0}
            step={0.01}
            value={product.price}
            onChange={(e) => set('price', Number(e.target.value) || 0)}
          />
        </div>
        <div className="field">
          <label htmlFor="part">Art motif</label>
          <select
            id="part"
            value={product.art}
            onChange={(e) => set('art', e.target.value as Product['art'])}
          >
            {ART_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="paccent">Accent</label>
          <input
            id="paccent"
            type="text"
            value={product.accent}
            onChange={(e) => set('accent', e.target.value)}
          />
        </div>
        <div className="field" style={{ justifyContent: 'flex-end' }}>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={!!product.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />
            Featured on home
          </label>
        </div>
      </div>
      <div className="field">
        <label htmlFor="pshort">Short description</label>
        <input
          id="pshort"
          value={product.shortDescription}
          onChange={(e) => set('shortDescription', e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="pdesc">Description</label>
        <textarea
          id="pdesc"
          rows={3}
          value={product.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="pimg">Product photo URL (Amazon image link is fine)</label>
          <input
            id="pimg"
            type="url"
            placeholder="https://..."
            value={product.imageUrl || ''}
            onChange={(e) => set('imageUrl', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="pfile">Or upload a photo</label>
          <input
            id="pfile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 1_500_000) {
                alert('Keep photos under 1.5 MB for this local admin.');
                return;
              }
              const reader = new FileReader();
              reader.onload = () => set('imageUrl', String(reader.result || ''));
              reader.readAsDataURL(file);
            }}
          />
        </div>
      </div>
      {product.imageUrl ? (
        <img className="admin-photo-preview" src={product.imageUrl} alt="" />
      ) : null}
      <div className="field">
        <label htmlFor="pamazon">Amazon listing URL (optional)</label>
        <input
          id="pamazon"
          type="url"
          value={product.amazonUrl || ''}
          onChange={(e) => set('amazonUrl', e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="pmats">Materials (comma-separated)</label>
        <input
          id="pmats"
          value={product.materials.join(', ')}
          onChange={(e) =>
            set(
              'materials',
              e.target.value.split(',').map((s) => s.trim()),
            )
          }
        />
      </div>
      <div className="field">
        <label htmlFor="pcolors">Colors (comma-separated)</label>
        <input
          id="pcolors"
          value={product.colors.join(', ')}
          onChange={(e) =>
            set(
              'colors',
              e.target.value.split(',').map((s) => s.trim()),
            )
          }
        />
      </div>
      <div className="field">
        <label>Sizes (label:delta per line, e.g. 12 cm:0)</label>
        <textarea
          rows={3}
          value={product.sizes.map((s) => `${s.label}:${s.priceDelta}`).join('\n')}
          onChange={(e) => {
            const sizes: ProductVariant[] = e.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line, i) => {
                const [label, delta] = line.split(':');
                return {
                  id: `s${i}`,
                  label: (label || 'Size').trim(),
                  priceDelta: Number(delta) || 0,
                };
              });
            setSizes(sizes);
          }}
        />
      </div>
      <div className="admin-header-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save product
        </button>
      </div>
    </form>
  );
}
