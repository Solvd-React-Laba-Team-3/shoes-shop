'use client';

import { useState, MouseEvent } from 'react';
import { Box, Menu, MenuItem, ListItemText, styled } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Link from 'next/link';
import { IconButton } from '@/components/ui';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  zIndex: 2,
  backgroundColor: 'transparent',
  color: theme.palette.secondary.main,
  transition: 'color 0.2s ease-in, background-color 0.2s ease-in',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(255,255,255, 0.5)',
  },
}));

export default function ProductActionMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <StyledIconButton color="secondary" onClick={handleClick}>
        <MoreHorizIcon />
      </StyledIconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiListItemText-primary': {
            fontSize: '13px',
            fontWeight: 300,
          },
          '& .MuiPaper-root': {
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <MenuItem onClick={handleClose} component={Link} href={`/view`}>
          <ListItemText primary="View" />
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemText primary="Edit" />
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemText primary="Duplicate" />
        </MenuItem>

        <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </Box>
  );
}
