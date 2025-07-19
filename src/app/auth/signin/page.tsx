import AuthLayout from '@/app/auth/layout';
import { AuthFormContainer } from '@/components/AuthFormContainer/AuthFormContainer';
import { Button, LabeledTextfield, Link } from '@/components/ui';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';

export const SignIn = () => {

  return (
    <AuthLayout>
      <Box sx={{ position: 'absolute', top: '50px', left: '40px' }}>
        <Image src="/logo.png" alt="register logo" width={40} height={30} />
      </Box>

      <AuthFormContainer
        title="Welcome back"
        description="Welcome back! Please enter your details to log into your account."
        footer={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" component="p" color="textSecondary">
              Don’t have an account?
            </Typography>
            <Link href="/signin" size="thin">
              <Typography variant="subtitle2">Sign up</Typography>
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
        >
          <LabeledTextfield
            id="email"
            label="Email"
            required
            placeholder="example@mail.com"
          />
          <LabeledTextfield
            id="password"
            label="Password"
            required
            type="password"
            placeholder="at least 8 characters"
          />

          <Button type="submit" size="large" sx={{ margin: '90px 0 16px 0' }}>
            Sign up
          </Button>
        </Box>
      </AuthFormContainer>

      
     
    </AuthLayout>
  );
};
