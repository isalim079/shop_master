import mongoose, { Schema } from 'mongoose';
import { ISupplier } from './supplier.interface';

const supplierSchema = new Schema<ISupplier>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'Shop is required'],
      index: true,
    },

    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
      minlength: [2, 'Supplier name must be at least 2 characters'],
      maxlength: [100, 'Supplier name cannot exceed 100 characters'],
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
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },

    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
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

supplierSchema.index({ shopId: 1, name: 1 }, { unique: true });
supplierSchema.index({ shopId: 1, isActive: 1 });

export const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema);