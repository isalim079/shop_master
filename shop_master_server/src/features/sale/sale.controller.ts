import { Request, Response } from 'express';
import {
  createSaleService,
  getSalesService,
  getSaleByIdService,
  getTodaySummaryService,
} from './sale.service';
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

export const createSale = asyncHandler(async (req: Request, res: Response) => {
  const shopId = getRequiredShopId(req.user?.shopId);
  const sale = await createSaleService(shopId, req.body);
  sendCreated(res, 'Sale recorded successfully', sale);
});

export const getSales = asyncHandler(async (req: Request, res: Response) => {
  const shopId = getRequiredShopId(req.user?.shopId);

  const filter = {
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    from: req.query.from as string,
    to: req.query.to as string,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await getSalesService(shopId, filter);
  sendSuccess(res, 'Sales fetched successfully', result.sales, 200, result.meta);
});

export const getSaleById = asyncHandler(async (req: Request, res: Response) => {
  const shopId = getRequiredShopId(req.user?.shopId);
  const saleId = getRequiredParam(req.params.saleId, 'saleId');
  const sale = await getSaleByIdService(shopId, saleId);
  sendSuccess(res, 'Sale fetched successfully', sale);
});

export const getTodaySummary = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const summary = await getTodaySummaryService(shopId);
    sendSuccess(res, 'Today summary fetched successfully', summary);
  }
);