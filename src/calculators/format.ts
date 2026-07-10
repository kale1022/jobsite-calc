/** Format a number to at most `digits` decimals, trimming trailing zeros. */
export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return parseFloat(n.toFixed(digits)).toLocaleString('en-US', {
    maximumFractionDigits: digits,
  });
}
