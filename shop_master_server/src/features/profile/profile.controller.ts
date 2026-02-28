import { Request, Response } from 'express';
import {
  getProfileService,
  updateProfileService,
  updateAvatarService,
  changePasswordService,
  deleteAccountService,
} from './profile.service';
import { sendSuccess } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { UnauthorizedError, BadRequestError } from '../../shared/errors';

// ─── Get Profile ──────────────────────────────────────────────────────────────
export const getProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedError('Not authenticated');
    const user = await getProfileService(userId);
    sendSuccess(res, 'Profile fetched successfully', user);
  }
);

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedError('Not authenticated');
    const user = await updateProfileService(userId, req.body);
    sendSuccess(res, 'Profile updated successfully', user);
  }
);

// ─── Update Avatar ────────────────────────────────────────────────────────────
export const updateAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedError('Not authenticated');

    const { avatarUrl } = req.body;
    if (!avatarUrl) throw new BadRequestError('Avatar URL is required');

    const user = await updateAvatarService(userId, avatarUrl);
    sendSuccess(res, 'Avatar updated successfully', user);
  }
);

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedError('Not authenticated');
    await changePasswordService(userId, req.body);
    sendSuccess(res, 'Password changed successfully');
  }
);

// ─── Delete Account ───────────────────────────────────────────────────────────
export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedError('Not authenticated');

    const { password } = req.body;
    if (!password) throw new BadRequestError('Password is required');

    await deleteAccountService(userId, password);
    res.clearCookie('refreshToken');
    sendSuccess(res, 'Account deleted successfully');
  }
);