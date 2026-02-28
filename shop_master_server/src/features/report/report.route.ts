import { Router } from "express";
import {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getYearlyReport,
  getCustomReport,
  getStockOverview,
} from "./report.controller";
import { protect, requireShop } from "../../shared/middleware/auth.middleware";

const router = Router();

router.use(protect, requireShop);

router.get("/daily", getDailyReport);
router.get("/weekly", getWeeklyReport);
router.get("/monthly", getMonthlyReport);
router.get("/yearly", getYearlyReport);
router.get("/custom", getCustomReport);
router.get("/stock", getStockOverview);

export default router;
