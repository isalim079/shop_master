import { Router } from 'express';
import {
  register,
  verifyOtp,
  login,
  resendOtp,
  refreshToken,
  logout,
} from './auth.controller';
import { validate } from '../../shared/middleware/validate';
import { authLimiter, otpLimiter } from '../../shared/middleware/rateLimiter';
import { protect } from '../../shared/middleware/auth.middleware';
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  resendOtpSchema,
  refreshTokenSchema,
} from './auth.validator';

const router = Router();

router.post('/register',   authLimiter, validate(registerSchema),    register);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema),   verifyOtp);
router.post('/login',      authLimiter, validate(loginSchema),       login);
router.post('/resend-otp', otpLimiter,  validate(resendOtpSchema),   resendOtp);
router.post('/refresh',                 validate(refreshTokenSchema), refreshToken);
router.post('/logout',     protect,                                   logout);

export default router;