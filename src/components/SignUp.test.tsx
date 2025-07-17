import { render, screen } from '@testing-library/react';
import { SignUp } from './SignUp';

describe('SignUp', () => {
  test('renders all expected form fields and text', () => {
    render(<SignUp />);

    expect(
      screen.getByRole('heading', { name: /create an account/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
  });
});
