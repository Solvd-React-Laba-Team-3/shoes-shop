import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MyProducts from './page';

// Mock next-auth
jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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
  });

  it('displays product information correctly', () => {
    render(<MyProducts />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
  });

  it('renders profile banner image', () => {
    render(<MyProducts />);

    const banner = screen.getByAltText('My Products');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('src', '/profile-banner.png');
  });
});
