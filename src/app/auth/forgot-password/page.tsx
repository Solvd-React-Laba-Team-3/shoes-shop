'use client';

import { Button, LabeledTextfield } from '@/components/ui';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from '@/api/auth/useForgotPassword';
import { AuthContainer } from '@/components/AuthContainer';
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from './forgot-password.schema';
import { Link } from '@/components/ui';
import { useRouter } from 'next/navigation';
import recoveryImage from '../../../../public/recovery.jpg';

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
    shouldFocusError: true,
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
          <Box>
            <LabeledTextfield
              id="Email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              {...register('email')}
              errorMessage={
                errors.email?.message ||
                (isError
                  ? 'Failed to send reset instructions. Please try again.'
                  : null)
              }
            />

            {isSuccess && (
              <Typography
                variant="subtitle2"
                color="success"
                data-testid="reset-success-message"
              >
                A reset link has been sent to your email. Redirecting to
                login...
              </Typography>
            )}
          </Box>

          <Button
            loading={isPending || isSuccess}
            type="submit"
            size="large"
            sx={{ width: '100%' }}
          >
            Forgot password
          </Button>
        </Box>
      </AuthContainer>

      <Box
        sx={{
          height: '100vh',
          position: 'relative',
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <Image src={recoveryImage} alt="forgot password" fill sizes="50vw" />
      </Box>
    </>
  );
}
