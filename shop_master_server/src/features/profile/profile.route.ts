import { Router } from "express";
import { getProfile, updateProfile, updateAvatar, changePassword, deleteAccount } from "./profile.controller";
import { validate } from "../../shared/middleware/validate";
import { protect } from "../../shared/middleware/auth.middleware";
import {
  updateProfileSchema,
  updateAvatarSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "./profile.validator";

const router = Router();

router.use(protect);

router.get("/", getProfile);
router.put("/", validate(updateProfileSchema), updateProfile);
router.patch("/avatar", validate(updateAvatarSchema), updateAvatar);
router.patch("/password", validate(changePasswordSchema), changePassword);
router.delete("/", validate(deleteAccountSchema), deleteAccount);

export default router;
