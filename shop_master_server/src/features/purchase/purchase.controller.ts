import { Request, Response } from 'express';
import {
  createPurchaseService,
  getPurchasesService,
  getPurchaseByIdService,
} from './purchase.service';
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

export const createPurchase = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const purchase = await createPurchaseService(shopId, req.body);
    sendCreated(res, 'Purchase recorded successfully', purchase);
  }
);

export const getPurchases = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);

    const filter = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      supplierId: req.query.supplierId as string,
      from: req.query.from as string,
      to: req.query.to as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await getPurchasesService(shopId, filter);
    sendSuccess(
      res,
      'Purchases fetched successfully',
      result.purchases,
      200,
      result.meta
    );
  }
);

export const getPurchaseById = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const purchaseId = getRequiredParam(req.params.purchaseId, 'purchaseId');
    const purchase = await getPurchaseByIdService(shopId, purchaseId);
    sendSuccess(res, 'Purchase fetched successfully', purchase);
  }
);