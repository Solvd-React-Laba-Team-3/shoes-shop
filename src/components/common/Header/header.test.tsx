import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/providers/ThemeProvider';

const mockUseSession = jest.fn();
jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
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
      expect(screen.getByTestId('ShoppingBasketIcon')).toBeInTheDocument();
      expect(document.querySelector('.MuiAvatar-root')).toBeInTheDocument();
    });

    it('renders logo link with correct href', () => {
      renderHeaderWithTheme();

      const logoLink = screen.getByRole('link', { name: 'logo' });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('renders avatar as div when not logged in', () => {
      renderHeaderWithTheme();

      const avatar = document.querySelector('.MuiAvatar-root');
      expect(avatar).toBeInTheDocument();
      expect(avatar?.tagName).toBe('DIV');
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: { user: { name: 'John Doe', email: 'john@example.com' } },
      });
    });

    it('renders avatar with image when logged in', () => {
      renderHeaderWithTheme();

      const avatarImg = document.querySelector('.MuiAvatar-root img');
      expect(avatarImg).toBeInTheDocument();
      expect(avatarImg).toHaveAttribute('src', '/avatar-placeholder.png');
    });

    it('still renders all other elements correctly when logged in', () => {
      renderHeaderWithTheme();

      expect(screen.getByAltText('logo')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByTestId('ShoppingBasketIcon')).toBeInTheDocument();
    });
  });
});
