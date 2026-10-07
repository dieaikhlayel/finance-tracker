import { axiosClient } from './axiosClient';
import type {
    StatsSummary,
    CategoryBreakdownItem,
    MonthlyItem,
    TransactionType,
} from '../types';

export interface SummaryParams {
    from?: string;
    to?: string;
}

export interface ByCategoryParams {
    type?: TransactionType;
    from?: string;
    to?: string;
}

export async function getSummary(params: SummaryParams = {}): Promise<StatsSummary> {
    const { data } = await axiosClient.get<StatsSummary>('/stats/summary', { params });
    return data;
}

export async function getByCategory(
    params: ByCategoryParams = {},
): Promise<CategoryBreakdownItem[]> {
    const { data } = await axiosClient.get<{ items: CategoryBreakdownItem[] }>(
        '/stats/by-category',
        { params },
    );
    return data.items;
}

export async function getMonthly(months = 12): Promise<MonthlyItem[]> {
    const { data } = await axiosClient.get<{ items: MonthlyItem[] }>('/stats/monthly', {
        params: { months },
    });
    return data.items;
}