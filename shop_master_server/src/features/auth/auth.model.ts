import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './auth.interface';
import { ALLOWED_EMAIL_DOMAINS } from '../../shared/constants';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) => {
          const domain = email.split('@')[1];
          return ALLOWED_EMAIL_DOMAINS.includes(domain as any);
        },
        message: 'Only gmail.com and outlook.com email addresses are allowed',
      },
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: ['owner', 'manager', 'cashier'],
      default: 'owner',
    },

    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    avatar: {
      type: String,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

// ─── Hash password before saving ─────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ─── Instance Methods ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);