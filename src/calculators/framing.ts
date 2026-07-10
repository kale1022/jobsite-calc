import type { CalculatorDef } from '@/types';

export const framing: CalculatorDef = {
  id: 'framing',
  title: 'Wall Framing',
  icon: 'hammer',
  subtitle: 'Stud count for straight walls',
  premium: true,
  fields: [{ key: 'length', label: 'Wall length', unit: 'ft', placeholder: '20' }],
  selects: [
    {
      key: 'spacing',
      label: 'Stud spacing',
      options: [
        { label: '16" OC', value: 16 },
        { label: '24" OC', value: 24 },
      ],
      defaultValue: 16,
    },
  ],
  note: 'Straight-wall estimate: one stud per spacing interval plus an end stud. Add king/jack studs for each opening and extra studs at corners and T-walls.',
  compute: (v) => {
    const studs = Math.ceil((v.length * 12) / v.spacing) + 1;
    return [
      { label: `Studs (${v.spacing}" OC)`, value: `${studs}`, emphasis: true, shop: true },
      { label: 'Plates (top + bottom)', value: `${Math.ceil(v.length * 3)} lin ft`, shop: true },
    ];
  },
};
