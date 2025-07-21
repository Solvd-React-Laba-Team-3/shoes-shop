import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';

interface SearchContainerProps {
  expandOnFocus?: boolean;
  size?: 'small' | 'medium';
}

interface StyledInputBaseProps {
  expandOnFocus?: boolean;
  size?: 'small' | 'medium';
}

export const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expandOnFocus' && prop !== 'size',
})<SearchContainerProps>(
  ({ theme, expandOnFocus = false, size = 'small' }) => ({
    position: 'relative',
    borderRadius: 42,
    marginLeft: 0,
    width: size === 'small' ? theme.spacing(35) : theme.spacing(40),
    height: size === 'small' ? theme.spacing(4) : theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.palette.grey[900]}`,
    transition: 'all 0.5s ease',
    transform: 'scale(1)',

    '& svg': {
      width: size === 'small' ? 18 : 21,
      height: size === 'small' ? 18 : 21,
      transition: 'all 0.5s',
    },

    ...(expandOnFocus && {
      '&:focus-within': {
        width: 1071,
        maxWidth: 1071,
        height: 79,
        paddingLeft: theme.spacing(1),
        border: `1.5px solid ${theme.palette.grey[900]}`,

        '& svg': {
          width: 32,
          height: 32,
        },
      },
    }),
  })
);

export const SearchIconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

export const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'expandOnFocus' && prop !== 'size',
})<StyledInputBaseProps>(
  ({ theme, expandOnFocus = false, size = 'small' }) => ({
    fontSize: 15,
    fontWeight: 500,
    color: theme.palette.grey[700],
    flex: 1,

    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      transition: theme.transitions.create(['width', 'font-size'], {
        duration: theme.transitions.duration.short,
      }),
      width: '100%',
    },

    ...(size === 'small' && {
      '& .MuiInputBase-input': {
        position: 'relative',
        left: -5,
      },
    }),

    ...(expandOnFocus && {
      '&.Mui-focused .MuiInputBase-input': {
        fontSize: 25,
        fontWeight: 400,
      },
    }),
  })
);
