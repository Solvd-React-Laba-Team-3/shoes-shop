import { Box, Typography } from '@mui/material';

import { ReactNode } from 'react';

type AuthFormContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export const AuthFormContainer = ({
  title,
  description,
  children,
  footer,
}: AuthFormContainerProps) => (
  <Box sx={{ margin: '20% auto', position: 'relative' }}>
    <Typography variant="h2">{title}</Typography>

    {description && (
      <Typography
        variant="caption"
        component="p"
        sx={(theme) => ({
          margin: '16px 0 48px 0',
          color: theme.palette.text.secondary,
        })}
      >
        {description}
      </Typography>
    )}

    {children}

    {footer && (
      <Box display="flex" justifyContent="flex-end">
        <Box width="calc(100% - 100px)">{footer}</Box>
      </Box>
    )}
  </Box>
);
