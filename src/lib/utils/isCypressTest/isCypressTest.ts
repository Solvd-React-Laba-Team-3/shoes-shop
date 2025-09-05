/**
 * Checks if the application is currently running in an E2E test environment
 * @returns {boolean} true if running in E2E test, false otherwise
 */
export const isCypressTest = (): boolean => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window as any).Cypress || !!(window as any).cy;
  }

  return false;
};
