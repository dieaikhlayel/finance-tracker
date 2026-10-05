import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getUserId } from '../../utils/getUserId';
import { AppError } from '../../utils/AppError';
import { getSummary, getByCategory, getMonthly } from './stats.service';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function readOptionalDate(raw: unknown, name: string): string | undefined {
    if (raw === undefined) return undefined;
    if (typeof raw !== 'string' || !DATE_RE.test(raw)) {
        throw new AppError(400, `Query parameter '${name}' must be in YYYY-MM-DD format`);
    }
    return raw;
}

function readOptionalType(raw: unknown, fallback: 'INCOME' | 'EXPENSE'): 'INCOME' | 'EXPENSE' {
    if (raw === undefined) return fallback;
    if (raw !== 'INCOME' && raw !== 'EXPENSE') {
        throw new AppError(400, "Query parameter 'type' must be INCOME or EXPENSE");
    }
    return raw;
}

export const summary = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const from = readOptionalDate(req.query.from, 'from');
    const to = readOptionalDate(req.query.to, 'to');

    const result = await getSummary(userId, { from, to });
    res.status(200).json(result);
});

export const byCategory = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const type = readOptionalType(req.query.type, 'EXPENSE');
    const from = readOptionalDate(req.query.from, 'from');
    const to = readOptionalDate(req.query.to, 'to');

    const items = await getByCategory(userId, type, { from, to });
    res.status(200).json({ items });
});

export const monthly = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const rawMonths = req.query.months;
    let months = 12;

    if (rawMonths !== undefined) {
        const parsed = Number(rawMonths);
        if (!Number.isInteger(parsed) || parsed < 1 || parsed > 24) {
            throw new AppError(400, "Query parameter 'months' must be an integer between 1 and 24");
        }
        months = parsed;
    }

    const items = await getMonthly(userId, months);
    res.status(200).json({ items });
});