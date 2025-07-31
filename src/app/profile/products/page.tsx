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
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '108px' }}>
      <Box sx={{ position: 'relative' }}>
        <Image
          src="/profile-banner.png"
          alt="My Products"
          width={1500}
          height={250}
          style={{ height: '250px', width: '100%' }}
        />
        <Box
          sx={{
            display: 'flex',
            gap: '26px',
            alignItems: 'center',
            position: 'absolute',
            left: '58px',
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
          <Button size="small" onClick={() => router.push('/products/create')}>
            Add Product
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {session?.user?.products?.length ? (
            <ProductList products={session?.user?.products} type="actionMenu" />
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
                  Post can contain video, images and text.
                </Typography>
              </Box>

              <Button
                size="small"
                onClick={() => router.push('/products/create')}
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
