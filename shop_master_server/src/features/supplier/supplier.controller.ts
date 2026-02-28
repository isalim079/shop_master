import { Request, Response } from 'express';
import {
  createSupplierService,
  getSuppliersService,
  getSupplierByIdService,
  updateSupplierService,
  deleteSupplierService,
} from './supplier.service';
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

export const createSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const supplier = await createSupplierService(shopId, req.body);
    sendCreated(res, 'Supplier created successfully', supplier);
  }
);

export const getSuppliers = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);

    const filter = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      search: req.query.search as string,
      isActive: req.query.isActive !== undefined
        ? req.query.isActive === 'true'
        : undefined,
    };

    const result = await getSuppliersService(shopId, filter);
    sendSuccess(res, 'Suppliers fetched successfully', result.suppliers, 200, result.meta);
  }
);

export const getSupplierById = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const supplierId = getRequiredParam(req.params.supplierId, 'supplierId');
    const supplier = await getSupplierByIdService(shopId, supplierId);
    sendSuccess(res, 'Supplier fetched successfully', supplier);
  }
);

export const updateSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const supplierId = getRequiredParam(req.params.supplierId, 'supplierId');
    const supplier = await updateSupplierService(shopId, supplierId, req.body);
    sendSuccess(res, 'Supplier updated successfully', supplier);
  }
);

export const deleteSupplier = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = getRequiredShopId(req.user?.shopId);
    const supplierId = getRequiredParam(req.params.supplierId, 'supplierId');
    await deleteSupplierService(shopId, supplierId);
    sendSuccess(res, 'Supplier deleted successfully');
  }
);