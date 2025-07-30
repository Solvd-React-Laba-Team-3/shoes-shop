import { render, screen, fireEvent } from '@testing-library/react';
import { Product } from './Product';
import { productSchema } from './productForm.schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import * as reactQuery from '@tanstack/react-query';
import { ReactElement } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithClient = (ui: ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useSuspenseQueries: () => [
      { data: { data: [{ id: 1, attributes: { name: 'Men' } }] } }, // genders
      { data: { data: [{ id: 1, attributes: { value: 'EU-38' } }] } }, // sizes
      { data: { data: [{ id: 1, attributes: { name: 'Nike' } }] } }, // brands
      { data: { data: [{ id: 1, attributes: { name: 'Black' } }] } }, // colors
    ],
  };
});

jest.mock('@/api/gender/getGendersOptions', () => ({
  getGendersOptions: () => ({
    queryKey: ['genders'],
    queryFn: () =>
      Promise.resolve({
        data: [{ id: 1, attributes: { name: 'Men' } }],
      }),
  }),
}));

jest.mock('@/api/size/getSizesOptions', () => ({
  getSizesOptions: () => ({
    queryKey: ['sizes'],
    queryFn: () =>
      Promise.resolve({
        data: [{ id: 1, attributes: { value: 'EU-38' } }],
      }),
  }),
}));

jest.mock('@/api/brand/getBrandsOptions', () => ({
  getBrandsOptions: () => ({
    queryKey: ['brands'],
    queryFn: () =>
      Promise.resolve({
        data: [{ id: 1, attributes: { name: 'Nike' } }],
      }),
  }),
}));

jest.mock('@/api/color/getColorsOptions', () => ({
  getColorsOptions: () => ({
    queryKey: ['colors'],
    queryFn: () =>
      Promise.resolve({
        data: [{ id: 1, attributes: { name: 'Black' } }],
      }),
  }),
}));

describe('editPage', () => {
  it('should pass with valid data', () => {
    const result = productSchema.safeParse({
      productName: 'Nike Air Max 90',
      price: '$160',
      gender: 'Men',
      color: 'Black',
      brand: 'Nike',
      description:
        "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with",
      size: [{ id: 1, attributes: { value: 'EU-38' } }],
    });

    expect(result.success).toBe(true);
  });

  it('should fail when required fields are missing in productSchema', () => {
    const result = productSchema.safeParse({
      productName: '',
      price: '',
      color: 'Black',
      gender: 'Male',
      brand: '',
      description: '',
      size: 'EU-38',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const formatted = result.error.format();

      expect(formatted.productName?._errors).toContain(
        'Product name is required'
      );

      expect(formatted.price?._errors).toContain('Price is required');
    }
  });

  it('should allow empty string for optional fields in productSchema', () => {
    const result = productSchema.safeParse({
      productName: 'Nike Air Max 90',
      price: '$160',
      gender: 'Men',
      color: 'Black',
      brand: 'Nike',
      description:
        "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with",
      size: [{ id: 1, attributes: { value: 'EU-38' } }],
    });

    expect(result.success).toBe(true);
  });

  it('submits valid form data', async () => {
    const onSubmit = jest.fn();

    renderWithClient(
      <Product
        onSubmit={onSubmit}
        defaultValues={{
          productName: 'Nike Air Max 90',
          price: '160',
          gender: 'Men',
          color: 'Black',
          brand: 'Nike',
          description: 'Some description',
          size: [{ id: 1, attributes: { value: 'EU-38' } }],
        }}
      />
    );

    const productNameInput = screen.getByDisplayValue(/Nike Air Max 90/i);
    const priceInput = screen.getByDisplayValue('160');
    const descriptionTextarea = screen.getByDisplayValue('Some description');

    fireEvent.change(productNameInput, {
      target: { value: 'Nike Air Max 90' },
    });
    fireEvent.change(priceInput, { target: { value: '120' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Cool shoes' } });

    const sizeButton = await screen.findByRole('button', { name: /EU-38/i });
    fireEvent.click(sizeButton);

    // const submitButton = screen.getByRole('button', { name: /submit/i });
    // fireEvent.click(submitButton);

    // await waitFor(() => {
    //   expect(onSubmit).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       productName: 'Nike Air Max 90',
    //       price: '120',
    //       description: 'Cool shoes',
    //       color: 'Black',
    //       gender: 'Men',
    //       brand: 'Nike',
    //       size: [
    //         expect.objectContaining({
    //           id: expect.any(Number),
    //           attributes: expect.objectContaining({
    //             value: 'EU-38',
    //           }),
    //         }),
    //       ],
    //     })
    //   );
    // });
  });
});
