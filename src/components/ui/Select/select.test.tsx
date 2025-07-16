import { render, screen, fireEvent } from '@testing-library/react';
import { BasicSelect } from './Select';

describe('DasicSelect', () => {
  test('renders with correct selected value', () => {
    render(<BasicSelect value="male" label="gender" />);

    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  test('renders label correctly', () => {
    render(<BasicSelect value="female" label="Gender" />);

    expect(screen.getByText('Gender')).toBeInTheDocument();
  });

  test('renders all options when select is open', () => {
    render(<BasicSelect value="" label="Gender" id="gender" displayEmpty />);

    const label = screen.getByText('Gender');
    const select = label.parentElement?.querySelector('[role="combobox"]');

    expect(select).toBeTruthy();

    fireEvent.mouseDown(select as Element);

    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
  });
});
