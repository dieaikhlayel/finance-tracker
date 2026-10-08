import type { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import { env } from '../config/env';

interface ErrorBody {
  error: {
    message: string;
    details?: unknown;
  };
}

function hasErrorCode(err: unknown, code: string): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: unknown }).code === code
  );
}

export function notFoundHandler(_req: Request, res: Response): void {
  const body: ErrorBody = { error: { message: 'Route not found' } };
  res.status(404).json(body);
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Already-shaped application errors
  if (err instanceof AppError) {
    const body: ErrorBody = { error: { message: err.message } };
    if (err.details !== undefined) body.error.details = err.details;
    res.status(err.statusCode).json(body);
    return;
  }

  // MySQL duplicate entry -> 409
  if (hasErrorCode(err, 'ER_DUP_ENTRY')) {
    res.status(409).json({ error: { message: 'Resource already exists' } });
    return;
  }

  // Unknown: log full error server-side, return generic message
  console.error('[unhandled error]', err);
  const body: ErrorBody = {
    error: {
      message: env.nodeEnv === 'production'
        ? 'Internal server error'
        : (err instanceof Error ? err.message : String(err)),
    },
  };
  res.status(500).json(body);
}
