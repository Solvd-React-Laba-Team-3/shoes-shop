'use client';

import { IconButton } from '../ui';
import { FC } from 'react';
import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';

interface WishlistButtonProps {
  onRemove: () => void;
}

export const WishlistButton: FC<WishlistButtonProps> = ({ onRemove }) => {
  return (
    <IconButton color="secondary" onClick={onRemove}>
      <HeartBrokenOutlinedIcon />
    </IconButton>
  );
};
