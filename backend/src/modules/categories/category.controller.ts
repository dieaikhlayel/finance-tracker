import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { AppError } from '../../utils/AppError';
import { listCategories, type CategoryType } from './category.service';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const rawType = req.query.type;

    let type: CategoryType | undefined;

    if (rawType !== undefined) {
        if (rawType !== 'INCOME' && rawType !== 'EXPENSE') {
            throw new AppError(400, "Query parameter 'type' must be INCOME or EXPENSE");
        }
        type = rawType;
    }

    const categories = await listCategories(type);
    res.status(200).json({ categories });
});