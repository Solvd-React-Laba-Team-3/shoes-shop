'use client';
import {
  AuthFormContainer,
  Button,
  Checkbox,
  LabeledTextfield,
  Link,
} from '@/components/ui';
import { Box, FormLabel, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();

  const onSubmit = async (data: SignInFormData) => {
    console.log('submitted data:', data);
    const res = await signIn('credentials', {
      redirect: false,
      identifier: data.email,
      password: data.password,
    });

    if (res?.ok) {
      router.push('/');
    } else {
      setError('password', {
        type: 'manual',
        message: 'Invalid login or passsword. Please try again.',
      });
    }
  };
  return (
    <>
      <AuthFormContainer
        title="Welcome back"
        description="Welcome back! Please enter your details to log into your account."
        footer={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" component="p" color="textSecondary">
              Don’t have an account?
            </Typography>
            <Link href="/auth/sign-up" size="small">
              Sign up
            </Link>
          </Stack>
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
            error={!!errors.email}
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
          <LabeledTextfield
            id="password"
            label="Password"
            required
            type="password"
            placeholder="at least 8 characters"
            error={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <FormLabel
              component="legend"
              color="error"
              sx={{ fontSize: '0.75rem', color: 'error.main' }}
            >
              {errors.password.message}
            </FormLabel>
          )}

          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: (theme) => theme.typography.fontWeightMedium,
                  color: '#494949',
                }}
              >
                Remember me
              </Typography>
            </Box>

            <Link size="thin" href="/auth/forgot-password">
              Forgot password?
            </Link>
          </Stack>

          <Button type="submit" size="large" sx={{ margin: '56px 0 24px' }}>
            Sign in
          </Button>
        </Box>
      </AuthFormContainer>

      <Box
        sx={{
          height: '100vh',
          position: 'relative',
        }}
      >
        <Image
          src="/login.jpg"
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

export default SignIn;
