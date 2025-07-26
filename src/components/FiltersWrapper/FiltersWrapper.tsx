'use client';

import { Box } from '@mui/material';
import { Filters } from '../Filters/';

interface FiltersWrapperProps {
  open?: boolean;
  onClose?: () => void;
}

export const FiltersWrapper: React.FC<FiltersWrapperProps> = () => (
  <Box sx={{ overflowX: 'hidden', paddingBottom: '200px', minWidth: '320px' }}>
    <Filters />
  </Box>
);
