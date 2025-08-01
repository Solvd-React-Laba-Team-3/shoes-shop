import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  price: z.number().min(1, 'Price is required'),
  color: z.number().min(1, 'Color is required'),
  gender: z.number().min(1, 'Gender is required'),
  brand: z.number().min(1, 'Brand is required'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  sizes: z.array(z.number()).min(1, 'At least one size is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;
