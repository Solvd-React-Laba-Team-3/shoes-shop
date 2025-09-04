import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/providers/ThemeProvider';

const mockSignIn = jest.fn();
const mockUseSession = jest.fn();
const mockRouter = jest.fn();
const mockUseMediaQuery = jest.fn();

jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouter }),
  usePathname: () => '/',
}));

jest.mock('@/components/MainSearchBar', () => ({
  MainSearchBar: () => <div data-testid="main-search-bar">Search Bar</div>,
}));

const renderHeaderWithTheme = () => {
  return render(
    <ThemeProvider theme={theme}>
      <Header />
    </ThemeProvider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ data: null });
    });

    it('renders all main elements', () => {
      renderHeaderWithTheme();

      expect(screen.getByAltText('logo')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByTestId('main-search-bar')).toBeInTheDocument();
      expect(screen.getByTestId('LocalMallOutlinedIcon')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Sign in' })
      ).toBeInTheDocument();
    });

    it('renders logo link with correct href', () => {
      renderHeaderWithTheme();

      const logoLink = screen.getByRole('link', { name: 'logo' });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('does not render avatar when not logged in', () => {
      renderHeaderWithTheme();

      const avatar = document.querySelector('.MuiAvatar-root');
      expect(avatar).not.toBeInTheDocument();
    });

    it('navigates to sign in page when clicking sign in button', () => {
      renderHeaderWithTheme();

      const signInButton = screen.getByRole('button', { name: 'Sign in' });
      fireEvent.click(signInButton);

      expect(mockRouter).toHaveBeenCalledWith('/auth/sign-in?next=/');
    });

    it('navigates to cart page when clicking cart icon', () => {
      renderHeaderWithTheme();

      const cartButton = screen
        .getByTestId('LocalMallOutlinedIcon')
        .closest('button');
      fireEvent.click(cartButton!);

      expect(mockRouter).toHaveBeenCalledWith('/cart');
    });
  });

  describe('Test Menu Button', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ data: null });
      mockUseMediaQuery.mockReturnValue(true);
    });
    it('renders menu button on small screens', () => {
      renderHeaderWithTheme();

      const menuButton = screen.getByTestId('menu-button');
      expect(menuButton).toBeInTheDocument();
    });

    it('toggles sidebar when clicking menu button', () => {
      renderHeaderWithTheme();

      const menuButton = screen.getByTestId('menu-button');
      fireEvent.click(menuButton);

      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('when user is logged in', () => {
    const mockAvatarUrl = 'https://example.com/avatar.jpg';

    beforeEach(() => {
      mockUseSession.mockReturnValue({
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
      renderHeaderWithTheme();

      const avatar = screen
        .getByRole('link', { name: '' })
        .querySelector('.MuiAvatar-img');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', mockAvatarUrl);
    });

    it('does not render sign in button when logged in', () => {
      renderHeaderWithTheme();

      const signInButton = screen.queryByRole('button', { name: 'Sign in' });
      expect(signInButton).not.toBeInTheDocument();
    });

    it('renders avatar link with correct href when logged in', () => {
      renderHeaderWithTheme();

      const avatarLink = screen.getByRole('link', { name: '' });
      expect(avatarLink).toHaveAttribute('href', '/profile/products');
    });

    it('navigates to cart page when clicking cart icon', () => {
      renderHeaderWithTheme();

      const cartButton = screen
        .getByTestId('LocalMallOutlinedIcon')
        .closest('button');
      fireEvent.click(cartButton!);

      expect(mockRouter).toHaveBeenCalledWith('/cart');
    });
  });
});
