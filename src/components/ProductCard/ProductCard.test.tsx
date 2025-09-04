import { fireEvent, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { getGenderText } from './ProductCard';
import { useWishlist } from '@/lib/hooks';
import { render } from '@/testing/utils';
import { productMock } from '@/testing/mocks';

jest.mock('@/lib/hooks', () => ({
  useWishlist: jest.fn(() => ({ removeItem: jest.fn() })),
}));

describe('ProductCard', () => {
  it('renders product details correctly', () => {
    render(<ProductCard product={productMock} />);
    expect(screen.getByText('Test Shoes')).toBeInTheDocument();
    expect(screen.getByText("Men's Shoes")).toBeInTheDocument();
    expect(screen.getByText('$199.99')).toBeInTheDocument();
  });

  it('renders product image with correct src and alt', () => {
    render(<ProductCard product={productMock} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('src', '/test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Alt Text');
  });

  it('uses image name as alt when alternativeText is missing', () => {
    const productWithoutAlt = {
      ...productMock,
      images: [{ ...productMock.images![0], alternativeText: '' }],
    };
    render(<ProductCard product={productWithoutAlt} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('alt', 'product image: Test Shoes');
  });

  it("renders Women's Shoes for female products", () => {
    const femaleProduct = {
      ...productMock,
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
    render(<ProductCard product={productMock} variant="catalog" />);
    expect(screen.queryByTestId('product-action-menu')).not.toBeInTheDocument();
    expect(screen.queryByTestId('wishlist-button')).not.toBeInTheDocument();
  });

  it('renders ProductActionMenu when variant is "actionMenu"', () => {
    render(<ProductCard product={productMock} variant="actionMenu" />);
    expect(screen.getByTestId('product-action-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('wishlist-button')).not.toBeInTheDocument();
  });

  it('renders ProductWishlistButton when variant is "wishlist"', () => {
    render(<ProductCard product={productMock} variant="wishlist" />);
    expect(screen.queryByTestId('product-action-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('wishlist-button')).toBeInTheDocument();
  });

  it('navigates to correct product link', () => {
    render(<ProductCard product={productMock} />);
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

    render(<ProductCard product={productMock} variant="wishlist" />);

    const wishlistButton = screen.getByTestId('wishlist-button');
    await fireEvent.click(wishlistButton);

    expect(removeItemMock).toHaveBeenCalledWith(productMock.id);
  });
});
