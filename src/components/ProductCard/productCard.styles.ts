import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const StyledCard = styled(Card)({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  position: 'relative',
  borderRadius: 0,
});

export const StyledCardActionArea = styled(CardActionArea)({
  '&:hover, &:focus, &:active': {
    backgroundColor: 'transparent',
  },
  '& .MuiCardActionArea-focusHighlight': {
    backgroundColor: 'transparent',
  },
  touchAction: 'pan-y',
});

export const StyledCardContent = styled(CardContent)({
  padding: '12px 0 0 0',
});

export const ActionButtonContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  zIndex: 2,
  '& .MuiIconButton-root': {
    backgroundColor: 'transparent',
    transition: 'color 0.2s ease-in, background-color 0.2s ease-in',
  },
  '& .MuiIconButton-root:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
}));
