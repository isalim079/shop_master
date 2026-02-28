import { User } from '../auth/auth.model';
import { IUpdateProfileInput, IChangePasswordInput } from './profile.interface';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../../shared/errors';

// ─── Get Profile ──────────────────────────────────────────────────────────────
export const getProfileService = async (userId: string) => {
  const user = await User.findById(userId).populate('shopId', 'name type currency logo');
  if (!user) throw new NotFoundError('User not found');
  return user;
};

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfileService = async (
  userId: string,
  input: IUpdateProfileInput
) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');

  Object.assign(user, input);
  await user.save();

  return user;
};

// ─── Update Avatar ────────────────────────────────────────────────────────────
export const updateAvatarService = async (
  userId: string,
  avatarUrl: string
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: avatarUrl },
    { new: true }
  );
  if (!user) throw new NotFoundError('User not found');
  return user;
};

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePasswordService = async (
  userId: string,
  input: IChangePasswordInput
) => {
  const { currentPassword, newPassword, confirmPassword } = input;

  if (newPassword !== confirmPassword) {
    throw new BadRequestError('New password and confirm password do not match');
  }

  const user = await User.findById(userId).select('+password');
  if (!user) throw new NotFoundError('User not found');

  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  if (currentPassword === newPassword) {
    throw new BadRequestError('New password must be different from current password');
  }

  user.password = newPassword;
  await user.save();
};

// ─── Delete Account ───────────────────────────────────────────────────────────
export const deleteAccountService = async (
  userId: string,
  password: string
) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new NotFoundError('User not found');

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Incorrect password');
  }

  await user.deleteOne();
};