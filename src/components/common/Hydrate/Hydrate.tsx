'use client';

import { HydrationBoundary } from '@tanstack/react-query';

export default function Hydrate({ state, children }: { state: unknown; children: React.ReactNode }) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
