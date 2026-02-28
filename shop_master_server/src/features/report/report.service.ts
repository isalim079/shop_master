import mongoose from 'mongoose';
import { Sale } from '../sale/sale.model';
import { Expense } from '../expense/expense.model';
import { Product } from '../product/product.model';
import {
  IDateRange,
  ISalesSummary,
  IExpenseSummary,
  ITopProduct,
  IDailyDataPoint,
  IReportSummary,
} from './report.interface';

// ─── Date Range Helpers ───────────────────────────────────────────────────────

export const getTodayRange = (): IDateRange => {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  return { from, to };
};

export const getWeekRange = (): IDateRange => {
  const from = new Date();
  from.setDate(from.getDate() - 6);
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  return { from, to };
};

export const getMonthRange = (): IDateRange => {
  const from = new Date();
  from.setDate(1);
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  return { from, to };
};

export const getYearRange = (): IDateRange => {
  const from = new Date();
  from.setMonth(0, 1);
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  return { from, to };
};

// ─── Sales Summary ────────────────────────────────────────────────────────────

const getSalesSummary = async (
  shopId: string,
  range: IDateRange
): Promise<ISalesSummary> => {
  const result = await Sale.aggregate([
    {
      $match: {
        shopId: new mongoose.Types.ObjectId(shopId),
        soldAt: { $gte: range.from, $lte: range.to },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: '$grandTotal' },
        totalCost: { $sum: '$totalCost' },
        totalProfit: { $sum: '$totalProfit' },
        totalDiscount: { $sum: '$discount' },
      },
    },
  ]);

  const data = result[0] || {
    totalSales: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    totalDiscount: 0,
  };

  const profitMargin =
    data.totalRevenue > 0
      ? parseFloat(((data.totalProfit / data.totalRevenue) * 100).toFixed(2))
      : 0;

  return { ...data, profitMargin };
};

// ─── Expense Summary ──────────────────────────────────────────────────────────

const getExpenseSummary = async (
  shopId: string,
  range: IDateRange
): Promise<IExpenseSummary> => {
  const result = await Expense.aggregate([
    {
      $match: {
        shopId: new mongoose.Types.ObjectId(shopId),
        expenseDate: { $gte: range.from, $lte: range.to },
      },
    },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  return result[0] || { totalExpenses: 0, totalAmount: 0 };
};

// ─── Top Products ─────────────────────────────────────────────────────────────

const getTopProducts = async (
  shopId: string,
  range: IDateRange,
  limit = 5
): Promise<ITopProduct[]> => {
  const result = await Sale.aggregate([
    {
      $match: {
        shopId: new mongoose.Types.ObjectId(shopId),
        soldAt: { $gte: range.from, $lte: range.to },
      },
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        productName: { $first: '$items.productName' },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.subtotal' },
        totalProfit: { $sum: '$items.profit' },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit },
    {
      $project: {
        productId: '$_id',
        productName: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        totalProfit: 1,
        _id: 0,
      },
    },
  ]);

  return result;
};

// ─── Chart Data (daily breakdown) ────────────────────────────────────────────

const getChartData = async (
  shopId: string,
  range: IDateRange
): Promise<IDailyDataPoint[]> => {
  const shopObjectId = new mongoose.Types.ObjectId(shopId);

  const [salesData, expenseData] = await Promise.all([
    Sale.aggregate([
      {
        $match: {
          shopId: shopObjectId,
          soldAt: { $gte: range.from, $lte: range.to },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$soldAt' },
          },
          revenue: { $sum: '$grandTotal' },
          profit: { $sum: '$totalProfit' },
          sales: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Expense.aggregate([
      {
        $match: {
          shopId: shopObjectId,
          expenseDate: { $gte: range.from, $lte: range.to },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$expenseDate' },
          },
          expenses: { $sum: '$amount' },
        },
      },
    ]),
  ]);

  // Merge sales and expense data by date
  const dataMap = new Map<string, IDailyDataPoint>();

  salesData.forEach((item) => {
    dataMap.set(item._id, {
      date: item._id,
      revenue: item.revenue,
      profit: item.profit,
      sales: item.sales,
      expenses: 0,
    });
  });

  expenseData.forEach((item) => {
    const existing = dataMap.get(item._id);
    if (existing) {
      existing.expenses = item.expenses;
    } else {
      dataMap.set(item._id, {
        date: item._id,
        revenue: 0,
        profit: 0,
        sales: 0,
        expenses: item.expenses,
      });
    }
  });

  return Array.from(dataMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

// ─── Full Report ──────────────────────────────────────────────────────────────

export const getReportService = async (
  shopId: string,
  range: IDateRange
): Promise<IReportSummary> => {
  const [sales, expenses, topProducts, chartData] = await Promise.all([
    getSalesSummary(shopId, range),
    getExpenseSummary(shopId, range),
    getTopProducts(shopId, range),
    getChartData(shopId, range),
  ]);

  const netProfit = sales.totalProfit - expenses.totalAmount;

  return {
    sales,
    expenses,
    netProfit,
    topProducts,
    chartData,
  };
};

// ─── Stock Overview ───────────────────────────────────────────────────────────

export const getStockOverviewService = async (shopId: string) => {
  const result = await Product.aggregate([
    {
      $match: {
        shopId: new mongoose.Types.ObjectId(shopId),
        isActive: true,
      },
    },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStockValue: {
          $sum: { $multiply: ['$stock', '$costPrice'] },
        },
        lowStockCount: {
          $sum: {
            $cond: [{ $lte: ['$stock', '$lowStockThreshold'] }, 1, 0],
          },
        },
        outOfStockCount: {
          $sum: {
            $cond: [{ $eq: ['$stock', 0] }, 1, 0],
          },
        },
      },
    },
  ]);

  return result[0] || {
    totalProducts: 0,
    totalStockValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  };
};

// ─── Custom Range Report ──────────────────────────────────────────────────────

export const getCustomRangeReportService = async (
  shopId: string,
  from: string,
  to: string
) => {
  const range: IDateRange = {
    from: new Date(from),
    to: new Date(to),
  };
  range.to.setHours(23, 59, 59, 999);

  return getReportService(shopId, range);
};