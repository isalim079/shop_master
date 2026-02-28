import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  categoryId: z.string().optional(),
  unit: z
    .string()
    .min(1, 'Unit is required')
    .max(20, 'Unit cannot exceed 20 characters')
    .trim(),
  sellingPrice: z
    .number({ message: 'Selling price must be a number' })
    .min(0, 'Selling price cannot be negative'),
  lowStockThreshold: z
    .number({ message: 'Low stock threshold must be a number' })
    .min(0, 'Low stock threshold cannot be negative')
    .optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name cannot exceed 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  categoryId: z.string().optional(),
  unit: z
    .string()
    .min(1, 'Unit is required')
    .max(20, 'Unit cannot exceed 20 characters')
    .trim()
    .optional(),
  sellingPrice: z
    .number({ message: 'Selling price must be a number' })
    .min(0, 'Selling price cannot be negative')
    .optional(),
  lowStockThreshold: z
    .number({ message: 'Low stock threshold must be a number' })
    .min(0, 'Low stock threshold cannot be negative')
    .optional(),
  isActive: z.boolean().optional(),
});

export const productFilterSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20)),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  lowStock: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  isActive: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? val === 'true' : undefined)),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});