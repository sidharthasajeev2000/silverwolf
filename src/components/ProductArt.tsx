import type { ReactNode } from 'react';
import type { Product } from '../data/products';

const paths: Record<Product['art'], ReactNode> = {
  wolf: (
    <>
      <ellipse cx="100" cy="150" rx="48" ry="28" opacity="0.25" />
      <path d="M70 130 Q55 90 72 70 Q85 95 100 85 Q115 95 128 70 Q145 90 130 130 Q100 155 70 130Z" />
      <circle cx="88" cy="105" r="3.5" fill="currentColor" />
      <circle cx="112" cy="105" r="3.5" fill="currentColor" />
      <path d="M95 118 Q100 124 105 118" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M100 70 L108 40 L118 68" fill="none" strokeWidth="3" />
    </>
  ),
  figure: (
    <>
      <circle cx="100" cy="55" r="18" />
      <path d="M70 90 Q100 75 130 90 L125 150 L75 150 Z" />
      <rect x="55" y="145" width="90" height="18" rx="3" opacity="0.5" />
      <path d="M60 120 H40 V135 H60" fill="none" strokeWidth="4" stroke="currentColor" />
    </>
  ),
  katana: (
    <>
      <path d="M40 150 L150 40" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M40 150 L150 40" stroke="var(--ember, #ff1a1a)" strokeWidth="2" fill="none" opacity="0.7" />
      <rect x="32" y="145" width="28" height="10" rx="2" transform="rotate(-45 46 150)" />
      <circle cx="150" cy="40" r="6" />
    </>
  ),
  mask: (
    <>
      <path d="M50 80 Q100 50 150 80 L145 130 Q100 155 55 130 Z" />
      <ellipse cx="78" cy="100" rx="12" ry="8" fill="var(--bg-deep, #0c0d10)" />
      <ellipse cx="122" cy="100" rx="12" ry="8" fill="var(--bg-deep, #0c0d10)" />
      <path d="M70 55 L78 78 M130 55 L122 78" stroke="currentColor" strokeWidth="4" fill="none" />
    </>
  ),
  armor: (
    <>
      <path d="M55 60 L100 45 L145 60 L150 110 L100 130 L50 110 Z" />
      <path d="M100 45 V130" stroke="var(--bg-deep, #0c0d10)" strokeWidth="3" fill="none" opacity="0.4" />
      <path d="M70 75 H130 M65 95 H135" stroke="var(--bg-deep, #0c0d10)" strokeWidth="2" fill="none" opacity="0.35" />
    </>
  ),
  helm: (
    <>
      <path d="M60 90 Q60 45 100 40 Q140 45 140 90 L135 140 Q100 155 65 140 Z" />
      <path d="M75 100 H125" stroke="var(--bg-deep, #0c0d10)" strokeWidth="8" strokeLinecap="round" />
      <path d="M100 40 V70" stroke="currentColor" strokeWidth="4" />
    </>
  ),
  dragon: (
    <>
      <path d="M50 120 Q70 60 110 70 Q140 50 155 80 Q140 110 110 105 Q90 140 55 130 Z" />
      <path d="M110 70 Q130 40 145 55" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="125" cy="78" r="3" fill="var(--bg-deep, #0c0d10)" />
      <path d="M60 100 Q40 90 35 110" fill="none" strokeWidth="3" stroke="currentColor" />
    </>
  ),
  shield: (
    <>
      <path d="M100 35 L155 55 V110 Q155 155 100 170 Q45 155 45 110 V55 Z" />
      <path d="M100 55 L130 70 V105 Q130 130 100 140 Q70 130 70 105 V70 Z" fill="none" stroke="var(--bg-deep, #0c0d10)" strokeWidth="3" opacity="0.4" />
    </>
  ),
  staff: (
    <>
      <path d="M100 170 V90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <circle cx="100" cy="70" r="28" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="100" cy="70" r="10" />
      <path d="M80 55 Q100 40 120 55" fill="none" strokeWidth="3" stroke="currentColor" />
    </>
  ),
  creature: (
    <>
      <ellipse cx="100" cy="120" rx="40" ry="30" />
      <circle cx="85" cy="85" r="22" />
      <path d="M70 75 L55 50 M95 70 L100 45" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="78" cy="82" r="3" fill="var(--ember, #ff1a1a)" />
      <path d="M60 130 Q40 140 45 155" fill="none" strokeWidth="5" stroke="currentColor" />
    </>
  ),
  crown: (
    <>
      <path d="M45 120 L45 80 L70 105 L100 55 L130 105 L155 80 L155 120 Z" />
      <rect x="40" y="118" width="120" height="16" rx="2" />
      <circle cx="100" cy="55" r="6" fill="var(--ember, #ff1a1a)" />
    </>
  ),
  blade: (
    <>
      <path d="M100 40 L115 130 L100 145 L85 130 Z" />
      <rect x="88" y="145" width="24" height="18" rx="2" />
      <rect x="70" y="160" width="60" height="10" rx="2" />
    </>
  ),
};

interface Props {
  product: Pick<Product, 'art' | 'accent' | 'name'>;
  size?: number;
}

export function ProductArt({ product, size = 200 }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label={`${product.name} illustration`}
      style={{ color: product.accent, maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <radialGradient id={`g-${product.art}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={product.accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0c0d10" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#g-${product.art})`} />
      <g fill={product.accent} fillOpacity="0.85" stroke={product.accent} strokeWidth="0">
        {paths[product.art]}
      </g>
    </svg>
  );
}
