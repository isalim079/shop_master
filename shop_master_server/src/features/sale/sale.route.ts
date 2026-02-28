import { Router } from "express";
import { createSale, getSales, getSaleById, getTodaySummary } from "./sale.controller";
import { validate } from "../../shared/middleware/validate";
import { protect, requireShop } from "../../shared/middleware/auth.middleware";
import { createSaleSchema } from "./sale.validator";

const router = Router();

router.use(protect, requireShop);

router.get("/today", getTodaySummary);
router.get("/", getSales);
router.post("/", validate(createSaleSchema), createSale);
router.get("/:saleId", getSaleById);

export default router;
