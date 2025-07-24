import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/Product';
import { ReactNode } from 'react';

jest.mock('next/image', () => {
  return function NextImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  };
});

jest.mock('next/link', () => {
  const MockNextLink = ({
    children,
    href,
  }: {
    children: ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockNextLink.displayName = 'MockNextLink';
  return MockNextLink;
});

jest.mock('../ProductActionMenu', () => {
  const MockProductActionMenu = () => <div data-testid="product-action-menu" />;
  MockProductActionMenu.displayName = 'MockProductActionMenu';
  return { ProductActionMenu: MockProductActionMenu };
});

jest.mock('../ProductWishlistButton', () => {
  const MockWishlistButton = () => <div data-testid="wishlist-button" />;
  MockWishlistButton.displayName = 'MockWishlistButton';
  return { ProductWishlistButton: MockWishlistButton };
});

const mockProduct: Pick<
  Product,
  'id' | 'name' | 'gender' | 'price' | 'images'
> = {
  id: 1,
  name: 'Test Shoes',
  price: 199.99,
  gender: { name: 'Men', createdAt: '', updatedAt: '', publishedAt: '' },
  images: [
    {
      id: 1,
      name: 'Test Image',
      alternativeText: 'Alt Text',
      caption: '',
      width: 100,
      height: 100,
      hash: 'hash',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 1,
      url: '/test-image.jpg',
      previewUrl: '/test-image.jpg',
      provider: 'local',
      provider_metadata: {
        public_id: 'mock-public-id',
        resource_type: 'image',
      },
      createdAt: '0000-00-00',
      updatedAt: '0000-00-00',
      formats: {},
    },
  ] as NonNullable<Product['images']>,
};

describe('ProductCard', () => {
  it('renders product details correctly', () => {
    render(<ProductCard {...mockProduct} />);
    expect(screen.getByText('Test Shoes')).toBeInTheDocument();
    expect(screen.getByText("Men's Shoes")).toBeInTheDocument();
    expect(screen.getByText('$199.99')).toBeInTheDocument();
  });

  it('renders product image with correct src and alt', () => {
    render(<ProductCard {...mockProduct} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('src', '/test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Alt Text');
  });

  it('uses image name as alt when alternativeText is missing', () => {
    const productWithoutAlt = {
      ...mockProduct,
      images: mockProduct.images
        ? [{ ...mockProduct.images[0], alternativeText: '' }]
        : [],
    };
    render(<ProductCard {...productWithoutAlt} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('alt', 'product image: Test Shoes');
  });

  it("renders Women's Shoes for female products", () => {
    const femaleProduct = {
      ...mockProduct,
      gender: {
        name: 'Women',
        createdAt: '0000-00-00',
        updatedAt: '0000-00-00',
        publishedAt: '0000-00-00',
      },
    };
    render(<ProductCard {...femaleProduct} />);
    expect(screen.getByText("Women's Shoes")).toBeInTheDocument();
  });

  it('renders ProductActionMenu when hasActionMenu is true', () => {
    render(<ProductCard {...mockProduct} hasActionMenu />);
    expect(screen.getByTestId('product-action-menu')).toBeInTheDocument();
  });

  it('does not render ProductActionMenu when hasActionMenu is false', () => {
    render(<ProductCard {...mockProduct} />);
    expect(screen.queryByTestId('product-action-menu')).not.toBeInTheDocument();
  });

  it('renders ProductWishlistButton when hasWishlistButton is true', () => {
    render(<ProductCard {...mockProduct} hasWishlistButton />);
    expect(screen.getByTestId('wishlist-button')).toBeInTheDocument();
  });

  it('navigates to correct product link', () => {
    render(<ProductCard {...mockProduct} />);
    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link).toHaveAttribute('href', '/products/1');
  });
});
