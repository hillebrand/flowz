/**
 * Returns the local date as YYYY-MM-DD.
 * Using toISOString() returns UTC and can give the wrong date in non-UTC timezones.
 */
export function toLocalDateStr(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
