import { render, screen } from '@testing-library/react';
import { ProductList } from './ProductList';
import { Product } from '@/types/Product';

jest.mock('../ProductCard', () => ({
  ProductCard: jest.fn(({ product, variant }) => (
    <div data-testid="product-card">
      {product.name} - {variant}
    </div>
  )),
}));

describe('ProductList', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      description: 'A great product',
      price: 100,
      images: [
        {
          id: 1,
          name: 'image1',
          alternativeText: null,
          caption: null,
          width: 800,
          height: 600,
          formats: {},
          hash: 'hash1',
          ext: '.jpg',
          mime: 'image/jpeg',
          size: 1024,
          url: 'image1.jpg',
          previewUrl: null,
          provider: 'local',
          provider_metadata: { public_id: 'image1', resource_type: 'image' },
          createdAt: '',
          updatedAt: '',
        },
      ],
      brand: {
        id: 1,
        name: 'Brand 1',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
      categories: [
        {
          id: 1,
          name: 'Category 1',
          createdAt: '',
          updatedAt: '',
          publishedAt: '',
        },
      ],
      color: {
        id: 1,
        name: 'Blue',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
      gender: {
        id: 1,
        name: 'Female',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
      sizes: [
        { id: 1, value: 38, createdAt: '', updatedAt: '', publishedAt: '' },
      ],
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Another product',
      price: 200,
      images: [
        {
          id: 1,
          name: 'image1',
          alternativeText: null,
          caption: null,
          width: 800,
          height: 600,
          formats: {},
          hash: 'hash1',
          ext: '.jpg',
          mime: 'image/jpeg',
          size: 1024,
          url: 'image1.jpg',
          previewUrl: null,
          provider: 'local',
          provider_metadata: { public_id: 'image1', resource_type: 'image' },
          createdAt: '',
          updatedAt: '',
        },
      ],
      brand: {
        id: 2,
        name: 'Brand 2',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
      categories: null,
      color: {
        id: 2,
        name: 'Red',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
      gender: {
        id: 2,
        name: 'Male',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
      sizes: [
        { id: 2, value: 40, createdAt: '', updatedAt: '', publishedAt: '' },
      ],
    },
  ];

  it('renders without crashing', () => {
    render(<ProductList products={mockProducts} />);
    expect(screen.getAllByTestId('product-card')).toHaveLength(
      mockProducts.length
    );
  });

  it('passes the default variant prop to ProductCard', () => {
    render(<ProductList products={mockProducts} />);
    const cards = screen.getAllByTestId('product-card');
    cards.forEach((card) => {
      expect(card.textContent).toContain('catalog');
    });
  });

  it('renders the correct number of ProductCard components', () => {
    render(<ProductList products={mockProducts} />);
    expect(screen.getAllByTestId('product-card').length).toBe(
      mockProducts.length
    );
  });
});
