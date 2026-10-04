import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { notFoundHandler, errorHandler } from './utils/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin, credentials: false }));
  app.use(express.json({ limit: '100kb' }));

  // Health check — deliberately before auth so it's always reachable
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes will be mounted here in later phases:
  // app.use('/api/auth', authRoutes);
  // app.use('/api/categories', categoryRoutes);
  // app.use('/api/transactions', transactionRoutes);
  // app.use('/api/stats', statsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}