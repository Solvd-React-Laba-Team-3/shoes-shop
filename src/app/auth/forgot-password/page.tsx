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
import { useForgotPassword } from '@/api/auth/useForgotPassword';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const router = useRouter();
  const { mutate, isSuccess, isError } = useForgotPassword();

  useEffect(() => {
    if (isSuccess) {
      router.push('/auth/reset-password');
    }
    if (isError) {
      alert('Failed to send reset instructions. Please try again.');
    }
  }, [isSuccess, isError, router]);

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data);
  };
  return (
    <>
      <AuthFormContainer
        title="Forgot password?"
        description="Don’t worry, we’ll send you reset instructions."
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
          alignItems="center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <LabeledTextfield
            id="Email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && (
            <FormLabel
              component="legend"
              color="error"
              sx={{ fontSize: '0.75rem', color: 'error.main' }}
            >
              {errors.email.message}
            </FormLabel>
          )}

          <Button
            type="submit"
            size="large"
            sx={{ margin: '37px 0 20px' }}
            disabled={isSuccess}
          >
            Reset password
          </Button>

          {isError && <FormLabel sx={{ color: 'error.main' }}></FormLabel>}

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" component="p" color="textSecondary">
              Back to
            </Typography>
            <Link href="/auth/sign-in" size="small">
              log in
            </Link>
          </Stack>
        </Box>
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
};

export default ForgotPassword;
