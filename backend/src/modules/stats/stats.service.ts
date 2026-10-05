import type { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface StatsSummary {
    totalIncome: string;
    totalExpense: string;
    balance: string;
    transactionCount: number;
}

export interface CategoryBreakdownItem {
    categoryId: number;
    categoryName: string;
    total: string;
    count: number;
}

export interface MonthlyItem {
    month: string;   // 'YYYY-MM'
    income: string;
    expense: string;
}

interface DateRange {
    from?: string;
    to?: string;
}

function buildDateClause(range: DateRange, column = 't.date'): { sql: string; params: string[] } {
    const clauses: string[] = [];
    const params: string[] = [];

    if (range.from) {
        clauses.push(`${column} >= ?`);
        params.push(range.from);
    }
    if (range.to) {
        clauses.push(`${column} <= ?`);
        params.push(range.to);
    }

    return {
        sql: clauses.length ? `AND ${clauses.join(' AND ')}` : '',
        params,
    };
}

export async function getSummary(userId: number, range: DateRange): Promise<StatsSummary> {
    const dateClause = buildDateClause(range);

    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT
       COALESCE(SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END), 0) AS total_income,
       COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expense,
       COUNT(*) AS transaction_count
     FROM transactions t
     WHERE t.user_id = ? ${dateClause.sql}`,
        [userId, ...dateClause.params],
    );

    const row = rows[0] as
        | { total_income: string; total_expense: string; transaction_count: number }
        | undefined;

    const totalIncome = row?.total_income ?? '0.00';
    const totalExpense = row?.total_expense ?? '0.00';
    const transactionCount = Number(row?.transaction_count ?? 0);

    const balance = (Number(totalIncome) - Number(totalExpense)).toFixed(2);

    return {
        totalIncome,
        totalExpense,
        balance,
        transactionCount,
    };
}

export async function getByCategory(
    userId: number,
    type: TransactionType,
    range: DateRange,
): Promise<CategoryBreakdownItem[]> {
    const dateClause = buildDateClause(range);

    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT
       c.id   AS category_id,
       c.name AS category_name,
       SUM(t.amount) AS total,
       COUNT(*)      AS count
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = ? AND t.type = ? ${dateClause.sql}
     GROUP BY c.id, c.name
     ORDER BY total DESC`,
        [userId, type, ...dateClause.params],
    );

    return rows.map((row) => ({
        categoryId: row.category_id as number,
        categoryName: row.category_name as string,
        total: String(row.total),
        count: Number(row.count),
    }));
}

export async function getMonthly(
    userId: number,
    months: number,
): Promise<MonthlyItem[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT
       DATE_FORMAT(t.date, '%Y-%m') AS month,
       COALESCE(SUM(CASE WHEN t.type = 'INCOME'  THEN t.amount ELSE 0 END), 0) AS income,
       COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) AS expense
     FROM transactions t
     WHERE t.user_id = ?
       AND t.date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
     GROUP BY DATE_FORMAT(t.date, '%Y-%m')
     ORDER BY month ASC`,
        [userId, months],
    );

    return rows.map((row) => ({
        month: row.month as string,
        income: String(row.income),
        expense: String(row.expense),
    }));
}