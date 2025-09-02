import { normalizeToUniqueArray } from './normalizeUniqueArray';

describe('normalizeToUniqueArray', () => {
  it('should return unique numbers when input is an array of numbers', () => {
    expect(normalizeToUniqueArray([1, 2, 2, 3])).toEqual([1, 2, 3]);
  });

  it('should convert array of strings to numbers and remove duplicates', () => {
    expect(normalizeToUniqueArray(['1', '2', '2', '3'])).toEqual([1, 2, 3]);
  });

  it('should return single element array for a single number', () => {
    expect(normalizeToUniqueArray(5)).toEqual([5]);
  });

  it('should return single element array for a numeric string', () => {
    expect(normalizeToUniqueArray('42')).toEqual([42]);
  });

  it('should return empty array for null or undefined', () => {
    expect(normalizeToUniqueArray(null)).toEqual([]);
    expect(normalizeToUniqueArray(undefined)).toEqual([]);
  });

  it('should convert other types to number', () => {
    expect(normalizeToUniqueArray(true)).toEqual([1]); // true -> 1
    expect(normalizeToUniqueArray(false)).toEqual([0]); // false -> 0
    expect(normalizeToUniqueArray({})).toEqual([NaN]); // {} -> NaN
  });
});
