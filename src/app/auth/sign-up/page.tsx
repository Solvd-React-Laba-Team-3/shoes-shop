'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  FormErrorMessage,
  LabeledTextfield,
  Link,
  ReviewPanel,
} from '@/components/ui';
import { Box, Divider, Typography } from '@mui/material';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/api/auth/useRegister';
import { AuthContainer } from '@/components/AuthContainer';
import { SignUpSchema, signUpSchema } from './sign-up.schema';
import { useRouter } from 'next/navigation';
import { LoaderButton } from '@/components/LoaderButton';
import registerImage from '../../../../public/register.jpg';
import { Loading } from '@/components/LoadingProgress';
import { signIn } from 'next-auth/react';

export default function SignUp() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    shouldFocusError: true,
  });

  const { mutate: registerUser, error, isPending } = useRegister();

  const onSubmit = (data: SignUpSchema) => {
    const { name, email, password } = data;
    registerUser(
      { username: name, email, password },
      { onSuccess: () => router.push('/auth/sign-in') }
    );
  };

  const loginWithGithub = async () => {
    setIsGitHubLoading(true);
    try {
      const res = await signIn('github', { redirect: false });
      if (!res?.ok) throw new Error('GitHub login failed');

      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();

      const strapiRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/github-custom`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: sessionData.user.email,
            name: sessionData.user.name || 'User',
          }),
        }
      );

      if (!strapiRes.ok) throw new Error('Strapi GitHub login failed');

      const strapiData = await strapiRes.json();
      localStorage.setItem('strapiToken', strapiData.jwt);
      router.push('/profile/products');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGitHubLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/profile/products' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (!hasMounted) return null;

  return (
    <>
      <AuthContainer
        title="Create an account"
        description="Create an account to get easy access to your dream shopping"
        footer={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Already have an account?
            </Typography>
            <Link href="/auth/sign-in" size="small">
              Sign in
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
          <Box>
            <LabeledTextfield
              id="name"
              label="Name"
              required
              placeholder="Hayman Andrews"
              {...register('name')}
              error={!!errors.name}
            />
            <FormErrorMessage message={errors.name?.message} />
          </Box>
          <Box>
            <LabeledTextfield
              id="email"
              label="Email"
              required
              placeholder="example@mail.com"
              {...register('email')}
              error={!!errors.email}
            />
            <FormErrorMessage message={errors.email?.message} />
          </Box>
          <Box>
            <LabeledTextfield
              id="password"
              label="Password"
              required
              type="password"
              placeholder="at least 6 characters"
              {...register('password')}
              error={!!errors.password}
            />
            <FormErrorMessage message={errors.password?.message} />
          </Box>
          <Box>
            <LabeledTextfield
              id="confirmPassword"
              label="Confirm password"
              required
              type="password"
              placeholder="at least 6 characters"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
            />
            <FormErrorMessage
              message={errors.confirmPassword?.message || error?.message}
            />
          </Box>

          <LoaderButton
            isSubmitting={isPending}
            text="Sign up"
            loadingText="Submitting..."
          />

          <Divider sx={{ width: '100%', height: 'auto', color: 'black' }}>
            or sign up with
          </Divider>

          <Button
            disabled={isGoogleLoading}
            onClick={loginWithGoogle}
            variant="outlined"
            size="large"
          >
            {isGoogleLoading && <Loading />}
            <span style={{ marginRight: 8 }}>G</span> Google
          </Button>

          <Button
            disabled={isGitHubLoading}
            onClick={loginWithGithub}
            variant="outlined"
            size="large"
          >
            {isGitHubLoading && <Loading />}
            <span style={{ marginRight: 8 }}>GH</span> GitHub
          </Button>
        </Box>
      </AuthContainer>

      <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
        <Image src={registerImage} alt="sign up" fill sizes="50vw" />
        <ReviewPanel
          quote="Lorem Ipsum is a really great company because the team is passionate about the projects they produce, the people they work with, the quality of the work they do."
          name="John Stone"
          location="Ukraine, Chernivtsi"
          rating={5}
        />
      </Box>
    </>
  );
}
