import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionType } from '../../types';

export type SortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export interface FilterState {
    search: string;
    type: TransactionType | '';
    categoryId: number | '';
    from: string;
    to: string;
    sort: SortOption;
    page: number;
    limit: number;
}

const initialState: FilterState = {
    search: '',
    type: '',
    categoryId: '',
    from: '',
    to: '',
    sort: 'date_desc',
    page: 1,
    limit: 20,
};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
            state.page = 1;
        },
        setType(state, action: PayloadAction<TransactionType | ''>) {
            state.type = action.payload;
            state.page = 1;
        },
        setCategoryId(state, action: PayloadAction<number | ''>) {
            state.categoryId = action.payload;
            state.page = 1;
        },
        setFrom(state, action: PayloadAction<string>) {
            state.from = action.payload;
            state.page = 1;
        },
        setTo(state, action: PayloadAction<string>) {
            state.to = action.payload;
            state.page = 1;
        },
        setSort(state, action: PayloadAction<SortOption>) {
            state.sort = action.payload;
            state.page = 1;
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        resetFilters() {
            return initialState;
        },
    },
});

export const {
    setSearch,
    setType,
    setCategoryId,
    setFrom,
    setTo,
    setSort,
    setPage,
    resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;