import { Document, Types } from 'mongoose';

export interface ISaleItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  sellingPrice: number;
  costPrice: number;
  subtotal: number;
  profit: number;
}

export interface ISale extends Document {
  _id: Types.ObjectId;
  shopId: Types.ObjectId;
  invoiceNumber: string;
  items: ISaleItem[];
  totalAmount: number;
  totalCost: number;
  totalProfit: number;
  discount: number;
  discountType: 'fixed' | 'percentage';
  grandTotal: number;
  note?: string;
  soldAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISaleItemInput {
  productId: string;
  quantity: number;
  sellingPrice: number;
}

export interface ICreateSaleInput {
  items: ISaleItemInput[];
  discount?: number;
  discountType?: 'fixed' | 'percentage';
  note?: string;
  soldAt?: Date;
}

export interface ISaleFilter {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}