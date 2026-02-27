import mongoose, { Schema } from 'mongoose';
import { IShop, ICategory } from './shop.interface';
import { ShopType, SUPPORTED_CURRENCIES } from '../../shared/constants';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    icon: {
      type: String,
    },
  },
  { _id: true }
);

const shopSchema = new Schema<IShop>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      unique: true, // one shop per user
    },

    name: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
      minlength: [2, 'Shop name must be at least 2 characters'],
      maxlength: [100, 'Shop name cannot exceed 100 characters'],
    },

    type: {
      type: String,
      enum: Object.values(ShopType),
      required: [true, 'Shop type is required'],
    },

    currency: {
      type: String,
      enum: SUPPORTED_CURRENCIES.map((c) => c.code),
      required: [true, 'Currency is required'],
      default: 'USD',
    },

    // ─── Optional Profile ──────────────────────────────────────────────────────
    logo: {
      type: String,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // ─── User Customizable ─────────────────────────────────────────────────────
    categories: {
      type: [categorySchema],
      default: [],
    },

    units: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Shop = mongoose.model<IShop>('Shop', shopSchema);