import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductActionMenu } from './ProductActionMenu';
import { useDeleteProduct } from '@/api/products/useDeleteProduct';
import { useCreateProduct } from '@/api/products/useCreateProduct';
import { useRouter } from 'next/navigation';
import { productMock } from '@/testing/mocks';
import { useSession } from 'next-auth/react';
import { render } from '@/testing/utils';

jest.mock('@/api/products/useDeleteProduct');
jest.mock('@/api/products/useCreateProduct');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('ProductActionMenu', () => {
  const deleteProductMock = jest.fn();
  const createProductMock = jest.fn();
  const useRouterMock = jest.fn();

  beforeEach(() => {
    (useDeleteProduct as jest.Mock).mockReturnValue({
      mutate: deleteProductMock,
      isPending: false,
    });
    (useCreateProduct as jest.Mock).mockReturnValue({
      mutate: createProductMock,
      isPending: false,
    });
    (useRouter as jest.Mock).mockReturnValue({ push: useRouterMock });
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });
    jest.clearAllMocks();
  });

  it('renders the IconButton', () => {
    render(<ProductActionMenu product={productMock} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens the menu on IconButton click', () => {
    render(<ProductActionMenu product={productMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('navigates to product page when clicking "View"', () => {
    render(<ProductActionMenu product={productMock} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('View'));
    expect(useRouterMock).toHaveBeenCalledWith(`/products/${productMock.id}`);
  });

  it('calls createProduct when clicking "Duplicate"', () => {
    render(<ProductActionMenu product={productMock} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Duplicate'));
    expect(createProductMock).toHaveBeenCalledWith({
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

  it('opens ConfirmActionModal when clicking "Delete"', () => {
    render(<ProductActionMenu product={productMock} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    expect(
      screen.getByText('Are you sure to delete this product?')
    ).toBeInTheDocument();
  });

  it('calls deleteProduct when confirming Delete', () => {
    render(<ProductActionMenu product={productMock} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('DeleteConfirm'));
    expect(deleteProductMock).toHaveBeenCalledWith({ id: productMock.id });
  });

  it('closes ConfirmActionModal on close', () => {
    render(<ProductActionMenu product={productMock} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('CloseModal'));
    expect(
      screen.queryByText('Are you sure to delete this product?')
    ).not.toBeInTheDocument();
  });

  it('shows LinearProgress when create or delete is pending', () => {
    (useDeleteProduct as jest.Mock).mockReturnValue({
      mutate: deleteProductMock,
      isPending: true,
    });
    render(<ProductActionMenu product={productMock} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('opens EditProductModal when clicking "Edit" and closes it', () => {
    render(<ProductActionMenu product={productMock} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('EditProductModalOpen')).toBeInTheDocument();

    fireEvent.click(screen.getByText('EditProductModalOpen'));
  });
  it('closes the menu when handleClose is triggered', async () => {
    render(<ProductActionMenu product={productMock} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('View')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Edit'));

    await waitFor(() => {
      expect(screen.queryByText('View')).not.toBeInTheDocument();
    });
  });
});
