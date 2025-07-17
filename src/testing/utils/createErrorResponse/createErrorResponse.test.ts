import { createErrorResponse } from './createErrorResponse';

describe('createErrorResponse', () => {
  it('should create error response with default values', async () => {
    const response = createErrorResponse();
    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(response.statusText).toBe('Bad Request');
    expect(data.error).toEqual({
      status: 400,
      name: 'Bad Request',
      message: 'Bad Request',
      details: {},
    });
  });

  it('should create error response with custom values', async () => {
    const status = 404;
    const message = 'Not Found';
    const details = { id: 'missing-resource' };

    const response = createErrorResponse(status, message, details);
    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(status);
    expect(response.statusText).toBe(message);
    expect(data.error).toEqual({
      status,
      name: message,
      message,
      details,
    });
  });
});
