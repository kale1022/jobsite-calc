import type { CalculatorDef } from '@/types';
import { concrete } from './concrete';
import { paint } from './paint';
import { framing } from './framing';
import { drywall } from './drywall';
import { tile } from './tile';
import { roofing } from './roofing';
import { mulch } from './mulch';
import { boardFeet } from './boardFeet';

export const CALCULATORS: CalculatorDef[] = [
  concrete,
  paint,
  framing,
  drywall,
  tile,
  roofing,
  mulch,
  boardFeet,
];

export function getCalculator(id: string): CalculatorDef {
  const calc = CALCULATORS.find((c) => c.id === id);
  if (!calc) throw new Error(`Unknown calculator: ${id}`);
  return calc;
}
