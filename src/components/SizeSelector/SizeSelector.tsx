'use client';

import { FC } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getSizesOptions } from '@/api/size/getSizesOptions';
import { ToggleButton } from '../ui';

interface SizeSelector {
  availableSizes: number[];
  selectedSize: number | null;
  onSizeChange: (value: number | null) => void;
}

export const SizeSelector: FC<SizeSelector> = ({
  availableSizes,
  selectedSize,
  onSizeChange,
}) => {
  const { data } = useSuspenseQuery(getSizesOptions());

  return (
    <Stack direction="column" paddingBottom="36px">
      <Typography
        variant="h6"
        component={'h3'}
        paddingBottom="24px"
        color="text.secondary"
      >
        Select Size
      </Typography>
      <ToggleButtonGroup
        value={selectedSize}
        exclusive
        onChange={(_, value) => onSizeChange(value)}
        sx={{
          flexWrap: 'wrap',
          gap: { xs: '14px', sm: '24px' },
          width: '100%',
        }}
      >
        {data?.map((sizeAttributes) => {
          const size = sizeAttributes.value;
          const isAvailable = availableSizes.some((s) => s === size);
          return (
            <ToggleButton
              key={size}
              value={size}
              disabled={!isAvailable}
              aria-label={`size EU ${size}`}
            >
              EU-{size}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Stack>
  );
};
