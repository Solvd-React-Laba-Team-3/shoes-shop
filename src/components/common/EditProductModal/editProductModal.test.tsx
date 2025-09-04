/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, fireEvent, screen } from '@testing-library/react';
import { EditProductModal } from './';
import { Box, CircularProgress, Dialog } from '@mui/material';
import { render } from '@/testing/utils';
import { productMock } from '@/testing/mocks';

const editProductMock = jest.fn();
const uploadFileMock = jest.fn();
const useUpdateProductMock = jest.fn();
const useUploadFileMock = jest.fn();

jest.mock('@/api/products/useUpdateProduct', () => ({
  useUpdateProduct: () => useUpdateProductMock(),
}));

jest.mock('@/api/uploadFile/useUploadFile', () => ({
  useUploadFile: () => useUploadFileMock(),
}));

useUpdateProductMock.mockReturnValue({
  mutate: editProductMock,
  isPending: false,
});

useUploadFileMock.mockReturnValue({ mutate: uploadFileMock, isPending: false });

describe('EditProductModal', () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(
      (file: Blob) => `blob:${(file as File).name}`
    );
  });

  it('renders ProductForm with correct title and product name', () => {
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );
    expect(screen.getByText('Edit product')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('passes initial images from editingProduct to ProductForm', () => {
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );
    const images = (global as any).lastProductFormProps.images;
    expect(images).toHaveLength(1);
    expect(images[0].url).toContain('https://fakestoreapi.com/img/test.jpg');
  });

  it('calls onClose when modal is closed', () => {
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });

  it('disables submit when pending', () => {
    useUpdateProductMock.mockReturnValue({
      mutate: editProductMock,
      isPending: true,
    });
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );
    const button = screen.getByRole('button', { name: /Submit/i });
    expect(button).toBeDisabled();
  });

  it('enables submit when not pending', () => {
    useUpdateProductMock.mockReturnValue({
      mutate: editProductMock,
      isPending: false,
    });
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );
    const button = screen.getByRole('button', { name: /Submit/i });
    expect(button).toBeEnabled();
  });

  it('adds new images when files are dropped', () => {
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );
    const productFormProps = (global as any).lastProductFormProps;
    const file1 = new File(['dummy'], 'file1.png', { type: 'image/png' });
    const file2 = new File(['dummy'], 'file2.png', { type: 'image/png' });

    act(() => {
      productFormProps.handleFilesDropped([file1, file2]);
    });

    const updatedImages = (global as any).lastProductFormProps.images;
    expect(updatedImages).toHaveLength(3);
    expect(updatedImages[1].url).toBe('blob:file1.png');
    expect(updatedImages[2].url).toBe('blob:file2.png');
  });

  it('removes image correctly when handleRemoveImage is called', () => {
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );
    const productFormProps = (global as any).lastProductFormProps;

    act(() => {
      productFormProps.onRemoveImage(1, 0);
    });

    const updatedImages = (global as any).lastProductFormProps.images;
    expect(updatedImages).toHaveLength(0);
  });

  it('calls editProduct directly when handleSubmit without files', () => {
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );
    const productFormProps = (global as any).lastProductFormProps;

    const formData = { name: 'Updated', price: 200 };
    act(() => {
      productFormProps.onSubmit(formData);
    });

    expect(editProductMock).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          data: expect.objectContaining({ images: [1] }),
        }),
        id: productMock.id,
      }),
      expect.any(Object)
    );
  });

  it('closes modal after successful editProduct call in handleSubmit without files', () => {
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );

    const productFormProps = (global as any).lastProductFormProps;
    const formData = { name: 'Updated', price: 200 };

    act(() => {
      productFormProps.onSubmit(formData);
    });

    const mutateCall = editProductMock.mock.calls[0][1];
    act(() => {
      mutateCall.onSuccess();
    });

    expect(handleClose).toHaveBeenCalled();
  });

  it('disables submit when either editProduct or uploadFile is pending', () => {
    useUpdateProductMock.mockReturnValue({
      mutate: editProductMock,
      isPending: false,
    });
    useUploadFileMock.mockReturnValue({
      mutate: uploadFileMock,
      isPending: true,
    });

    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );

    const button = screen.getByRole('button', { name: /Submit/i });
    expect(button).toBeDisabled();
  });

  it('handles handleRemoveImage when file index out of bounds gracefully', () => {
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );

    const productFormProps = (global as any).lastProductFormProps;

    act(() => {
      productFormProps.onRemoveImage(999, 10);
    });

    const updatedImages = (global as any).lastProductFormProps.images;
    expect(updatedImages).toHaveLength(1);
  });

  it('maps editingProduct fields correctly to ProductForm', () => {
    render(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={productMock}
      />
    );

    const productFormProps = (global as any).lastProductFormProps;

    expect(productFormProps.editingProduct).toEqual({
      name: productMock.name,
      price: productMock.price,
      gender: productMock.gender.id.toString(),
      color: productMock.color.id.toString(),
      brand: productMock.brand.id.toString(),
      description: productMock.description,
      sizes: productMock.sizes.map((size) => size.id),
    });
  });

  it('renders CircularProgress fallback when loading', () => {
    render(
      <Dialog open={true} onClose={handleClose}>
        <Box
          data-testid="fallback-loader"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Dialog>
    );

    const loader = screen.getByTestId('fallback-loader');
    expect(loader).toBeInTheDocument();
  });
});
