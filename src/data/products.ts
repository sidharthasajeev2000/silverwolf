export type Collection = 'Figurines' | 'Cosplay' | 'Props';

export interface ProductVariant {
  id: string;
  label: string;
  /** Price adjustment in USD relative to base */
  priceDelta: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: Collection;
  price: number;
  shortDescription: string;
  description: string;
  featured?: boolean;
  /** Accent color for placeholder art */
  accent: string;
  /** Art motif key for SVG placeholder (used only if no photo) */
  art: 'wolf' | 'figure' | 'katana' | 'mask' | 'armor' | 'helm' | 'dragon' | 'shield' | 'staff' | 'creature' | 'crown' | 'blade';
  /** Amazon or other product photo URL (or data URL from admin upload) */
  imageUrl?: string;
  /** Optional Amazon listing */
  amazonUrl?: string;
  materials: string[];
  colors: string[];
  sizes: ProductVariant[];
}

export const collections: Collection[] = ['Figurines', 'Cosplay', 'Props'];

export const products: Product[] = [
  {
    id: 'p01',
    slug: 'ember-wolf-figurine',
    name: 'Ember Wolf Figurine',
    collection: 'Figurines',
    price: 28,
    shortDescription: 'Howling wolf on a rocky base — shop mascot tribute.',
    description:
      'A detailed 3D-printed wolf mid-howl, perched on a cracked stone base with ember-glow paint accents available on request. Printed in durable PLA; optional PETG for outdoor display.',
    featured: true,
    accent: '#ff1a1a',
    art: 'wolf',
    materials: ['PLA', 'PETG'],
    colors: ['Matte Black', 'Silver', 'Ember Red', 'Bone White'],
    sizes: [
      { id: 's', label: '12 cm', priceDelta: 0 },
      { id: 'm', label: '18 cm', priceDelta: 12 },
      { id: 'l', label: '25 cm', priceDelta: 28 },
    ],
  },
  {
    id: 'p02',
    slug: 'shadow-ronin-bust',
    name: 'Shadow Ronin Bust',
    collection: 'Figurines',
    price: 36,
    shortDescription: 'Masked warrior bust with layered armor detail.',
    description:
      'Desktop-scale ronin bust with intricate armor plates and a removable mask option. Great for painting or as a display piece out of the box in gunmetal PLA.',
    featured: true,
    accent: '#6c757d',
    art: 'helm',
    materials: ['PLA', 'Resin'],
    colors: ['Gunmetal', 'Matte Black', 'Bone White'],
    sizes: [
      { id: 's', label: '10 cm', priceDelta: 0 },
      { id: 'm', label: '15 cm', priceDelta: 14 },
    ],
  },
  {
    id: 'p03',
    slug: 'crystal-dragonette',
    name: 'Crystal Dragonette',
    collection: 'Figurines',
    price: 42,
    shortDescription: 'Tiny dragon coiled around a crystal shard.',
    description:
      'Whimsical dragonette with wing membranes and a crystalline perch. Fine-detail friendly — Resin recommended for sharp scales; PLA available for a bolder silhouette.',
    featured: true,
    accent: '#2a9d8f',
    art: 'dragon',
    materials: ['PLA', 'Resin'],
    colors: ['Forest Green', 'Silver', 'Ember Red', 'Bone White'],
    sizes: [
      { id: 's', label: '8 cm', priceDelta: 0 },
      { id: 'm', label: '14 cm', priceDelta: 16 },
    ],
  },
  {
    id: 'p04',
    slug: 'void-stalker-mini',
    name: 'Void Stalker Mini',
    collection: 'Figurines',
    price: 18,
    shortDescription: 'Tabletop-ready creature mini (~32 mm scale).',
    description:
      'A hunched void creature for RPG sessions or shelf dioramas. Sold unpainted. Base included. Multiple copies available for squads.',
    accent: '#7b2cbf',
    art: 'creature',
    materials: ['PLA', 'Resin'],
    colors: ['Matte Black', 'Gunmetal', 'Bone White'],
    sizes: [
      { id: '32', label: '32 mm', priceDelta: 0 },
      { id: '54', label: '54 mm', priceDelta: 8 },
    ],
  },
  {
    id: 'p05',
    slug: 'replica-katana-display',
    name: 'Replica Katana (Display Prop)',
    collection: 'Cosplay',
    price: 65,
    shortDescription: 'Cosplay/display replica — not a real weapon.',
    description:
      'Lightweight 3D-printed replica katana for cosplay and wall display. Blunt tip, plastic construction, decorative only. Includes optional wall mount pegs. This is a prop replica, never a functional blade.',
    featured: true,
    accent: '#c1121f',
    art: 'katana',
    materials: ['PLA', 'PETG'],
    colors: ['Matte Black', 'Silver', 'Gunmetal', 'Ember Red'],
    sizes: [
      { id: 'full', label: '~100 cm (assembled)', priceDelta: 0 },
      { id: 'short', label: '~70 cm (wakizashi scale)', priceDelta: -15 },
    ],
  },
  {
    id: 'p06',
    slug: 'oni-half-mask',
    name: 'Oni Half-Mask',
    collection: 'Cosplay',
    price: 32,
    shortDescription: 'Wearable half-mask with horn accents.',
    description:
      'Lightweight cosplay half-mask designed for elastic strap (strap not included). Smooth exterior ready for paint or weathering. Comfortable PLA or flexible TPU options.',
    featured: true,
    accent: '#d00000',
    art: 'mask',
    materials: ['PLA', 'TPU', 'PETG'],
    colors: ['Matte Black', 'Ember Red', 'Bone White', 'Custom (note color)'],
    sizes: [
      { id: 's', label: 'Small', priceDelta: 0 },
      { id: 'm', label: 'Medium', priceDelta: 0 },
      { id: 'l', label: 'Large', priceDelta: 4 },
    ],
  },
  {
    id: 'p07',
    slug: 'plate-pauldrons-pair',
    name: 'Plate Pauldrons (Pair)',
    collection: 'Cosplay',
    price: 48,
    shortDescription: 'Shoulder armor pair for LARP / photoshoots.',
    description:
      'Articulated-look pauldrons printed as a pair. Lightweight PLA with optional PETG for tougher wear. Mounting holes for straps. Costume use only.',
    accent: '#adb5bd',
    art: 'armor',
    materials: ['PLA', 'PETG'],
    colors: ['Gunmetal', 'Silver', 'Matte Black', 'Bone White'],
    sizes: [
      { id: 'm', label: 'Standard', priceDelta: 0 },
      { id: 'l', label: 'Large', priceDelta: 10 },
    ],
  },
  {
    id: 'p08',
    slug: 'crown-of-embers',
    name: 'Crown of Embers',
    collection: 'Cosplay',
    price: 38,
    shortDescription: 'Fantasy crown with flame-spike silhouette.',
    description:
      'Statement fantasy crown for photos and stage. Hollow lightweight build. Paint-ready surface. Adjustable with foam padding (padding not included).',
    accent: '#ff1a1a',
    art: 'crown',
    materials: ['PLA', 'PETG'],
    colors: ['Ember Red', 'Gold-ish (Bone White + paint)', 'Matte Black', 'Silver'],
    sizes: [
      { id: 'm', label: 'Adult', priceDelta: 0 },
      { id: 's', label: 'Youth', priceDelta: -6 },
    ],
  },
  {
    id: 'p09',
    slug: 'hex-tower-shield',
    name: 'Hex Tower Shield (Prop)',
    collection: 'Props',
    price: 55,
    shortDescription: 'Decorative tower shield for display & photos.',
    description:
      'Large decorative shield prop with hexagonal motif. Wall-mount friendly. Not for combat or LARP striking — display and photography use.',
    featured: true,
    accent: '#457b9d',
    art: 'shield',
    materials: ['PLA', 'PETG'],
    colors: ['Gunmetal', 'Matte Black', 'Forest Green', 'Silver'],
    sizes: [
      { id: 'm', label: '60 cm tall', priceDelta: 0 },
      { id: 'l', label: '80 cm tall', priceDelta: 22 },
    ],
  },
  {
    id: 'p10',
    slug: 'arcane-staff-head',
    name: 'Arcane Staff Head',
    collection: 'Props',
    price: 29,
    shortDescription: 'Ornate staff finial — attach to your own shaft.',
    description:
      'Print-ready staff head with spiral cage and gem seat (gem not included). Socket fits common 22–25 mm dowels. Cosplay / photo prop.',
    accent: '#9b5de5',
    art: 'staff',
    materials: ['PLA', 'Resin', 'PETG'],
    colors: ['Matte Black', 'Silver', 'Ember Red', 'Bone White'],
    sizes: [
      { id: 'std', label: 'Standard (~18 cm)', priceDelta: 0 },
    ],
  },
  {
    id: 'p11',
    slug: 'dagger-display-replica',
    name: 'Dagger Display Replica',
    collection: 'Props',
    price: 24,
    shortDescription: 'Blunt decorative dagger with stand — prop only.',
    description:
      'Fully blunt decorative dagger replica with optional desktop stand. Plastic prop for display and cosplay. Not a weapon; tip and edges are rounded.',
    accent: '#495057',
    art: 'blade',
    materials: ['PLA', 'PETG'],
    colors: ['Gunmetal', 'Matte Black', 'Silver', 'Bone White'],
    sizes: [
      { id: 'std', label: '~35 cm', priceDelta: 0 },
    ],
  },
  {
    id: 'p12',
    slug: 'workshop-bench-figure',
    name: 'Workshop Artisan Figure',
    collection: 'Figurines',
    price: 34,
    shortDescription: 'Maker at a workbench — nod to the craft.',
    description:
      'Charming artisan figure with tiny tools and a print bench. A gift for fellow makers. Multi-part print assembled and glued before shipping.',
    accent: '#bc6c25',
    art: 'figure',
    materials: ['PLA'],
    colors: ['Bone White', 'Matte Black', 'Custom (note color)'],
    sizes: [
      { id: 's', label: '10 cm', priceDelta: 0 },
      { id: 'm', label: '15 cm', priceDelta: 12 },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCollection(collection: Collection | 'All'): Product[] {
  if (collection === 'All') return products;
  return products.filter((p) => p.collection === collection);
}
