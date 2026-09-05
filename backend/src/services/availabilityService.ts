const normalized = (value: string) => value.trim().toLowerCase();

export function compareAvailability(requested: string[] = [], offered: string[] = []) {
  if (!requested.length || !offered.length) return 5;
  const offeredValues = offered.map(normalized);
  const matches = requested.filter((slot) => offeredValues.some((value) => value === normalized(slot) || value.includes(normalized(slot)) || normalized(slot).includes(value))).length;
  if (!matches) return 0;
  return matches === requested.length ? 10 : 5;
}
