import { Router } from 'express';
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from './supplier.controller';
import { validate } from '../../shared/middleware/validate';
import { protect, requireShop } from '../../shared/middleware/auth.middleware';
import {
  createSupplierSchema,
  updateSupplierSchema,
} from './supplier.validator';

const router = Router();

router.use(protect, requireShop);

router.get('/',                validate(createSupplierSchema), getSuppliers);
router.post('/',               validate(createSupplierSchema), createSupplier);
router.get('/:supplierId',                                     getSupplierById);
router.put('/:supplierId',     validate(updateSupplierSchema), updateSupplier);
router.delete('/:supplierId',                                  deleteSupplier);

export default router;