import type { CalculatorDef } from '@/types';
import { fmt } from './format';

const WASTE = 1.1;

export const tile: CalculatorDef = {
  id: 'tile',
  title: 'Tile',
  icon: 'view-grid-outline',
  subtitle: 'Tile count for floors and walls',
  premium: true,
  fields: [
    { key: 'length', label: 'Area length', unit: 'ft', placeholder: '10' },
    { key: 'width', label: 'Area width', unit: 'ft', placeholder: '8' },
    { key: 'tileW', label: 'Tile width', unit: 'in', placeholder: '12' },
    { key: 'tileH', label: 'Tile height', unit: 'in', placeholder: '12' },
  ],
  note: 'Includes 10% waste for cuts and breakage. Diagonal layouts and small rooms with many cuts may need 15%.',
  compute: (v) => {
    const area = v.length * v.width;
    const tileArea = (v.tileW * v.tileH) / 144;
    const tiles = Math.ceil((area * WASTE) / tileArea);
    return [
      { label: 'Floor area', value: `${fmt(area)} sq ft` },
      { label: 'Tiles', value: `${tiles}`, emphasis: true, shop: true },
      { label: 'Coverage w/ waste', value: `${fmt(area * WASTE)} sq ft` },
    ];
  },
};
