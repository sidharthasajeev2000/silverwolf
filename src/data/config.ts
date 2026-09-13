/** Site-wide editable config. No secrets. */
export const siteConfig = {
  shopName: 'Silverwolf',
  tagline: '3D-printed figurines, cosplay props & custom prints',
  ownerName: 'Sidhartha Mandampilly',
  domain: 'silverwolf.in',
  siteUrl: 'https://silverwolf.in',
  orderEmail: 'admin@silverwolf.in',
  leadTimeReadyMade: '5–10 business days',
  leadTimeCustom: '7–21 business days (depends on size & queue)',
  shippingNote: 'Ships worldwide. Shipping cost calculated when invoiced.',
} as const;

/** FormSubmit (free) emails admin@silverwolf.in. Override with VITE_FORM_ENDPOINT if needed. */
export const formEndpoint =
  (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim() ||
  `https://formsubmit.co/ajax/${siteConfig.orderEmail}`;
