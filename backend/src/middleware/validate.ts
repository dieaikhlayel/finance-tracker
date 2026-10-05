import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

type Source = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, source: Source = 'body') {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));
            throw new AppError(400, 'Validation failed', details);
        }
        // Overwrite with the parsed value so defaults and coercions apply
        (req as any)[source] = result.data;
        next();
    };
}