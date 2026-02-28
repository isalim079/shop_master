import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductsByCategory,
} from "./product.controller";
import { validate } from "../../shared/middleware/validate";
import { protect } from "../../shared/middleware/auth.middleware";
import { requireShop } from "../../shared/middleware/auth.middleware";
import { createProductSchema, updateProductSchema, productFilterSchema } from "./product.validator";

const router = Router();

// ─── All product routes require login + shop ──────────────────────────────────
router.use(protect, requireShop);

router.get("/low-stock", getLowStockProducts);
router.get("/category/:categoryId", getProductsByCategory);

router.get("/", validate(productFilterSchema, "query"), getProducts);
router.post("/", validate(createProductSchema), createProduct);
router.get("/:productId", getProductById);
router.put("/:productId", validate(updateProductSchema), updateProduct);
router.delete("/:productId", deleteProduct);

export default router;
