'use client';

import { useSession } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { styled, useTheme } from '@mui/material/styles';
import { Button, IconButton, Link } from '@/components/ui';
import { HEADER_HEIGHT } from '@/constants/headerHeight';
import { useRouter } from 'next/navigation';
import { MainSearchBar } from '@/components/MainSearchBar';
import logo from '../../../../public/logo.png';
import { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { useMediaQuery } from '@mui/material';
import { useHideOnScroll } from '@/lib/hooks';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '45px 40px',
  height: HEADER_HEIGHT,
  position: 'sticky',
  top: 0,
  backgroundColor: theme.palette.secondary.contrastText,
  zIndex: 900,
  transition: 'transform 0.2s ease-in-out',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: '18px 10px 14px 20px',
  },
}));

export const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hidden = useHideOnScroll();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <StyledContainer
        sx={{
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/">
            <Image src={logo} alt="logo" width={40} height={30} />
          </Link>
          {
            <Typography
              sx={{ display: { xs: 'none', md: 'inline' } }}
              variant="subtitle2"
              component={'span'}
            >
              Products
            </Typography>
          }
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { sx: '0', md: '40px' },
          }}
        >
          {!session && (
            <Button
              variant="outlined"
              sx={{ display: { xs: 'none', md: 'block' } }}
              size="small"
              onClick={() => router.push('/auth/sign-in')}
            >
              Sign in
            </Button>
          )}
          <MainSearchBar />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: '10px', md: '20px' },
            }}
          >
            <IconButton
              onClick={() => router.push('/cart')}
              color="secondary"
              sx={{ padding: 0 }}
            >
              <LocalMallOutlinedIcon fontSize="medium" />
            </IconButton>
            {session && (
              <Link
                href={session ? '/profile/products' : '/auth/sign-in'}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                <Avatar
                  src={session.user?.avatar?.url}
                  sx={{ width: '28px', height: '28px' }}
                />
              </Link>
            )}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton
                color="secondary"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <MenuIcon />
              </IconButton>
              {isMobile && (
                <Sidebar
                  open={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                />
              )}
            </Box>
          </Box>
        </Box>
      </StyledContainer>
    </>
  );
};
