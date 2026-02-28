import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim()
    .optional(),
  phone: z
    .string()
    .trim()
    .optional(),
  address: z
    .string()
    .trim()
    .optional(),
});

export const updateAvatarSchema = z.object({
  avatarUrl: z
    .string()
    .url('Invalid avatar URL'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z
      .string()
      .min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});