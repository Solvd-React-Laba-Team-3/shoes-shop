import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm, handleToggleSize } from './ProductForm';
import { TempImage } from '@/types/TempImage';
import { render } from '@/testing/utils';

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

const validFormData = {
  name: 'Test Sneaker',
  price: 199.99,
  color: 1,
  gender: 1,
  brand: 1,
  description: 'A test product description',
  sizes: [1, 2],
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

describe('ProductForm', () => {
  describe('Rendering', () => {
    it('should render all form fields and labels', () => {
      const onSubmit = jest.fn();
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();
      const images: TempImage[] = [];

      render(
        <ProductForm
          isPending={false}
          title="Test Product Form"
          description="Test description"
          onSubmit={onSubmit}
          images={images}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
        />
      );

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
      const onSubmit = jest.fn();
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();
      const images: TempImage[] = [];

      render(
        <ProductForm
          isPending={false}
          title="Test Product Form"
          description="Test description"
          onSubmit={onSubmit}
          images={images}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
        />
      );
      expect(screen.getByText('Test Product Form')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should pre-fill form when editingProduct is provided', () => {
      const onSubmit = jest.fn();
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();
      const images: TempImage[] = [];

      render(
        <ProductForm
          isPending={false}
          title="Test Product Form"
          description="Test description"
          onSubmit={onSubmit}
          images={images}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
        />
      );
      render(
        <ProductForm
          editingProduct={{
            ...validFormData,
            ...validFormData,
            color: validFormData.color.toString(),
            gender: validFormData.gender.toString(),
            brand: validFormData.brand.toString(),
          }}
          isPending={false}
          title="Test Product Form"
          description="Test description"
          onSubmit={onSubmit}
          images={images}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
        />
      );

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
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();
      const images: TempImage[] = [];

      render(
        <ProductForm
          onSubmit={onSubmit}
          isPending={false}
          title="Test Product Form"
          description="Test description"
          images={images}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
        />
      );

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
      const onSubmit = jest.fn();
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();

      render(
        <ProductForm
          isPending={false}
          title="Test Product Form"
          description="Test description"
          images={[]}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
          onSubmit={onSubmit}
        />
      );

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
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();

      render(
        <ProductForm
          onSubmit={onSubmit}
          isPending={false}
          title="Test Product Form"
          description="Test description"
          images={[]}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
        />
      );

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
      const onSubmit = jest.fn();
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();

      render(
        <ProductForm
          isPending={true}
          title="Test Product Form"
          description="Test description"
          images={[]}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
          onSubmit={onSubmit}
        />
      );

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
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();

      render(
        <ProductForm
          onSubmit={onSubmit}
          isPending={false}
          title="Test Product Form"
          description="Test description"
          images={[]}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
        />
      );

      fireEvent.click(screen.getAllByText('Save', { selector: 'button' })[0]);

      const linearProgressBars = screen.getAllByRole('progressbar');
      const linearProgress = linearProgressBars.find((el) =>
        el.className.includes('MuiLinearProgress-root')
      );
      expect(linearProgress).toBeInTheDocument();
    });

    it('should expand suggestion section when toggle button is clicked', () => {
      const onSubmit = jest.fn();
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();

      render(
        <ProductForm
          isPending={false}
          title="Test Product Form"
          description="Test description"
          images={[]}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
          onSubmit={onSubmit}
        />
      );
      const toggleButton = screen.getByRole('button', {
        name: /suggestion collapsed/i,
      });
      fireEvent.click(toggleButton);
      expect(toggleButton).not.toBeInTheDocument();
    });

    it('should call onRemoveImage when remove button clicked', () => {
      const onSubmit = jest.fn();
      const onRemoveImage = jest.fn();
      const handleFilesDropped = jest.fn();
      const images = [{ id: 1, url: 'https://fakestoreapi.com/img/test.jpg' }];

      render(
        <ProductForm
          images={images}
          onRemoveImage={onRemoveImage}
          isPending={false}
          title="Test Product Form"
          description="Test description"
          handleFilesDropped={handleFilesDropped}
          onSubmit={onSubmit}
        />
      );

      const fabButton = screen.getByRole('button', { name: /Delete image/i });
      fireEvent.click(fabButton);

      const deleteButton = screen.getByRole('button', { name: /Delete/i });
      fireEvent.click(deleteButton);

      expect(onRemoveImage).toHaveBeenCalledWith(1, 0);
    });

    it('should display placeholder text in selects when value is empty', () => {
      const onSubmit = jest.fn();
      const handleFilesDropped = jest.fn();
      const onRemoveImage = jest.fn();

      render(
        <ProductForm
          isPending={false}
          title="Test Product Form"
          description="Test description"
          images={[]}
          handleFilesDropped={handleFilesDropped}
          onRemoveImage={onRemoveImage}
          onSubmit={onSubmit}
        />
      );
      expect(screen.getByText('Select color')).toBeInTheDocument();
      expect(screen.getByText('Select gender')).toBeInTheDocument();
      expect(screen.getByText('Select brand')).toBeInTheDocument();
    });
  });

  describe('ProductForm description suggestion', () => {
    it('calls handleDescriptionSuggestion and updates description', async () => {
      const onSubmit = jest.fn();
      const onRemoveImage = jest.fn();
      const images: TempImage[] = [];

      render(
        <ProductForm
          onSubmit={onSubmit}
          isPending={false}
          title="Test Product Form"
          description="Test description"
          handleFilesDropped={() => {}}
          onRemoveImage={onRemoveImage}
          images={images}
        />
      );

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
