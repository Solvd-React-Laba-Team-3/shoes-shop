'use client';

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
import { useState } from 'react';
import { Loading } from '@/components/LoadingProgress';
import { signIn } from 'next-auth/react';

export default function SignUp() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    shouldFocusError: true,
  });

  const { mutate: registerUser, error, isPending } = useRegister();
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const onSubmit = (data: SignUpSchema) => {
    const { name, email, password } = data;

    registerUser(
      { username: name, email, password },
      {
        onSuccess: () => {
          router.push('/auth/sign-in');
        },
      }
    );
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
  // const loginWithGoogle = async () => {
  //   try {
  //     setIsGoogleLoading(true);

  //     // 1. Sign in with Google
  //     await signIn('google', { callbackUrl: '/profile/products' });

  //     // if (!res?.ok) throw new Error('Google login failed');

  //     // 2. Get session info from NextAuth
  //     const session = await getSession();
  //     const user = session?.user;
  //     if (!user || !user.email)
  //       throw new Error('No user returned from Google login');

  //     // 3. Prepare a name to send to Strapi
  //     const nameToSend = user.name || user.username || 'User';

  //     // 4. Send Google info to Strapi and get Strapi JWT
  //     const strapiRes = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/auth/google-custom`,
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           email: user.email,
  //           name: nameToSend,
  //         }),
  //       }
  //     );

  //     const data = await strapiRes.json();
  //     if (!strapiRes.ok)
  //       throw new Error(data.error || 'Strapi Google login failed');

  //     // 5. Store Strapi JWT locally
  //     localStorage.setItem('strapiToken', data.jwt);

  //     console.log('Strapi JWT stored:', data.jwt);

  //     // 6. Redirect to profile page
  //     window.location.href = '/profile/products';
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsGoogleLoading(false);
  //   }
  // };

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

          <Divider
            sx={{
              width: '100%',
              height: 'auto',
              color: 'black',
            }}
          >
            or sign up with
          </Divider>

          <Button
            disabled={isGoogleLoading}
            onClick={loginWithGoogle}
            variant="outlined"
            size="large"
          >
            {isGoogleLoading && <Loading />}
            <svg
              style={{ marginRight: '8px' }}
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Google
          </Button>
        </Box>
      </AuthContainer>

      <Box
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
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
