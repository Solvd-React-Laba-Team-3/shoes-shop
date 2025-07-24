import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from './Sidebar';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { mockSession, mockRouter } from '@/testing/mocks/';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: mockSession });
    (usePathname as jest.Mock).mockReturnValue('/products');
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
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
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
