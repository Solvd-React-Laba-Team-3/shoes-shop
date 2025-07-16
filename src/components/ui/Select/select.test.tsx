import { render, screen, fireEvent } from '@testing-library/react';
import { Select, StyledMenuItem } from './Select';
import '@testing-library/jest-dom';

describe('Select component', () => {
  test('renders with correct selected value', () => {
    render(
      <Select value="male" onChange={() => {}}>
        <StyledMenuItem value="male">Male</StyledMenuItem>
        <StyledMenuItem value="female">Female</StyledMenuItem>
      </Select>
    );

    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  test('renders all options when select is open', () => {
    render(
      <Select value="" onChange={() => {}} displayEmpty>
        <StyledMenuItem value="" disabled>
          Select gender
        </StyledMenuItem>
        <StyledMenuItem value="male">Male</StyledMenuItem>
        <StyledMenuItem value="female">Female</StyledMenuItem>
      </Select>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    fireEvent.mouseDown(select);

    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
  });
});
