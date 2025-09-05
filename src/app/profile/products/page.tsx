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
import { EmptyContent } from '@/components/EmptyContent';

const StyledBusinessCenterIcon = styled(BusinessCenterIcon)(({ theme }) => ({
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.grey[200],
  padding: '20px',
  borderRadius: '50%',
  width: '72px',
  height: '72px',
}));

const StyledAvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '26px',
  alignItems: 'center',
  position: 'absolute',
  left: '58px',
  bottom: '-90px',

  [theme.breakpoints.down('md')]: {
    gap: '12px',
    left: 0,
  },
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
        <StyledAvatarContainer>
          <Avatar
            src={session?.user?.avatar?.url}
            alt="Avatar"
            sx={{
              border: (theme) => `4px solid ${theme.palette.common.white}`,
              width: '120px',
              height: '120px',
            }}
          />
          <Box paddingTop="10px">
            <Typography
              variant="h6"
              component={'p'}
              whiteSpace="pre-wrap"
              lineHeight="1.2"
            >
              {session?.user?.username}
            </Typography>
            <Typography variant="caption" component={'p'}>
              {`Joined in ${new Date(
                session?.user?.createdAt || ''
              ).toLocaleDateString()}`}
            </Typography>
          </Box>
        </StyledAvatarContainer>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h2" component={'h1'}>
            My Products
          </Typography>
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
            <EmptyContent
              icon={<StyledBusinessCenterIcon />}
              message="You don't have any products yet"
              caption="Start adding products to your profile"
            >
              <Button
                size="small"
                onClick={() => router.push('/profile/products/create')}
              >
                Add Product
              </Button>
            </EmptyContent>
          )}
        </Box>
      </Box>
    </Box>
  );
}
