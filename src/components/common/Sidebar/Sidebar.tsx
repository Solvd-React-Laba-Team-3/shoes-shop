'use client';
import Box from '@mui/material/Box';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HistoryIcon from '@mui/icons-material/History';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import PreviewIcon from '@mui/icons-material/Preview';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { signOut, useSession } from 'next-auth/react';
import { Button as MuiButton, IconButton, Link } from '@/components/ui';
import { usePathname } from 'next/navigation';
import { HEADER_HEIGHT } from '@/constants/headerHeight';
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';
import { FC } from 'react';
import { styled, useMediaQuery, useTheme } from '@mui/material';

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
  maxWidth: '320px',
  zIndex: isMobile ? 1000 : 800,
  width: '320px',
  position: 'relative',

  [theme.breakpoints.down('lg')]: {
    width: '260px',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    position: 'fixed',
  },

  '& .MuiDrawer-paper': {
    border: 'none',
    paddingBottom: '200px',
    top: isMobile ? 0 : HEADER_HEIGHT,
  },
  '& .MuiPaper-root': {
    position: isMobile ? 'fixed' : 'sticky',
  },
}));

const CloseButtonContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingBottom: '8px',
  paddingTop: '12px',
  width: '100%',
}));

const UserInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '32px 40px',
  width: '100%',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const LogoutButton = styled(MuiButton)(() => ({
  padding: '0 0 0 4px',
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
  height: '25px',
}));

export const Sidebar: FC<DrawerProps> = ({ open = false, ...props }) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    {
      label: 'My Products',
      icon: <StorefrontIcon />,
      href: '/profile/products',
    },
    {
      label: 'Order history',
      icon: <HistoryIcon />,
      href: '/profile/orders',
    },
    {
      label: 'My Wishlist',
      icon: <LoyaltyIcon />,
      href: '/profile/wishlist',
    },
    {
      label: 'Recently viewed',
      icon: <PreviewIcon />,
      href: '/profile/recently-viewed',
    },
    {
      label: 'Settings',
      icon: <SettingsIcon />,
      href: '/profile/settings',
    },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledDrawer
      isMobile={isMobile}
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor={isMobile ? 'right' : 'left'}
      open={isMobile ? open : true}
      {...props}
    >
      {isMobile && (
        <CloseButtonContainer>
          <IconButton
            sx={{
              cursor: 'pointer',
              zIndex: 1000,
              color: 'text.secondary',
            }}
            onClick={(e) => props.onClose?.(e, 'backdropClick')}
          >
            <CloseIcon />
          </IconButton>
        </CloseButtonContainer>
      )}
      {session ? (
        <>
          <UserInfoContainer>
            <Avatar
              src={session?.user?.avatar?.url}
              alt="Avatar"
              sx={{ width: '64px', height: '64px' }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography
                variant="subtitle2"
                component={'span'}
                color="textDisabled"
              >
                Welcome
              </Typography>
              <Typography
                variant="subtitle2"
                component={'span'}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: { xs: '140px', md: '140px', lg: '200px' },
                  wordBreak: 'break-word',
                }}
              >
                {session?.user?.username}
              </Typography>
            </Box>
          </UserInfoContainer>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '36px',
              padding: '32px 40px',
            }}
          >
            {navLinks.map((link) => (
              <Link
                onClick={() => props.onClose?.({}, 'backdropClick')}
                key={link.href}
                href={link.href}
                active={pathname.includes(link.href)}
                variant="subtitle2"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <LogoutButton
              variant="text"
              size="small"
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              color="secondary"
            >
              <Typography
                variant="subtitle2"
                component={'span'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                <LogoutIcon fontSize="small" />
                Logout
              </Typography>
            </LogoutButton>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '36px',
            padding: '32px 40px',
          }}
        >
          <Link
            onClick={() => props.onClose?.({}, 'backdropClick')}
            href={'/auth/sign-in'}
            active={pathname.includes('/auth/sign-in')}
            variant="subtitle2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <LoginIcon fontSize="small" />
            Sign in
          </Link>
        </Box>
      )}
    </StyledDrawer>
  );
};
