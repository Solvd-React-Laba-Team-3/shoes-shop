import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';
import { MenuItem } from '../MenuItem/MenuItem';
import '@testing-library/jest-dom';

describe('Select component', () => {
  test('renders with correct selected value', () => {
    render(
      <Select value="male" onChange={() => {}}>
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
      </Select>
    );

    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  test('renders all options when select is open', () => {
    render(
      <Select value="" onChange={() => {}} displayEmpty>
        <MenuItem value="" disabled>
          Select gender
        </MenuItem>
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
      </Select>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    fireEvent.mouseDown(select);

    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
  });
});
