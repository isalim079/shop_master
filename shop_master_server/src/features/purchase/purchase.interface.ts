import { Document, Types } from 'mongoose';

export interface IPurchaseItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
  transportCost: number;     // portion of transport allocated to this item
  costPerUnit: number;       // (subtotal + transportCost) / quantity
}

export interface IPurchase extends Document {
  _id: Types.ObjectId;
  shopId: Types.ObjectId;
  supplierId?: Types.ObjectId;
  invoiceNumber: string;
  items: IPurchaseItem[];
  totalAmount: number;
  totalTransportCost: number;
  grandTotal: number;
  note?: string;
  purchasedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchaseItemInput {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

export interface ICreatePurchaseInput {
  supplierId?: string;
  items: IPurchaseItemInput[];
  totalTransportCost?: number;
  note?: string;
  purchasedAt?: Date;
}

export interface IPurchaseFilter {
  page?: number;
  limit?: number;
  supplierId?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}