import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from './';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useDeviceSize } from '@/lib/hooks';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/lib/hooks', () => ({
  useDeviceSize: jest.fn(),
}));

describe('Sidebar', () => {
  const mockSession = {
    user: {
      username: 'John Doe',
      avatar: { url: 'avatar.jpg' },
    },
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: mockSession });
    (usePathname as jest.Mock).mockReturnValue('/profile/products');
    (useDeviceSize as jest.Mock).mockReturnValue({ isMobile: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user name from session', () => {
    render(<Sidebar />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays all navigation links', () => {
    render(<Sidebar />);
    const expectedLinks = [
      'My Products',
      'Order history',
      'My Wishlist',
      'Recently viewed',
      'Settings',
    ];
    expectedLinks.forEach((linkText) => {
      expect(
        screen.getByRole('link', { name: new RegExp(linkText, 'i') })
      ).toBeInTheDocument();
    });
  });

  it('handles logout correctly', () => {
    render(<Sidebar />);
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    expect(signOut).toHaveBeenCalled();
  });

  it('renders Sign in link when no session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Sidebar />);
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders drawer as persistent on desktop', () => {
    (useDeviceSize as jest.Mock).mockReturnValue({ isMobile: false });
    render(<Sidebar />);
    // The close button should not exist on desktop
    expect(
      screen.queryByRole('button', { name: /close/i })
    ).not.toBeInTheDocument();
  });

  it('renders avatar image when session has avatar', () => {
    render(<Sidebar />);
    const avatarImg = screen.getByRole('img', { name: /avatar/i });
    expect(avatarImg).toHaveAttribute('src', 'avatar.jpg');
  });

  it('does not render links when no session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Sidebar />);
    const navLinks = screen.queryAllByRole('link');
    expect(
      navLinks.some((link) => /my products/i.test(link.textContent || ''))
    ).toBe(false);
  });
});
