import * as z from 'zod';
export const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  price: z.string().min(1, 'Price is required'),
  color: z.string().min(1, 'Color is required'),
  gender: z.string(),
  brand: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  size: z
    .array(
      z.object({
        id: z.number(),
        attributes: z.object({
          value: z.union([z.string(), z.number()]),
        }),
      })
    )
    .min(1, 'At least one size is required'),
});
