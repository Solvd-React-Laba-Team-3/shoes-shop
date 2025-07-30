import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import { InputLabel, TextareaAutosize, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MenuItem } from '@/components/ui';

export const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: '15px',
}));

export const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  marginLeft: '-13px',
  fontSize: '17px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const StyledDescriptionLabel = styled(Typography)(({ theme }) => ({
  marginLeft: 0,
  fontSize: '15px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  borderRadius: '8px',
}));

export const StyledTextArea = styled(TextareaAutosize)(({ theme }) => ({
  marginTop: '8px',
  padding: '18px',
  fontFamily: 'inherit',
  width: '100%',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  outline: 'none',
  minHeight: '276px',
  maxHeight: '276px',
  resize: 'none',
  ...theme.typography.caption,
}));

export const StyledAiButton = styled(AutoFixHighOutlinedIcon)(({ theme }) => ({
  position: 'absolute',
  bottom: '12px',
  right: '12px',
  color: theme.palette.grey[600],
  cursor: 'pointer',
}));
