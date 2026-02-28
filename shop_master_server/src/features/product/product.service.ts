import { Product } from './product.model';
import { Shop } from '../shop/shop.model';
import {
  ICreateProductInput,
  IUpdateProductInput,
  IProductFilter,
} from './product.interface';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../shared/errors';
import { buildPaginationMeta } from '../../shared/utils/response';
import { parsePagination } from '../../shared/types';

// ─── Create Product ───────────────────────────────────────────────────────────
export const createProductService = async (
  shopId: string,
  input: ICreateProductInput
) => {
  // Validate category belongs to shop if provided
  if (input.categoryId) {
    const shop = await Shop.findById(shopId);
    if (!shop) throw new NotFoundError('Shop not found');

    const categoryExists = shop.categories.some(
      (c) => c._id?.toString() === input.categoryId
    );
    if (!categoryExists) throw new BadRequestError('Invalid category');

    // Validate unit belongs to shop
    const unitExists = shop.units.includes(input.unit);
    if (!unitExists) throw new BadRequestError(`Unit '${input.unit}' not found in your shop. Please add it first`);
  }

  // Check duplicate product name in same shop
  const existing = await Product.findOne({
    shopId,
    name: { $regex: new RegExp(`^${input.name}$`, 'i') },
  });
  if (existing) throw new ConflictError(`Product '${input.name}' already exists`);

  const product = await Product.create({
    shopId,
    ...input,
  });

  return product;
};

// ─── Get All Products ─────────────────────────────────────────────────────────
export const getProductsService = async (
  shopId: string,
  filter: IProductFilter
) => {
  const { page, limit, skip, sort } = parsePagination(filter);

  // Build query
  const query: any = { shopId };

  if (filter.search) {
    query.name = { $regex: filter.search, $options: 'i' };
  }

  if (filter.categoryId) {
    query.categoryId = filter.categoryId;
  }

  if (filter.isActive !== undefined) {
    query.isActive = filter.isActive;
  }

  if (filter.lowStock === true) {
    query.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
  }

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    products,
    meta: buildPaginationMeta(total, page, limit),
  };
};

// ─── Get Single Product ───────────────────────────────────────────────────────
export const getProductByIdService = async (
  shopId: string,
  productId: string
) => {
  const product = await Product.findOne({ _id: productId, shopId });
  if (!product) throw new NotFoundError('Product not found');
  return product;
};

// ─── Update Product ───────────────────────────────────────────────────────────
export const updateProductService = async (
  shopId: string,
  productId: string,
  input: IUpdateProductInput
) => {
  const product = await Product.findOne({ _id: productId, shopId });
  if (!product) throw new NotFoundError('Product not found');

  // Validate category if being updated
  if (input.categoryId) {
    const shop = await Shop.findById(shopId);
    const categoryExists = shop?.categories.some(
      (c) => c._id?.toString() === input.categoryId
    );
    if (!categoryExists) throw new BadRequestError('Invalid category');
  }

  // Validate unit if being updated
  if (input.unit) {
    const shop = await Shop.findById(shopId);
    const unitExists = shop?.units.includes(input.unit);
    if (!unitExists) throw new BadRequestError(`Unit '${input.unit}' not found in your shop`);
  }

  Object.assign(product, input);
  await product.save();

  return product;
};

// ─── Delete Product ───────────────────────────────────────────────────────────
export const deleteProductService = async (
  shopId: string,
  productId: string
) => {
  const product = await Product.findOne({ _id: productId, shopId });
  if (!product) throw new NotFoundError('Product not found');

  await product.deleteOne();
};

// ─── Get Low Stock Products ───────────────────────────────────────────────────
export const getLowStockProductsService = async (shopId: string) => {
  const products = await Product.find({
    shopId,
    isActive: true,
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
  }).sort({ stock: 1 });

  return products;
};

// ─── Get Products by Category ─────────────────────────────────────────────────
export const getProductsByCategoryService = async (
  shopId: string,
  categoryId: string
) => {
  const products = await Product.find({
    shopId,
    categoryId,
    isActive: true,
  }).sort({ name: 1 });

  return products;
};