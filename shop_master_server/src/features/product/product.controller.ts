import { Request, Response } from 'express';
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  getLowStockProductsService,
  getProductsByCategoryService,
} from './product.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { BadRequestError, UnauthorizedError } from '../../shared/errors';

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

// ─── Create Product ───────────────────────────────────────────────────────────
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);

    const product = await createProductService(shopId, req.body);

    sendCreated(res, 'Product created successfully', product);
  }
);

// ─── Get All Products ─────────────────────────────────────────────────────────
export const getProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);

    const filter = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      search: req.query.search as string,
      categoryId: req.query.categoryId as string,
      lowStock: req.query.lowStock === 'true',
      isActive: req.query.isActive !== undefined
        ? req.query.isActive === 'true'
        : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await getProductsService(shopId, filter);

    sendSuccess(res, 'Products fetched successfully', result.products, 200, result.meta);
  }
);

// ─── Get Single Product ───────────────────────────────────────────────────────
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const productId = getRequiredParam(req.params.productId, 'productId');

    const product = await getProductByIdService(shopId, productId);

    sendSuccess(res, 'Product fetched successfully', product);
  }
);

// ─── Update Product ───────────────────────────────────────────────────────────
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const productId = getRequiredParam(req.params.productId, 'productId');

    const product = await updateProductService(
      shopId,
      productId,
      req.body
    );

    sendSuccess(res, 'Product updated successfully', product);
  }
);

// ─── Delete Product ───────────────────────────────────────────────────────────
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const productId = getRequiredParam(req.params.productId, 'productId');

    await deleteProductService(shopId, productId);

    sendSuccess(res, 'Product deleted successfully');
  }
);

// ─── Get Low Stock Products ───────────────────────────────────────────────────
export const getLowStockProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);

    const products = await getLowStockProductsService(shopId);

    sendSuccess(res, 'Low stock products fetched successfully', products);
  }
);

// ─── Get Products by Category ─────────────────────────────────────────────────
export const getProductsByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const categoryId = getRequiredParam(req.params.categoryId, 'categoryId');

    const products = await getProductsByCategoryService(
      shopId,
      categoryId
    );

    sendSuccess(res, 'Products fetched successfully', products);
  }
);