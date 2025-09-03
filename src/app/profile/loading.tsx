'use client';
import { Loading } from '@/components/common/Loading';
import { theme } from '@/providers/ThemeProvider';
import { useMediaQuery } from '@mui/material';

export default function LoadingPage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  return <Loading fullScreen={isMobile} />;
}
