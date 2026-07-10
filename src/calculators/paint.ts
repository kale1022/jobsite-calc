import type { CalculatorDef } from '@/types';
import { fmt } from './format';

const SQFT_PER_GALLON = 350;
const DOOR_SQFT = 20;
const WINDOW_SQFT = 15;

export const paint: CalculatorDef = {
  id: 'paint',
  title: 'Paint Coverage',
  icon: 'format-paint',
  subtitle: 'Gallons needed for interior walls',
  premium: false,
  fields: [
    { key: 'perimeter', label: 'Wall length (total)', unit: 'ft', placeholder: '40' },
    { key: 'height', label: 'Wall height', unit: 'ft', placeholder: '8' },
    { key: 'coats', label: 'Coats', unit: '', placeholder: '2', optional: true, defaultValue: 2 },
    { key: 'doors', label: 'Doors', unit: '', placeholder: '0', optional: true, defaultValue: 0 },
    { key: 'windows', label: 'Windows', unit: '', placeholder: '0', optional: true, defaultValue: 0 },
  ],
  note: 'Assumes 350 sq ft coverage per gallon, 20 sq ft per door, 15 sq ft per window. Porous or unprimed surfaces cover less.',
  compute: (v) => {
    const area = Math.max(
      0,
      v.perimeter * v.height - v.doors * DOOR_SQFT - v.windows * WINDOW_SQFT,
    );
    const gallonsExact = (area * v.coats) / SQFT_PER_GALLON;
    return [
      { label: 'Paintable area', value: `${fmt(area)} sq ft` },
      { label: 'Exact amount', value: `${fmt(gallonsExact)} gal` },
      { label: 'Paint', value: `${Math.ceil(gallonsExact)} gal`, emphasis: true, shop: true },
    ];
  },
};
