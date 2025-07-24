import { flattenStrapiData } from './flattenStrapiData';

describe('flattenStrapiData', () => {
  it('should flatten a single StrapiResponse', () => {
    const data = {
      id: 1,
      attributes: { name: 'Shoe', price: 120 },
    };

    const result = flattenStrapiData(data);

    expect(result).toEqual({
      id: 1,
      name: 'Shoe',
      price: 120,
    });
  });

  it('should flatten a StrapiPaginatedData array', () => {
    const data = {
      data: [
        { id: 1, attributes: { name: 'Shoe' } },
        { id: 2, attributes: { name: 'Hat' } },
      ],
      meta: { pagination: { page: 1, pageSize: 2, pageCount: 1, total: 2 } },
    };

    const result = flattenStrapiData(data);

    expect(result).toEqual([
      { id: 1, name: 'Shoe' },
      { id: 2, name: 'Hat' },
    ]);
  });

  it('should flatten a single item inside data', () => {
    const data = { id: 3, attributes: { title: 'Jacket' } };

    const result = flattenStrapiData(data);

    expect(result).toEqual({
      id: 3,
      title: 'Jacket',
    });
  });
});
