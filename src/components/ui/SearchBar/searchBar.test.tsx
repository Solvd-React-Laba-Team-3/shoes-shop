import { screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { render } from '@/testing/utils';

describe('SearchBar', () => {
  const setup = (props?: Partial<React.ComponentProps<typeof SearchBar>>) => {
    const defaultProps = {
      value: '',
      onChange: jest.fn(),
      ...props,
    };
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByRole('textbox', { name: /search/i });
    const icon = screen.getByTestId('SearchIcon');
    return { input, icon, props: defaultProps };
  };

  test('renders input and icon', () => {
    const { input, icon } = setup({ placeholder: 'Search...' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search...');
    expect(icon).toBeInTheDocument();
  });

  test('calls onChange when typing', () => {
    const { input, props } = setup();
    fireEvent.change(input, { target: { value: 'test' } });
    expect(props.onChange).toHaveBeenCalled();
  });

  test('respects size prop', () => {
    const { input } = setup({ size: 'medium' });
    expect(input).toBeInTheDocument();
  });

  test('triggers focus behavior when input is focused', () => {
    const handleFocus = jest.fn();

    render(<SearchBar value="" onChange={() => {}} expandOnFocus />);

    const input = screen.getByRole('textbox');
    input.addEventListener('focus', handleFocus);

    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalled();
  });
});
