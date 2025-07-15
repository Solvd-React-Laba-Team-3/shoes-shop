'use client';

import { HydrationBoundary } from '@tanstack/react-query';

interface HydrateProps {
  state: unknown;
  children: React.ReactNode;
}

const Hydrate: React.FC<HydrateProps> = ({ state, children }) => (
  <HydrationBoundary state={state}>{children}</HydrationBoundary>
);

export default Hydrate;
