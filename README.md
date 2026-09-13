# Silverwolf — 3D print shop

Static / JAMstack storefront for **Silverwolf** (Sidhartha Mandampilly): ready-made figurines & cosplay props, plus custom STL order requests with in-browser binary-STL volume quotes.

**Stack:** Vite + React + TypeScript, React Router, vanilla CSS. No Shopify, no paid SaaS required to demo. Checkout is **order request only** (invoice later).

## Quick start

```bash
cd silverwolf
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```


## Admin dashboard

Open **`/admin`** (or `/admin/login`). PIN is **`silverwolf`** until you change `VITE_ADMIN_PIN` in `.env`.

- Orders live in **this browser** (localStorage inbox). Every shop submit — catalog *and* custom print — is saved first via `saveIncomingOrder`.
- Custom prints appear under **Orders → Custom prints**, with file name, clickable file link, material/color/infill, quantity, volume/grams/quote, customer info, notes, and full summary.
- **Products** and **Pricing** overlays also store in localStorage and feed the live shop / custom quote.
- Admin routes sit outside the public shop layout (no public header). Do not add `/admin` to the public nav.

```bash
cp .env.example .env   # includes VITE_ADMIN_PIN=silverwolf
npm run dev
# → http://localhost:5173/admin
```

## Edit catalog & pricing

| What | File |
|------|------|
| Products (9–12 placeholders) | `src/data/products.ts` |
| Filament $/g, markup, minimum, densities | `src/data/pricing.ts` |
| Shop name, mailto fallback email | `src/data/config.ts` |
| FAQ copy | `src/data/faq.ts` |

Product art is CSS/SVG placeholders in `src/components/ProductArt.tsx` — no external image CDN.

## Order form endpoint (free)

By default there is **no** backend. Submit shows a **copyable order summary** + `mailto:` draft.

1. Create a free form at [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com).
2. Copy `.env.example` → `.env` (never commit `.env`).
3. Set:

```env
VITE_FORM_ENDPOINT=https://formspree.io/f/your-id
```

Orders POST JSON to that URL. Edit the fallback address in `src/data/config.ts` (`orderEmail`).

**Do not put API secrets in the repo.** Only `VITE_*` values are exposed to the browser; treat form endpoints as public.

## Custom STL quoting

- Parses **binary STL** in the browser: 80-byte header + `uint32` triangle count + 50 bytes/triangle.
- Volume from signed tetrahedra; abs → mm³ → cm³.
- Grams ≈ volume × density × infill factor; price = `max(minimum, grams × filamentPerGram × markup)`.
- **ASCII STL** is detected and does not crash — clear message + still allow file-link submit.

## Deploy free + custom domain

Build output is static files in `dist/`.

Production domain: **silverwolf.in**.

### Cloudflare Pages

1. Connect the repo (or upload `dist`).
2. Build command: `npm run build`
3. Output directory: `dist`
4. **Custom domain:** Pages → Custom domains → add your domain → set the DNS records Cloudflare shows.

For client-side routing, add a `_redirects` or Pages SPA fallback (`/* /index.html 200`) if needed.

### GitHub Pages

1. Set Vite base if serving from a subpath, e.g. in `vite.config.ts`: `base: '/repo-name/'`.
2. Build, deploy `dist` with GitHub Actions (`peaceiris/actions-gh-pages`) or Pages from docs/dist.
3. **Custom domain:** repo Settings → Pages → Custom domain → add `CNAME` / A records as GitHub documents.

### Vercel

1. Import the project; framework preset Vite.
2. Build: `npm run build`, output: `dist`.
3. **Custom domain:** Project → Settings → Domains.

SPA rewrites: ensure all routes fall back to `index.html` (Vercel does this for Vite by default).

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/shop` | Catalog + collection filters |
| `/shop/:slug` | Product detail + request form |
| `/custom` | Custom STL upload + quote + request |
| `/about` | About |
| `/faq` | FAQ |
| `/policies` | Returns & props disclaimer |
| `/admin/login` | Admin PIN gate |
| `/admin` | Admin overview |
| `/admin/orders` | Orders inbox (custom + catalog) |
| `/admin/products` | Catalog overlay editor |
| `/admin/pricing` | Filament $/g, markup, minimum |

## Scripts

- `npm run dev` — local dev server
- `npm run build` — typecheck + production build
- `npm run preview` — serve `dist`

## License / notes

Placeholder catalog and prices for demo. Prop replicas are not weapons. No payment processing on-site.
