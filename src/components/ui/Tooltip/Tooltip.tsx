'use client';

import { FC, ReactNode } from 'react';
import Box from '@mui/material/Box';
import MUITooltip, {
  TooltipProps as MUITooltipProps,
} from '@mui/material/Tooltip';
import { StyledLabelWrapper, StyledTooltipContent } from './tooltip.styles';

interface TooltipProps extends Omit<MUITooltipProps, 'children'> {
  icon: ReactNode;
  label: string;
}

export const Tooltip: FC<TooltipProps> = ({ icon, label, title, ...props }) => (
  <StyledLabelWrapper>
    <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>
      {label}
    </Box>
    <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>{icon}</Box>
    <MUITooltip
      title={title}
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      {...props}
    >
      <StyledTooltipContent>{title}</StyledTooltipContent>
    </MUITooltip>
  </StyledLabelWrapper>
);
