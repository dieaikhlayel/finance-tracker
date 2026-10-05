import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getUserId } from '../../utils/getUserId';
import { AppError } from '../../utils/AppError';
import {
    listTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from './transaction.service';

function parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, 'Invalid transaction id');
    }
    return id;
}

export const list = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const result = await listTransactions(userId, req.query as any);
    res.status(200).json(result);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const id = parseId(req.params.id);
    const transaction = await getTransactionById(userId, id);
    res.status(200).json({ transaction });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const transaction = await createTransaction(userId, req.body);
    res.status(201).json({ transaction });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const id = parseId(req.params.id);
    const transaction = await updateTransaction(userId, id, req.body);
    res.status(200).json({ transaction });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const id = parseId(req.params.id);
    await deleteTransaction(userId, id);
    res.status(204).send();
});