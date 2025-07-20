import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/utils';
import { getProductOptions } from './getProductOptions';
import { createSuccessResponse, createWrapper } from '@/testing/utils';
import { StrapiSingleData } from '@/types/api/StrapiSingleData';
import { ProductAttributes } from '@/types/api/ProductAttributes';

jest.mock('@/lib/utils/fetchApi/fetchApi');
const mockedFetchApi = fetchApi as jest.Mock;

describe('getProductOptions', () => {
  it('fetches a single product successfully', async () => {
    const mockResponse: StrapiSingleData<ProductAttributes> = {
      data: {
        id: 123,
        attributes: {
          name: 'Single Product',
          description: 'Single Desc',
          price: 150,
          teamName: 'team-1',
          images: {
            data: [
              {
                id: 10,
                attributes: {
                  id: 10,
                  url: '/uploads/image.jpg',
                  alternativeText: 'Sample Image',
                  caption: null,
                  width: 100,
                  height: 100,
                  formats: {},
                  hash: 'hash',
                  ext: '.jpg',
                  mime: 'image/jpeg',
                  size: 123,
                  previewUrl: null,
                  provider: 'local',
                  provider_metadata: {
                    public_id: 'some_id',
                    resource_type: 'image',
                  },
                  name: 'image.jpg',
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
                name: 'male',
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
    };

    mockedFetchApi.mockResolvedValueOnce(
      await createSuccessResponse(mockResponse).json()
    );

    const { result } = renderHook(() => useQuery(getProductOptions(123)), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe(123);
    expect(result.current.data?.name).toBe('Single Product');
  });

  it('handles API errors correctly', async () => {
    mockedFetchApi.mockRejectedValueOnce(new Error('Not Found'));

    const { result } = renderHook(() => useQuery(getProductOptions(999)), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Not Found');
  });
});
