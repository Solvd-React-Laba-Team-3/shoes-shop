import { render, screen } from '@testing-library/react';
import { ProductsContainer } from './ProductsContainer';
import {
  useSearchParams,
  useWishlist,
  useIntersectionObserver,
} from '@/lib/hooks';
import { getProductsOptions } from '@/api/products/getProductsOptions';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

jest.mock('@/lib/hooks');
jest.mock('@/api/products/getProductsOptions');
jest.mock('@tanstack/react-query');

const mockedUseSearchParams = useSearchParams as jest.Mock;
const mockedGetProductsOptions = getProductsOptions as jest.Mock;
const mockedUseSuspenseInfiniteQuery = useSuspenseInfiniteQuery as jest.Mock;
const mockedUseWishlist = useWishlist as jest.Mock;
const mockedUseIntersectionObserver = useIntersectionObserver as jest.Mock;

describe('<ProductsContainer />', () => {
  beforeEach(() => {
    mockedUseSuspenseInfiniteQuery.mockReturnValue({
      data: {
        pages: [
          {
            products: [
              { id: 1, name: 'Test Product', gender: 'Men', price: 10 },
            ],
          },
        ],
      },
    });

    mockedGetProductsOptions.mockReturnValue({
      queryKey: ['products'],
      queryFn: jest.fn(),
      initialPageParam: 0,
      getNextPageParam: jest.fn(),
    });

    mockedUseWishlist.mockReturnValue({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      isLoading: false,
    });
    mockedUseIntersectionObserver.mockReturnValue({
      ref: document.createElement('div'),
    });
  });

  it('should display "Catalog" when there is no search or filters', () => {
    const params = new URLSearchParams();
    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => params.get(key),
      set: jest.fn(),
      delete: jest.fn(),
      searchParams: params,
    });

    render(
      <ProductsContainer isFiltersOpen={false} onFiltersToggle={jest.fn()} />
    );
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.queryByText('Search Results')).not.toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should display "Search Results" when there is a search', () => {
    const params = new URLSearchParams();
    params.set('search', 'test');

    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => params.get(key),
      set: jest.fn(),
      delete: jest.fn(),
      searchParams: params,
    });

    render(
      <ProductsContainer isFiltersOpen={false} onFiltersToggle={jest.fn()} />
    );
    expect(screen.getByText('Search Results')).toBeInTheDocument();
    expect(screen.queryByText('Catalog')).not.toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
