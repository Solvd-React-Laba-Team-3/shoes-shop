import Typography from '@mui/material/Typography';
import { Button, LabeledTextfield, Link } from '../ui';
import { Box, Paper, Stack } from '@mui/material';
import AuthLayout from '../AuthLayout/AuthLayout';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import Image from 'next/image';

const FeedbackPaper = styled(Paper)(({ theme }) => ({
  color: theme.palette.text.secondary,
  boxSizing: 'border-box',
  background: `
    radial-gradient(55.99% 112.1% at 69.71% 44.01%, rgba(253, 253, 253, 0.074) 0%, rgba(0, 0, 0, 0) 100%),
    radial-gradient(64.9% 185.04% at 19.81% 27.89%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.06) 100%)
  `,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '32px',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  position: 'sticky',
  left: '1062px',
  top: '340px',
}));

export const SignUp = () => {
  return (
    <>
      <AuthLayout>
        <Box sx={{ margin: '0 auto' }}>
          <Image
            src="/register-logo.png" 
            alt="register logo"
            width={500}
            height={400}
          />
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
                  <Typography variant="subtitle2">Log in</Typography>
                </Link>
              </Stack>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundImage: 'url(/register.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            width: '100%',
          }}
        >
          <FeedbackPaper>
            <Typography variant="h4" component="p" textAlign="center">
              &quot; Lorem Ipsum is a really great company because the team is
              passionate about the projects they produce, the people they work
              with, the quality of the work they do.&quot;
            </Typography>

            <Stack
              spacing={1}
              alignItems="center"
              sx={{ margin: '16px 0 4px' }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  sx={(theme) => ({
                    color: theme.palette.text.primary,
                  })}
                >
                  John Stone
                </Typography>
                <Rating name="size-large" defaultValue={5} size="large" />
              </Stack>
            </Stack>
            <Typography variant="caption" sx={{ fontSize: '18px' }}>
              Ukraine, Chernivtsi
            </Typography>
          </FeedbackPaper>
        </Box>
      </AuthLayout>
    </>
  );
};
