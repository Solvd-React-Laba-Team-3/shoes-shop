'use client';

import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';
import { IconButton } from '../ui';

export function ProductWishlistButton({
  handleClick,
}: {
  handleClick?: () => void;
}) {
  return (
    <IconButton color="secondary" onClick={handleClick}>
      <HeartBrokenOutlinedIcon />
    </IconButton>
  );
}
