import { getLivePricing } from './store';

export interface QuoteInput {
  volumeCm3: number;
  material: string;
  infill: string;
  quantity: number;
}

export interface QuoteResult {
  volumeCm3: number;
  estimatedGrams: number;
  unitPrice: number;
  totalPrice: number;
  density: number;
  infillFactor: number;
}

export function estimateQuote(input: QuoteInput): QuoteResult {
  const pricing = getLivePricing();
  const density = pricing.densityByMaterial[input.material] ?? 1.24;
  const infillFactor = pricing.infillFactor[input.infill] ?? 0.35;
  const solidGrams = input.volumeCm3 * density;
  const estimatedGrams = solidGrams * infillFactor;
  const raw = estimatedGrams * pricing.filamentPerGram * pricing.markup;
  const unitPrice = Math.max(pricing.minimum, roundMoney(raw));
  const qty = Math.max(1, Math.floor(input.quantity) || 1);
  return {
    volumeCm3: round(input.volumeCm3, 2),
    estimatedGrams: round(estimatedGrams, 1),
    unitPrice,
    totalPrice: roundMoney(unitPrice * qty),
    density,
    infillFactor,
  };
}

function round(n: number, places: number): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

function roundMoney(n: number): number {
  return Math.round(n);
}

/** Format as Indian rupees (₹). */
export function formatInr(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

/** @deprecated use formatInr */
export const formatUsd = formatInr;

