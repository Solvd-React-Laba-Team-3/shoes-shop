'use client';

import { FC } from 'react';
import MUITooltip, { TooltipProps } from '@mui/material/Tooltip';
import { StyledLabelWrapper, StyledTooltipContent } from './tooltip.styles';

export const Tooltip: FC<TooltipProps> = ({ children, ...props }) => {
  return (
    <StyledLabelWrapper>
      <MUITooltip enterTouchDelay={0} leaveTouchDelay={3000} {...props}>
        <StyledTooltipContent> {children}</StyledTooltipContent>
      </MUITooltip>
    </StyledLabelWrapper>
  );
};
