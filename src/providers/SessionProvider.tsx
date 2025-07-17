'use client';

import {
  SessionProvider as Provider,
  SessionProviderProps,
} from 'next-auth/react';
import { FC } from 'react';

export const SessionProvider: FC<SessionProviderProps> = (props) => {
  return <Provider {...props} />;
};
