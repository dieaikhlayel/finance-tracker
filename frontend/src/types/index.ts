export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
    id: number;
    name: string;
    type: TransactionType;
}

export interface Transaction {
    id: number;
    type: TransactionType;
    amount: string;          // DECIMAL comes over the wire as a string
    categoryId: number;
    categoryName: string;
    description: string | null;
    date: string;            // 'YYYY-MM-DD'
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
    month: string;           // 'YYYY-MM'
    income: string;
    expense: string;
}

export interface ApiErrorBody {
    error: {
        message: string;
        details?: Array<{ path: string; message: string }>;
    };
}

// Request payloads
export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface TransactionPayload {
    type: TransactionType;
    amount: number;
    categoryId: number;
    description?: string;
    date: string;
}

export interface TransactionListParams {
    search?: string;
    type?: TransactionType;
    categoryId?: number;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
    sort?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
}