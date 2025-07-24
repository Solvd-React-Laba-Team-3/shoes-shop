'use client';

import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';
import { IconButton, styled } from '@mui/material';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  zIndex: 2,
  backgroundColor: 'rgba(255,255,255, 0.25)',
  color: theme.palette.secondary.main,
  transition: 'color 0.2s ease-in, background-color 0.2s ease-in',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(255,255,255, 0.5)',
  },
}));

export function ProductWishlistButton({
  handleClick,
}: {
  handleClick?: () => void;
}) {
  return (
    <StyledIconButton onClick={handleClick}>
      <HeartBrokenOutlinedIcon />
    </StyledIconButton>
  );
}
