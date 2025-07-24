'use client';

import { LabeledTextfield, Link } from '@/components/ui';
import { Box, FormLabel, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '@/api/auth/useResetPassword';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthContainer } from '@/components/AuthContainer';
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from './reset-password.schema';
import { LoaderButton } from '@/components/LoaderButton';
import { ReactElement } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function ResetPassword(): ReactElement | null {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: resetPassword, isError, isSuccess } = useResetPassword();

  if (!code) {
    router.replace('/');
    return null;
  }

  const onSubmit = async (data: ResetPasswordSchema) => {
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
            <Typography variant="subtitle2" color="textSecondary">
              Back to
            </Typography>
            <Link href="/auth/sign-in" size="small">
              log in
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
          gap={2}
          width="100%"
          maxWidth={400}
          onSubmit={handleSubmit(onSubmit)}
        >
          <LabeledTextfield
            id="password"
            placeholder="at least 6 characters"
            required
            type="password"
            label="Password"
            error={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" /> {errors.password.message}
            </FormLabel>
          )}
          <LabeledTextfield
            id="Confirm password"
            required
            type="password"
            placeholder="at least 6 characters"
            label="Confirm password"
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" />
              {errors.confirmPassword.message}
            </FormLabel>
          )}
          {isError && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" />
              Failed to reset password. Please try again.
            </FormLabel>
          )}
          {isSuccess && (
            <Typography variant="subtitle2" color="success">
              Password reset successful. Redirecting to login...
            </Typography>
          )}
          <LoaderButton
            isSubmitting={isSubmitting || isSuccess}
            text="Reset Password"
            loadingText="Submitting..."
          />
        </Box>
      </AuthContainer>

      <Box
        sx={{
          height: '100vh',
          position: 'relative',
        }}
      >
        <Image src="/recovery.jpg" alt="reset password" fill sizes="50vw" />
      </Box>
    </>
  );
}
