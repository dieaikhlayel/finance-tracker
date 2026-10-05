import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { hashPassword, verifyPassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import type { RegisterInput, LoginInput } from './auth.schemas';

export interface PublicUser {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
}

export async function registerUser(
    input: RegisterInput,
): Promise<{ user: PublicUser; token: string }> {
    const { name, email, password } = input;

    const [existing] = await pool.query<UserRow[]>(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email],
    );
    if (existing.length > 0) {
        throw new AppError(409, 'Email is already registered');
    }

    const passwordHash = await hashPassword(password);

    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, passwordHash],
    );

    const userId = result.insertId;

    const [rows] = await pool.query<UserRow[]>(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [userId],
    );

    const row = rows[0];
    if (!row) {
        throw new AppError(500, 'Failed to load created user');
    }

    return {
        user: toPublicUser(row),
        token: signToken(row.id),
    };
}

export async function loginUser(
    input: LoginInput,
): Promise<{ user: PublicUser; token: string }> {
    const { email, password } = input;

    const [rows] = await pool.query<UserRow[]>(
        'SELECT id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1',
        [email],
    );

    const row = rows[0];

    // Same error for unknown email and wrong password (no user enumeration)
    if (!row) {
        throw new AppError(401, 'Invalid email or password');
    }

    const ok = await verifyPassword(password, row.password_hash);
    if (!ok) {
        throw new AppError(401, 'Invalid email or password');
    }

    return {
        user: toPublicUser(row),
        token: signToken(row.id),
    };
}

export async function getUserById(userId: number): Promise<PublicUser> {
    const [rows] = await pool.query<UserRow[]>(
        'SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1',
        [userId],
    );

    const row = rows[0];
    if (!row) {
        throw new AppError(404, 'User not found');
    }

    return toPublicUser(row);
}

function toPublicUser(row: UserRow): PublicUser {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        createdAt: row.created_at.toISOString(),
    };
}