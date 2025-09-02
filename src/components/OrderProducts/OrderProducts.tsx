import { theme } from '@/providers/ThemeProvider';
import { Avatar, useMediaQuery } from '@mui/material';
import { FC } from 'react';
import { CartProduct } from '@/types/CartProduct';
import { ItemLabel } from '../ItemLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface OrderProductsProps {
  products: CartProduct[];
}

const StyledOrderInfo = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: '8px 16px',
  gap: '24px',
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  display: 'none',

  [theme.breakpoints.down('lg')]: {
    display: 'flex',
  },

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const StyledProductWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
  padding: '16px',
  gap: '18px',
  backgroundColor: 'inherit',
  borderRadius: '8px',

  [theme.breakpoints.down('lg')]: {
    flexWrap: 'wrap',
  },
}));

export const OrderProducts: FC<OrderProductsProps> = ({ products }) => {
  const isBetweenMdAndLg = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isBetweenXsAndSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      <StyledOrderInfo>
        <Typography variant="subtitle1" sx={{ flex: 0.75 }}>
          Product
        </Typography>
        <Typography variant="subtitle1" sx={{ flex: 0.15, textAlign: 'right' }}>
          Qty.
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ flex: 0.15, mr: 2, textAlign: 'right' }}
        >
          Price
        </Typography>
      </StyledOrderInfo>
      {products.map((product) => (
        <StyledProductWrapper key={`${product.id}-${product.size}`}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              flex: { xs: 1, sm: 0.7, lg: 1.25 },
            }}
          >
            <Avatar
              src={product.image}
              alt={product.name}
              variant="rounded"
              sx={{
                width: { xs: 110, default: 80 },
                height: { xs: 110, default: 80 },
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" component={'p'}>
                {product.name}
              </Typography>
              <Typography
                variant="subtitle2"
                component={'p'}
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: theme.palette.grey[600],
                }}
              >
                {product.gender == 'Men' ? "Men's Shoes" : "Women's Shoes"}
              </Typography>
              <ItemLabel
                label="Size: "
                title={`${product.size} UK`}
                labelColor={theme.palette.grey[600]}
                valueColor={theme.palette.secondary.main}
              />

              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="subtitle2"
                  component={'p'}
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.grey[600],
                  }}
                >
                  Price:{' '}
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    {product.price}$
                  </Typography>
                </Typography>

                <ItemLabel
                  label={!isBetweenMdAndLg ? 'Quantity: ' : ''}
                  title={product.quantity}
                  labelColor={theme.palette.grey[600]}
                  valueColor={theme.palette.secondary.main}
                />
              </Box>
            </Box>
          </Box>
          {!isBetweenXsAndSm && (
            <>
              <Box
                sx={{
                  flex: { xs: 0.15, lg: 1 },
                  textAlign: { xs: 'left', lg: 'center' },
                }}
              >
                <Typography
                  variant="subtitle2"
                  component={'p'}
                  sx={{
                    color: theme.palette.grey[600],
                    textAlign: 'right',
                  }}
                >
                  {!isBetweenMdAndLg ? 'Quantity: ' : ''}
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ color: theme.palette.secondary.main }}
                  >
                    {product.quantity}
                  </Typography>
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: { xs: 0.15, lg: 1 },
                  textAlign: 'right',
                  mr: 2,
                }}
              >
                <ItemLabel
                  label={!isBetweenMdAndLg ? 'Price: ' : ''}
                  title={`${product.price}$`}
                  labelColor={theme.palette.grey[600]}
                  valueColor={theme.palette.secondary.main}
                />
              </Box>
            </>
          )}
        </StyledProductWrapper>
      ))}
    </Box>
  );
};
