import { createSuccessResponse } from './createSuccessResponse';

describe('createSuccessResponse', () => {
  it('should create a successful response with the provided data', () => {
    const testData = { id: 1, name: 'Test' };
    const response = createSuccessResponse(testData);

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
  });

  it('should resolve json() with the provided data', async () => {
    const testData = { id: 1, name: 'Test' };
    const response = createSuccessResponse(testData);

    const result = await response.json();
    expect(result).toEqual(testData);
  });

  it('should work with different data types', () => {
    const testCases = [123, 'test string', [1, 2, 3], { key: 'value' }, null];

    testCases.forEach((testData) => {
      const response = createSuccessResponse(testData);
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
    });
  });
});
