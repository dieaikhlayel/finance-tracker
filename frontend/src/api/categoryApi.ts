import { axiosClient } from './axiosClient';
import type { Category, TransactionType } from '../types';

export async function listCategories(type?: TransactionType): Promise<Category[]> {
    const { data } = await axiosClient.get<{ categories: Category[] }>('/categories', {
        params: type ? { type } : undefined,
    });
    return data.categories;
}