import mongoose, { Schema } from 'mongoose';
import { IPurchase, IPurchaseItem } from './purchase.interface';

const purchaseItemSchema = new Schema<IPurchaseItem>(
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
    pricePerUnit: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    subtotal: {
      type: Number,
      required: true,
    },
    transportCost: {
      type: Number,
      default: 0,
    },
    costPerUnit: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const purchaseSchema = new Schema<IPurchase>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },

    invoiceNumber: {
      type: String,
      required: true,
    },

    items: {
      type: [purchaseItemSchema],
      required: true,
      validate: {
        validator: (items: IPurchaseItem[]) => items.length > 0,
        message: 'At least one item is required',
      },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    totalTransportCost: {
      type: Number,
      default: 0,
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

    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

purchaseSchema.index({ shopId: 1, purchasedAt: -1 });
purchaseSchema.index({ shopId: 1, supplierId: 1 });

export const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema);