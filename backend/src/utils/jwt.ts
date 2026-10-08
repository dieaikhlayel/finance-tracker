import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './AppError';

export interface JwtPayload {
    sub: number; // user id
}

export function signToken(userId: number): string {
    return jwt.sign({ sub: userId }, env.jwt.secret, {
        expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });
}

export function verifyToken(token: string): JwtPayload {
    try {
        const decoded = jwt.verify(token, env.jwt.secret);
        if (
            typeof decoded === 'string' ||
            typeof decoded !== 'object' ||
            decoded === null ||
            typeof decoded.sub !== 'number'
        ) {
            throw new AppError(401, 'Invalid token payload');
        }
        return { sub: decoded.sub };
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError(401, 'Invalid or expired token');
    }
}
