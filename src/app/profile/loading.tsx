'use client';
import { theme } from '@/providers/ThemeProvider';
import { useMediaQuery } from '@mui/material';
import { Loading } from '@/components/ui';

export default function LoadingPage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  return <Loading fullScreen={isMobile} />;
}
