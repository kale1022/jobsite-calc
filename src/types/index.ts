export interface CalcField {
  key: string;
  label: string;
  unit: string;
  placeholder?: string;
  /** Optional field — blank is treated as defaultValue (or 0). */
  optional?: boolean;
  defaultValue?: number;
}

export interface CalcSelectOption {
  label: string;
  value: number;
}

export interface CalcSelect {
  key: string;
  label: string;
  options: CalcSelectOption[];
  defaultValue: number;
}

export interface ResultLine {
  label: string;
  value: string;
  emphasis?: boolean;
  /** Marks a line as a purchasable quantity for project shopping lists. */
  shop?: boolean;
}

export interface SavedItem {
  id: string;
  calcId: string;
  calcTitle: string;
  values: Record<string, number>;
  results: ResultLine[];
  savedAt: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  items: SavedItem[];
}

export interface ShoppingLine {
  label: string;
  qty: number;
  unit: string;
  approx: boolean;
}

export interface CalculatorDef {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  premium: boolean;
  fields: CalcField[];
  selects?: CalcSelect[];
  /** Shown in small print under results, e.g. formula assumptions. */
  note?: string;
  compute: (values: Record<string, number>) => ResultLine[];
}
