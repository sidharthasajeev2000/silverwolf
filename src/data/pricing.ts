/**
 * Editable quote rates for custom prints.
 * Volume comes from binary STL parse (cm³). Grams = volume × density.
 * Price = max(minimum, grams × filamentPerGram × markup)
 */
export const pricing = {
  /** USD per gram of filament (material cost basis) */
  filamentPerGram: 0.04,
  /** Multiplier over material cost (labor, machine wear, profit) */
  markup: 3.5,
  /** Floor price for any custom order quote (USD) */
  minimum: 12,
  /** Default density g/cm³ — PLA ~1.24 */
  densityByMaterial: {
    PLA: 1.24,
    PETG: 1.27,
    ABS: 1.04,
    Resin: 1.15,
    TPU: 1.21,
  } as Record<string, number>,
  /** Infill factor applied to solid volume for gram estimate */
  infillFactor: {
    '15%': 0.28,
    '20%': 0.35,
    '40%': 0.5,
    '60%': 0.65,
    '100%': 1.0,
  } as Record<string, number>,
  materials: ['PLA', 'PETG', 'ABS', 'Resin', 'TPU'] as const,
  colors: [
    'Matte Black',
    'Silver',
    'Gunmetal',
    'Ember Red',
    'Bone White',
    'Forest Green',
    'Custom (note color)',
  ] as const,
  infills: ['15%', '20%', '40%', '60%', '100%'] as const,
};

export type Material = (typeof pricing.materials)[number];
export type Infill = (typeof pricing.infills)[number];
