// ─── Allowed Email Domains ────────────────────────────────────────────────────
export const ALLOWED_EMAIL_DOMAINS = ['gmail.com', 'outlook.com'] as const;

// ─── Shop Types ───────────────────────────────────────────────────────────────
export enum ShopType {
  PET_FOOD     = 'pet_food',
  GENERAL_STORE = 'general_store',
  RESTAURANT   = 'restaurant',
  CLOTHING     = 'clothing',
  PHARMACY     = 'pharmacy',
  ELECTRONICS  = 'electronics',
  GROCERY      = 'grocery',
  OTHER        = 'other',
}

// ─── Shop Type Default Templates ─────────────────────────────────────────────
export const SHOP_TYPE_TEMPLATES: Record<ShopType, { categories: string[]; units: string[] }> = {
  [ShopType.PET_FOOD]: {
    categories: ['Cow Food', 'Poultry Food', 'Fish Food', 'Dog Food', 'Cat Food'],
    units: ['kg', 'g', 'bag', 'piece', 'liter'],
  },
  [ShopType.GENERAL_STORE]: {
    categories: ['Beverages', 'Snacks', 'Cleaning', 'Personal Care', 'Stationery'],
    units: ['piece', 'box', 'dozen', 'pack', 'bottle'],
  },
  [ShopType.RESTAURANT]: {
    categories: ['Ingredients', 'Beverages', 'Packaging', 'Spices', 'Dairy'],
    units: ['kg', 'liter', 'piece', 'packet', 'tray'],
  },
  [ShopType.CLOTHING]: {
    categories: ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'],
    units: ['piece', 'pair', 'set', 'dozen'],
  },
  [ShopType.PHARMACY]: {
    categories: ['Medicine', 'Supplements', 'Medical Devices', 'Cosmetics'],
    units: ['strip', 'bottle', 'piece', 'box', 'tube'],
  },
  [ShopType.ELECTRONICS]: {
    categories: ['Mobile', 'Accessories', 'Computers', 'Home Appliances'],
    units: ['piece', 'set', 'box'],
  },
  [ShopType.GROCERY]: {
    categories: ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Oil & Spices'],
    units: ['kg', 'g', 'liter', 'piece', 'bundle'],
  },
  [ShopType.OTHER]: {
    categories: ['General'],
    units: ['piece', 'unit'],
  },
};

// ─── Supported Currencies ─────────────────────────────────────────────────────
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'BDT', symbol: '৳',  name: 'Bangladeshi Taka' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼',  name: 'Saudi Riyal' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]['code'];

// ─── OTP ──────────────────────────────────────────────────────────────────────
export const OTP_LENGTH = 6;

// ─── Pagination Defaults ──────────────────────────────────────────────────────
export const DEFAULT_PAGE  = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT     = 100;