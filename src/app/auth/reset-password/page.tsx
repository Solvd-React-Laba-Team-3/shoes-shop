'use client';

import {
  AuthFormContainer,
  Button,
  LabeledTextfield,
  Link,
} from '@/components/ui';
import { Box, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '@/api/auth/useResetPassword';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Image from 'next/image';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') ?? '';

  const [submitted, setSubmitted] = useState(false);

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

  const { mutate, isPending, isSuccess } = useResetPassword();

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate(
      {
        password: data.password,
        passwordConfirmation: data.confirmPassword,
        code,
      },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  };

  useEffect(() => {
    if (submitted && isSuccess) {
      const timer = setTimeout(() => {
        router.push('/auth/sign-in');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [submitted, isSuccess, router]);

  return (
    <>
      <AuthFormContainer
        title="Reset password"
        description="Please create new password here"
      >
        {submitted && isSuccess ? (
          <Typography variant="body1" color="textDisabled">
            <DoneOutlineIcon />
            Password successfully reset! Redirecting to login...
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
              placeholder="at least 8 characters"
              required
              type="password"
              label={errors.password?.message ?? 'Password'}
              error={!!errors.password}
              {...register('password')}
            />
            <LabeledTextfield
              id="Confirm password"
              required
              type="password"
              placeholder="at least 8 characters"
              label={errors.confirmPassword?.message ?? 'Confirm password'}
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            <Button
              type="submit"
              size="large"
              sx={{ margin: '37px 0 20px' }}
              disabled={isPending}
            >
              {isPending ? 'Submitting...' : 'Reset Password'}
            </Button>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="subtitle2"
                component="p"
                color="textSecondary"
              >
                Back to
              </Typography>
              <Link href="/auth/sign-in" size="small">
                log in
              </Link>
            </Stack>
          </Box>
        )}
      </AuthFormContainer>

      <Box
        sx={{
          height: '100vh',
          position: 'relative',
        }}
      >
        <Image
          src="/recovery.jpg"
          alt="login"
          fill
          style={{
            objectFit: 'cover',
          }}
        />
      </Box>
    </>
  );
}
