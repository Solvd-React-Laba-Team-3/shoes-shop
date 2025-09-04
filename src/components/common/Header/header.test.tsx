import { screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { render } from '@/testing/utils';

const signInMock = jest.fn();
const useSessionMock = jest.fn();
const useRouterMock = jest.fn();
const useMediaQueryMock = jest.fn();

jest.mock('next-auth/react', () => ({
  useSession: () => useSessionMock(),
  signIn: (...args: unknown[]) => signInMock(...args),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: useRouterMock }),
  usePathname: () => '/',
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      useSessionMock.mockReturnValue({ data: null });
    });

    it('renders all main elements', () => {
      render(<Header />);

      expect(screen.getByAltText('logo')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByTestId('main-search-bar')).toBeInTheDocument();
      expect(screen.getByTestId('LocalMallOutlinedIcon')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Sign in' })
      ).toBeInTheDocument();
    });

    it('renders logo link with correct href', () => {
      render(<Header />);

      const logoLink = screen.getByRole('link', { name: 'logo' });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('does not render avatar when not logged in', () => {
      render(<Header />);

      const avatar = document.querySelector('.MuiAvatar-root');
      expect(avatar).not.toBeInTheDocument();
    });

    it('navigates to sign in page when clicking sign in button', () => {
      render(<Header />);

      const signInButton = screen.getByRole('button', { name: 'Sign in' });
      fireEvent.click(signInButton);

      expect(useRouterMock).toHaveBeenCalledWith('/auth/sign-in?next=/');
    });

    it('navigates to cart page when clicking cart icon', () => {
      render(<Header />);

      const cartButton = screen
        .getByTestId('LocalMallOutlinedIcon')
        .closest('button');
      fireEvent.click(cartButton!);

      expect(useRouterMock).toHaveBeenCalledWith('/cart');
    });
  });

  describe('Test Menu Button', () => {
    beforeEach(() => {
      useSessionMock.mockReturnValue({ data: null });
      useMediaQueryMock.mockReturnValue(true);
    });
    it('renders menu button on small screens', () => {
      render(<Header />);

      const menuButton = screen.getByTestId('menu-button');
      expect(menuButton).toBeInTheDocument();
    });

    it('toggles sidebar when clicking menu button', () => {
      render(<Header />);

      const menuButton = screen.getByTestId('menu-button');
      fireEvent.click(menuButton);

      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('when user is logged in', () => {
    const mockAvatarUrl = 'https://example.com/avatar.jpg';

    beforeEach(() => {
      useSessionMock.mockReturnValue({
        data: {
          user: {
            avatar: {
              url: mockAvatarUrl,
            },
          },
        },
      });
    });

    it('renders avatar with correct image when logged in', () => {
      render(<Header />);

      const avatar = screen
        .getByRole('link', { name: '' })
        .querySelector('.MuiAvatar-img');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', mockAvatarUrl);
    });

    it('does not render sign in button when logged in', () => {
      render(<Header />);

      const signInButton = screen.queryByRole('button', { name: 'Sign in' });
      expect(signInButton).not.toBeInTheDocument();
    });

    it('renders avatar link with correct href when logged in', () => {
      render(<Header />);

      const avatarLink = screen.getByRole('link', { name: '' });
      expect(avatarLink).toHaveAttribute('href', '/profile/products');
    });

    it('navigates to cart page when clicking cart icon', () => {
      render(<Header />);

      const cartButton = screen
        .getByTestId('LocalMallOutlinedIcon')
        .closest('button');
      fireEvent.click(cartButton!);

      expect(useRouterMock).toHaveBeenCalledWith('/cart');
    });
  });
});
