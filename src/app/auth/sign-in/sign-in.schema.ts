import z from 'zod';

export const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'At least 6 characters'),
});

export type SignInSchema = z.infer<typeof signInSchema>;
