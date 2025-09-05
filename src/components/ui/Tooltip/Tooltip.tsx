'use client';

import { FC } from 'react';
import MUITooltip, { TooltipProps } from '@mui/material/Tooltip';
import { StyledLabelWrapper, StyledTooltipContent } from './tooltip.styles';

interface CustomTooltipProps extends TooltipProps {
  block?: boolean;
}

export const Tooltip: FC<CustomTooltipProps> = ({
  children,
  block = false,
  ...props
}) => {
  return (
    <StyledLabelWrapper block={block}>
      <MUITooltip enterTouchDelay={0} leaveTouchDelay={3000} {...props}>
        <StyledTooltipContent>{children}</StyledTooltipContent>
      </MUITooltip>
    </StyledLabelWrapper>
  );
};
