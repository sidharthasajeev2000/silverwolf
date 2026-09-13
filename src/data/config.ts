/** Site-wide editable config. No secrets — put form endpoint in .env as VITE_FORM_ENDPOINT. */
export const siteConfig = {
  shopName: 'Silverwolf',
  tagline: '3D-printed figurines, cosplay props & custom prints',
  ownerName: 'Sidhartha Mandampilly',
  domain: 'silverwolf.in',
  siteUrl: 'https://silverwolf.in',
  /** Edit this mailto address — used when no form endpoint is configured */
  orderEmail: 'sidhartha@example.com',
  leadTimeReadyMade: '5–10 business days',
  leadTimeCustom: '7–21 business days (depends on size & queue)',
  shippingNote: 'Ships worldwide. Shipping cost calculated when invoiced.',
} as const;

export const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
