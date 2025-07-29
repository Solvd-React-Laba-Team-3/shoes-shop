'use client';

import { LabeledTextfield, Link, ReviewPanel } from '@/components/ui';
import { Box, Typography, FormLabel } from '@mui/material';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/api/auth/useRegister';
import { AuthContainer } from '@/components/AuthContainer';
import { SignUpSchema, signUpSchema } from './sign-up.schema';
import { useRouter } from 'next/navigation';
import { LoaderButton } from '@/components/LoaderButton';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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
  });

  const { mutate: registerUser, error, isPending } = useRegister();

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
          gap={2}
          width="100%"
          maxWidth={400}
          onSubmit={handleSubmit(onSubmit)}
        >
          <LabeledTextfield
            id="name"
            label="Name"
            required
            placeholder="Hayman Andrews"
            {...register('name')}
            error={!!errors.name}
          />
          {errors.name && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" /> {errors.name.message}
            </FormLabel>
          )}

          <LabeledTextfield
            id="email"
            label="Email"
            required
            placeholder="example@mail.com"
            {...register('email')}
            error={!!errors.email}
          />
          {errors.email && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" /> {errors.email.message}
            </FormLabel>
          )}
          <LabeledTextfield
            id="password"
            label="Password"
            required
            type="password"
            placeholder="at least 6 characters"
            {...register('password')}
            error={!!errors.password}
          />
          {errors.password && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" /> {errors.password.message}
            </FormLabel>
          )}

          <LabeledTextfield
            id="confirmPassword"
            label="Confirm password"
            required
            type="password"
            placeholder="at least 6 characters"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" />{' '}
              {errors.confirmPassword.message}
            </FormLabel>
          )}

          {error && (
            <FormLabel
              sx={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              error
            >
              <WarningAmberIcon fontSize="small" />
              {error.message}
            </FormLabel>
          )}
          <LoaderButton
            isSubmitting={isPending}
            text="Sign up"
            loadingText="Submitting..."
          />
        </Box>
      </AuthContainer>

      <Box
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
        <Image src="/register.jpg" alt="sign up" fill sizes="50vw" />
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
