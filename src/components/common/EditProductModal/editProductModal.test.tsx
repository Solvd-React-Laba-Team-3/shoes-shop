/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { EditProductModal } from './';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Product } from '@/types/Product';
import React from 'react';
import { Box, CircularProgress, Dialog } from '@mui/material';

const editProductMock = jest.fn();
const uploadFileMock = jest.fn();
const useUpdateProductMock = jest.fn();
const useUploadFileMock = jest.fn();

jest.mock('@/components/ProductForm', () => ({
  ProductForm: (props: any) => {
    (global as any).lastProductFormProps = props;
    return (
      <div data-testid="mock-product-form">
        <h1>{props.title}</h1>
        <p>{props.editingProduct.name}</p>
        <button disabled={props.isPending}>Submit</button>
      </div>
    );
  },
}));

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

const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <SessionProvider session={null}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </SessionProvider>
  );
};

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  price: 100,
  gender: {
    id: 1,
    name: 'Male',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  },
  color: { id: 1, name: 'Blue', createdAt: '', updatedAt: '', publishedAt: '' },
  brand: { id: 1, name: 'Nike', createdAt: '', updatedAt: '', publishedAt: '' },
  description: 'Test description',
  sizes: [{ id: 1, value: 35, createdAt: '', updatedAt: '', publishedAt: '' }],
  categories: [
    { id: 1, name: 'Shoes', createdAt: '', updatedAt: '', publishedAt: '' },
    {
      id: 2,
      name: 'Sportswear',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
    },
  ],
  images: [
    {
      id: 1,
      name: 'image',
      url: 'https://fakestoreapi.com/img/test.jpg',
      alternativeText: 'test text',
      caption: 'text',
      width: 100,
      height: 100,
      formats: {} as any,
      hash: 'test',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 50,
      previewUrl: 'https://fakestoreapi.com/img/test.jpg',
      provider: 'local',
      provider_metadata: { public_id: 'public-id', resource_type: 'image' },
      createdAt: '',
      updatedAt: '',
    },
  ],
};

describe('EditProductModal', () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(
      (file: Blob) => `blob:${(file as File).name}`
    );
  });

  it('renders ProductForm with correct title and product name', () => {
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
      />
    );
    expect(screen.getByText('Edit product')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('passes initial images from editingProduct to ProductForm', () => {
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
      />
    );
    const images = (global as any).lastProductFormProps.images;
    expect(images).toHaveLength(1);
    expect(images[0].url).toContain('https://fakestoreapi.com/img/test.jpg');
  });

  it('calls onClose when modal is closed', () => {
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
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
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
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
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
      />
    );
    const button = screen.getByRole('button', { name: /Submit/i });
    expect(button).toBeEnabled();
  });

  it('adds new images when files are dropped', () => {
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
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
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
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
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
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
        id: mockProduct.id,
      }),
      expect.any(Object)
    );
  });

  it('closes modal after successful editProduct call in handleSubmit without files', () => {
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
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

    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
      />
    );

    const button = screen.getByRole('button', { name: /Submit/i });
    expect(button).toBeDisabled();
  });

  it('handles handleRemoveImage when file index out of bounds gracefully', () => {
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
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
    renderWithProviders(
      <EditProductModal
        open={true}
        onClose={handleClose}
        editingProduct={mockProduct}
      />
    );

    const productFormProps = (global as any).lastProductFormProps;

    expect(productFormProps.editingProduct).toEqual({
      name: mockProduct.name,
      price: mockProduct.price,
      gender: mockProduct.gender.id.toString(),
      color: mockProduct.color.id.toString(),
      brand: mockProduct.brand.id.toString(),
      description: mockProduct.description,
      sizes: mockProduct.sizes.map((size) => size.id),
    });
  });

  it('renders CircularProgress fallback when loading', () => {
    renderWithProviders(
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
