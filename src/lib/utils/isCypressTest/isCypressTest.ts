/**
 * Checks if the application is currently running in an E2E test environment
 * @returns {boolean} true if running in E2E test, false otherwise
 */
export const isCypressTest = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!window.Cypress || !!window.cy;
  }

  return false;
};
