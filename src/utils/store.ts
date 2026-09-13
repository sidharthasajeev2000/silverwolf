import { products as seedProducts, type Product } from '../data/products';
import { pricing as seedPricing } from '../data/pricing';
import type { OrderPayload } from './orderSubmit';

export type OrderStatus = 'new' | 'quoted' | 'in-progress' | 'done' | 'rejected';

export interface StoredOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  payload: OrderPayload;
}

export type PricingOverlay = {
  filamentPerGram: number;
  markup: number;
  minimum: number;
};

export type LivePricing = typeof seedPricing;

const ORDERS_KEY = 'silverwolf.orders';
const PRODUCTS_KEY = 'silverwolf.products';
const PRICING_KEY = 'silverwolf.pricing';

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `ord-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function saveIncomingOrder(payload: OrderPayload): StoredOrder {
  const order: StoredOrder = {
    id: newId(),
    createdAt: new Date().toISOString(),
    status: 'new',
    payload,
  };
  const orders = listOrders();
  orders.unshift(order);
  writeJson(ORDERS_KEY, orders);
  return order;
}

export function listOrders(): StoredOrder[] {
  const data = readJson<StoredOrder[]>(ORDERS_KEY);
  return Array.isArray(data) ? data : [];
}

export function setOrderStatus(id: string, status: OrderStatus): void {
  const orders = listOrders();
  const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
  writeJson(ORDERS_KEY, next);
}

export function deleteOrder(id: string): void {
  writeJson(
    ORDERS_KEY,
    listOrders().filter((o) => o.id !== id),
  );
}

export function getLiveProducts(): Product[] {
  const overlay = readJson<Product[]>(PRODUCTS_KEY);
  if (Array.isArray(overlay)) {
    return overlay;
  }
  return seedProducts.map((p) => ({ ...p, sizes: p.sizes.map((s) => ({ ...s })) }));
}

export function saveProducts(products: Product[]): void {
  writeJson(PRODUCTS_KEY, products);
}

export function resetProducts(): void {
  localStorage.removeItem(PRODUCTS_KEY);
}

export function getLivePricing(): LivePricing {
  const overlay = readJson<Partial<PricingOverlay>>(PRICING_KEY);
  return {
    ...seedPricing,
    filamentPerGram: overlay?.filamentPerGram ?? seedPricing.filamentPerGram,
    markup: overlay?.markup ?? seedPricing.markup,
    minimum: overlay?.minimum ?? seedPricing.minimum,
  };
}

export function savePricing(overlay: PricingOverlay): void {
  writeJson(PRICING_KEY, overlay);
}

export function resetPricing(): void {
  localStorage.removeItem(PRICING_KEY);
}
