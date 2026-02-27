import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  shopId: Types.ObjectId;
  name: string;
  description?: string;
  categoryId?: Types.ObjectId;
  unit: string;
  costPrice: number;       // weighted average cost, auto-calculated
  sellingPrice: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProductInput {
  name: string;
  description?: string;
  categoryId?: string;
  unit: string;
  sellingPrice: number;
  lowStockThreshold?: number;
}

export interface IUpdateProductInput {
  name?: string;
  description?: string;
  categoryId?: string;
  unit?: string;
  sellingPrice?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
}

export interface IProductFilter {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  lowStock?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}