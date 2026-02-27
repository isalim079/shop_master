import { z } from 'zod';
import { ShopType, SUPPORTED_CURRENCIES } from '../../shared/constants';

const currencyCodes = SUPPORTED_CURRENCIES.map((c) => c.code) as [
  string,
  ...string[]
];

export const createShopSchema = z.object({
  name: z
    .string()
    .min(2, 'Shop name must be at least 2 characters')
    .max(100, 'Shop name cannot exceed 100 characters')
    .trim(),
  type: z.nativeEnum(ShopType, {
    message: 'Invalid shop type',
  }),
  currency: z.enum(currencyCodes, {
    message: 'Invalid currency code',
  }),
  phone: z.string().trim().optional(),
  email: z.string().email('Invalid email').optional(),
  address: z.string().trim().optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

export const updateShopSchema = z.object({
  name: z
    .string()
    .min(2, 'Shop name must be at least 2 characters')
    .max(100, 'Shop name cannot exceed 100 characters')
    .trim()
    .optional(),
  currency: z
    .enum(currencyCodes, {
      message: 'Invalid currency code',
    })
    .optional(),
  phone: z.string().trim().optional(),
  email: z.string().email('Invalid email').optional(),
  address: z.string().trim().optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

export const addCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name cannot exceed 50 characters')
    .trim(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code')
    .optional(),
  icon: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name cannot exceed 50 characters')
    .trim()
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code')
    .optional(),
  icon: z.string().optional(),
});

export const addUnitSchema = z.object({
  unit: z
    .string()
    .min(1, 'Unit is required')
    .max(20, 'Unit cannot exceed 20 characters')
    .trim(),
});