'use client';

import MUILink from '@mui/material/Link';
import { LinkProps as MUILinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import { FC } from 'react';

const sizeStyles = {
  thin: {
    fontSize: '15px',
    fontWeight: 300,
  },
  medium: {
    fontSize: '16px',
    fontWeight: 500,
  },
  small: {
    fontSize: '15px',
    fontWeight: 600,
  },
};

export const StyledLink = styled(MUILink)<Omit<LinkProps, 'href'>>(
  ({ theme, active, size = 'medium' }) => ({
    color:
      active || size !== 'medium'
        ? theme.palette.primary.main
        : theme.palette.text.primary,
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',

    '&:hover': {
      textDecoration: 'underline',
    },
    ...sizeStyles[size as keyof typeof sizeStyles],
  })
);

interface LinkProps extends MUILinkProps {
  href: string;
  size?: 'regular' | 'small' | 'thin';
  active?: boolean;
}

export const Link: FC<LinkProps> = ({ href, active = false, ...props }) => {
  return (
    <NextLink style={{ textDecoration: 'none' }} href={href}>
      <StyledLink active={active} {...props} />
    </NextLink>
  );
};
