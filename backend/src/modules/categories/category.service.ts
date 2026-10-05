import type { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
    id: number;
    name: string;
    type: CategoryType;
}

interface CategoryRow extends RowDataPacket {
    id: number;
    name: string;
    type: CategoryType;
}

export async function listCategories(type?: CategoryType): Promise<Category[]> {
    const sql = type
        ? 'SELECT id, name, type FROM categories WHERE type = ? ORDER BY name ASC'
        : 'SELECT id, name, type FROM categories ORDER BY type ASC, name ASC';

    const params = type ? [type] : [];

    const [rows] = await pool.query<CategoryRow[]>(sql, params);

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
    }));
}