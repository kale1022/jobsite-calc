import type { CalculatorDef } from '@/types';
import { fmt } from './format';

export const boardFeet: CalculatorDef = {
  id: 'boardFeet',
  title: 'Board Feet',
  icon: 'ruler-square',
  subtitle: 'Lumber volume for pricing rough stock',
  premium: true,
  fields: [
    { key: 'thickness', label: 'Thickness', unit: 'in', placeholder: '1' },
    { key: 'width', label: 'Width', unit: 'in', placeholder: '6' },
    { key: 'length', label: 'Length', unit: 'ft', placeholder: '8' },
    { key: 'qty', label: 'Quantity', unit: 'pcs', placeholder: '1', optional: true, defaultValue: 1 },
    {
      key: 'price',
      label: 'Price per board foot',
      unit: '$',
      placeholder: '0',
      optional: true,
      defaultValue: 0,
    },
  ],
  note: 'BF = thickness (in) × width (in) × length (ft) ÷ 12. Hardwood dealers price by nominal (rough) dimensions.',
  compute: (v) => {
    const bfEach = (v.thickness * v.width * v.length) / 12;
    const total = bfEach * v.qty;
    const lines = [
      { label: 'Per piece', value: `${fmt(bfEach)} BF` },
      { label: 'Lumber', value: `${fmt(total)} BF`, emphasis: true, shop: true },
    ];
    if (v.price > 0) {
      lines.push({ label: 'Lumber cost', value: `$${fmt(total * v.price)}`, emphasis: true, shop: true });
    }
    return lines;
  },
};
