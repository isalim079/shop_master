import mongoose, { Schema } from 'mongoose';
import { ISale, ISaleItem } from './sale.interface';

const saleItemSchema = new Schema<ISaleItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0.01, 'Quantity must be greater than 0'],
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: [0, 'Selling price cannot be negative'],
    },
    costPrice: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    profit: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const saleSchema = new Schema<ISale>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
    },

    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (items: ISaleItem[]) => items.length > 0,
        message: 'At least one item is required',
      },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    totalCost: {
      type: Number,
      required: true,
    },

    totalProfit: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },

    discountType: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'fixed',
    },

    grandTotal: {
      type: Number,
      required: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },

    soldAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

saleSchema.index({ shopId: 1, soldAt: -1 });

export const Sale = mongoose.model<ISale>('Sale', saleSchema);