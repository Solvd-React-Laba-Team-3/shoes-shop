import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductActionMenu } from '.';
import { useDeleteProduct } from '@/api/products/useDeleteProduct';
import { useCreateProduct } from '@/api/products/useCreateProduct';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/Product';
import { useSession } from 'next-auth/react';

jest.mock('@/api/products/useDeleteProduct');
jest.mock('@/api/products/useCreateProduct');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('../common/EditProductModal', () => ({
  EditProductModal: ({ open }: { open: boolean }) => (
    <div>{open ? 'EditProductModalOpen' : null}</div>
  ),
}));

jest.mock('../common/DeleteConfirmationModal', () => ({
  DeleteConfirmationModal: ({
    open,
    onDelete,
    onClose,
    title,
  }: {
    open: boolean;
    onDelete: () => void;
    onClose: () => void;
    title: string;
  }) => (
    <div>
      {open && (
        <>
          <span>{title}</span>
          <button onClick={onDelete}>DeleteConfirm</button>
          <button onClick={onClose}>CloseModal</button>
        </>
      )}
    </div>
  ),
}));

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  price: 100,
  brand: { id: 1, name: '', createdAt: '', updatedAt: '', publishedAt: '' },
  color: { id: 2, name: '', createdAt: '', updatedAt: '', publishedAt: '' },
  gender: { id: 3, name: '', createdAt: '', updatedAt: '', publishedAt: '' },
  sizes: [
    { id: 4, value: 0, createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 5, value: 0, createdAt: '', updatedAt: '', publishedAt: '' },
  ],
  images: [
    {
      id: 6,
      name: '',
      alternativeText: null,
      caption: null,
      width: 0,
      height: 0,
      formats: {},
      hash: '',
      ext: '',
      mime: '',
      size: 0,
      url: '',
      previewUrl: null,
      provider: '',
      provider_metadata: { public_id: 'mock', resource_type: 'image' },
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 7,
      name: '',
      alternativeText: null,
      caption: null,
      width: 0,
      height: 0,
      formats: {},
      hash: '',
      ext: '',
      mime: '',
      size: 0,
      url: '',
      previewUrl: null,
      provider: '',
      provider_metadata: { public_id: 'mock', resource_type: 'image' },
      createdAt: '',
      updatedAt: '',
    },
  ],
  description: 'Test description',
  categories: [
    {
      id: 8,
      name: 'Category 1',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
    },
  ],
};

describe('ProductActionMenu', () => {
  const mockDelete = jest.fn();
  const mockCreate = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useDeleteProduct as jest.Mock).mockReturnValue({
      mutate: mockDelete,
      isPending: false,
    });
    (useCreateProduct as jest.Mock).mockReturnValue({
      mutate: mockCreate,
      isPending: false,
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });
    jest.clearAllMocks();
  });

  it('renders the IconButton', () => {
    render(<ProductActionMenu product={mockProduct} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens the menu on IconButton click', () => {
    render(<ProductActionMenu product={mockProduct} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('navigates to product page when clicking "View"', () => {
    render(<ProductActionMenu product={mockProduct} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('View'));
    expect(mockPush).toHaveBeenCalledWith(`/products/${mockProduct.id}`);
  });

  it('calls createProduct when clicking "Duplicate"', () => {
    render(<ProductActionMenu product={mockProduct} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Duplicate'));
    expect(mockCreate).toHaveBeenCalledWith({
      body: {
        data: {
          images: [6, 7],
          brand: 1,
          color: 2,
          gender: 3,
          sizes: [4, 5],
          price: 100,
          name: 'Test Product',
          description: 'Test description',
        },
      },
    });
  });

  it('opens DeleteConfirmationModal when clicking "Delete"', () => {
    render(<ProductActionMenu product={mockProduct} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    expect(
      screen.getByText('Are you sure to delete this product?')
    ).toBeInTheDocument();
  });

  it('calls deleteProduct when confirming Delete', () => {
    render(<ProductActionMenu product={mockProduct} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('DeleteConfirm'));
    expect(mockDelete).toHaveBeenCalledWith({ id: mockProduct.id });
  });

  it('closes DeleteConfirmationModal on close', () => {
    render(<ProductActionMenu product={mockProduct} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('CloseModal'));
    expect(
      screen.queryByText('Are you sure to delete this product?')
    ).not.toBeInTheDocument();
  });

  it('shows LinearProgress when create or delete is pending', () => {
    (useDeleteProduct as jest.Mock).mockReturnValue({
      mutate: mockDelete,
      isPending: true,
    });
    render(<ProductActionMenu product={mockProduct} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('opens EditProductModal when clicking "Edit" and closes it', () => {
    render(<ProductActionMenu product={mockProduct} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('EditProductModalOpen')).toBeInTheDocument();

    fireEvent.click(screen.getByText('EditProductModalOpen'));
  });
  it('closes the menu when handleClose is triggered', async () => {
    render(<ProductActionMenu product={mockProduct} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('View')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Edit'));

    await waitFor(() => {
      expect(screen.queryByText('View')).not.toBeInTheDocument();
    });
  });
});
