import { render, screen, fireEvent } from '@testing-library/react';
import { Link } from './Link';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/providers/ThemeProvider';

describe('Link component', () => {
  it('renders with correct text', () => {
    render(<Link href="/test">Test Link</Link>);
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('renders with correct href', () => {
    render(<Link href="/test">Test Link</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(
      <Link href="/test" onClick={handleClick}>
        Clickable Link
      </Link>
    );
    fireEvent.click(screen.getByText('Clickable Link'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('applies active styles when active prop is true', () => {
    render(
      <ThemeProvider theme={theme}>
        <Link href="/test" active>
          Active Link
        </Link>
      </ThemeProvider>
    );
    const linkElement = screen.getByText('Active Link');
    expect(linkElement).toHaveStyle('color: rgb(254, 100, 94)');
  });

  it('renders children correctly', () => {
    render(
      <Link href="/test">
        <span>Child Element</span>
      </Link>
    );
    expect(screen.getByText('Child Element')).toBeInTheDocument();
  });

  it('is accessible by role', () => {
    render(<Link href="/test">Accessible Link</Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
  it('applies correct styles based on size prop', () => {
    render(
      <ThemeProvider theme={theme}>
        <Link href="/test" size="small">
          Small Link
        </Link>
      </ThemeProvider>
    );
    const linkElement = screen.getByText('Small Link');
    expect(linkElement).toHaveStyle('font-size: 15px');
    expect(linkElement).toHaveStyle('font-weight: 600');
  });
  it('applies default styles when no size prop is provided', () => {
    render(
      <ThemeProvider theme={theme}>
        <Link href="/test">Default Size Link</Link>
      </ThemeProvider>
    );
    const linkElement = screen.getByText('Default Size Link');
    expect(linkElement).toHaveStyle('font-size: 16px');
    expect(linkElement).toHaveStyle('font-weight: 500');
  });
});
