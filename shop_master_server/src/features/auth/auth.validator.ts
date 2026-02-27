import { z } from 'zod';
import { ALLOWED_EMAIL_DOMAINS } from '../../shared/constants';

const emailSchema = z
  .string()
  .email('Invalid email address')
  .refine((email) => {
    const domain = email.split('@')[1];
    return ALLOWED_EMAIL_DOMAINS.includes(domain as any);
  }, `Only ${ALLOWED_EMAIL_DOMAINS.join(' and ')} emails are allowed`);

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password is too long');

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: emailSchema,
  password: passwordSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const resendOtpSchema = z.object({
  email: emailSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});