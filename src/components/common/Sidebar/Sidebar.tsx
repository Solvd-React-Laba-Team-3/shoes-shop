'use client';
import Box from '@mui/material/Box';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HistoryIcon from '@mui/icons-material/History';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PreviewIcon from '@mui/icons-material/Preview';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { signOut, useSession } from 'next-auth/react';
import { Button, Link } from '@/components/ui';
import { usePathname } from 'next/navigation';
import { HEADER_HEIGHT } from '@/constants/headerHeight';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import { FC } from 'react';

export const Sidebar: FC<DrawerProps> = ({ open = true, ...props }) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    {
      label: 'My Products',
      icon: <StorefrontIcon />,
      href: '/products',
    },
    {
      label: 'Order history',
      icon: <HistoryIcon />,
      href: '/history',
    },
    {
      label: 'My Wishlist',
      icon: <LoyaltyIcon />,
      href: '/wishlist',
    },
    {
      label: 'Recently viewed',
      icon: <PreviewIcon />,
      href: '/recently-viewed',
    },
    {
      label: 'Settings',
      icon: <SettingsIcon />,
      href: '/settings',
    },
  ];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: '320px',
        zIndex: 100,

        '& .MuiPaper-root': {
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          position: 'sticky',
          top: 0,
        },
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '32px 40px',
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
    </Drawer>
  );
};
