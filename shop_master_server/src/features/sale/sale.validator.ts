import { z } from 'zod';

const saleItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z
    .number({ message: 'Quantity must be a number' })
    .positive('Quantity must be greater than 0'),
  sellingPrice: z
    .number({ message: 'Selling price must be a number' })
    .min(0, 'Selling price cannot be negative'),
});

export const createSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, 'At least one item is required'),
  discount: z
    .number({ message: 'Discount must be a number' })
    .min(0, 'Discount cannot be negative')
    .optional(),
  discountType: z.enum(['fixed', 'percentage']).optional(),
  note: z
    .string()
    .max(500, 'Note cannot exceed 500 characters')
    .optional(),
  soldAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});