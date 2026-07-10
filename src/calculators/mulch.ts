import type { CalculatorDef } from '@/types';
import { fmt } from './format';

export const mulch: CalculatorDef = {
  id: 'mulch',
  title: 'Mulch & Gravel',
  icon: 'shovel',
  subtitle: 'Cubic yards for beds and fill',
  premium: true,
  fields: [
    { key: 'length', label: 'Length', unit: 'ft', placeholder: '20' },
    { key: 'width', label: 'Width', unit: 'ft', placeholder: '5' },
    { key: 'depth', label: 'Depth', unit: 'in', placeholder: '3' },
  ],
  note: 'Bag count uses standard 2 cu ft bags. Bulk delivery is usually cheaper above 1 cu yd.',
  compute: (v) => {
    const cuYd = (v.length * v.width * v.depth) / 324;
    const cuFt = cuYd * 27;
    return [
      { label: 'Volume', value: `${fmt(cuFt)} cu ft` },
      { label: 'Mulch/gravel', value: `${fmt(cuYd)} cu yd`, emphasis: true, shop: true },
      { label: 'Mulch bags (2 cu ft)', value: `${Math.ceil(cuFt / 2)}`, emphasis: true, shop: true },
    ];
  },
};
