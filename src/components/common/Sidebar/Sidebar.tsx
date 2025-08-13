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
import { Button, IconButton, Link } from '@/components/ui';
import { usePathname } from 'next/navigation';
import { HEADER_HEIGHT } from '@/constants/headerHeight';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import { FC } from 'react';
import { useDeviceSize } from '@/lib/hooks';

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

  const { isMobile } = useDeviceSize();

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor={isMobile ? 'right' : 'left'}
      open={!isMobile || open}
      sx={{
        minWidth: '320px',
        zIndex: 100,

        '& .MuiDrawer-paper': {
          border: 'none',
          paddingBottom: '200px',
          top: { xs: 0, md: HEADER_HEIGHT },
        },
        '& .MuiPaper-root': {
          position: { md: 'sticky' },
        },

        position: { md: 'relative' },
      }}
      {...props}
    >
      {isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingBottom: '8px',
            paddingTop: '12px',
            width: '320px',
          }}
        >
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
        </Box>
      )}
      {session ? (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '32px 40px',
              width: '320px',
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Avatar
              src={session?.user?.avatar?.url}
              alt="Avatar"
              sx={{ width: '64px', height: '64px' }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 500 }}
                color="textDisabled"
              >
                Welcome
              </Typography>
              <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
                {session?.user?.username}
              </Typography>
            </Box>
          </Box>

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

            <Button
              variant="text"
              sx={{
                padding: '0 0 0 4px',
                justifyContent: 'flex-start',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
                height: '25px',
              }}
              size="small"
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              color="secondary"
            >
              <Typography
                variant="subtitle2"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                <LogoutIcon fontSize="small" />
                Logout
              </Typography>
            </Button>
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
    </Drawer>
  );
};
