import { z } from 'zod';

export const transactionTypeEnum = z.enum(['INCOME', 'EXPENSE']);

export const createTransactionSchema = z.object({
    type: transactionTypeEnum,
    amount: z.coerce
        .number()
        .positive('Amount must be greater than 0')
        .max(9999999999.99, 'Amount is too large')
        .refine((v) => Number.isFinite(v), 'Amount must be a finite number'),
    categoryId: z.coerce.number().int().positive('Category is required'),
    description: z.string().trim().max(255, 'Description is too long').optional(),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const updateTransactionSchema = createTransactionSchema;

export const listTransactionsQuerySchema = z.object({
    search: z.string().trim().min(1).max(255).optional(),
    type: transactionTypeEnum.optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid from date').optional(),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid to date').optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z
        .enum(['date_desc', 'date_asc', 'amount_desc', 'amount_asc'])
        .default('date_desc'),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;