'use client';

import { HydrationBoundary } from '@tanstack/react-query';

interface HydrateProps {
  state: unknown;
  children: React.ReactNode;
}

export const Hydrate: React.FC<HydrateProps> = ({ state, children }) => (
  <HydrationBoundary state={state}>{children}</HydrationBoundary>
);
