// Dev-only formula spot-check: npx tsx verify-formulas.ts
import { concrete } from './src/calculators/concrete';
import { paint } from './src/calculators/paint';
import { framing } from './src/calculators/framing';
import { drywall } from './src/calculators/drywall';
import { tile } from './src/calculators/tile';
import { roofing } from './src/calculators/roofing';
import { mulch } from './src/calculators/mulch';
import { boardFeet } from './src/calculators/boardFeet';

const show = (name: string, r: unknown) => console.log(name.padEnd(24), JSON.stringify(r));
show('concrete 10x10x4 80lb', concrete.compute({ length: 10, width: 10, depth: 4, bagSize: 80 }));
show('paint 40x8 2coats', paint.compute({ perimeter: 40, height: 8, coats: 2, doors: 0, windows: 0 }));
show('framing 20ft 16oc', framing.compute({ length: 20, spacing: 16 }));
show('drywall 48x8 4x8', drywall.compute({ perimeter: 48, height: 8, sheetSqFt: 32 }));
show('tile 10x8 12x12', tile.compute({ length: 10, width: 8, tileW: 12, tileH: 12 }));
show('roofing 2000 10%', roofing.compute({ area: 2000, waste: 10 }));
show('mulch 20x5x3', mulch.compute({ length: 20, width: 5, depth: 3 }));
show('bf 1x6x8 x10 $4', boardFeet.compute({ thickness: 1, width: 6, length: 8, qty: 10, price: 4 }));

// Shopping list aggregation check: two concrete pours + drywall merge correctly.
import { aggregateShoppingList } from './src/projects/ProjectsContext';
const items = [
  { id: '1', calcId: 'concrete', calcTitle: 'Concrete Slab', values: {}, savedAt: 0,
    results: concrete.compute({ length: 10, width: 10, depth: 4, bagSize: 80 }) },
  { id: '2', calcId: 'concrete', calcTitle: 'Concrete Slab', values: {}, savedAt: 0,
    results: concrete.compute({ length: 6, width: 4, depth: 4, bagSize: 80 }) },
  { id: '3', calcId: 'drywall', calcTitle: 'Drywall Sheets', values: {}, savedAt: 0,
    results: drywall.compute({ perimeter: 48, height: 8, sheetSqFt: 32 }) },
];
console.log('\nshopping list:', JSON.stringify(aggregateShoppingList(items), null, 1));
