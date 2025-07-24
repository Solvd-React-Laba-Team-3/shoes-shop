'use client';
import { Button, LabeledTextfield, Link } from '@/components/ui';
import { Box, FormLabel, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from '@/api/auth/useForgotPassword';
import { AuthFormContainer } from '@/components/AuthFormContainer';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const { mutate, isSuccess, isError } = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data);
    setSubmitted(true);
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
            <FormLabel sx={{ fontSize: '0.75rem', color: 'error.main' }}>
              {errors.email.message}
            </FormLabel>
          )}

          <Button
            type="submit"
            size="large"
            sx={{ margin: '20px 0' }}
            disabled={!isValid || isSuccess}
          >
            Reset password
          </Button>

          {submitted && isSuccess && (
            <Typography
              variant="body1"
              color="textDisabled"
              fontSize="1rem"
              align="center"
              display="flex"
            >
              <EmailOutlinedIcon />A confirmation link has been sent to your
              email. Please check your inbox.
            </Typography>
          )}

          {isError && (
            <Typography color="error.main" fontSize="0.875rem" align="center">
              <CloseIcon />
              Failed to send reset instructions. Please try again.
            </Typography>
          )}

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

export default ForgotPassword;
