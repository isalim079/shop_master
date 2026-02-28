import { z } from 'zod';

export const createExpenseSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),
  amount: z
    .number({ message: 'Amount must be a number' })
    .min(0, 'Amount cannot be negative'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category cannot exceed 50 characters')
    .trim(),
  note: z
    .string()
    .max(500, 'Note cannot exceed 500 characters')
    .optional(),
  expenseDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const updateExpenseSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .trim()
    .optional(),
  amount: z
    .number({ message: 'Amount must be a number' })
    .min(0, 'Amount cannot be negative')
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category cannot exceed 50 characters')
    .trim()
    .optional(),
  note: z
    .string()
    .max(500, 'Note cannot exceed 500 characters')
    .optional(),
  expenseDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});