'use client';

import { Checkbox, LabeledTextfield, Link } from '@/components/ui';
import { Box, FormControlLabel, Typography } from '@mui/material';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { signInSchema, SignInSchema } from './sign-in.schema';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContainer } from '@/components/AuthContainer';
import {
  REMEMBER_ME_SESSION_MAX_AGE,
  SESSION_MAX_AGE,
} from '@/constants/sessionMaxAge';
import { LoaderButton } from '@/components/LoaderButton';
import loginImage from '../../../../public/login.jpg';

export default function SignIn() {
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
    shouldFocusError: true,
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

      router.replace('/profile/products');
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
      <AuthContainer
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
          gap={1.5}
          width="100%"
          maxWidth={400}
          onSubmit={handleSubmit(onSubmit)}
        >
          <LabeledTextfield
            id="email"
            label="Email"
            required
            placeholder="example@mail.com"
            {...register('email')}
            errorMessage={errors.email?.message}
          />

          <LabeledTextfield
            id="password"
            label="Password"
            required
            type="password"
            placeholder="at least 6 characters"
            {...register('password')}
            errorMessage={errors.password?.message || error}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FormControlLabel
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '15px',
                    },
                  }}
                  control={
                    <Checkbox
                      checked={isRememberMe}
                      onChange={() => setIsRememberMe(!isRememberMe)}
                    />
                  }
                  label="Remember me"
                />
              </Box>
            </Box>

            <Link
              size="thin"
              href="/auth/forgot-password"
              sx={{
                display: 'block',
                textAlign: 'center',
                width: '100%',
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <LoaderButton
            isSubmitting={isSubmitting}
            text="Sign in"
            loadingText="Signing in..."
          />
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
        <Image src={loginImage} alt="sign in" fill sizes="50vw" />
      </Box>
    </>
  );
}
