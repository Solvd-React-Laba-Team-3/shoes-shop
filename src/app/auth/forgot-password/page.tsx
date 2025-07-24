'use client';

import { LabeledTextfield } from '@/components/ui';
import { Box, FormLabel, Typography } from '@mui/material';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from '@/api/auth/useForgotPassword';
import { AuthContainer } from '@/components/AuthContainer';
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from './forgot-password.schema';
import { LoaderButton } from '@/components/LoaderButton';
import { Link } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    mutate: forgotPassword,
    isError,
    isPending,
    isSuccess,
  } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordSchema) => {
    forgotPassword(data, {
      onSuccess: () => {
        setTimeout(() => {
          router.replace('/auth/sign-in');
        }, 2000);
      },
    });
  };

  return (
    <>
      <AuthContainer
        title="Forgot password?"
        description="Don’t worry, we’ll send you reset instructions."
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
            id="Email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
            {...register('email')}
            error={!!errors.email}
          />
          {errors.email && (
            <FormLabel sx={{ fontSize: '13px' }} error>
              {errors.email.message}
            </FormLabel>
          )}
          {isError && (
            <FormLabel sx={{ fontSize: '13px' }} error>
              Failed to send reset instructions. Please try again.
            </FormLabel>
          )}

          {isSuccess && (
            <Typography variant="subtitle2" color="success">
              A confirmation link has been sent to your email. Redirecting to
              login...
            </Typography>
          )}

          <LoaderButton
            isSubmitting={isPending || isSuccess}
            text="Forgot password"
            loadingText="Submitting..."
          />
        </Box>
      </AuthContainer>

      <Box sx={{ height: '100vh', position: 'relative' }}>
        <Image
          src="/recovery.jpg"
          alt="forgot password"
          objectFit="cover"
          fill
        />
      </Box>
    </>
  );
}
