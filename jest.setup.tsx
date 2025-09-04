import '@testing-library/jest-dom';
import '@/testing/mocks';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string | { src: string };
    alt: string;
    width: number;
    height: number;
  }) => {
    const imgSrc = typeof src === 'object' ? src.src : src;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imgSrc} alt={alt} width={width} height={height} />;
  },
}));

jest.mock('@/components/ui', () => {
  const originalModule = jest.requireActual('@/components/ui');
  return {
    __esModule: true,
    ...originalModule,
    Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href}>{children}</a>
    ),
  };
});
