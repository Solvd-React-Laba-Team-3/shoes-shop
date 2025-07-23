'use client';

import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import { FC } from 'react';

interface LinkProps extends TypographyProps {
  size?: 'regular' | 'small' | 'thin';
  active?: boolean;
  href?: string;
}

const sizeStyles = {
  thin: {
    fontSize: '15px',
    fontWeight: 300,
  },
  regular: {
    fontSize: '16px',
    fontWeight: 500,
  },
  small: {
    fontSize: '15px',
    fontWeight: 600,
  },
};

export const StyledTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'size',
})<Omit<LinkProps, 'href'>>(({ theme, active, size = 'regular' }) => ({
  color:
    active || size !== 'regular'
      ? theme.palette.primary.main
      : theme.palette.text.primary,
  textDecoration: 'none',
  transition: 'all 0.2s ease-in-out',
  fontFamily: 'Work Sans',

  '&:hover': {
    textDecoration: 'underline',
  },
  ...sizeStyles[size],
}));

export const Link: FC<LinkProps> = ({ href = '/', ...props }) => {
  return (
    <NextLink style={{ textDecoration: 'none', lineHeight: 0 }} href={href}>
      <StyledTypography as="span" {...props} />
    </NextLink>
  );
};
