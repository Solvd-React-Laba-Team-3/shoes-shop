import { Header } from '@/components/common/Header';
import { ReactNode } from 'react';

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
