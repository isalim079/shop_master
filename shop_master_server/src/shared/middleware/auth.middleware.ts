import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.config';
import { User } from '../../features/auth/auth.model';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { asyncHandler } from './asyncHandler';
import { ITokenPayload } from '../../features/auth/auth.interface';
import { UserRole } from '../types';

// ─── Protect — verify JWT ─────────────────────────────────────────────────────
export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is required');
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded: ITokenPayload;
    try {
      decoded = jwt.verify(token, config.jwt.accessSecret) as ITokenPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired access token');
    }

    // 3. Check user still exists
    const user = await User.findById(decoded.userId).select('_id role shopId isVerified');
    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    if (!user.isVerified) {
      throw new UnauthorizedError('Please verify your account first');
    }

    // 4. Attach user to request
    req.user = {
      userId: user._id.toString(),
      shopId: user.shopId?.toString() || '',
      role: user.role as UserRole,
    };

    next();
  }
);

// ─── Role Guard — restrict to specific roles ──────────────────────────────────
export const restrictTo = (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Required role: ${roles.join(' or ')}`
      );
    }

    next();
  };

// ─── Shop Guard — ensure user has a shop set up ───────────────────────────────
export const requireShop = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user?.shopId) {
    throw new ForbiddenError('Please set up your shop first');
  }
  next();
};