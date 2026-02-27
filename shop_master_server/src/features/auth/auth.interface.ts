import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'owner' | 'manager' | 'cashier';
  shopId?: Types.ObjectId;
  isVerified: boolean;
  avatar?: string;
  phone?: string;
  address?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(password: string): Promise<boolean>;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface IVerifyOtpInput {
  email: string;
  otp: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ITokenPayload {
  userId: string;
  shopId: string;
  role: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}