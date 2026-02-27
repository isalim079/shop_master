import { Router } from "express";
import {
  createShop,
  getMyShop,
  updateShop,
  addCategory,
  updateCategory,
  deleteCategory,
  addUnit,
  deleteUnit,
  getCurrencies,
  getShopTypes,
} from "./shop.controller";
import { validate } from "../../shared/middleware/validate";
import { protect } from "../../shared/middleware/auth.middleware";
import {
  createShopSchema,
  updateShopSchema,
  addCategorySchema,
  updateCategorySchema,
  addUnitSchema,
} from "./shop.validator";

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get("/currencies", getCurrencies);
router.get("/types", getShopTypes);

// ─── Protected (all routes below require login) ───────────────────────────────
router.use(protect);

router.post("/", validate(createShopSchema), createShop);
router.get("/me", getMyShop);
router.put("/me", validate(updateShopSchema), updateShop);

// ─── Categories ───────────────────────────────────────────────────────────────
router.post("/me/categories", validate(addCategorySchema), addCategory);
router.put("/me/categories/:categoryId", validate(updateCategorySchema), updateCategory);
router.delete("/me/categories/:categoryId", deleteCategory);

// ─── Units ────────────────────────────────────────────────────────────────────
router.post("/me/units", validate(addUnitSchema), addUnit);
router.delete("/me/units/:unit", deleteUnit);

export default router;
