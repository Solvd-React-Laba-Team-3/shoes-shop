import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { FC, PropsWithChildren, ReactNode } from 'react';

interface EmptyContentProps extends PropsWithChildren {
  icon: ReactNode;
  message: string;
  caption: string;
}

const StyledEmptyContentWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '30px',
  height: 'calc(100vh - 300px)',
  textAlign: 'center',
}));

export const EmptyContent: FC<EmptyContentProps> = ({
  icon,
  message,
  caption,
  children,
}) => {
  return (
    <StyledEmptyContentWrapper>
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
    </StyledEmptyContentWrapper>
  );
};
