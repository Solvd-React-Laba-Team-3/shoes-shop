// import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { productSchema } from './ProductForm';
// import EditPage from './EditPage';

describe('editPage', () => {
  it('should pass with valid data', () => {
    const result = productSchema.safeParse({
      productName: 'Nike Air Max 90',
      price: '120',
      color: 'Black',
      gender: 'Male',
      brand: 'Puma',
      description: 'Nice shoes',
      size: ['EU-38', 'EU-39'],
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
      price: '120',
      color: 'Black',
      gender: '',
      brand: 'Puma',
      description: 'Nice shoes',
      size: [],
    });

    expect(result.success).toBe(true);
  });

  // it('submits valid form data', async () => {
  //   const logSpy = jest.spyOn(console, 'log').mockImplementation();

  //   render(<EditPage />);

  //   const productNameInput = screen.getByPlaceholderText(
  //     /Nike Air Max 90/i
  //   ) as HTMLInputElement;
  //   const priceInput = screen.getByPlaceholderText(
  //     /\$160/i
  //   ) as HTMLInputElement;
  //   const descriptionTextarea = screen.getByPlaceholderText(
  //     /lorem ipsum/i
  //   ) as HTMLTextAreaElement;

  //   fireEvent.change(productNameInput, {
  //     target: { value: 'Nike Air Max 90' },
  //   });
  //   fireEvent.change(priceInput, { target: { value: '120' } });
  //   fireEvent.change(descriptionTextarea, { target: { value: 'Cool shoes' } });

  //   // fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  //   await waitFor(() => {
  //     expect(logSpy).toHaveBeenCalledWith(
  //       'Form Data:',
  //       expect.objectContaining({
  //         productName: 'Nike Air Max 90',
  //         price: '120',
  //         description: 'Cool shoes',
  //         color: 'Black',
  //         gender: 'Male',
  //         brand: 'Nike',
  //         size: '',
  //       })
  //     );
  //   });

  //   logSpy.mockRestore();
  // });
});
