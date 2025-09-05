import '@testing-library/jest-dom';
import { ReactNode } from 'react';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    onClick,
    style,
    ...props
  }: {
    src: string | { src: string };
    alt: string;
    width: number;
    height: number;
    onClick?: () => void;
    style?: React.CSSProperties;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }) => {
    const imgSrc = typeof src === 'object' ? src.src : src;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onClick={onClick}
        style={style}
        {...props}
      />
    );
  },
}));

jest.mock('next/link', () => {
  const NextLink = ({
    children,
    href,
  }: {
    children: ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  NextLink.displayName = 'NextLink';
  return NextLink;
});

jest.mock('@/components/ui', () => {
  const originalModule = jest.requireActual('@/components/ui');
  return {
    __esModule: true,
    ...originalModule,
    Link: ({ href, children }: { href: string; children: ReactNode }) => (
      <a href={href}>{children}</a>
    ),
  };
});
