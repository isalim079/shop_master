import { Document, Types } from 'mongoose';
import { ShopType, CurrencyCode } from '../../shared/constants';

export interface IShop extends Document {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  type: ShopType;
  currency: CurrencyCode;

  // Optional profile info
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;

  // User-defined categories and units
  categories: ICategory[];
  units: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  color?: string;
  icon?: string;
}

export interface ICreateShopInput {
  name: string;
  type: ShopType;
  currency: CurrencyCode;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
}

export interface IUpdateShopInput {
  name?: string;
  currency?: CurrencyCode;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  logo?: string;
}

export interface IAddCategoryInput {
  name: string;
  color?: string;
  icon?: string;
}

export interface IUpdateCategoryInput {
  name?: string;
  color?: string;
  icon?: string;
}