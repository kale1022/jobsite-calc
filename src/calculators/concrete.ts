import type { CalculatorDef } from '@/types';
import { fmt } from './format';

// Bag yields per Quikrete standards (cu ft of mixed concrete per bag).
const BAG_YIELD: Record<number, number> = {
  80: 0.6,
  60: 0.45,
  40: 0.3,
};

export const concrete: CalculatorDef = {
  id: 'concrete',
  title: 'Concrete Slab',
  icon: 'cube-outline',
  subtitle: 'Volume + bag count for slabs and footings',
  premium: false,
  fields: [
    { key: 'length', label: 'Length', unit: 'ft', placeholder: '10' },
    { key: 'width', label: 'Width', unit: 'ft', placeholder: '10' },
    { key: 'depth', label: 'Depth', unit: 'in', placeholder: '4' },
  ],
  selects: [
    {
      key: 'bagSize',
      label: 'Bag size',
      options: [
        { label: '80 lb', value: 80 },
        { label: '60 lb', value: 60 },
        { label: '40 lb', value: 40 },
      ],
      defaultValue: 80,
    },
  ],
  note: 'Bag counts use standard premix yields: 80 lb = 0.60 cu ft, 60 lb = 0.45 cu ft, 40 lb = 0.30 cu ft. Order 5–10% extra for spillage and uneven grade.',
  compute: (v) => {
    const cuFt = v.length * v.width * (v.depth / 12);
    const cuYd = cuFt / 27;
    const bags = Math.ceil(cuFt / BAG_YIELD[v.bagSize]);
    return [
      { label: 'Volume', value: `${fmt(cuFt)} cu ft` },
      { label: 'Concrete', value: `${fmt(cuYd)} cu yd`, emphasis: true, shop: true },
      { label: `Concrete bags (${v.bagSize} lb)`, value: `${bags}`, emphasis: true, shop: true },
    ];
  },
};
