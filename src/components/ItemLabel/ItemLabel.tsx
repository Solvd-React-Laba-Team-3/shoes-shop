import { FC, ReactNode } from 'react';
import Typography from '@mui/material/Typography';

interface ItemLabelProps {
  label?: string;
  title: ReactNode;
  valueColor?: string;
  labelColor?: string;
}

export const ItemLabel: FC<ItemLabelProps> = ({
  label,
  title,
  valueColor,
  labelColor,
}) => {
  return (
    <Typography
      variant="subtitle2"
      sx={{ color: (theme) => labelColor ?? theme.palette.grey[600] }}
    >
      {label}
      <Typography
        component="span"
        variant="subtitle1"
        sx={{ color: (theme) => valueColor ?? theme.palette.secondary.main }}
      >
        {title}
      </Typography>
    </Typography>
  );
};
