import mongoose from 'mongoose';
import { Sale } from './sale.model';
import { Product } from '../product/product.model';
import {
  ICreateSaleInput,
  ISaleFilter,
} from './sale.interface';
import {
  BadRequestError,
  NotFoundError,
} from '../../shared/errors';
import { buildPaginationMeta } from '../../shared/utils/response';
import { parsePagination } from '../../shared/types';

// ─── Generate invoice number ──────────────────────────────────────────────────
const generateInvoiceNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SAL-${dateStr}-${random}`;
};

// ─── Create Sale ──────────────────────────────────────────────────────────────
export const createSaleService = async (
  shopId: string,
  input: ICreateSaleInput
) => {
  const { items, discount = 0, discountType = 'fixed', note, soldAt } = input;

  // Validate all products
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({
    _id: { $in: productIds },
    shopId,
    isActive: true,
  });

  if (products.length !== items.length) {
    throw new BadRequestError('One or more products not found in your shop');
  }

  // Check sufficient stock for all items
  for (const item of items) {
    const product = products.find(
      (p) => p._id.toString() === item.productId
    );
    if (!product) throw new NotFoundError(`Product not found`);

    if (product.stock < item.quantity) {
      throw new BadRequestError(
        `Insufficient stock for '${product.name}'. Available: ${product.stock}`
      );
    }
  }

  // Build sale items
  let totalAmount = 0;
  let totalCost = 0;

  const saleItems = items.map((item) => {
    const product = products.find(
      (p) => p._id.toString() === item.productId
    );
    if (!product) throw new NotFoundError(`Product not found`);

    const subtotal = item.quantity * item.sellingPrice;
    const cost = item.quantity * product.costPrice;
    const profit = subtotal - cost;

    totalAmount += subtotal;
    totalCost += cost;

    return {
      productId: product._id,
      productName: product.name,
      quantity: item.quantity,
      sellingPrice: item.sellingPrice,
      costPrice: product.costPrice,
      subtotal,
      profit,
    };
  });

  // Apply discount
  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (totalAmount * discount) / 100;
  } else {
    discountAmount = discount;
  }

  if (discountAmount > totalAmount) {
    throw new BadRequestError('Discount cannot exceed total amount');
  }

  const grandTotal = totalAmount - discountAmount;
  const totalProfit = grandTotal - totalCost;

  // ─── Atomic transaction ────────────────────────────────────────────────────
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create sale record
    const [sale] = await Sale.create(
      [
        {
          shopId,
          invoiceNumber: generateInvoiceNumber(),
          items: saleItems,
          totalAmount,
          totalCost,
          totalProfit,
          discount,
          discountType,
          grandTotal,
          note,
          soldAt: soldAt || new Date(),
        },
      ],
      { session }
    );

    // Deduct stock for each product
    for (const item of saleItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    return sale;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ─── Get All Sales ────────────────────────────────────────────────────────────
export const getSalesService = async (
  shopId: string,
  filter: ISaleFilter
) => {
  const { page, limit, skip, sort } = parsePagination(filter);

  const query: any = { shopId };

  if (filter.from || filter.to) {
    query.soldAt = {};
    if (filter.from) query.soldAt.$gte = new Date(filter.from);
    if (filter.to) query.soldAt.$lte = new Date(filter.to);
  }

  const [sales, total] = await Promise.all([
    Sale.find(query).sort(sort).skip(skip).limit(limit),
    Sale.countDocuments(query),
  ]);

  return {
    sales,
    meta: buildPaginationMeta(total, page, limit),
  };
};

// ─── Get Sale By ID ───────────────────────────────────────────────────────────
export const getSaleByIdService = async (
  shopId: string,
  saleId: string
) => {
  const sale = await Sale.findOne({ _id: saleId, shopId });
  if (!sale) throw new NotFoundError('Sale not found');
  return sale;
};

// ─── Get Sales Summary (today) ────────────────────────────────────────────────
export const getTodaySummaryService = async (shopId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const result = await Sale.aggregate([
    {
      $match: {
        shopId: new mongoose.Types.ObjectId(shopId),
        soldAt: { $gte: startOfDay, $lte: endOfDay },
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

  return result[0] || {
    totalSales: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    totalDiscount: 0,
  };
};