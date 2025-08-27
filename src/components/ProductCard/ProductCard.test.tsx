import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/Product';
import { ReactNode } from 'react';
import { getGenderText } from './ProductCard';
import { useWishlist } from '@/lib/hooks';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

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

jest.mock('../WishlistButton', () => {
  const MockWishlistButton = ({ onRemove }: { onRemove?: () => void }) => (
    <div data-testid="wishlist-button" onClick={onRemove} />
  );
  MockWishlistButton.displayName = 'MockWishlistButton';
  return { WishlistButton: MockWishlistButton };
});

jest.mock('@/lib/hooks', () => ({
  useWishlist: jest.fn(() => ({ removeItem: jest.fn() })),
}));

const mockProduct = {
  id: 1,
  name: 'Test Shoes',
  price: 199.99,
  gender: { id: 1, name: 'Men', createdAt: '', updatedAt: '', publishedAt: '' },
  description: 'Test description',
  brand: {
    id: 1,
    name: 'Test Brand',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  },
  categories: [
    {
      id: 1,
      name: 'Test Category',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
    },
  ],
  color: {
    id: 1,
    name: 'Test Color',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  },
  sizes: [
    {
      id: 1,
      value: 1,
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
    },
  ],
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
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Shoes')).toBeInTheDocument();
    expect(screen.getByText("Men's Shoes")).toBeInTheDocument();
    expect(screen.getByText('$199.99')).toBeInTheDocument();
  });

  it('renders product image with correct src and alt', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('src', '/test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Alt Text');
  });

  it('uses image name as alt when alternativeText is missing', () => {
    const productWithoutAlt = {
      ...mockProduct,
      images: [{ ...mockProduct.images[0], alternativeText: '' }],
    };
    render(<ProductCard product={productWithoutAlt} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('alt', 'product image: Test Shoes');
  });

  it("renders Women's Shoes for female products", () => {
    const femaleProduct = {
      ...mockProduct,
      gender: {
        id: 2,
        name: 'Women',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
    };
    render(<ProductCard product={femaleProduct} />);
    expect(screen.getByText("Women's Shoes")).toBeInTheDocument();
  });

  it('does not render any action buttons by default (catalog)', () => {
    render(<ProductCard product={mockProduct} variant="catalog" />);
    expect(screen.queryByTestId('product-action-menu')).not.toBeInTheDocument();
    expect(screen.queryByTestId('wishlist-button')).not.toBeInTheDocument();
  });

  it('renders ProductActionMenu when variant is "actionMenu"', () => {
    render(<ProductCard product={mockProduct} variant="actionMenu" />);
    expect(screen.getByTestId('product-action-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('wishlist-button')).not.toBeInTheDocument();
  });

  it('renders ProductWishlistButton when variant is "wishlist"', () => {
    render(<ProductCard product={mockProduct} variant="wishlist" />);
    expect(screen.queryByTestId('product-action-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('wishlist-button')).toBeInTheDocument();
  });

  it('navigates to correct product link', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link).toHaveAttribute('href', '/products/1');
  });

  it('getGenderText returns "Men\'s Shoes" for "Men"', () => {
    expect(getGenderText('Men')).toBe("Men's Shoes");
  });

  it('getGenderText returns "Women\'s Shoes" for other values', () => {
    expect(getGenderText('Women')).toBe("Women's Shoes");
  });

  it('calls removeItem when WishlistButton is clicked', async () => {
    const removeItemMock = jest.fn();
    (useWishlist as jest.Mock).mockReturnValue({ removeItem: removeItemMock });

    render(<ProductCard product={mockProduct} variant="wishlist" />);

    const wishlistButton = screen.getByTestId('wishlist-button');
    await fireEvent.click(wishlistButton);

    expect(removeItemMock).toHaveBeenCalledWith(mockProduct.id);
  });
});
