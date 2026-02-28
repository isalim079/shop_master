import { Document, Types } from 'mongoose';

export interface ISupplier extends Document {
  _id: Types.ObjectId;
  shopId: Types.ObjectId;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSupplierInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface IUpdateSupplierInput {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  isActive?: boolean;
}

export interface ISupplierFilter {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}