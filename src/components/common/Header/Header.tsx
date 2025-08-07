'use client';

import { useSession } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ListIcon from '@mui/icons-material/List';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { Button, IconButton, Link } from '@/components/ui';
import { HEADER_HEIGHT } from '@/constants/headerHeight';
import { useRouter } from 'next/navigation';
import { MainSearchBar } from '@/components/MainSearchBar';
import logo from '../../../../public/logo.png';
import { useDeviceSize } from '@/lib/hooks';
import { useState } from 'react';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '45px 40px',
  height: HEADER_HEIGHT,
}));

export const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const { isMobile } = useDeviceSize();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {isMobile && (
        <>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <ListIcon />
          </IconButton>
        </>
      )}
      <StyledContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/">
            <Image src={logo} alt="logo" width={40} height={30} />
          </Link>
          <Typography variant="subtitle2">Products</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {!session && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => router.push('/auth/sign-in')}
            >
              Sign in
            </Button>
          )}
          <MainSearchBar />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <IconButton
              onClick={() => router.push('/cart')}
              color="secondary"
              sx={{ padding: 0 }}
            >
              <ShoppingBasketOutlinedIcon fontSize="medium" />
            </IconButton>
            {session && (
              <Link href={session ? '/profile/products' : '/auth/sign-in'}>
                <Avatar
                  src={session.user?.avatar?.url}
                  sx={{ width: '28px', height: '28px' }}
                />
              </Link>
            )}
          </Box>
        </Box>
      </StyledContainer>
    </>
  );
};
