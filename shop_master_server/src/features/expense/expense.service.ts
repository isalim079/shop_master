import mongoose from 'mongoose';
import { Expense } from './expense.model';
import {
  ICreateExpenseInput,
  IUpdateExpenseInput,
  IExpenseFilter,
} from './expense.interface';
import { NotFoundError } from '../../shared/errors';
import { buildPaginationMeta } from '../../shared/utils/response';
import { parsePagination } from '../../shared/types';

// ─── Create Expense ───────────────────────────────────────────────────────────
export const createExpenseService = async (
  shopId: string,
  input: ICreateExpenseInput
) => {
  return await Expense.create({
    shopId,
    ...input,
    expenseDate: input.expenseDate || new Date(),
  });
};

// ─── Get All Expenses ─────────────────────────────────────────────────────────
export const getExpensesService = async (
  shopId: string,
  filter: IExpenseFilter
) => {
  const { page, limit, skip, sort } = parsePagination(filter);

  const query: any = { shopId };

  if (filter.category) {
    query.category = { $regex: filter.category, $options: 'i' };
  }

  if (filter.from || filter.to) {
    query.expenseDate = {};
    if (filter.from) query.expenseDate.$gte = new Date(filter.from);
    if (filter.to) query.expenseDate.$lte = new Date(filter.to);
  }

  const [expenses, total] = await Promise.all([
    Expense.find(query).sort(sort).skip(skip).limit(limit),
    Expense.countDocuments(query),
  ]);

  return {
    expenses,
    meta: buildPaginationMeta(total, page, limit),
  };
};

// ─── Get Expense By ID ────────────────────────────────────────────────────────
export const getExpenseByIdService = async (
  shopId: string,
  expenseId: string
) => {
  const expense = await Expense.findOne({ _id: expenseId, shopId });
  if (!expense) throw new NotFoundError('Expense not found');
  return expense;
};

// ─── Update Expense ───────────────────────────────────────────────────────────
export const updateExpenseService = async (
  shopId: string,
  expenseId: string,
  input: IUpdateExpenseInput
) => {
  const expense = await Expense.findOne({ _id: expenseId, shopId });
  if (!expense) throw new NotFoundError('Expense not found');

  Object.assign(expense, input);
  await expense.save();

  return expense;
};

// ─── Delete Expense ───────────────────────────────────────────────────────────
export const deleteExpenseService = async (
  shopId: string,
  expenseId: string
) => {
  const expense = await Expense.findOne({ _id: expenseId, shopId });
  if (!expense) throw new NotFoundError('Expense not found');
  await expense.deleteOne();
};

// ─── Get Expense Summary ──────────────────────────────────────────────────────
export const getExpenseSummaryService = async (
  shopId: string,
  from: Date,
  to: Date
) => {
  const result = await Expense.aggregate([
    {
      $match: {
        shopId: new mongoose.Types.ObjectId(shopId),
        expenseDate: { $gte: from, $lte: to },
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = result.reduce((sum, item) => sum + item.total, 0);

  return {
    byCategory: result,
    grandTotal,
  };
};