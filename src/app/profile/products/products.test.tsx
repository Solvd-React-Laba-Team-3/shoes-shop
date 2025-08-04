import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MyProducts from './page';
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from '@tanstack/react-query';

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useSuspenseQuery: jest.fn(),
}));

const ProductListMock = jest.fn();
jest.mock('@/components/ProductList', () => ({
  ProductList: (props: unknown) => {
    ProductListMock(props);
    return <div data-testid="product-list" />;
  },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string | { src: string };
    alt: string;
    width: number;
    height: number;
  }) => {
    const imgSrc = typeof src === 'object' ? src.src : src;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imgSrc} alt={alt} width={width} height={height} />;
  },
}));

jest.mock('../../../../public/profile-banner.png', () => ({
  src: '/profile-banner.png',
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe('MyProducts', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockProducts = [
    {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 99,
    },
  ];

  const mockSession = {
    user: {
      username: 'testUser',
      avatar: {
        url: 'https://example.com/avatar.jpg',
      },
      createdAt: '2024-01-01',
      accessToken: 'test-token',
    },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSession as jest.Mock).mockReturnValue({ data: mockSession });
    (useSuspenseQuery as jest.Mock).mockReturnValue({ data: mockProducts });
    ProductListMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with user information', () => {
    render(<MyProducts />, { wrapper: createWrapper() });

    expect(screen.getByText('testUser')).toBeInTheDocument();
    expect(screen.getByAltText('Avatar')).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg'
    );
    expect(screen.getByText('My Products')).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.startsWith('Joined in'))
    ).toBeInTheDocument();
  });

  it('renders profile banner image', () => {
    render(<MyProducts />, { wrapper: createWrapper() });

    const banner = screen.getByAltText('My Products');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('src', '/profile-banner.png');
  });

  it('renders ProductList when user has products', () => {
    render(<MyProducts />, { wrapper: createWrapper() });

    expect(screen.getByTestId('product-list')).toBeInTheDocument();
    expect(ProductListMock).toHaveBeenCalledWith({
      products: mockProducts,
      type: 'actionMenu',
    });
  });

  it('renders empty state when user has no products', () => {
    (useSuspenseQuery as jest.Mock).mockReturnValue({ data: [] });

    render(<MyProducts />, { wrapper: createWrapper() });

    expect(
      screen.getByText("You don't have any products yet")
    ).toBeInTheDocument();
    expect(
      screen.getByText('Start adding products to your profile')
    ).toBeInTheDocument();
  });
});
