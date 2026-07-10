import type { CalculatorDef } from '@/types';
import { fmt } from './format';

const WASTE = 1.1;

export const drywall: CalculatorDef = {
  id: 'drywall',
  title: 'Drywall Sheets',
  icon: 'wall',
  subtitle: 'Sheet count for walls with 10% waste',
  premium: true,
  fields: [
    { key: 'perimeter', label: 'Wall length (total)', unit: 'ft', placeholder: '48' },
    { key: 'height', label: 'Wall height', unit: 'ft', placeholder: '8' },
  ],
  selects: [
    {
      key: 'sheetSqFt',
      label: 'Sheet size',
      options: [
        { label: "4' × 8'", value: 32 },
        { label: "4' × 12'", value: 48 },
      ],
      defaultValue: 32,
    },
  ],
  note: 'Includes 10% waste. Ceilings: run the calculator again with room length × width as wall length × height.',
  compute: (v) => {
    const area = v.perimeter * v.height;
    const sheets = Math.ceil((area * WASTE) / v.sheetSqFt);
    return [
      { label: 'Wall area', value: `${fmt(area)} sq ft` },
      { label: 'Drywall sheets', value: `${sheets}`, emphasis: true, shop: true },
      { label: 'Joint compound', value: `~${fmt((area / 1000) * 9.4, 1)} gal`, shop: true },
      { label: 'Drywall screws', value: `~${sheets * 32}`, shop: true },
    ];
  },
};
