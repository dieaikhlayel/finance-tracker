import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import type {
    CreateTransactionInput,
    UpdateTransactionInput,
    ListTransactionsQuery,
} from './transaction.schemas';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
    id: number;
    type: TransactionType;
    amount: string;
    categoryId: number;
    categoryName: string;
    description: string | null;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionListResult {
    items: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface TransactionRow extends RowDataPacket {
    id: number;
    user_id: number;
    category_id: number;
    category_name: string;
    type: TransactionType;
    amount: string;
    description: string | null;
    date: string;
    created_at: Date;
    updated_at: Date;
}

const SORT_MAP: Record<ListTransactionsQuery['sort'], string> = {
    date_desc: 't.date DESC, t.id DESC',
    date_asc: 't.date ASC, t.id ASC',
    amount_desc: 't.amount DESC, t.id DESC',
    amount_asc: 't.amount ASC, t.id ASC',
};

export async function listTransactions(
    userId: number,
    query: ListTransactionsQuery,
): Promise<TransactionListResult> {
    const { search, type, categoryId, from, to, page, limit, sort } = query;

    const searchPattern = search === undefined ? null : `%${search}%`;
    const filters = [
        userId,
        searchPattern,
        searchPattern,
        type ?? null,
        type ?? null,
        categoryId ?? null,
        categoryId ?? null,
        from ?? null,
        from ?? null,
        to ?? null,
        to ?? null,
    ];

    const [countRows] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total
     FROM transactions t
     WHERE t.user_id = ?
       AND (? IS NULL OR t.description LIKE ?)
       AND (? IS NULL OR t.type = ?)
       AND (? IS NULL OR t.category_id = ?)
       AND (? IS NULL OR t.date >= ?)
       AND (? IS NULL OR t.date <= ?)`,
        filters,
    );
    const total = Number(countRows[0]?.total ?? 0);

    const offset = (page - 1) * limit;
    const orderBy = SORT_MAP[sort];

    const [rows] = await pool.query<TransactionRow[]>(
        `SELECT
       t.id, t.user_id, t.category_id, c.name AS category_name,
       t.type, t.amount, t.description, t.date, t.created_at, t.updated_at
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = ?
       AND (? IS NULL OR t.description LIKE ?)
       AND (? IS NULL OR t.type = ?)
       AND (? IS NULL OR t.category_id = ?)
       AND (? IS NULL OR t.date >= ?)
       AND (? IS NULL OR t.date <= ?)
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
        [...filters, limit, offset],
    );

    const items = rows.map(toTransaction);
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
}

export async function getTransactionById(userId: number, id: number): Promise<Transaction> {
    const [rows] = await pool.query<TransactionRow[]>(
        `SELECT
       t.id, t.user_id, t.category_id, c.name AS category_name,
       t.type, t.amount, t.description, t.date, t.created_at, t.updated_at
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.id = ? AND t.user_id = ?
     LIMIT 1`,
        [id, userId],
    );

    const row = rows[0];
    if (!row) {
        throw new AppError(404, 'Transaction not found');
    }
    return toTransaction(row);
}

export async function createTransaction(
    userId: number,
    input: CreateTransactionInput,
): Promise<Transaction> {
    const { type, amount, categoryId, description, date } = input;

    await assertCategoryMatchesType(categoryId, type);

    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO transactions (user_id, category_id, type, amount, description, date)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, categoryId, type, amount, description ?? null, date],
    );

    return getTransactionById(userId, result.insertId);
}

export async function updateTransaction(
    userId: number,
    id: number,
    input: UpdateTransactionInput,
): Promise<Transaction> {
    const { type, amount, categoryId, description, date } = input;

    await assertCategoryMatchesType(categoryId, type);

    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE transactions
     SET category_id = ?, type = ?, amount = ?, description = ?, date = ?
     WHERE id = ? AND user_id = ?`,
        [categoryId, type, amount, description ?? null, date, id, userId],
    );

    if (result.affectedRows === 0) {
        throw new AppError(404, 'Transaction not found');
    }

    return getTransactionById(userId, id);
}

export async function deleteTransaction(userId: number, id: number): Promise<void> {
    const [result] = await pool.query<ResultSetHeader>(
        'DELETE FROM transactions WHERE id = ? AND user_id = ?',
        [id, userId],
    );

    if (result.affectedRows === 0) {
        throw new AppError(404, 'Transaction not found');
    }
}

async function assertCategoryMatchesType(
    categoryId: number,
    type: TransactionType,
): Promise<void> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id, type FROM categories WHERE id = ? LIMIT 1',
        [categoryId],
    );

    const row = rows[0];
    if (!row) {
        throw new AppError(400, 'Category does not exist');
    }
    if (row.type !== type) {
        throw new AppError(400, `Category is for ${row.type}, not ${type}`);
    }
}

function toTransaction(row: TransactionRow): Transaction {
    return {
        id: row.id,
        type: row.type,
        amount: row.amount,
        categoryId: row.category_id,
        categoryName: row.category_name,
        description: row.description,
        date: row.date,
        createdAt: row.created_at.toISOString(),
        updatedAt: row.updated_at.toISOString(),
    };
}
