'use client';
import { useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

export function useDeviceSize() {
  const { breakpoints } = useTheme();

  const breakpoint = breakpoints.values.md;

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : true
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < breakpoint);
      setIsInitialized(true);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return { isMobile, isInitialized };
}
