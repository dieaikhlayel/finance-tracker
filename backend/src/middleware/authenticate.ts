import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header) {
        throw new AppError(401, 'Authentication required');
    }

    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        throw new AppError(401, 'Invalid Authorization header format');
    }

    const payload = verifyToken(token);
    req.userId = payload.sub;
    next();
}