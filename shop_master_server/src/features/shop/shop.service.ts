import { Shop } from './shop.model';
import { User } from '../auth/auth.model';
import {
  ICreateShopInput,
  IUpdateShopInput,
  IAddCategoryInput,
  IUpdateCategoryInput,
} from './shop.interface';
import { SHOP_TYPE_TEMPLATES } from '../../shared/constants';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from '../../shared/errors';

// ─── Create Shop ──────────────────────────────────────────────────────────────
export const createShopService = async (
  userId: string,
  input: ICreateShopInput
) => {
  // One shop per user
  const existingShop = await Shop.findOne({ ownerId: userId });
  if (existingShop) {
    throw new ConflictError('You already have a shop');
  }

  // Load default categories and units from template
  const template = SHOP_TYPE_TEMPLATES[input.type];
  const categories = template.categories.map((name) => ({ name }));
  const units = template.units;

  const shop = await Shop.create({
    ownerId: userId,
    ...input,
    categories,
    units,
  });

  // Link shop to user
  await User.findByIdAndUpdate(userId, { shopId: shop._id });

  return shop;
};

// ─── Get My Shop ──────────────────────────────────────────────────────────────
export const getMyShopService = async (userId: string) => {
  const shop = await Shop.findOne({ ownerId: userId });
  if (!shop) throw new NotFoundError('Shop not found. Please create your shop first');
  return shop;
};

// ─── Update Shop ──────────────────────────────────────────────────────────────
export const updateShopService = async (
  userId: string,
  input: IUpdateShopInput
) => {
  const shop = await Shop.findOne({ ownerId: userId });
  if (!shop) throw new NotFoundError('Shop not found');

  Object.assign(shop, input);
  await shop.save();

  return shop;
};

// ─── Add Category ─────────────────────────────────────────────────────────────
export const addCategoryService = async (
  userId: string,
  input: IAddCategoryInput
) => {
  const shop = await Shop.findOne({ ownerId: userId });
  if (!shop) throw new NotFoundError('Shop not found');

  // Check duplicate category name
  const exists = shop.categories.some(
    (c) => c.name.toLowerCase() === input.name.toLowerCase()
  );
  if (exists) throw new ConflictError(`Category '${input.name}' already exists`);

  shop.categories.push(input);
  await shop.save();

  return shop.categories;
};

// ─── Update Category ──────────────────────────────────────────────────────────
export const updateCategoryService = async (
  userId: string,
  categoryId: string,
  input: IUpdateCategoryInput
) => {
  const shop = await Shop.findOne({ ownerId: userId });
  if (!shop) throw new NotFoundError('Shop not found');

  const category = shop.categories.find(
    (c) => c._id?.toString() === categoryId
  );
  if (!category) throw new NotFoundError('Category not found');

  Object.assign(category, input);
  await shop.save();

  return shop.categories;
};

// ─── Delete Category ──────────────────────────────────────────────────────────
export const deleteCategoryService = async (
  userId: string,
  categoryId: string
) => {
  const shop = await Shop.findOne({ ownerId: userId });
  if (!shop) throw new NotFoundError('Shop not found');

  const index = shop.categories.findIndex(
    (c) => c._id?.toString() === categoryId
  );
  if (index === -1) throw new NotFoundError('Category not found');

  shop.categories.splice(index, 1);
  await shop.save();

  return shop.categories;
};

// ─── Add Unit ─────────────────────────────────────────────────────────────────
export const addUnitService = async (userId: string, unit: string) => {
  const shop = await Shop.findOne({ ownerId: userId });
  if (!shop) throw new NotFoundError('Shop not found');

  const exists = shop.units.some(
    (u) => u.toLowerCase() === unit.toLowerCase()
  );
  if (exists) throw new ConflictError(`Unit '${unit}' already exists`);

  shop.units.push(unit);
  await shop.save();

  return shop.units;
};

// ─── Delete Unit ──────────────────────────────────────────────────────────────
export const deleteUnitService = async (userId: string, unit: string) => {
  const shop = await Shop.findOne({ ownerId: userId });
  if (!shop) throw new NotFoundError('Shop not found');

  const index = shop.units.findIndex(
    (u) => u.toLowerCase() === unit.toLowerCase()
  );
  if (index === -1) throw new NotFoundError(`Unit '${unit}' not found`);

  shop.units.splice(index, 1);
  await shop.save();

  return shop.units;
};

// ─── Get Currencies ───────────────────────────────────────────────────────────
export const getCurrenciesService = async () => {
  const { SUPPORTED_CURRENCIES } = await import('../../shared/constants');
  return SUPPORTED_CURRENCIES;
};

// ─── Get Shop Types ───────────────────────────────────────────────────────────
export const getShopTypesService = async () => {
  const { ShopType, SHOP_TYPE_TEMPLATES } = await import('../../shared/constants');
  return Object.values(ShopType).map((type) => ({
    type,
    defaultCategories: SHOP_TYPE_TEMPLATES[type].categories,
    defaultUnits: SHOP_TYPE_TEMPLATES[type].units,
  }));
};