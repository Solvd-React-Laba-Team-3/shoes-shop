/**
 * Formats an ISO date string into a human-readable date string.
 *
 * @param isoDateString - The ISO date string to format.
 * @param format - The desired output format. Can be:
 *   - 'dd.mm.yyyy': Returns the date in the format 'day.month.year' (e.g., '05.06.2024').
 *   - 'dayMonthNameYear': Returns the date in the format 'day MonthName year' (e.g., '05 June 2024').
 *   Defaults to 'dd.mm.yyyy'.
 * @returns The formatted date string, or an empty string if the input is invalid.
 */

export const formatDate = (
  isoDateString: string,
  format: 'dd.mm.yyyy' | 'dayMonthNameYear' = 'dd.mm.yyyy'
): string => {
  if (!isoDateString || typeof isoDateString !== 'string') {
    return '';
  }

  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  if (format === 'dd.mm.yyyy') {
    return `${day}.${month}.${year}`;
  }

  if (format === 'dayMonthNameYear') {
    const monthName = date.toLocaleString('en-US', {
      month: 'long',
      timeZone: 'UTC',
    });
    return `${day} ${monthName} ${year}`;
  }

  return '';
};
