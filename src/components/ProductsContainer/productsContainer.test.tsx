import { render, screen } from '@testing-library/react';
import { ProductsContainer } from './ProductsContainer';
import { useSearchParams } from '@/lib/hooks';
import { getProductsOptions } from '@/api/products/getProductsOptions';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

jest.mock('@/lib/hooks');
jest.mock('@/api/products/getProductsOptions');
jest.mock('@tanstack/react-query');

const mockedUseSearchParams = useSearchParams as jest.Mock;
const mockedGetProductsOptions = getProductsOptions as jest.Mock;
const mockedUseSuspenseInfiniteQuery = useSuspenseInfiniteQuery as jest.Mock;

describe('<ProductsContainer />', () => {
  beforeEach(() => {
    mockedUseSuspenseInfiniteQuery.mockReturnValue({
      data: {
        pages: [
          {
            products: [{ id: 1, name: 'Tênis XPTO', gender: 'Men', price: 10 }],
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
  });

  it('deve exibir "Catalog" quando não houver search ou filters', () => {
    mockedUseSearchParams.mockReturnValue({
      searchParams: new URLSearchParams(),
    });

    render(<ProductsContainer />);
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.queryByText('Search Results')).not.toBeInTheDocument();
    expect(screen.getByText('Tênis XPTO')).toBeInTheDocument();
  });

  it('deve exibir "Search Results" quando houver search', () => {
    const params = new URLSearchParams();
    params.set('search', 'tenis');

    mockedUseSearchParams.mockReturnValue({
      searchParams: params,
    });

    render(<ProductsContainer />);
    expect(screen.getByText('Search Results')).toBeInTheDocument();
    expect(screen.queryByText('Catalog')).not.toBeInTheDocument();
    expect(screen.getByText('Tênis XPTO')).toBeInTheDocument();
  });
});
