import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/providers/ThemeProvider';
import { Loading } from './Loading';

const renderLoadingWithTheme = (fullScreen?: boolean) => {
  return render(
    <ThemeProvider theme={theme}>
      <Loading fullScreen={fullScreen} />
    </ThemeProvider>
  );
};

describe('Loading component', () => {
  it('renders the CircularProgress', () => {
    renderLoadingWithTheme();
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('renders the "Loading..." text', () => {
    renderLoadingWithTheme();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the Box container with full viewport height when fullScreen is true', () => {
    renderLoadingWithTheme(true);
    const box = screen.getByText('Loading...').parentElement;
    expect(box).toHaveStyle('height: 100vh');
  });

  it('renders the Box container with 100% height by default', () => {
    renderLoadingWithTheme();
    const box = screen.getByText('Loading...').parentElement;
    expect(box).toHaveStyle('height: 100%');
  });
});
