import { Request, Response } from 'express';
import {
  getReportService,
  getStockOverviewService,
  getCustomRangeReportService,
  getTodayRange,
  getWeekRange,
  getMonthRange,
  getYearRange,
} from './report.service';
import { sendSuccess } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { UnauthorizedError, BadRequestError } from '../../shared/errors';

export const getDailyReport = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = req.user?.shopId;
    if (!shopId) throw new UnauthorizedError('Shop not found');
    const report = await getReportService(shopId, getTodayRange());
    sendSuccess(res, 'Daily report fetched successfully', report);
  }
);

export const getWeeklyReport = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = req.user?.shopId;
    if (!shopId) throw new UnauthorizedError('Shop not found');
    const report = await getReportService(shopId, getWeekRange());
    sendSuccess(res, 'Weekly report fetched successfully', report);
  }
);

export const getMonthlyReport = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = req.user?.shopId;
    if (!shopId) throw new UnauthorizedError('Shop not found');
    const report = await getReportService(shopId, getMonthRange());
    sendSuccess(res, 'Monthly report fetched successfully', report);
  }
);

export const getYearlyReport = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = req.user?.shopId;
    if (!shopId) throw new UnauthorizedError('Shop not found');
    const report = await getReportService(shopId, getYearRange());
    sendSuccess(res, 'Yearly report fetched successfully', report);
  }
);

export const getCustomReport = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = req.user?.shopId;
    if (!shopId) throw new UnauthorizedError('Shop not found');

    const { from, to } = req.query;
    if (!from || !to) {
      throw new BadRequestError('from and to date are required');
    }

    if (isNaN(new Date(from as string).getTime())) {
      throw new BadRequestError('Invalid from date');
    }

    if (isNaN(new Date(to as string).getTime())) {
      throw new BadRequestError('Invalid to date');
    }

    const report = await getCustomRangeReportService(
      shopId,
      from as string,
      to as string
    );
    sendSuccess(res, 'Custom report fetched successfully', report);
  }
);

export const getStockOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = req.user?.shopId;
    if (!shopId) throw new UnauthorizedError('Shop not found');
    const overview = await getStockOverviewService(shopId);
    sendSuccess(res, 'Stock overview fetched successfully', overview);
  }
);