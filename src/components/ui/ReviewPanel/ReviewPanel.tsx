'use client';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Paper, Rating, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconButton } from '../IconButton/IconButton';
import { FC } from 'react';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `
    radial-gradient(55.99% 112.1% at 69.71% 44.01%, rgba(253, 253, 253, 0.074) 0%, rgba(0, 0, 0, 0) 100%),
    radial-gradient(64.9% 185.04% at 19.81% 27.89%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.06) 100%)
  `,
  backdropFilter: 'blur(20px)',
  borderRadius: '32px',
  padding: theme.spacing(4),
  justifyItems: 'start',
  width: '756px',
  position: 'absolute',
  right: '5%',
  bottom: '10%',
  display: 'grid',

  [theme.breakpoints.down('xxl')]: {
    display: 'none',
  },
}));

interface ReviewPanelProps {
  quote: string;
  name: string;
  location: string;
  rating: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export const ReviewPanel: FC<ReviewPanelProps> = ({
  quote,
  name,
  location,
  rating,
  onPrev,
  onNext,
}) => (
  <StyledPaper>
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h4" component="p" sx={{ flex: 1 }}>
        “ {quote} ”
      </Typography>
      <Stack
        sx={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '15px',
        }}
      >
        <IconButton onClick={onPrev}>
          <ArrowBackIosIcon fontSize="small" color="secondary" />
        </IconButton>
        <IconButton onClick={onNext}>
          <ArrowForwardIosIcon fontSize="small" color="secondary" />
        </IconButton>
      </Stack>
    </Box>

    <Stack
      spacing={1}
      alignItems="center"
      sx={{
        margin: '16px 0 4px',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h4">{name}</Typography>
        <Rating value={rating} readOnly size="large" />
      </Stack>
    </Stack>

    <Typography variant="caption" sx={{ fontSize: '18px' }}>
      {location}
    </Typography>
  </StyledPaper>
);
