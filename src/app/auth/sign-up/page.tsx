'use client';
import {
  AuthFormContainer,
  Button,
  LabeledTextfield,
  Link,
  ReviewPanel,
} from '@/components/ui';
import { Box, Stack, Typography, FormLabel } from '@mui/material';
import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// type SignUpFormData = {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// };

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log(data, errors);

    signUpSchema.parse(data);

    // use errors from zod to diplay them
  };

  const handlePrev = () => console.log('Previous feedback');
  const handleNext = () => console.log('Next feedback');

  useEffect(() => {
    console.log('Validation errors', errors);
  }, [errors]);
  return (
    <>
      <AuthFormContainer
        title="Create an account"
        description="Create an account to get easy access to your dream shopping"
        footer={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" component="p" color="textSecondary">
              Already have an account?
            </Typography>
            <Link href="/auth/sign-in" size="small">
              Log in
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
            id="name"
            label="Name"
            required
            placeholder="Hayman Andrews"
            {...register('name')}
            error={!!errors.name}
          />
          {errors.name && (
            <FormLabel
              component="legend"
              color="error"
              sx={{ fontSize: '0.75rem', color: 'error.main' }}
            >
              {errors.name.message}
            </FormLabel>
          )}

          <LabeledTextfield
            id="email"
            label="Email"
            required
            placeholder="example@mail.com"
            {...register('email', { required: true })}
            error={!!errors.email}
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
            {...register('password')}
            error={!!errors.password}
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

          <LabeledTextfield
            id="confirmPassword"
            label="Confirm password"
            required
            type="password"
            placeholder="at least 8 characters"
            {...register('confirmPassword', { required: true })}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <FormLabel
              component="legend"
              color="error"
              sx={{ fontSize: '0.75rem', color: 'error.main' }}
            >
              {errors.confirmPassword.message}
            </FormLabel>
          )}
          <Button type="submit" size="large" sx={{ margin: '90px 0 16px 0' }}>
            Sign up
          </Button>
        </Box>
      </AuthFormContainer>

      <Box
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
        <Image
          src="/register.jpg"
          alt="background"
          fill
          sizes="50vw"
          style={{ objectFit: 'cover' }}
          priority
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ReviewPanel
            quote="Lorem Ipsum is a really great company because the team is passionate about the projects they produce, the people they work with, the quality of the work they do."
            name="John Stone"
            location="Ukraine, Chernivtsi"
            rating={5}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </Box>
      </Box>
    </>
  );
};

export default SignUp;
