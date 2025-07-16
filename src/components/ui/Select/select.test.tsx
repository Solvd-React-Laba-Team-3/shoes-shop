import { render, screen } from '@testing-library/react';
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
});
