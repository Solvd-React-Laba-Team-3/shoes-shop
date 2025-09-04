'use client';

import { IconButton } from '../ui';
import { FC } from 'react';
import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';

interface WishlistButtonProps {
  onRemove: () => void;
}

export const WishlistButton: FC<WishlistButtonProps> = ({ onRemove }) => {
  return (
    <IconButton
      data-testid="wishlist-button"
      color="secondary"
      onClick={onRemove}
    >
      <HeartBrokenOutlinedIcon />
    </IconButton>
  );
};
