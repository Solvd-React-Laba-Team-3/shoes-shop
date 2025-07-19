import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from './page';

describe('SignUp', () => {
  test('renders all expected form fields and text', () => {
    render(<SignUp />);

    expect(
      screen.getByRole('heading', { name: /create an account/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument(); // "Password"
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
  });

  test('value of the input is updated correctly', () => {
    render(<SignUp />);
    const nameInput = screen.getByLabelText(/name/i);

    fireEvent.change(nameInput, { target: { value: 'Olha Kucheruk' } });
    expect(nameInput).toHaveValue('Olha Kucheruk');
  });
});
