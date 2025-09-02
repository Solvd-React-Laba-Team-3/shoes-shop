import { InputLabel, TextareaAutosize } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToggleButton } from '../ui';
import { Button } from '@/components/ui';
import { ButtonProps } from '@mui/material/Button';

export const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const StyledTextArea = styled(TextareaAutosize)(({ theme }) => ({
  marginTop: '8px',
  padding: '18px',
  fontFamily: 'inherit',
  width: '100%',
  borderRadius: '8px',
  outline: 'none',
  minHeight: '276px',
  maxHeight: '276px',
  resize: 'none',
  ...theme.typography.caption,
}));

export const StyledToggleButton = styled(ToggleButton)(() => ({
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  padding: '6px 8px',
  minWidth: '50px !important',
  height: '38px !important',
  border: 'none !important',
  backgroundColor: 'rgba(247, 99, 94, 0.1)  ',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(247, 99, 94, 0.15)',
  },
}));

interface StyledAutocompleteButtonProps extends ButtonProps {
  isCollapsed: boolean;
}

export const StyledAutocompleteButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})<StyledAutocompleteButtonProps>(({ isCollapsed }) => ({
  transform: isCollapsed ? 'scaleX(0)' : 'scaleX(1)',
  transformOrigin: 'right center',
  pointerEvents: isCollapsed ? 'none' : 'auto',
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  transition: 'transform 0.2s ease-in-out',
  fontSize: '12px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  gap: '8px',
  '&:hover': {
    textDecoration: 'underline',
  },
}));
