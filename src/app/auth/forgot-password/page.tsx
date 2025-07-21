'use client';
import {
  AuthFormContainer,
  Button,
  LabeledTextfield,
  Link,
} from '@/components/ui';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';

const ForgotPassword = () => {
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
        >
          <LabeledTextfield
            id="Email"
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <Button type="submit" size="large" sx={{ margin: '37px 0 20px' }}>
            Reset password
          </Button>

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

      <Box
        sx={{
          height: '100vh',
          position: 'relative',
        }}
      >
        <Image
          src="/recovery.jpg"
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

export default ForgotPassword;
