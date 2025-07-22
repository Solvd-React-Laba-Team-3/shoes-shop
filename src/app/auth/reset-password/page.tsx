'use client';
import {
  AuthFormContainer,
  Button,
  LabeledTextfield,
  Link,
} from '@/components/ui';
import { Box, FormLabel, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useResetPassword } from '@/api/auth/useResetPassword';
import { useSearchParams, useRouter } from 'next/navigation';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const searchParams = useSearchParams();
  const code = searchParams.get('code') ?? '';

  const router = useRouter();

  const { mutate, status, isSuccess, isError } = useResetPassword();

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push('/auth/sign-in');
      }, 3000);
    }
  }, [isSuccess, router]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!code) {
      alert('Reset code is missing. Please check the link in your email.');
      return;
    }

    mutate({
      password: data.password,
      passwordConfirmation: data.confirmPassword,
      code,
    });
  };

  return (
    <>
      <AuthFormContainer
        title="Reset password"
        description="Please create a new password below"
      >
        {isSuccess ? (
          <Typography color="success.main" align="center" mt={2}>
            ✅ Confirmation link has been sent to your email. Redirecting to
            login...
          </Typography>
        ) : (
          <Box
            component="form"
            noValidate
            autoComplete="off"
            display="flex"
            flexDirection="column"
            gap={2}
            width="100%"
            maxWidth={400}
            alignItems="center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <LabeledTextfield
              id="password"
              label="Password"
              required
              type="password"
              placeholder="at least 6 characters"
              {...register('password')}
            />
            {errors.password && (
              <FormLabel sx={{ fontSize: '0.75rem', color: 'error.main' }}>
                {errors.password.message}
              </FormLabel>
            )}

            <LabeledTextfield
              id="confirmPassword"
              label="Confirm password"
              required
              type="password"
              placeholder="repeat your password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <FormLabel sx={{ fontSize: '0.75rem', color: 'error.main' }}>
                {errors.confirmPassword.message}
              </FormLabel>
            )}

            <Button type="submit" size="large" disabled={status === 'pending'}>
              {status === 'pending' ? 'Processing...' : 'Reset password'}
            </Button>

            {isError && (
              <Typography color="error.main" fontSize="0.875rem">
                ❌ Failed to reset password. Please try again.
              </Typography>
            )}

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle2" color="textSecondary">
                Back to
              </Typography>
              <Link href="/auth/sign-in" size="small">
                log in
              </Link>
            </Stack>
          </Box>
        )}
      </AuthFormContainer>

      <Box sx={{ height: '100vh', position: 'relative' }}>
        <Image
          src="/recovery.jpg"
          alt="login"
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
    </>
  );
};

export default ResetPassword;
