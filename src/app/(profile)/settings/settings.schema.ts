import { z } from 'zod';
import { PHONE_REGEX } from '@/constants/phoneRegex';

export const settingsSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .optional(),
    email: z.email('The email is invalid').optional(),
    phoneNumber: z
      .string()
      .regex(PHONE_REGEX, 'Invalid phone number (e.g. (123) 456-7890)')
      .optional()
      .nullable(),
    avatar: z.instanceof(File).optional(),
    currentPassword: z.string().optional().nullable(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional()
      .nullable(),
    confirmPassword: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.password) {
        return !!data.currentPassword;
      }
      return true;
    },
    {
      message: 'Current password is required to set a new password',
      path: ['currentPassword'],
    }
  );

export type SettingsSchema = z.infer<typeof settingsSchema>;
