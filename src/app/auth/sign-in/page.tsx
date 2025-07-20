'use client';
import { AuthFormContainer } from '@/components/ui/AuthFormContainer/AuthFormContainer';
import { AuthImagePanel } from '@/components/ui/AuthImagePanel/AuthImagePanel';
import { Button, Checkbox, LabeledTextfield, Link } from '@/components/ui';
import { Box, Stack, Typography } from '@mui/material';

const SignIn = () => {
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
            <Link href="/auth/sign-up" size="thin">
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

          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Checkbox defaultChecked />
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

            <Link size="thin">
              <Typography variant="caption">Forgot password?</Typography>
            </Link>
          </Stack>

          <Button type="submit" size="large" sx={{ margin: '56px 0 24px' }}>
            Sign in
          </Button>
        </Box>
      </AuthFormContainer>

      <AuthImagePanel />
    </>
  );
};

export default SignIn;
