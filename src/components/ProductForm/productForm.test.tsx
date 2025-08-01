import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from './ProductForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/providers/ThemeProvider';
import { ProductFormData } from './productForm.schema';

const mockData = {
  genders: [
    { id: 1, name: 'Men' },
    { id: 2, name: 'Women' },
    { id: 3, name: 'Unisex' },
  ],
  sizes: [
    { id: 1, value: '36' },
    { id: 2, value: '37' },
    { id: 3, value: '38' },
  ],
  brands: [
    { id: 1, name: 'Nike' },
    { id: 2, name: 'Adidas' },
    { id: 3, name: 'Puma' },
  ],
  colors: [
    { id: 1, name: 'Black' },
    { id: 2, name: 'White' },
    { id: 3, name: 'Red' },
  ],
};

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useSuspenseQueries: () => [
    { data: mockData.genders },
    { data: mockData.sizes },
    { data: mockData.brands },
    { data: mockData.colors },
  ],
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

interface RenderOptions {
  editingProduct?: Partial<ProductFormData>;
  isPending?: boolean;
  onSubmit?: jest.Mock;
}

const renderProductForm = ({
  editingProduct,
  isPending = false,
  onSubmit = jest.fn(),
}: RenderOptions = {}) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ProductForm
          title="Test Product Form"
          description="Test description"
          editingProduct={editingProduct}
          isPending={isPending}
          onSubmit={onSubmit}
          images={[]}
          handleFilesDropped={() => {}}
          onRemoveImage={() => {}}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const validFormData = {
  name: 'Test Sneaker',
  price: 199.99,
  color: 1,
  gender: 1,
  brand: 1,
  description: 'A test product description',
  sizes: [1, 2],
};

describe('ProductForm', () => {
  describe('Rendering', () => {
    it('should render all form fields and labels', () => {
      renderProductForm();

      // Check for input fields by their placeholders/names
      expect(
        screen.getByPlaceholderText('Nike Air Max 90')
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('160')).toBeInTheDocument();

      // Check for labels
      expect(screen.getByText('Product name')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Add size')).toBeInTheDocument();

      // Check for size toggle buttons
      mockData.sizes.forEach((size) => {
        expect(screen.getByText(size.value)).toBeInTheDocument();
      });
    });

    it('should render title and description', () => {
      renderProductForm();
      expect(screen.getByText('Test Product Form')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should pre-fill form when editingProduct is provided', () => {
      renderProductForm({ editingProduct: validFormData });

      expect(screen.getByDisplayValue('Test Sneaker')).toBeInTheDocument();
      expect(screen.getByDisplayValue('199.99')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('A test product description')
      ).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      const onSubmit = jest.fn();
      renderProductForm({ onSubmit });

      // Submit empty form
      const submitButton = screen.getByText('Save');
      fireEvent.click(submitButton);

      // Wait for validation messages
      await waitFor(() => {
        expect(
          screen.getByText('Product name is required')
        ).toBeInTheDocument();
        expect(screen.getByText('Price is required')).toBeInTheDocument();
        expect(screen.getByText('Color is required')).toBeInTheDocument();
        expect(screen.getByText('Gender is required')).toBeInTheDocument();
        expect(screen.getByText('Brand is required')).toBeInTheDocument();
        expect(
          screen.getByText('Description must be at least 10 characters')
        ).toBeInTheDocument();
        expect(
          screen.getByText('At least one size is required')
        ).toBeInTheDocument();
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('should handle size toggle selection', () => {
      renderProductForm();

      const size36Button = screen.getByRole('button', { name: '36' });
      const size37Button = screen.getByRole('button', { name: '37' });

      fireEvent.click(size36Button);
      expect(size36Button).toHaveClass('Mui-selected');

      fireEvent.click(size37Button);
      expect(size37Button).toHaveClass('Mui-selected');

      fireEvent.click(size36Button);
      expect(size36Button).not.toHaveClass('Mui-selected');
    });
  });
});
