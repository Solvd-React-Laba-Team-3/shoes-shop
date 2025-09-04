import { screen } from '@testing-library/react';
import { Loading } from './Loading';
import { render } from '@/testing/utils';

describe('Loading component', () => {
  it('renders the CircularProgress', () => {
    render(<Loading />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('renders the "Loading..." text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the Box container with full viewport height when fullScreen is true', () => {
    render(<Loading fullScreen={true} />);
    const box = screen.getByText('Loading...').parentElement;
    expect(box).toHaveStyle('height: 100vh');
  });

  it('renders the Box container with 100% height by default', () => {
    render(<Loading />);
    const box = screen.getByText('Loading...').parentElement;
    expect(box).toHaveStyle('height: 100%');
  });
});
