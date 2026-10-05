import type { Request } from 'express';
import { AppError } from './AppError';

export function getUserId(req: Request): number {
    if (typeof req.userId !== 'number') {
        throw new AppError(401, 'Authentication required');
    }
    return req.userId;
}