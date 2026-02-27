import createApp from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database.config";
import { config } from "./config/env.config";
import { logger } from "./shared/utils/logger";


const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(`🚀 ShopMaster API running`);
    logger.info(`   ├─ Env  : ${config.env}`);
    logger.info(`   ├─ Port : ${config.port}`);
    logger.info(`   └─ Base : /api/${config.apiVersion}`);
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────────────
  const gracefulShutdown = async (signal: string): Promise<void> => {
    logger.info(`\n⚠️  ${signal} received. Shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('👋 Shutdown complete.');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('❌ Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason: any) => {
    logger.error('❌ Unhandled Rejection:', reason);
    gracefulShutdown('unhandledRejection');
  });

  process.on('uncaughtException', (err: Error) => {
    logger.error('❌ Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
  });
};

bootstrap();