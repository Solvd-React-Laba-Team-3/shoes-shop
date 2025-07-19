import { render, screen } from '@testing-library/react';
import { AuthImagePanel } from './AuthImagePanel';
import '@testing-library/jest-dom';

describe('AuthImagePanel', () => {
  it('renders without crashing', () => {
    render(<AuthImagePanel />);

    const image = screen.getByAltText('login');
    expect(image).toBeInTheDocument();
  });

  it('renders the correct image with the alt text', () => {
    render(<AuthImagePanel />);

    const image = screen.getByAltText('login') as HTMLImageElement;

    expect(image).toBeInTheDocument();
    expect(image.src).toContain('login.jpg');
  });

  it('aplies the correct styles to the wrapper box', () => {
    const { container } = render(<AuthImagePanel />);

    const box = container.firstChild;
    expect(box).toHaveStyle({
      height: '100vh',
      position: 'relative',
    });
  });
});
