import { formEndpoint, siteConfig } from '../data/config';
import { saveIncomingOrder } from './store';

export interface OrderPayload {
  type: 'product-request' | 'custom-print' | 'customize-request';
  name: string;
  email: string;
  shippingCountry: string;
  details: string;
  summary: string;
  [key: string]: unknown;
}

export type SubmitResult =
  | { mode: 'endpoint'; ok: true }
  | { mode: 'endpoint'; ok: false; error: string }
  | { mode: 'fallback'; summary: string; mailto: string };

export async function submitOrder(payload: OrderPayload): Promise<SubmitResult> {
  // Always persist to local admin inbox first (custom-print + product-request)
  try {
    saveIncomingOrder(payload);
  } catch {
    // localStorage may be unavailable; continue with submit paths
  }

  const endpoint = formEndpoint?.trim();

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...payload,
          subject: `[Silverwolf] ${payload.type} — ${payload.name}`,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return { mode: 'endpoint', ok: false, error: text || `Request failed (${res.status})` };
      }
      return { mode: 'endpoint', ok: true };
    } catch (e) {
      return {
        mode: 'endpoint',
        ok: false,
        error: e instanceof Error ? e.message : 'Network error',
      };
    }
  }

  const subject = encodeURIComponent(`[Silverwolf] ${payload.type} — ${payload.name}`);
  const body = encodeURIComponent(payload.summary);
  const mailto = `mailto:${siteConfig.orderEmail}?subject=${subject}&body=${body}`;
  return { mode: 'fallback', summary: payload.summary, mailto };
}

export function buildProductOrderSummary(opts: {
  productName: string;
  material: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  name: string;
  email: string;
  shippingCountry: string;
  notes: string;
}): string {
  return [
    'Silverwolf — Product order request',
    '--------------------------------',
    `Product: ${opts.productName}`,
    `Material: ${opts.material}`,
    `Color: ${opts.color}`,
    `Size: ${opts.size}`,
    `Quantity: ${opts.quantity}`,
    `Listed unit price: $${opts.unitPrice.toFixed(2)} (final invoice may vary)`,
    '',
    `Name: ${opts.name}`,
    `Email: ${opts.email}`,
    `Shipping country: ${opts.shippingCountry}`,
    `Notes: ${opts.notes || '(none)'}`,
  ].join('\n');
}

export function buildCustomOrderSummary(opts: {
  fileName?: string;
  fileLink?: string;
  material: string;
  color: string;
  infill: string;
  quantity: number;
  volumeCm3?: number;
  estimatedGrams?: number;
  quotedTotal?: number;
  parseNote?: string;
  name: string;
  email: string;
  shippingCountry: string;
  notes: string;
}): string {
  const lines = [
    'Silverwolf — Custom print order request',
    '---------------------------------------',
    `File name: ${opts.fileName || '(none uploaded)'}`,
    `File link: ${opts.fileLink || '(none)'}`,
    `Material: ${opts.material}`,
    `Color: ${opts.color}`,
    `Infill: ${opts.infill}`,
    `Quantity: ${opts.quantity}`,
  ];
  if (opts.volumeCm3 != null) lines.push(`Est. volume: ${opts.volumeCm3} cm³`);
  if (opts.estimatedGrams != null) lines.push(`Est. mass: ${opts.estimatedGrams} g`);
  if (opts.quotedTotal != null) lines.push(`Rough quote total: $${opts.quotedTotal.toFixed(2)}`);
  if (opts.parseNote) lines.push(`Parse note: ${opts.parseNote}`);
  lines.push(
    '',
    `Name: ${opts.name}`,
    `Email: ${opts.email}`,
    `Shipping country: ${opts.shippingCountry}`,
    `Notes: ${opts.notes || '(none)'}`,
  );
  return lines.join('\n');
}

export function buildCustomizeSummary(opts: {
  productName: string;
  alteration: string;
  material: string;
  color: string;
  size: string;
  quantity: number;
  name: string;
  email: string;
  shippingCountry: string;
  notes: string;
}): string {
  return [
    'Silverwolf — Customize request (contact to alter)',
    '------------------------------------------------',
    `Product: ${opts.productName}`,
    `Requested change: ${opts.alteration || '(none)'}`,
    `Base material: ${opts.material}`,
    `Base color: ${opts.color}`,
    `Size: ${opts.size}`,
    `Quantity: ${opts.quantity}`,
    '',
    `Name: ${opts.name}`,
    `Email: ${opts.email}`,
    `Shipping country: ${opts.shippingCountry}`,
    `Extra notes: ${opts.notes || '(none)'}`,
    '',
    'Action: contact the customer about this alteration. Do not invoice until agreed.',
  ].join('\n');
}
