import type { CalculatorDef } from '@/types';
import { fmt } from './format';

export const roofing: CalculatorDef = {
  id: 'roofing',
  title: 'Roofing Shingles',
  icon: 'home-roof',
  subtitle: 'Squares + bundles from roof area',
  premium: true,
  fields: [
    { key: 'area', label: 'Roof area (sloped plane)', unit: 'sq ft', placeholder: '2000' },
    { key: 'waste', label: 'Waste', unit: '%', placeholder: '10', optional: true, defaultValue: 10 },
  ],
  note: 'Enter actual sloped roof area, not footprint. 1 square = 100 sq ft = 3 bundles of standard 3-tab or architectural shingles. Complex roofs (hips, valleys) need 15% waste.',
  compute: (v) => {
    const areaWithWaste = v.area * (1 + v.waste / 100);
    const squares = areaWithWaste / 100;
    const bundles = Math.ceil(squares * 3);
    return [
      { label: 'Area w/ waste', value: `${fmt(areaWithWaste)} sq ft` },
      { label: 'Squares', value: fmt(squares, 1), emphasis: true },
      { label: 'Shingle bundles', value: `${bundles}`, emphasis: true, shop: true },
    ];
  },
};
