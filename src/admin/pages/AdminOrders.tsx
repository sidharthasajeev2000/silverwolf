import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  deleteOrder,
  listOrders,
  setOrderStatus,
  type OrderStatus,
  type StoredOrder,
} from '../../utils/store';
import { formatUsd } from '../../utils/quote';

type Filter = 'all' | 'custom' | 'catalog' | 'customize';

const STATUSES: OrderStatus[] = ['new', 'quoted', 'in-progress', 'done', 'rejected'];

function asStr(v: unknown): string {
  if (v == null) return '';
  return String(v);
}

function asNum(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v);
  return undefined;
}

export function AdminOrders() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('filter') || 'all';
  const filter: Filter =
    raw === 'custom' || raw === 'catalog' || raw === 'customize' ? raw : 'all';
  const [tick, setTick] = useState(0);

  const orders = useMemo(() => {
    void tick;
    const all = listOrders();
    if (filter === 'custom') return all.filter((o) => o.payload.type === 'custom-print');
    if (filter === 'catalog') return all.filter((o) => o.payload.type === 'product-request');
    if (filter === 'customize') return all.filter((o) => o.payload.type === 'customize-request');
    return all;
  }, [filter, tick]);

  function refresh() {
    setTick((t) => t + 1);
  }

  function setFilter(f: Filter) {
    if (f === 'all') setParams({});
    else setParams({ filter: f });
  }

  function onStatus(id: string, status: OrderStatus) {
    setOrderStatus(id, status);
    refresh();
  }

  function onDelete(id: string) {
    if (!confirm('Delete this order from the local inbox?')) return;
    deleteOrder(id);
    refresh();
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Orders</h1>
        <p>Custom prints and catalog requests saved in this browser.</p>
      </header>

      <div className="admin-chips" role="group" aria-label="Order filters">
        {(
          [
            ['all', 'All'],
            ['custom', 'Custom prints'],
            ['customize', 'Customize'],
            ['catalog', 'Catalog'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="filter-btn"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty">
          <p>
            No orders yet
            {filter === 'custom'
              ? ' for custom prints'
              : filter === 'customize'
                ? ' for customize requests'
                : filter === 'catalog'
                  ? ' for catalog requests'
                  : ''}
            .
          </p>
          {filter === 'customize' ? (
            <p>
              Use <strong>Customize</strong> on a shop product. We take their description and contact
              them.
            </p>
          ) : filter !== 'catalog' ? (
            <p>
              Submit a custom print from <Link to="/custom">/custom</Link> to see it here with file
              link and quote fields.
            </p>
          ) : (
            <p>
              Request a catalog item from the <Link to="/shop">shop</Link> to populate this inbox.
            </p>
          )}
        </div>
      ) : (
        <ul className="admin-order-list">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} onStatus={onStatus} onDelete={onDelete} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onStatus,
  onDelete,
}: {
  order: StoredOrder;
  onStatus: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}) {
  const p = order.payload;
  const isCustom = p.type === 'custom-print';
  const isCustomize = p.type === 'customize-request';
  const fileName = asStr(p.fileName);
  const fileLink = asStr(p.fileLink);
  const material = asStr(p.material);
  const color = asStr(p.color);
  const infill = asStr(p.infill);
  const quantity = asNum(p.quantity);
  const volumeCm3 = asNum(p.volumeCm3);
  const estimatedGrams = asNum(p.estimatedGrams);
  const quotedTotal = asNum(p.quotedTotal);
  const product = asStr(p.product);
  const size = asStr(p.size);
  const unitPrice = asNum(p.unitPrice);

  return (
    <article className="admin-order-card">
      <div className="admin-order-top">
        <div>
          <span
            className={`admin-type-badge ${isCustom ? 'custom' : isCustomize ? 'customize' : 'catalog'}`}
          >
            {isCustom ? 'Custom print' : isCustomize ? 'Customize' : 'Catalog'}
          </span>
          <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time>
        </div>
        <div className="admin-order-actions">
          <label className="sr-only" htmlFor={`status-${order.id}`}>
            Status
          </label>
          <select
            id={`status-${order.id}`}
            value={order.status}
            onChange={(e) => onStatus(order.id, e.target.value as OrderStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-ghost admin-danger-btn" onClick={() => onDelete(order.id)}>
            Delete
          </button>
        </div>
      </div>

      <dl className="admin-order-meta">
        <div>
          <dt>Customer</dt>
          <dd>
            {p.name} · <a href={`mailto:${p.email}`}>{p.email}</a> · {p.shippingCountry}
          </dd>
        </div>
        {isCustomize ? (
          <>
            <div>
              <dt>Product</dt>
              <dd>{asStr(p.productName) || product || '—'}</dd>
            </div>
            <div>
              <dt>Requested change</dt>
              <dd>{asStr(p.alteration) || p.details || '—'}</dd>
            </div>
          </>
        ) : isCustom ? (
          <>
            <div>
              <dt>File</dt>
              <dd>
                {fileName || '(none uploaded)'}
                {fileLink ? (
                  <>
                    {' · '}
                    <a href={fileLink} target="_blank" rel="noreferrer">
                      {fileLink}
                    </a>
                  </>
                ) : (
                  ' · (no file link)'
                )}
              </dd>
            </div>
            <div>
              <dt>Print</dt>
              <dd>
                {material || '—'} · {color || '—'} · infill {infill || '—'} · qty{' '}
                {quantity ?? '—'}
              </dd>
            </div>
            <div>
              <dt>Quote</dt>
              <dd>
                {volumeCm3 != null ? `${volumeCm3} cm³` : '— volume'}
                {' · '}
                {estimatedGrams != null ? `${estimatedGrams} g` : '— g'}
                {' · '}
                {quotedTotal != null ? formatUsd(quotedTotal) : '— quote'}
              </dd>
            </div>
          </>
        ) : (
          <>
            <div>
              <dt>Product</dt>
              <dd>
                {product || '—'}
                {size ? ` · ${size}` : ''}
                {material || color
                  ? ` · ${[material, color].filter(Boolean).join(' · ')}`
                  : ''}
                {quantity != null ? ` · qty ${quantity}` : ''}
                {unitPrice != null ? ` · ${formatUsd(unitPrice)}` : ''}
              </dd>
            </div>
          </>
        )}
        {p.details ? (
          <div>
            <dt>Notes</dt>
            <dd>{asStr(p.details)}</dd>
          </div>
        ) : null}
      </dl>

      <details className="admin-summary">
        <summary>Full summary</summary>
        <pre>{p.summary}</pre>
      </details>
    </article>
  );
}
