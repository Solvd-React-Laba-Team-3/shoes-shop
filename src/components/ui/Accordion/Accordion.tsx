'use client';

import { FC, ReactNode } from 'react';
import {
  Accordion as MUIAccordion,
  AccordionProps,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface BaseAccordionProps extends AccordionProps {
  label: ReactNode;
}

export const Accordion: FC<BaseAccordionProps> = ({
  label,
  children,
  ...rest
}) => {
  return (
    <MUIAccordion
      disableGutters
      {...rest}
      sx={{
        boxShadow: 'none',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          minHeight: 48,
          padding: '0 20px 0 0',
          '& .MuiTypography-root': { margin: 0 },
          '& .MuiAccordionSummary-expandIconWrapper svg': {
            color: 'text.primary',
          },
        }}
      >
        {label}
      </AccordionSummary>

      <AccordionDetails
        sx={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </AccordionDetails>
    </MUIAccordion>
  );
};
