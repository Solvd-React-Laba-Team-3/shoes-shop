import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession, signOut } from 'next-auth/react';
import Settings from './page';
import { useUpdateProfile } from '@/api/profile/useUpdateProfile';
import { useUploadFile } from '@/api/uploadFile/useUploadFile';
import { useChangePassword } from '@/api/profile/useChangePassword';
import { sessionMock } from '@/testing/mocks';

jest.mock('next-auth/react');
jest.mock('@/api/profile/useUpdateProfile');
jest.mock('@/api/uploadFile/useUploadFile');
jest.mock('@/api/profile/useChangePassword');

describe('Settings Page', () => {
  const updateProfileMock = jest.fn();
  const uploadFileMock = jest.fn();
  const changePasswordMock = jest.fn();
  const signOutMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSession as jest.Mock).mockReturnValue({
      data: sessionMock,
      status: 'authenticated',
    });

    (useUpdateProfile as jest.Mock).mockReturnValue({
      mutate: updateProfileMock,
      isPending: false,
      error: null,
    });

    (useUploadFile as jest.Mock).mockReturnValue({
      mutate: uploadFileMock,
      isPending: false,
      error: null,
    });

    (useChangePassword as jest.Mock).mockReturnValue({
      mutate: changePasswordMock,
      isPending: false,
      error: null,
    });

    (signOut as jest.Mock).mockImplementation(signOutMock);
  });

  it('renders with user data from session', () => {
    render(<Settings />);

    expect(screen.getByPlaceholderText('Jane Meldrum')).toHaveValue('testuser');
    expect(screen.getByPlaceholderText('example@gmail.com')).toHaveValue(
      'test@example.com'
    );
    expect(screen.getByPlaceholderText('(949) 354-2574')).toHaveValue(
      '(123) 456-7890'
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg'
    );
  });

  it('handles profile update without avatar change', async () => {
    render(<Settings />);

    const usernameInput = screen.getByPlaceholderText('Jane Meldrum');
    const emailInput = screen.getByPlaceholderText('example@gmail.com');

    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(usernameInput, { target: { value: 'newusername' } });
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Save changes'));
    });

    expect(updateProfileMock).toHaveBeenCalledWith({
      body: {
        username: 'newusername',
        email: 'newemail@example.com',
        phoneNumber: '(123) 456-7890',
        avatar: undefined,
      },
      token: sessionMock.user.accessToken,
      id: sessionMock.user.id,
    });
  });

  it('handles password change', async () => {
    render(<Settings />);

    const passwordFields = screen.getAllByPlaceholderText('********');
    const [currentPasswordInput, newPasswordInput, confirmPasswordInput] =
      passwordFields;

    fireEvent.change(currentPasswordInput, {
      target: { value: 'currentpass' },
    });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Save changes'));
    });

    expect(changePasswordMock).toHaveBeenCalledWith(
      {
        currentPassword: 'currentpass',
        password: 'newpass123',
        passwordConfirmation: 'newpass123',
      },
      expect.any(Object)
    );
  });

  it('handles avatar deletion', async () => {
    render(<Settings />);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Save changes'));
    });

    expect(updateProfileMock).toHaveBeenCalledWith({
      body: {
        username: sessionMock.user.username,
        email: sessionMock.user.email,
        phoneNumber: sessionMock.user.phoneNumber,
        avatar: null,
      },
      token: sessionMock.user.accessToken,
      id: sessionMock.user.id,
    });
  });

  it('handles avatar upload', async () => {
    render(<Settings />);
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });

    uploadFileMock.mockImplementationOnce((file, { onSuccess }) => {
      onSuccess([{ id: 'new-avatar-id' }]);
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Save changes'));
    });

    expect(uploadFileMock).toHaveBeenCalledWith(file, expect.any(Object));
    await waitFor(() => {
      expect(updateProfileMock).toHaveBeenCalledWith({
        body: {
          username: sessionMock.user.username,
          email: sessionMock.user.email,
          phoneNumber: sessionMock.user.phoneNumber,
          avatar: 'new-avatar-id',
        },
        token: sessionMock.user.accessToken,
        id: sessionMock.user.id,
      });
    });
  });

  it('displays validation errors for invalid form submission', async () => {
    render(<Settings />);

    const usernameInput = screen.getByPlaceholderText('Jane Meldrum');
    const emailInput = screen.getByPlaceholderText('example@gmail.com');

    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    fireEvent.click(screen.getByText('Save changes'));

    expect(
      await screen.findByText('Username must be at least 3 characters')
    ).toBeInTheDocument();
    expect(await screen.findByText('The email is invalid')).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    const errorMessage = 'Failed to update profile';
    (useUpdateProfile as jest.Mock).mockReturnValue({
      mutate: updateProfileMock,
      isPending: false,
      error: { message: errorMessage },
    });

    render(<Settings />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    (useUpdateProfile as jest.Mock).mockReturnValue({
      mutate: updateProfileMock,
      isPending: true,
      error: null,
    });

    render(<Settings />);

    const saveButton = screen.getByText('Save changes');
    expect(saveButton).toBeDisabled();
    expect(saveButton.closest('button')).toHaveClass('MuiButton-loading');
  });
});
