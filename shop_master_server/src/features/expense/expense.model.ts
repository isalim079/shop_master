import mongoose, { Schema } from 'mongoose';
import { IExpense } from './expense.interface';

const expenseSchema = new Schema<IExpense>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },

    expenseDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ shopId: 1, expenseDate: -1 });
expenseSchema.index({ shopId: 1, category: 1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);