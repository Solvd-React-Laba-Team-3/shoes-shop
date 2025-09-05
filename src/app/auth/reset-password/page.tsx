'use client';

import { Button, LabeledTextfield, Link } from '@/components/ui';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '@/api/auth/useResetPassword';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthContainer } from '@/components/AuthContainer';
import {
  ResetPasswordData,
  resetPasswordSchema,
} from './reset-password.schema';
import recoveryImage from '../../../../public/recovery.jpg';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    shouldFocusError: true,
  });

  const { mutate: resetPassword, isError, isSuccess } = useResetPassword();

  if (!code) {
    router.replace('/');
    return null;
  }

  const onSubmit = async (data: ResetPasswordData) => {
    resetPassword(
      {
        password: data.password,
        passwordConfirmation: data.confirmPassword,
        code,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.replace('/auth/sign-in');
          }, 2000);
        },
      }
    );
  };

  return (
    <>
      <AuthContainer
        title="Reset password"
        description="Please create new password here"
        footer={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle2"
              component={'p'}
              color="textSecondary"
            >
              Back to
            </Typography>
            <Link href="/auth/sign-in" active>
              Log in
            </Link>
          </Box>
        }
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap={1.5}
          width="100%"
          onSubmit={handleSubmit(onSubmit)}
        >
          <LabeledTextfield
            id="password"
            placeholder="at least 6 characters"
            required
            type="password"
            label="Password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />

          <Box>
            <LabeledTextfield
              id="Confirm password"
              required
              type="password"
              placeholder="at least 6 characters"
              label="Confirm password"
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
              errorMessage={
                errors.confirmPassword?.message || isError
                  ? 'Failed to reset password. Please try again.'
                  : null
              }
            />

            {isSuccess && (
              <Typography variant="subtitle2" component={'p'} color="success">
                Password reset successful. Redirecting to login...
              </Typography>
            )}
          </Box>
          <Button
            loading={isSubmitting || isSuccess}
            type="submit"
            size="large"
            sx={{ width: '100%' }}
          >
            Reset Password
          </Button>
        </Box>
      </AuthContainer>

      <Box
        sx={(theme) => ({
          height: '100vh',
          position: 'relative',
          [theme.breakpoints.down('lg')]: {
            display: 'none',
          },
        })}
      >
        <Image src={recoveryImage} alt="reset password" fill sizes="50vw" />
      </Box>
    </>
  );
}
