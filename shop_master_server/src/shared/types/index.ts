// ─── User Roles ───────────────────────────────────────────────────────────────
export enum UserRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  CASHIER = 'cashier',
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
}

export const parsePagination = (query: PaginationQuery): PaginationOptions => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = {
    [query.sortBy || 'createdAt']: query.sortOrder === 'asc' ? 1 : -1,
  };
  return { page, limit, skip, sort };
};

// ─── Augment Express Request ──────────────────────────────────────────────────
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        shopId: string;
        role: UserRole;
      };
    }
  }
}