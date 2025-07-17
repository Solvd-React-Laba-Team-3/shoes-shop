import { render, screen, fireEvent } from '@testing-library/react';
import { SignUp } from './SignUp';

describe('SignUp', () => {
  test('renders all expected form fields and text', () => {
    render(<SignUp />);

    expect(
      screen.getByRole('heading', { name: /create an account/i })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Hayman Andrews')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@mail.com')).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText('at least 8 characters')
    ).toHaveLength(2);

    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
  });

  test('value of the input is updated correctly', () => {
    render(<SignUp />);
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0];

    fireEvent.change(nameInput, { target: { value: 'Olha Kucheruk' } });
    expect(nameInput).toHaveValue('Olha Kucheruk');
  });
});
