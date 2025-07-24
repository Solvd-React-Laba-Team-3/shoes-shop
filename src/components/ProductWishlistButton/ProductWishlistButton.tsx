'use client';

import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';
import { IconButton } from '../ui';
import { FC } from 'react';

type ProductWishlistButton = {
  handleClick?: () => void;
};

export const ProductWishlistButton: FC<ProductWishlistButton> = ({
  handleClick,
}) => {
  return (
    <IconButton color="secondary" onClick={handleClick}>
      <HeartBrokenOutlinedIcon />
    </IconButton>
  );
};
