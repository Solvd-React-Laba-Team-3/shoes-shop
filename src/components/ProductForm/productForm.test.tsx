import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm, handleToggleSize } from './ProductForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/providers/ThemeProvider';
import { ProductFormData } from './productForm.schema';
import { TempImage } from '@/types/TempImage';

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
  useQuery: () => ({
    refetch: jest.fn().mockResolvedValue({ data: 'AI suggested description' }),
    isFetching: false,
  }),
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
  images?: TempImage[];
  handleFilesDropped?: (files: File[]) => void;
  onRemoveImage?: (id: number, index: number) => void;
  title?: string;
  description?: string;
}

const renderProductForm = ({
  editingProduct,
  isPending = false,
  onSubmit = jest.fn(),
  images = [],
  handleFilesDropped = () => {},
  onRemoveImage = () => {},
  title = 'Test Product Form',
  description = 'Test description',
}: RenderOptions = {}) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ProductForm
          title={title}
          description={description}
          editingProduct={editingProduct}
          isPending={isPending}
          onSubmit={onSubmit}
          images={images}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
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

      expect(
        screen.getByPlaceholderText('Nike Air Max 90')
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('160')).toBeInTheDocument();
      expect(screen.getByText('Product name')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Add size')).toBeInTheDocument();

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
      renderProductForm({
        editingProduct: {
          ...validFormData,
          color: validFormData.color.toString(),
          gender: validFormData.gender.toString(),
          brand: validFormData.brand.toString(),
        },
      });

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

      const submitButton = screen.getAllByText('Save')[0];
      fireEvent.click(submitButton);

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

    it('should call onSubmit when form is valid', async () => {
      const onSubmit = jest.fn();
      renderProductForm({ onSubmit });

      fireEvent.change(screen.getByPlaceholderText('Nike Air Max 90'), {
        target: { value: validFormData.name },
      });
      fireEvent.change(screen.getByPlaceholderText('160'), {
        target: { value: validFormData.price.toString() },
      });

      fireEvent.mouseDown(screen.getByText('Select color'));
      fireEvent.click(screen.getByText('Black'));

      fireEvent.mouseDown(screen.getByText('Select gender'));
      fireEvent.click(screen.getByText('Men'));

      fireEvent.mouseDown(screen.getByText('Select brand'));
      fireEvent.click(screen.getByText('Nike'));

      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: validFormData.description },
      });

      fireEvent.click(screen.getByRole('button', { name: '36' }));

      fireEvent.click(screen.getAllByText('Save', { selector: 'button' })[0]);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: validFormData.name,
            price: validFormData.price,
            description: validFormData.description,
          })
        );
      });
    });

    it('should handle toggle size logic correctly', () => {
      const onChangeMock = jest.fn();
      const selected: number[] = [];

      handleToggleSize(
        {
          id: 1,
          value: 36,
          createdAt: '',
          updatedAt: '',
          publishedAt: '',
        },
        selected,
        onChangeMock
      );
      expect(onChangeMock).toHaveBeenCalledWith([1]);

      handleToggleSize(
        {
          id: 1,
          value: 36,
          createdAt: '',
          updatedAt: '',
          publishedAt: '',
        },
        [1],
        onChangeMock
      );
      expect(onChangeMock).toHaveBeenCalledWith([]);
    });

    it('should show LinearProgress when isPending is true', () => {
      renderProductForm({ isPending: true });

      const linearProgressBars = screen.getAllByRole('progressbar');
      const linearProgress = linearProgressBars.find((el) =>
        el.className.includes('MuiLinearProgress-root')
      );
      expect(linearProgress).toBeInTheDocument();
    });

    it('should show LinearProgress when form is submitting', async () => {
      const onSubmit = jest.fn(
        async () => new Promise((res) => setTimeout(res, 100))
      );
      renderProductForm({ onSubmit });

      fireEvent.click(screen.getAllByText('Save', { selector: 'button' })[0]);

      const linearProgressBars = screen.getAllByRole('progressbar');
      const linearProgress = linearProgressBars.find((el) =>
        el.className.includes('MuiLinearProgress-root')
      );
      expect(linearProgress).toBeInTheDocument();
    });

    it('should expand suggestion section when toggle button is clicked', () => {
      renderProductForm();
      const toggleButton = screen.getByRole('button', {
        name: /suggestion collapsed/i,
      });
      fireEvent.click(toggleButton);
      expect(toggleButton).not.toBeInTheDocument();
    });

    it('should call onRemoveImage when remove button clicked', () => {
      const onRemoveImage = jest.fn();
      const images = [{ id: 1, url: 'https://fakestoreapi.com/img/test.jpg' }];
      renderProductForm({ images, onRemoveImage });

      const fabButton = screen.getByRole('button', { name: /Delete image/i });
      fireEvent.click(fabButton);

      const deleteButton = screen.getByRole('button', { name: /Delete/i });
      fireEvent.click(deleteButton);

      expect(onRemoveImage).toHaveBeenCalledWith(1, 0);
    });

    it('should display placeholder text in selects when value is empty', () => {
      renderProductForm();
      expect(screen.getByText('Select color')).toBeInTheDocument();
      expect(screen.getByText('Select gender')).toBeInTheDocument();
      expect(screen.getByText('Select brand')).toBeInTheDocument();
    });
  });

  describe('ProductForm description suggestion', () => {
    it('calls handleDescriptionSuggestion and updates description', async () => {
      const onSubmit = jest.fn();
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();
      const images: TempImage[] = [];

      renderProductForm({
        onSubmit,
        handleFilesDropped,
        onRemoveImage,
        images,
      });

      const aiButton = screen.getByText(/Use AI suggestion/i);
      fireEvent.click(aiButton);

      const descriptionField = screen.getByLabelText(
        'Description'
      ) as HTMLTextAreaElement;

      await waitFor(() => {
        expect(descriptionField.value).toBe('AI suggested description');
      });
    });
  });
});
