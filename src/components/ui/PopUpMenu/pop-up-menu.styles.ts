import { styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';

export const StyledMenu = styled(Menu)<MenuProps>(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.shape.borderRadius,
    minWidth: 75,
    boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.15)`,
    '& .MuiMenu-list': {
      padding: 0,
      marginBottom: 8,
    },
    '& .MuiMenuItem-root': {
      ...theme.typography.caption,
      lineHeight: '14px',
      color: theme.palette.text.primary,
      padding: 8,
      margin: 0,
      minHeight: 22,
    },
  },
}));
