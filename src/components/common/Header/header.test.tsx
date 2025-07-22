import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/providers/ThemeProvider';

const mockSignIn = jest.fn();
const mockUseSession = jest.fn();
const mockRouter = jest.fn();

jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouter }),
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
      expect(
        screen.getByTestId('ShoppingBasketOutlinedIcon')
      ).toBeInTheDocument();
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

    it('renders avatar link with correct href', () => {
      renderHeaderWithTheme();

      const avatarLink = screen.getByRole('link', { name: '' });
      expect(avatarLink).toHaveAttribute('href', '/products');
    });
  });
});
