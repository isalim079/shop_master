import mongoose from 'mongoose';
import { Purchase } from './purchase.model';
import { Product } from '../product/product.model';
import {
  ICreatePurchaseInput,
  IPurchaseFilter,
} from './purchase.interface';
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
  return `PUR-${dateStr}-${random}`;
};

// ─── Create Purchase ──────────────────────────────────────────────────────────
export const createPurchaseService = async (
  shopId: string,
  input: ICreatePurchaseInput
) => {
  const { items, totalTransportCost = 0, supplierId, note, purchasedAt } = input;

  // Calculate total quantity for transport cost distribution
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Validate all products exist and belong to shop
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({
    _id: { $in: productIds },
    shopId,
  });

  if (products.length !== items.length) {
    throw new BadRequestError('One or more products not found in your shop');
  }

  // Build purchase items with cost calculation
  let totalAmount = 0;
  const purchaseItems = items.map((item) => {
    const product = products.find(
      (p) => p._id.toString() === item.productId
    );
    if (!product) throw new NotFoundError(`Product not found`);

    const subtotal = item.quantity * item.pricePerUnit;

    // Distribute transport cost proportionally by quantity
    const itemTransportCost =
      totalQuantity > 0
        ? (item.quantity / totalQuantity) * totalTransportCost
        : 0;

    // costPerUnit = (purchase cost + allocated transport) / quantity
    const costPerUnit = (subtotal + itemTransportCost) / item.quantity;

    totalAmount += subtotal;

    return {
      productId: product._id,
      productName: product.name,
      quantity: item.quantity,
      pricePerUnit: item.pricePerUnit,
      subtotal,
      transportCost: itemTransportCost,
      costPerUnit,
    };
  });

  const grandTotal = totalAmount + totalTransportCost;

  // ─── Use session for atomicity ─────────────────────────────────────────────
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create purchase record
    const [purchase] = await Purchase.create(
      [
        {
          shopId,
          supplierId,
          invoiceNumber: generateInvoiceNumber(),
          items: purchaseItems,
          totalAmount,
          totalTransportCost,
          grandTotal,
          note,
          purchasedAt: purchasedAt || new Date(),
        },
      ],
      { session }
    );

    // Update each product: stock + weighted average cost price
    for (const item of purchaseItems) {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      if (!product) continue;

      const currentStock = product.stock;
      const currentCostPrice = product.costPrice;
      const newStock = currentStock + item.quantity;

      // Weighted average cost formula:
      // newCostPrice = (currentStock * currentCostPrice + newQty * newCostPerUnit) / newStock
      const newCostPrice =
        newStock > 0
          ? (currentStock * currentCostPrice + item.quantity * item.costPerUnit) /
            newStock
          : item.costPerUnit;

      await Product.findByIdAndUpdate(
        product._id,
        {
          $inc: { stock: item.quantity },
          costPrice: parseFloat(newCostPrice.toFixed(4)),
        },
        { session }
      );
    }

    await session.commitTransaction();
    return purchase;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ─── Get All Purchases ────────────────────────────────────────────────────────
export const getPurchasesService = async (
  shopId: string,
  filter: IPurchaseFilter
) => {
  const { page, limit, skip, sort } = parsePagination(filter);

  const query: any = { shopId };

  if (filter.supplierId) query.supplierId = filter.supplierId;

  if (filter.from || filter.to) {
    query.purchasedAt = {};
    if (filter.from) query.purchasedAt.$gte = new Date(filter.from);
    if (filter.to) query.purchasedAt.$lte = new Date(filter.to);
  }

  const [purchases, total] = await Promise.all([
    Purchase.find(query)
      .populate('supplierId', 'name phone')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Purchase.countDocuments(query),
  ]);

  return {
    purchases,
    meta: buildPaginationMeta(total, page, limit),
  };
};

// ─── Get Purchase By ID ───────────────────────────────────────────────────────
export const getPurchaseByIdService = async (
  shopId: string,
  purchaseId: string
) => {
  const purchase = await Purchase.findOne({
    _id: purchaseId,
    shopId,
  }).populate('supplierId', 'name phone email');

  if (!purchase) throw new NotFoundError('Purchase not found');

  return purchase;
};