import { axiosClient } from './axiosClient';
import type {
    Transaction,
    TransactionListParams,
    TransactionListResult,
    TransactionPayload,
} from '../types';

export async function list(params: TransactionListParams): Promise<TransactionListResult> {
    // Strip undefined values so Axios doesn't send ?search=&type= for empty filters
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
    );

    const { data } = await axiosClient.get<TransactionListResult>('/transactions', {
        params: cleanParams,
    });
    return data;
}

export async function getOne(id: number): Promise<Transaction> {
    const { data } = await axiosClient.get<{ transaction: Transaction }>(`/transactions/${id}`);
    return data.transaction;
}

export async function create(payload: TransactionPayload): Promise<Transaction> {
    const { data } = await axiosClient.post<{ transaction: Transaction }>('/transactions', payload);
    return data.transaction;
}

export async function update(id: number, payload: TransactionPayload): Promise<Transaction> {
    const { data } = await axiosClient.put<{ transaction: Transaction }>(
        `/transactions/${id}`,
        payload,
    );
    return data.transaction;
}

export async function remove(id: number): Promise<void> {
    await axiosClient.delete(`/transactions/${id}`);
}