'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode, FC } from 'react';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const StripeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <Elements stripe={stripe}>{children}</Elements>;
};

export default StripeProvider;
