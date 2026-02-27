import { Request, Response } from 'express';
import {
  registerService,
  verifyOtpService,
  loginService,
  refreshTokenService,
  logoutService,
  resendOtpService,
} from './auth.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { UnauthorizedError } from '../../shared/errors';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  await registerService({ name, email, password });
  sendSuccess(
    res,
    `OTP sent to ${email}. Please verify your email to complete registration.`
  );
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const tokens = await verifyOtpService({ email, otp });
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
  sendCreated(res, 'Account created successfully', {
    accessToken: tokens.accessToken,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await loginService({ email, password });
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
  sendSuccess(res, 'Logged in successfully', {
    accessToken: tokens.accessToken,
  });
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await resendOtpService(email);
  sendSuccess(res, `OTP resent to ${email}`);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) throw new UnauthorizedError('Refresh token is required');
  const tokens = await refreshTokenService(token);
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
  sendSuccess(res, 'Token refreshed', { accessToken: tokens.accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new UnauthorizedError('Not authenticated');
  await logoutService(userId);
  res.clearCookie('refreshToken');
  sendSuccess(res, 'Logged out successfully');
});