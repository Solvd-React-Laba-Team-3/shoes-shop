import { fireEvent, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MyProducts from './page';
import { useSuspenseQuery } from '@tanstack/react-query';
import { render } from '@/testing/utils';
import { productMock, sessionMock } from '@/testing/mocks';

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useSuspenseQuery: jest.fn(),
}));

jest.mock('../../../../public/profile-banner.png', () => ({
  src: '/profile-banner.png',
}));

const ProductListMock = jest.fn();
jest.mock('@/components/ProductList', () => ({
  ProductList: (props: unknown) => {
    ProductListMock(props);
    return <div data-testid="product-list" />;
  },
}));

describe('MyProducts', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockProducts = [productMock];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSession as jest.Mock).mockReturnValue({ data: sessionMock });
    (useSuspenseQuery as jest.Mock).mockReturnValue({ data: mockProducts });
    ProductListMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with user information', () => {
    render(<MyProducts />, { isLoggedIn: true });

    expect(screen.getByText('testuser')).toBeInTheDocument();
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
    render(<MyProducts />, { isLoggedIn: true });

    const banner = screen.getByAltText('My Products');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('src', '/profile-banner.png');
  });

  it('renders ProductList when user has products', () => {
    render(<MyProducts />, { isLoggedIn: true });

    expect(screen.getByTestId('product-list')).toBeInTheDocument();
    expect(screen.getByText(productMock.name)).toBeInTheDocument();
  });

  it('renders empty state when user has no products', () => {
    (useSuspenseQuery as jest.Mock).mockReturnValue({ data: [] });

    render(<MyProducts />, { isLoggedIn: true });

    expect(
      screen.getByText("You don't have any products yet")
    ).toBeInTheDocument();
    expect(
      screen.getByText('Start adding products to your profile')
    ).toBeInTheDocument();
  });

  it('navigates to create product page when top Add Product button is clicked', () => {
    render(<MyProducts />, { isLoggedIn: true });

    const addButton = screen.getAllByRole('button', { name: 'Add Product' })[0];
    fireEvent.click(addButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/profile/products/create');
  });

  it('navigates to create product page when bottom Add Product button is clicked in empty state', async () => {
    (useSuspenseQuery as jest.Mock).mockReturnValue({ data: [] });
    render(<MyProducts />, { isLoggedIn: true });

    const addButton = screen.getAllByRole('button', { name: 'Add Product' })[1];
    fireEvent.click(addButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/profile/products/create');
  });

  it('formats joined date correctly when createdAt is defined', () => {
    render(<MyProducts />, { isLoggedIn: true });

    const joinedText = screen.getByText(/^Joined in/);
    const date = new Date(sessionMock.user.createdAt).toLocaleDateString();
    expect(joinedText).toHaveTextContent(`Joined in ${date}`);
  });

  it('renders correctly when createdAt is undefined', () => {
    const mockSessionNoDate = {
      user: { ...sessionMock.user, createdAt: undefined },
    };
    (useSession as jest.Mock).mockReturnValue({ data: mockSessionNoDate });

    render(<MyProducts />, { isLoggedIn: true });

    const joinedText = screen.getByText(/^Joined in/);
    expect(joinedText).toHaveTextContent('Joined in');
  });
});
