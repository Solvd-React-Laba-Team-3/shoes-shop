/**
 * Normalizes an array to a unique array of numbers.
 * @param value - The value to normalize.
 * @returns A unique array of numbers.
 */

export const normalizeToUniqueArray = (value: unknown): number[] => {
  if (Array.isArray(value)) return Array.from(new Set(value.map(Number)));
  if (value != null && value != undefined) return [Number(value)];

  return [];
};
