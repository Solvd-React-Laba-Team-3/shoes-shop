import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils';
import { getProductsOptions } from './getProductsOptions';
import { createSuccessResponse, createWrapper } from '@/testing/utils';
import { StrapiPaginatedData } from '@/types/api/StrapiPaginatedData';
import { ProductAttributes } from '@/types/api/ProductAttributes';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('getProductsOptions', () => {
  it('fetches products successfully', async () => {
    const mockResponse: StrapiPaginatedData<ProductAttributes> = {
      data: [
        {
          id: 1,
          attributes: {
            name: 'Product 1',
            description: 'Desc 1',
            price: 100,
            teamName: 'team-1',
            images: {
              data: [
                {
                  id: 10,
                  attributes: {
                    id: 10,
                    name: 'image.jpg',
                    alternativeText: null,
                    caption: null,
                    width: 100,
                    height: 100,
                    formats: {},
                    hash: 'hash',
                    ext: '.jpg',
                    mime: 'image/jpeg',
                    size: 123,
                    url: '/img.jpg',
                    previewUrl: null,
                    provider: 'local',
                    provider_metadata: {
                      public_id: 'some_id',
                      resource_type: 'image',
                    },
                    createdAt: '2023-01-01',
                    updatedAt: '2023-01-02',
                  },
                },
              ],
            },
            brand: {
              data: {
                id: 1,
                attributes: {
                  name: 'Brand 1',
                  createdAt: '2023-01-01',
                  updatedAt: '2023-01-02',
                  publishedAt: '2023-01-03',
                },
              },
            },
            categories: {
              data: [
                {
                  id: 1,
                  attributes: {
                    name: 'Category 1',
                    createdAt: '2023-01-01',
                    updatedAt: '2023-01-02',
                    publishedAt: '2023-01-03',
                  },
                },
              ],
            },
            color: {
              data: {
                id: 1,
                attributes: {
                  name: 'Red',
                  createdAt: '2023-01-01',
                  updatedAt: '2023-01-02',
                  publishedAt: '2023-01-03',
                },
              },
            },
            gender: {
              data: {
                id: 1,
                attributes: {
                  name: 'Unisex',
                  createdAt: '2023-01-01',
                  updatedAt: '2023-01-02',
                  publishedAt: '2023-01-03',
                },
              },
            },
            sizes: {
              data: [
                {
                  id: 1,
                  attributes: {
                    value: 42,
                    createdAt: '2023-01-01',
                    updatedAt: '2023-01-02',
                    publishedAt: '2023-01-03',
                  },
                },
              ],
            },
          },
        },
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 1,
        },
      },
    };

    mockedFetchApi.mockResolvedValueOnce(
      await createSuccessResponse(mockResponse).json()
    );

    const { result } = renderHook(
      () =>
        useQuery(getProductsOptions({ pagination: { page: 1, pageSize: 10 } })),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.products).toHaveLength(1);
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockRejectedValueOnce(new Error('Something went wrong'));

    const { result } = renderHook(
      () =>
        useQuery(getProductsOptions({ pagination: { page: 1, pageSize: 10 } })),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Something went wrong');
  });
});
