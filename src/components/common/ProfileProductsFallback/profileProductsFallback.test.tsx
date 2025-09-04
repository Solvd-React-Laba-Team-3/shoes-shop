import { render, screen } from '@testing-library/react';
import { ProfileProductsFallback } from './ProfileProductsFallback';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const renderWithTheme = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('ProfileProductsFallback', () => {
  it('renders styled profile wrapper', () => {
    renderWithTheme(<ProfileProductsFallback />);
    const wrapper = screen.getByTestId('profile-wrapper');
    expect(wrapper).toBeInTheDocument();
  });
});
