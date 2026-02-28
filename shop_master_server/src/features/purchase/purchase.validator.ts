import { z } from 'zod';

const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z
    .number({ message: 'Quantity must be a number' })
    .positive('Quantity must be greater than 0'),
  pricePerUnit: z
    .number({ message: 'Price must be a number' })
    .min(0, 'Price cannot be negative'),
});

export const createPurchaseSchema = z.object({
  supplierId: z.string().optional(),
  items: z
    .array(purchaseItemSchema)
    .min(1, 'At least one item is required'),
  totalTransportCost: z
    .number({ message: 'Transport cost must be a number' })
    .min(0, 'Transport cost cannot be negative')
    .optional(),
  note: z
    .string()
    .max(500, 'Note cannot exceed 500 characters')
    .optional(),
  purchasedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});