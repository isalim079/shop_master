import { Document, Types } from 'mongoose';

export interface IExpense extends Document {
  _id: Types.ObjectId;
  shopId: Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  note?: string;
  expenseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateExpenseInput {
  title: string;
  amount: number;
  category: string;
  note?: string;
  expenseDate?: Date;
}

export interface IUpdateExpenseInput {
  title?: string;
  amount?: number;
  category?: string;
  note?: string;
  expenseDate?: Date;
}

export interface IExpenseFilter {
  page?: number;
  limit?: number;
  category?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}