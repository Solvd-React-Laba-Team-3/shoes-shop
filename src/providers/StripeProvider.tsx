'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FC, PropsWithChildren } from 'react';

const stripe = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export const StripeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Elements stripe={stripe} options={{ locale: 'en' }}>
      {children}
    </Elements>
  );
};
