import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z
    .string()
    .min(2, 'Supplier name must be at least 2 characters')
    .max(100, 'Supplier name cannot exceed 100 characters')
    .trim(),
  phone: z.string().trim().optional(),
  email: z.string().email('Invalid email').optional(),
  address: z.string().trim().optional(),
  note: z
    .string()
    .max(500, 'Note cannot exceed 500 characters')
    .optional(),
});

export const updateSupplierSchema = z.object({
  name: z
    .string()
    .min(2, 'Supplier name must be at least 2 characters')
    .max(100, 'Supplier name cannot exceed 100 characters')
    .trim()
    .optional(),
  phone: z.string().trim().optional(),
  email: z.string().email('Invalid email').optional(),
  address: z.string().trim().optional(),
  note: z
    .string()
    .max(500, 'Note cannot exceed 500 characters')
    .optional(),
  isActive: z.boolean().optional(),
});