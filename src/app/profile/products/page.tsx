'use client';

import { Button } from '@/components/ui';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { styled } from '@mui/material/styles';
import { ProductList } from '@/components/ProductList';
import profileBanner from '../../../../public/profile-banner.png';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProductsOptions } from '@/api/products/getUserProductsOptions';

const StyledBusinessCenterIcon = styled(BusinessCenterIcon)(({ theme }) => ({
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.grey[200],
  padding: '20px',
  borderRadius: '50%',
  width: '72px',
  height: '72px',
}));

const StyledNoProductsWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '30px',
  height: 'calc(100vh - 800px)',
}));

export default function MyProducts() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: products } = useSuspenseQuery(
    getUserProductsOptions(session?.user.accessToken || '')
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '108px' }}>
      <Box sx={{ position: 'relative' }}>
        <Image
          src={profileBanner}
          alt="My Products"
          width={1500}
          height={250}
          style={{ height: '250px', width: '100%' }}
        />
        <Box
          sx={{
            display: 'flex',
            gap: { xs: '12px', md: '26px' },
            alignItems: 'center',
            position: 'absolute',
            left: { md: '58px' },
            bottom: '-90px',
          }}
        >
          <Avatar
            src={session?.user?.avatar?.url}
            alt="Avatar"
            sx={{
              border: (theme) => `4px solid ${theme.palette.common.white}`,
              width: '120px',
              height: '120px',
            }}
          />
          <Box>
            <Typography variant="h6">{session?.user?.username}</Typography>
            <Typography variant="caption">
              {`Joined in ${new Date(
                session?.user?.createdAt || ''
              ).toLocaleDateString()}`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h2">My Products</Typography>
          <Button
            size="small"
            onClick={() => router.push('/profile/products/create')}
          >
            Add Product
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {products?.length ? (
            <ProductList products={products} variant="actionMenu" />
          ) : (
            <StyledNoProductsWrapper>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <StyledBusinessCenterIcon />
                <Typography variant="h6">
                  {"You don't have any products yet"}
                </Typography>
                <Typography variant="caption">
                  Start adding products to your profile
                </Typography>
              </Box>

              <Button
                size="small"
                onClick={() => router.push('/profile/products/create')}
              >
                Add Product
              </Button>
            </StyledNoProductsWrapper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
