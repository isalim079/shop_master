import { Request, Response } from 'express';
import {
  createShopService,
  getMyShopService,
  updateShopService,
  addCategoryService,
  updateCategoryService,
  deleteCategoryService,
  addUnitService,
  deleteUnitService,
  getCurrenciesService,
  getShopTypesService,
} from './shop.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { UnauthorizedError } from '../../shared/errors';

// ─── Create Shop ──────────────────────────────────────────────────────────────
export const createShop = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new UnauthorizedError('Not authenticated');

  const shop = await createShopService(userId, req.body);

  sendCreated(res, 'Shop created successfully', shop);
});

// ─── Get My Shop ──────────────────────────────────────────────────────────────
export const getMyShop = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new UnauthorizedError('Not authenticated');

  const shop = await getMyShopService(userId);

  sendSuccess(res, 'Shop fetched successfully', shop);
});

// ─── Update Shop ──────────────────────────────────────────────────────────────
export const updateShop = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new UnauthorizedError('Not authenticated');

  const shop = await updateShopService(userId, req.body);

  sendSuccess(res, 'Shop updated successfully', shop);
});

// ─── Add Category ─────────────────────────────────────────────────────────────
export const addCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new UnauthorizedError('Not authenticated');

  const categories = await addCategoryService(userId, req.body);

  sendCreated(res, 'Category added successfully', categories);
});

// ─── Update Category ──────────────────────────────────────────────────────────
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedError('Not authenticated');

    const categoryId = Array.isArray(req.params.categoryId)
      ? req.params.categoryId[0]!
      : req.params.categoryId;

    const categories = await updateCategoryService(
      userId,
      categoryId,
      req.body
    );

    sendSuccess(res, 'Category updated successfully', categories);
  }
);

// ─── Delete Category ──────────────────────────────────────────────────────────
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedError('Not authenticated');

    const categoryId = Array.isArray(req.params.categoryId)
      ? req.params.categoryId[0]!
      : req.params.categoryId;

    const categories = await deleteCategoryService(
      userId,
      categoryId
    );

    sendSuccess(res, 'Category deleted successfully', categories);
  }
);

// ─── Add Unit ─────────────────────────────────────────────────────────────────
export const addUnit = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new UnauthorizedError('Not authenticated');

  const units = await addUnitService(userId, req.body.unit);

  sendCreated(res, 'Unit added successfully', units);
});

// ─── Delete Unit ──────────────────────────────────────────────────────────────
export const deleteUnit = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new UnauthorizedError('Not authenticated');

  const unit = Array.isArray(req.params.unit)
    ? req.params.unit[0]!
    : req.params.unit;

  const units = await deleteUnitService(userId, unit);

  sendSuccess(res, 'Unit deleted successfully', units);
});

// ─── Get Currencies ───────────────────────────────────────────────────────────
export const getCurrencies = asyncHandler(
  async (_req: Request, res: Response) => {
    const currencies = await getCurrenciesService();
    sendSuccess(res, 'Currencies fetched successfully', currencies);
  }
);

// ─── Get Shop Types ───────────────────────────────────────────────────────────
export const getShopTypes = asyncHandler(
  async (_req: Request, res: Response) => {
    const shopTypes = await getShopTypesService();
    sendSuccess(res, 'Shop types fetched successfully', shopTypes);
  }
);