
import {
  ICreateSupplierInput,
  IUpdateSupplierInput,
  ISupplierFilter,
} from './supplier.interface';
import { ConflictError, NotFoundError } from '../../shared/errors';
import { buildPaginationMeta } from '../../shared/utils/response';
import { parsePagination } from '../../shared/types';
import { Supplier } from './supplier.model';

export const createSupplierService = async (
  shopId: string,
  input: ICreateSupplierInput
) => {
  const existing = await Supplier.findOne({
    shopId,
    name: { $regex: new RegExp(`^${input.name}$`, 'i') },
  });
  if (existing) throw new ConflictError(`Supplier '${input.name}' already exists`);

  return await Supplier.create({ shopId, ...input });
};

export const getSuppliersService = async (
  shopId: string,
  filter: ISupplierFilter
) => {
  const { page, limit, skip, sort } = parsePagination(filter);

  const query: any = { shopId };

  if (filter.search) {
    query.name = { $regex: filter.search, $options: 'i' };
  }

  if (filter.isActive !== undefined) {
    query.isActive = filter.isActive;
  }

  const [suppliers, total] = await Promise.all([
    Supplier.find(query).sort(sort).skip(skip).limit(limit),
    Supplier.countDocuments(query),
  ]);

  return {
    suppliers,
    meta: buildPaginationMeta(total, page, limit),
  };
};

export const getSupplierByIdService = async (
  shopId: string,
  supplierId: string
) => {
  const supplier = await Supplier.findOne({ _id: supplierId, shopId });
  if (!supplier) throw new NotFoundError('Supplier not found');
  return supplier;
};

export const updateSupplierService = async (
  shopId: string,
  supplierId: string,
  input: IUpdateSupplierInput
) => {
  const supplier = await Supplier.findOne({ _id: supplierId, shopId });
  if (!supplier) throw new NotFoundError('Supplier not found');

  Object.assign(supplier, input);
  await supplier.save();

  return supplier;
};

export const deleteSupplierService = async (
  shopId: string,
  supplierId: string
) => {
  const supplier = await Supplier.findOne({ _id: supplierId, shopId });
  if (!supplier) throw new NotFoundError('Supplier not found');
  await supplier.deleteOne();
};