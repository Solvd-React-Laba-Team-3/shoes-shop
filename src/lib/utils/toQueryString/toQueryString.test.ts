import { toQueryString } from './toQueryString';

describe('toQueryString', () => {
  it('returns empty string when called with undefined', () => {
    expect(toQueryString()).toBe('');
  });

  it('returns empty string when called with empty object', () => {
    expect(toQueryString({})).toBe('');
  });

  it('encodes simple key-value pairs', () => {
    expect(decodeURIComponent(toQueryString({ name: 'Test', age: 30 }))).toBe(
      '?name=Test&age=30'
    );
  });

  it('encodes boolean values', () => {
    expect(
      decodeURIComponent(toQueryString({ active: true, admin: false }))
    ).toBe('?active=true&admin=false');
  });

  it('skips null, undefined, or empty string values', () => {
    expect(toQueryString({ a: undefined, b: undefined, c: '' })).toBe('');
  });

  it('encodes nested objects using bracket notation', () => {
    expect(
      decodeURIComponent(
        toQueryString({ filter: { status: 'active', priority: 'high' } })
      )
    ).toBe('?filter[status]=active&filter[priority]=high');
  });

  it('handles arrays properly', () => {
    expect(
      decodeURIComponent(toQueryString({ tags: ['react', 'nextjs'] }))
    ).toBe('?tags=react&tags=nextjs');
  });

  it('skips empty arrays', () => {
    expect(toQueryString({ tags: [] })).toBe('');
  });

  it('handles deeply nested objects', () => {
    expect(
      decodeURIComponent(
        toQueryString({ filter: { user: { name: 'Test', role: 'admin' } } })
      )
    ).toBe('?filter[user][name]=Test&filter[user][role]=admin');
  });

  it('applies optional prefix to all keys', () => {
    expect(
      decodeURIComponent(toQueryString({ page: 1, limit: 10 }, 'pagination'))
    ).toBe('?pagination[page]=1&pagination[limit]=10');
  });

  it('combines all features in a complex object', () => {
    const input = {
      page: 1,
      filters: {
        category: ['books', 'tech'],
        price: { min: 10, max: 100 },
      },
      search: '',
      sort: undefined,
    };
    const output = decodeURIComponent(toQueryString(input));
    expect(output).toBe(
      '?page=1&filters[category]=books&filters[category]=tech&filters[price][min]=10&filters[price][max]=100'
    );
  });
});
