import { Router } from "express";
import { createPurchase, getPurchases, getPurchaseById } from "./purchase.controller";
import { validate } from "../../shared/middleware/validate";
import { protect, requireShop } from "../../shared/middleware/auth.middleware";
import { createPurchaseSchema } from "./purchase.validator";

const router = Router();

router.use(protect, requireShop);

router.get("/", validate(createPurchaseSchema), getPurchases);
router.post("/", validate(createPurchaseSchema), createPurchase);
router.get("/:purchaseId", getPurchaseById);

export default router;
