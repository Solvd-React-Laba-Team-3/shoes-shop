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
