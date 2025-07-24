'use client';

import { Box, Drawer } from '@mui/material';
import dynamic from 'next/dynamic';

interface FiltersWrapperProps {
  open?: boolean;
  onClose?: () => void;
}

const Filters = dynamic(
  () => import('@/components/Filters/Filters').then((module) => module.Filters),
  {
    ssr: false,
  }
);
export const FiltersWrapper: React.FC<FiltersWrapperProps> = ({
  onClose,
  open = true,
}) => (
  <Drawer
    open={open}
    sx={{ width: '400px' }}
    onClose={onClose}
    variant="persistent"
    anchor="left"
    slotProps={{ paper: { sx: { border: 'none' } } }}
  >
    <Box
      sx={{ paddingLeft: '40px', overflowX: 'hidden', paddingBottom: '200px' }}
    >
      <Filters />
    </Box>
  </Drawer>
);
