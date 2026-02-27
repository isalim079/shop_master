import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './auth.model';
import {
  IRegisterInput,
  IVerifyOtpInput,
  ILoginInput,
  IAuthTokens,
  ITokenPayload,
} from './auth.interface';
import { config } from '../../config/env.config';
import { sendOtpEmail } from '../../shared/utils/email';
import { saveOtp, getOtp, deleteOtp } from '../../shared/utils/otpStore';
import { ALLOWED_EMAIL_DOMAINS } from '../../shared/constants';
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from '../../shared/errors';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateOtp = (): string => crypto.randomInt(100000, 999999).toString();

const generateTokens = (payload: ITokenPayload): IAuthTokens => {
  const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(
    { userId: payload.userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

const validateEmailDomain = (email: string): void => {
  const domain = email.split('@')[1];
  if (!ALLOWED_EMAIL_DOMAINS.includes(domain as any)) {
    throw new BadRequestError(
      `Only ${ALLOWED_EMAIL_DOMAINS.join(' and ')} email addresses are allowed`
    );
  }
};

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerService = async (input: IRegisterInput): Promise<void> => {
  const { name, email, password } = input;

  validateEmailDomain(email);

  // Reject if verified account already exists
  const existingUser = await User.findOne({ email, isVerified: true });
  if (existingUser) {
    throw new ConflictError('An account with this email already exists');
  }

  // Hash password before storing in temp store
  const hashedPassword = await bcrypt.hash(password, 12);

  const otp = generateOtp();

  // Save to memory only — NOT to DB
  saveOtp(email, otp, name, hashedPassword, config.otp.expiresInMinutes);

  // If email fails, error is thrown — nothing was persisted
  await sendOtpEmail(email, otp, name);
};

// ─── Verify OTP — create user in DB only here ─────────────────────────────────
export const verifyOtpService = async (
  input: IVerifyOtpInput
): Promise<IAuthTokens> => {
  const { email, otp } = input;

  const record = getOtp(email);
  if (!record) {
    throw new BadRequestError(
      'OTP not found or expired. Please register again'
    );
  }

  if (new Date() > record.expiresAt) {
    deleteOtp(email);
    throw new BadRequestError('OTP has expired. Please register again');
  }

  if (record.otp !== otp) {
    throw new UnauthorizedError('Invalid OTP');
  }

  // ✅ Only now create user in DB
  const user = await User.create({
    name: record.name,
    email,
    password: record.hashedPassword,
    isVerified: true,
  });

  // Clean up memory store
  deleteOtp(email);

  const tokens = generateTokens({
    userId: user._id.toString(),
    shopId: '',
    role: user.role,
  });

  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};

// ─── Resend OTP ───────────────────────────────────────────────────────────────
export const resendOtpService = async (email: string): Promise<void> => {
  validateEmailDomain(email);

  const record = getOtp(email);
  if (!record) {
    throw new BadRequestError(
      'No pending registration found. Please register again'
    );
  }

  const otp = generateOtp();

  saveOtp(email, otp, record.name, record.hashedPassword, config.otp.expiresInMinutes);

  await sendOtpEmail(email, otp, record.name);
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginService = async (input: ILoginInput): Promise<IAuthTokens> => {
  const { email, password } = input;

  validateEmailDomain(email);

  const user = await User.findOne({ email, isVerified: true }).select(
    '+password +refreshToken'
  );
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

  const tokens = generateTokens({
    userId: user._id.toString(),
    shopId: user.shopId?.toString() || '',
    role: user.role,
  });

  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
export const refreshTokenService = async (
  token: string
): Promise<IAuthTokens> => {
  if (!token) throw new UnauthorizedError('Refresh token is required');

  let decoded: any;
  try {
    decoded = jwt.verify(token, config.jwt.refreshSecret);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const tokens = generateTokens({
    userId: user._id.toString(),
    shopId: user.shopId?.toString() || '',
    role: user.role,
  });

  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logoutService = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { refreshToken: undefined });
};