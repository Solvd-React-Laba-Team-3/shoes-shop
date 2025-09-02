/** @jest-environment jsdom */

import { isCypressTest } from './isCypressTest';

describe('isCypressTest', () => {
  afterEach(() => {
    // @ts-expect-error override for tests
    delete window.Cypress;
    // @ts-expect-error override for tests
    delete window.cy;
  });

  it('returns true when window.Cypress exists', () => {
    // @ts-expect-error override for tests
    window.Cypress = {};
    expect(isCypressTest()).toBe(true);
  });
  it('returns false when window.Cypress and window.CY do not exist', () => {
    // @ts-expect-error override for tests
    window.Cypress = undefined;
    // @ts-expect-error override for tests
    window.Cy = undefined;

    expect(isCypressTest()).toBe(false);
  });

  it('returns true when window.cy exists', () => {
    // @ts-expect-error override for tests
    window.cy = {};
    expect(isCypressTest()).toBe(true);
  });
});
