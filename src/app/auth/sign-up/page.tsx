'use client';

import {
  FormErrorMessage,
  LabeledTextfield,
  Link,
  ReviewPanel,
} from '@/components/ui';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/api/auth/useRegister';
import { AuthContainer } from '@/components/AuthContainer';
import { SignUpSchema, signUpSchema } from './sign-up.schema';
import { useRouter } from 'next/navigation';
import { LoaderButton } from '@/components/LoaderButton';
import registerImage from '../../../../public/register.jpg';

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
          <FormErrorMessage message={errors.name?.message} />

          <LabeledTextfield
            id="email"
            label="Email"
            required
            placeholder="example@mail.com"
            {...register('email')}
            error={!!errors.email}
          />
          <FormErrorMessage message={errors.email?.message} />

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
