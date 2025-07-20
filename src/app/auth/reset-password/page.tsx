'use client';
import { AuthFormContainer } from '@/components/ui/AuthFormContainer/AuthFormContainer';
import { AuthImagePanel } from '@/components/ui/AuthImagePanel/AuthImagePanel';
import { Button, LabeledTextfield, Link } from '@/components/ui';
import { Box, Stack, Typography } from '@mui/material';

const ResetPassword = () => {
  return (
    <>
      <AuthFormContainer
        title="Reset password"
        description="Please create new password here"
        footer={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" component="p" color="textSecondary">
              Back to
            </Typography>
            <Link href="/auth/sign-up" size="thin">
              <Typography variant="subtitle2">log in</Typography>
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
            id="password"
            label="Password"
            required
            type="password"
            placeholder="at least 8 characters"
          />
          <LabeledTextfield
            id="Confirm password"
            label="Confirm password"
            required
            type="password"
            placeholder="at least 8 characters"
          />

          <Button type="submit" size="large" sx={{ margin: '56px 0 24px' }}>
            Reset password
          </Button>
        </Box>
      </AuthFormContainer>

      <AuthImagePanel />
    </>
  );
};

export default ResetPassword;
