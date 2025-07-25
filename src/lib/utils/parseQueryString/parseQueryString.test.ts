import { parseQueryString } from './parseQueryString';

describe('parseQueryString', () => {
  it('parses simple key-value pairs', () => {
    expect(parseQueryString('?name=Jeff&age=30')).toEqual({
      name: 'Jeff',
      age: '30',
    });
  });

  it('parses without a leading ?', () => {
    expect(parseQueryString('name=Jeff')).toEqual({ name: 'Jeff' });
  });

  it('parses nested keys using bracket notation', () => {
    expect(parseQueryString('?filter[user][id]=42')).toEqual({
      filter: {
        user: {
          id: '42',
        },
      },
    });
  });

  it('parses multiple nested keys', () => {
    const result = parseQueryString('?a[b][c]=123&a[b][d]=456');
    expect(result).toEqual({
      a: {
        b: {
          c: '123',
          d: '456',
        },
      },
    });
  });

  it('parses comma-separated arrays', () => {
    expect(parseQueryString('?tags=react&tags=nextjs&tags=ts')).toEqual({
      tags: ['react', 'nextjs', 'ts'],
    });
  });

  it('handles a mix of nesting and arrays', () => {
    const result = parseQueryString(
      '?filter[ids]=1&filter[ids]=2&filter[ids]=3&filter[status]=active'
    );
    expect(result).toEqual({
      filter: {
        ids: ['1', '2', '3'],
        status: 'active',
      },
    });
  });

  it('returns empty object for empty string', () => {
    expect(parseQueryString('')).toEqual({});
  });

  it('preserves type as string even for numeric-looking values', () => {
    expect(parseQueryString('?x=001')).toEqual({ x: '001' });
  });
});
