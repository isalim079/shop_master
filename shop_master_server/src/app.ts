import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import morgan from 'morgan';
import { config } from './config/env.config';
import { morganStream } from './shared/utils/logger';
import { apiLimiter, globalErrorHandler, notFoundHandler } from './shared/middleware/index';
import authRouter from './features/auth/auth.route';
import shopRouter from './features/shop/shop.route';
import productRouter from './features/product/product.route';
import supplierRouter from './features/supplier/supplier.route';
import purchaseRouter from './features/purchase/purchase.route';
import saleRouter from './features/sale/sale.route';
import expenseRouter from './features/expense/expense.route';
import reportRouter from './features/report/report.route';
import profileRouter from './features/profile/profile.route';


const createApp = (): Application => {
  const app = express();

  // ─── Security ───────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(hpp());

  // ─── CORS ───────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: config.isDev ? '*' : [],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ─── Body Parsers ────────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // ─── Compression ─────────────────────────────────────────────────────────────
  app.use(compression());

  // ─── HTTP Logger ─────────────────────────────────────────────────────────────
  if (config.isDev) {
    // Development: colorful console logging
    app.use(morgan('dev'));
  } else {
    // Production: winston file logging
    app.use(morgan('combined', { stream: morganStream }));
  }

  // ─── Rate Limiter ─────────────────────────────────────────────────────────────
  app.use(`/api/${config.apiVersion}`, apiLimiter);

  // ─── Health Check ─────────────────────────────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      environment: config.env,
      timestamp: new Date().toISOString(),
    });
  });

  // ─── API Routes (added as features are built) ─────────────────────────────────
  app.use(`/api/${config.apiVersion}/auth`, authRouter);
  app.use(`/api/${config.apiVersion}/shop`, shopRouter);
  app.use(`/api/${config.apiVersion}/products`, productRouter);
  app.use(`/api/${config.apiVersion}/suppliers`, supplierRouter);
  app.use(`/api/${config.apiVersion}/purchases`, purchaseRouter);
  app.use(`/api/${config.apiVersion}/sales`, saleRouter);
  app.use(`/api/${config.apiVersion}/expenses`, expenseRouter);
  app.use(`/api/${config.apiVersion}/reports`, reportRouter);
  app.use(`/api/${config.apiVersion}/profile`, profileRouter);


  // ─── 404 & Error Handlers ─────────────────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};

export default createApp;