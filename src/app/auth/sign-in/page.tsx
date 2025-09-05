'use client';

import { Button, Checkbox, LabeledTextfield, Link } from '@/components/ui';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { SignInData, signInSchema } from './sign-in.schema';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthContainer } from '@/components/AuthContainer';
import {
  REMEMBER_ME_SESSION_MAX_AGE,
  SESSION_MAX_AGE,
} from '@/constants/sessionMaxAge';
import loginImage from '../../../../public/login.jpg';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const [error, setError] = useState<string | null>(null);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: SignInData) => {
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

      if (nextParam) {
        router.replace(nextParam);
      } else {
        router.replace('/profile/products');
      }
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
            <Typography
              variant="subtitle2"
              component={'p'}
              color="textSecondary"
            >
              {"Don't have an account?"}
            </Typography>
            <Link href="/auth/sign-up" active>
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
          width="100%"
          gap={1.5}
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
              alignItems: 'center',
              justifyContent: 'space-between',
              my: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Checkbox
                size="large"
                checked={isRememberMe}
                onChange={() => setIsRememberMe(!isRememberMe)}
                id="rememberMe"
              />
              <Typography
                component="label"
                htmlFor="rememberMe"
                variant="subtitle2"
                color="secondary"
                sx={{ cursor: 'pointer' }}
              >
                Remember me
              </Typography>
            </Box>

            <Link href="/auth/forgot-password" active fontWeight={300}>
              Forgot password?
            </Link>
          </Box>

          <Button
            loading={isSubmitting}
            type="submit"
            size="large"
            sx={{ width: '100%' }}
          >
            Sign in
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
        <Image src={loginImage} alt="sign in" fill sizes="50vw" />
      </Box>
    </>
  );
}
