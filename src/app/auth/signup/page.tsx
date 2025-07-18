import AuthLayout from '@/app/auth/layout';
import { AuthFormContainer } from '@/components/AuthFormContainer/AuthFormContainer';
import { ReviewWithBackground } from '@/components/ReviewPanel/ReviewWithBackground';
import { Button, LabeledTextfield, Link } from '@/components/ui';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';

export const SignUp = () => {
  const handlePrev = () => console.log('Previous feedback');
  const handleNext = () => console.log('Next feedback');

  return (
    <AuthLayout>
      <Box sx={{ position: 'absolute', top: '50px', left: '40px' }}>
        <Image
          src="/logo-register.png"
          alt="register logo"
          width={40}
          height={30}
        />
      </Box>

      <AuthFormContainer
        title="Create an account"
        description="Create an account to get easy access to your dream shopping"
        footer={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" component="p" color="textSecondary">
              Already have an account?
            </Typography>
            <Link href="/signin" size="thin">
              <Typography variant="subtitle2">Log in</Typography>
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
            type="password"
          />
          <LabeledTextfield
            id="confirmPassword"
            label="Confirm password"
            required
            type="password"
          />
          <Button type="submit" size="large" sx={{ margin: '90px 0 16px 0' }}>
            Sign up
          </Button>
        </Box>
      </AuthFormContainer>

      <ReviewWithBackground
        backgroundImage="/register.jpg"
        quote="Lorem Ipsum is a really great company because the team is passionate about the projects they produce, the people they work with, the quality of the work they do."
        name="John Stone"
        location="Ukraine, Chernivtsi"
        rating={5}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </AuthLayout>
  );
};
