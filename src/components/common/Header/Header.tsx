'use client';

import { useSession } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { Link } from '@/components/ui';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '45px 40px',
  height: '100px',
}));

export const Header = () => {
  const { data: session } = useSession();

  return (
    <StyledContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '44px' }}>
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={40} height={30} />
        </Link>
        <Typography variant="subtitle2">Products</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        {/* <Search /> */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/cart">
            <ShoppingBasketIcon />
          </Link>
          <Avatar
            src={session ? '/avatar-placeholder.png' : ''}
            sx={{ width: '24px', height: '24px' }}
          />
        </Box>
      </Box>
    </StyledContainer>
  );
};
