import mongoose, { Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'Shop is required'],
      index: true,
    },

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      default: null,
    },

    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },

    // ─── Pricing ───────────────────────────────────────────────────────────────
    costPrice: {
      type: Number,
      default: 0,
      min: [0, 'Cost price cannot be negative'],
    },

    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },

    // ─── Stock ─────────────────────────────────────────────────────────────────
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },

    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Low stock threshold cannot be negative'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
productSchema.index({ shopId: 1, name: 1 });
productSchema.index({ shopId: 1, categoryId: 1 });
productSchema.index({ shopId: 1, isActive: 1 });
productSchema.index({ shopId: 1, stock: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);