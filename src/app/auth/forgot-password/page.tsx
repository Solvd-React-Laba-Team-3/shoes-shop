'use client';
import { AuthFormContainer } from '@/components/ui/AuthFormContainer/AuthFormContainer';
import { AuthImagePanel } from '@/components/ui/AuthImagePanel/AuthImagePanel';
import { Button, LabeledTextfield, Link } from '@/components/ui';
import { Box, Stack, Typography } from '@mui/material';

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
            label="email"
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
            <Link href="/auth/sign-in" size="thin">
              <Typography variant="subtitle2">log in</Typography>
            </Link>
          </Stack>
        </Box>
      </AuthFormContainer>

      <AuthImagePanel />
    </>
  );
};

export default ForgotPassword;
