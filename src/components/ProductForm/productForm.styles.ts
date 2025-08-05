import { InputLabel, TextareaAutosize } from '@mui/material';
import { styled } from '@mui/material/styles';

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
