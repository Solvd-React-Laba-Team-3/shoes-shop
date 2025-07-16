'use client';

import MUILink from '@mui/material/Link';
import { LinkProps as MUILinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import { FC } from 'react';

interface LinkProps extends MUILinkProps {
  size?: 'regular' | 'small' | 'thin';
  active?: boolean;
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

export const StyledLink = styled(MUILink)<Omit<LinkProps, 'href'>>(
  ({ theme, active, size = 'regular' }) => ({
    color:
      active || size !== 'regular'
        ? theme.palette.primary.main
        : theme.palette.text.primary,
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',

    '&:hover': {
      textDecoration: 'underline',
    },
    ...sizeStyles[size],
  })
);

export const Link: FC<LinkProps> = ({ href = '/', ...props }) => {
  return (
    <NextLink style={{ textDecoration: 'none' }} href={href}>
      <StyledLink {...props} />
    </NextLink>
  );
};
