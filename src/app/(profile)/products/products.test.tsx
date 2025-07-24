import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MyProducts from './page';

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}));

describe('MyProducts', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockSession = {
    user: {
      username: 'testUser',
      avatar: {
        url: 'https://example.com/avatar.jpg',
      },
      createdAt: '2024-01-01',
      products: [
        {
          id: 1,
          name: 'Test Product',
          description: 'Test Description',
          price: 99,
        },
      ],
    },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSession as jest.Mock).mockReturnValue({ data: mockSession });
    ProductListMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with user information', () => {
    render(<MyProducts />);

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
    render(<MyProducts />);

    const banner = screen.getByAltText('My Products');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('src', '/profile-banner.png');
  });

  it('renders ProductList when user has products', () => {
    render(<MyProducts />);

    expect(screen.getByTestId('product-list')).toBeInTheDocument();
    expect(ProductListMock).toHaveBeenCalledWith({
      products: mockSession.user.products,
      type: 'actionMenu',
    });
  });

  it('renders empty state when user has no products', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        ...mockSession,
        user: {
          ...mockSession.user,
          products: [],
        },
      },
    });

    render(<MyProducts />);

    expect(
      screen.getByText("You don't have any products yet")
    ).toBeInTheDocument();
    expect(
      screen.getByText('Post can contain video, images and text.')
    ).toBeInTheDocument();
  });
});
