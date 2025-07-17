import Typography from '@mui/material/Typography';
import { Button, LabeledTextfield, Link } from '../ui';
import { Box, Stack } from '@mui/material';

export const SignUp = () => {
  return (
    <>
      <Typography variant="h2">Create an account</Typography>
      <Typography
        variant="caption"
        component="p"
        sx={(theme) => ({
          margin: '16px 0 48px 0',
          color: theme.palette.text.secondary,
        })}
      >
        Create an account to get an easy access to your dream shopping
      </Typography>
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
          id="name"
          label="Name"
          required
          placeholder="Hayman Andrews"
        />
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
          placeholder="at least 8 characters"
          type="password"
        />
        <LabeledTextfield
          id="confirmPassword"
          label="Confirm password"
          required
          placeholder="at least 8 characters"
          type="password"
        />
        <Button type="submit" size="large" sx={{ margin: '90px 0 16px 0' }}>
          Sign up
        </Button>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Box width="calc(100% - 100px)">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="subtitle2"
              component="p"
              sx={{ color: 'text.secondary' }}
            >
              Already have an account?
            </Typography>
            {/* <Link href="/signin" size="thin">
              Log in
            </Link> */}
            <Link href="/signin" size="thin">
              <Typography variant="subtitle2">
                Log in
              </Typography>
            </Link>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
