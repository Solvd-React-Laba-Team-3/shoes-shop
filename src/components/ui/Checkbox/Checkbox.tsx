'use client';

import { FC } from 'react';
import { styled } from '@mui/material/styles';
import MUICheckbox, { CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

type LabeledCheckboxProps = CheckboxProps & {
  label?: React.ReactNode;
};

const StyledCheckbox = styled(MUICheckbox)<CheckboxProps>(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 16,
  },
  padding: 0,
  borderRadius: 2,
  marginLeft: 0,
}));

export const Checkbox: FC<LabeledCheckboxProps> = ({ label, ...rest }) => {
  const control = <StyledCheckbox disableRipple {...rest} />;

  return label ? (
    <FormControlLabel
      control={control}
      label={<Typography variant="body2">{label}</Typography>}
      sx={{ gap: '12px', marginLeft: '0px' }}
    />
  ) : (
    control
  );
};
