import { formatDate } from './formatDate';

describe('formatDate', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-06-06T00:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return empty string for falsy values', () => {
    expect(formatDate('')).toBe('');
  });

  it('should return empty string for invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('');
    expect(formatDate('2024-13-40')).toBe('');
  });

  it('should format a valid date with default dd.mm.yyyy', () => {
    const result = formatDate('2024-06-05T00:00:00Z');
    expect(result).toBe('05.06.2024');
  });

  it('should format a valid date with dayMonthNameYear', () => {
    const result = formatDate('2024-06-05T00:00:00Z', 'dayMonthNameYear');
    expect(result).toBe('05 June 2024');
  });

  it('should pad single digit day and month with zeros', () => {
    const result = formatDate('2024-01-03T00:00:00Z');
    expect(result).toBe('03.01.2024');
  });

  it('should return empty string if unknown format is provided (safety fallback)', () => {
    // @ts-expect-error testing invalid format
    expect(formatDate('2024-06-05', 'invalidFormat')).toBe('');
  });
});
