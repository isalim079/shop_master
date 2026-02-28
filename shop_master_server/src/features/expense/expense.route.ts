import { Router } from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} from "./expense.controller";
import { validate } from "../../shared/middleware/validate";
import { protect, requireShop } from "../../shared/middleware/auth.middleware";
import { createExpenseSchema, updateExpenseSchema } from "./expense.validator";

const router = Router();

router.use(protect, requireShop);

router.get("/summary", getExpenseSummary);
router.get("/", getExpenses);
router.post("/", validate(createExpenseSchema), createExpense);
router.get("/:expenseId", getExpenseById);
router.put("/:expenseId", validate(updateExpenseSchema), updateExpense);
router.delete("/:expenseId", deleteExpense);

export default router;
