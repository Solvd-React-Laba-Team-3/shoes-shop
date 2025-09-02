import { Box, styled, Typography } from '@mui/material';
import { FC, PropsWithChildren, ReactNode } from 'react';

interface EmptyProductListProps extends PropsWithChildren {
  icon: ReactNode;
  message: string;
  caption: string;
}

const StyledNoProductsWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '30px',
  height: 'calc(100vh - 300px)',
  textAlign: 'center',
}));

export const EmptyProductList: FC<EmptyProductListProps> = ({
  icon,
  message,
  caption,
  children,
}) => {
  return (
    <StyledNoProductsWrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {icon}
        <Typography variant="h6" component={'h3'}>
          {message}
        </Typography>
        <Typography variant="caption" component={'p'}>
          {caption}
        </Typography>
      </Box>
      {children}
    </StyledNoProductsWrapper>
  );
};
