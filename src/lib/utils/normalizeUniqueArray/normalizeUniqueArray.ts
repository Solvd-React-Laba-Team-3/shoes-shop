export const normalizeToUniqueArray = (value: unknown): number[] => {
  if (Array.isArray(value)) return Array.from(new Set(value.map(Number)));
  if (value != null && value != undefined) return [Number(value)];

  return [];
};
