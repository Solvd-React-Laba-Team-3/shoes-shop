'use client';

import { Button, Checkbox, LabeledTextfield, Link } from '@/components/ui';
import { Box, CircularProgress, FormLabel, Typography } from '@mui/material';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { signInSchema, SignInSchema } from './sign-in.schema';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthFormContainer } from '@/components/AuthFormContainer';
import {
  REMEMBER_ME_SESSION_MAX_AGE,
  SESSION_MAX_AGE,
} from '@/constants/sessionMaxAge';

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    try {
      setError(null);

      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.email,
        password: data.password,
        maxAge: isRememberMe ? REMEMBER_ME_SESSION_MAX_AGE : SESSION_MAX_AGE,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push('/products');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const subscription = watch(() => {
      if (error) setError(null);
    });

    return () => subscription.unsubscribe();
  }, [watch, error]);

  return (
    <>
      <AuthFormContainer
        title="Welcome back"
        description="Welcome back! Please enter your details to log into your account."
        footer={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {"Don't have an account?"}
            </Typography>
            <Link href="/auth/sign-up" size="small">
              Sign up
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
            id="email"
            label="Email"
            required
            placeholder="example@mail.com"
            error={!!errors.email || !!error}
            {...register('email')}
          />
          {errors.email && (
            <FormLabel sx={{ fontSize: '13px' }} error>
              {errors.email.message}
            </FormLabel>
          )}
          <LabeledTextfield
            id="password"
            label="Password"
            required
            type="password"
            placeholder="at least 6 characters"
            error={!!errors.password || !!error}
            {...register('password')}
          />
          {errors.password && (
            <FormLabel sx={{ fontSize: '13px' }} error>
              {errors.password.message}
            </FormLabel>
          )}
          {error && (
            <FormLabel sx={{ fontSize: '13px' }} error>
              {error}
            </FormLabel>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                size="large"
                checked={isRememberMe}
                onChange={() => setIsRememberMe(!isRememberMe)}
              />
              <Typography variant="subtitle2" color="secondary">
                Remember me
              </Typography>
            </Box>

            <Link size="thin" href="/auth/forgot-password">
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            size="large"
            sx={{
              mt: '56px',
              '& .MuiCircularProgress-root': {
                color: (theme) => theme.palette.common.white,
                marginLeft: '10px',
              },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
            {isSubmitting && <CircularProgress size={12} />}
          </Button>
        </Box>
      </AuthFormContainer>

      <Box
        sx={{
          height: '100vh',
          position: 'relative',
        }}
      >
        <Image src="/login.jpg" alt="login" fill objectFit="cover" />
      </Box>
    </>
  );
};

export default SignIn;
