/** Client-side SEO helpers for the static SPA (GitHub Pages). */

export interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'product';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

const SITE = 'https://silverwolf.in';
const DEFAULT_IMAGE = `${SITE}/logo-mark.jpg`;

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(data: Record<string, unknown> | Record<string, unknown>[] | undefined) {
  const id = 'silverwolf-jsonld';
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** Update document title, description, Open Graph, canonical, and optional JSON-LD. */
export function applySeo({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  noIndex = false,
}: SeoProps) {
  const url = path.startsWith('http') ? path : `${SITE}${path.startsWith('/') ? path : `/${path}`}`;
  const fullTitle = title.includes('Silverwolf') ? title : `${title} | Silverwolf`;

  document.title = fullTitle;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
  upsertLink('canonical', url);

  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:site_name', 'Silverwolf');
  upsertMeta('property', 'og:title', fullTitle);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:locale', 'en_IN');

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', fullTitle);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);

  setJsonLd(jsonLd);
}

export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'Silverwolf',
      url: SITE,
      logo: `${SITE}/logo-mark.jpg`,
      email: 'admin@silverwolf.in',
      description:
        'India-based 3D print shop for figurines, cosplay props, and custom STL prints.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'Silverwolf',
      description:
        '3D-printed figurines, cosplay props, and custom STL prints. Browse the catalog or request a custom quote in INR.',
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'Store',
      '@id': `${SITE}/#store`,
      name: 'Silverwolf 3D Print Shop',
      url: SITE,
      image: `${SITE}/logo-mark.jpg`,
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Invoice',
      email: 'admin@silverwolf.in',
      parentOrganization: { '@id': `${SITE}/#organization` },
    },
  ],
};
