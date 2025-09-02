/** @jest-environment node */

import { isCypressTest } from './isCypressTest';

describe('isCypressTest on Node environment', () => {
  it('returns false when window is undefined (Node environment)', () => {
    const originalWindow = global.window;
    // @ts-expect-error simulate Node
    window = undefined;
    console.log(typeof window);

    expect(isCypressTest()).toBe(false);

    global.window = originalWindow;
  });
});
