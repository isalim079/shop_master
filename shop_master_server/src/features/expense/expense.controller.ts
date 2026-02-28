import { Request, Response } from 'express';
import {
  createExpenseService,
  getExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
  getExpenseSummaryService,
} from './expense.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { UnauthorizedError, BadRequestError } from '../../shared/errors';

const getRequiredParam = (
  value: string | string[] | undefined,
  paramName: string
): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw new BadRequestError(`Invalid ${paramName} parameter`);
};

const getRequiredShopId = (shopId: string | string[] | undefined): string => {
  if (typeof shopId === 'string' && shopId.trim().length > 0) {
    return shopId;
  }

  throw new UnauthorizedError('Shop not found');
};

export const createExpense = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const expense = await createExpenseService(shopId, req.body);
    sendCreated(res, 'Expense recorded successfully', expense);
  }
);

export const getExpenses = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);

    const filter = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      category: req.query.category as string,
      from: req.query.from as string,
      to: req.query.to as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await getExpensesService(shopId, filter);
    sendSuccess(
      res,
      'Expenses fetched successfully',
      result.expenses,
      200,
      result.meta
    );
  }
);

export const getExpenseById = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const expenseId = getRequiredParam(req.params.expenseId, 'expenseId');
    const expense = await getExpenseByIdService(shopId, expenseId);
    sendSuccess(res, 'Expense fetched successfully', expense);
  }
);

export const updateExpense = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const expenseId = getRequiredParam(req.params.expenseId, 'expenseId');
    const expense = await updateExpenseService(
      shopId,
      expenseId,
      req.body
    );
    sendSuccess(res, 'Expense updated successfully', expense);
  }
);

export const deleteExpense = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const expenseId = getRequiredParam(req.params.expenseId, 'expenseId');
    await deleteExpenseService(shopId, expenseId);
    sendSuccess(res, 'Expense deleted successfully');
  }
);

export const getExpenseSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);

    const from = req.query.from
      ? new Date(req.query.from as string)
      : new Date(new Date().setDate(1)); // start of current month
    const to = req.query.to
      ? new Date(req.query.to as string)
      : new Date();

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new BadRequestError('Invalid date format');
    }

    const summary = await getExpenseSummaryService(shopId, from, to);
    sendSuccess(res, 'Expense summary fetched successfully', summary);
  }
);