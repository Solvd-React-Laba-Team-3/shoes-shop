import { render, screen } from '@testing-library/react';
import { AuthContainer } from './AuthContainer';

describe('AuthContainer', () => {
  it('renders title', () => {
    render(
      <AuthContainer title="Login">
        <div>Form content</div>
      </AuthContainer>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Login'
    );
  });

  it('renders description if provided', () => {
    render(
      <AuthContainer title="Login" description="Please enter your credentials">
        <div>Form content</div>
      </AuthContainer>
    );

    expect(
      screen.getByText('Please enter your credentials')
    ).toBeInTheDocument();
  });

  it('does not render description if not provided', () => {
    render(
      <AuthContainer title="Login">
        <div>Form content</div>
      </AuthContainer>
    );

    const description = screen.queryByText('Please enter your credentials');
    expect(description).not.toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <AuthContainer title="Login">
        <div data-testid="form-content">Form content</div>
      </AuthContainer>
    );

    expect(screen.getByTestId('form-content')).toHaveTextContent(
      'Form content'
    );
  });

  it('renders footer if provided', () => {
    render(
      <AuthContainer
        title="Login"
        footer={<div data-testid="footer">Footer content</div>}
      >
        <div>Form content</div>
      </AuthContainer>
    );

    expect(screen.getByTestId('footer')).toHaveTextContent('Footer content');
  });

  it('does not render footer if not provided', () => {
    render(
      <AuthContainer title="Login">
        <div>Form content</div>
      </AuthContainer>
    );

    const footer = screen.queryByTestId('footer');
    expect(footer).not.toBeInTheDocument();
  });
});
