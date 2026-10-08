import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as txApi from '../../api/transactionApi';
import { extractErrorMessage } from '../../utils/errors';
import type {
    Transaction,
    TransactionListParams,
    TransactionListResult,
    TransactionPayload,
} from '../../types';
import type { RootState } from '../../app/store';

interface TransactionState {
    items: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    listError: string | null;

    // For the create/edit/delete actions
    mutationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    mutationError: string | null;

    // For the "load one for edit" case
    current: Transaction | null;
    currentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: TransactionState = {
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    listStatus: 'idle',
    listError: null,
    mutationStatus: 'idle',
    mutationError: null,
    current: null,
    currentStatus: 'idle',
};

export const fetchTransactions = createAsyncThunk(
    'transactions/fetch',
    async (params: TransactionListParams, { rejectWithValue }) => {
        try {
            return await txApi.list(params);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

export const fetchTransactionById = createAsyncThunk(
    'transactions/fetchOne',
    async (id: number, { rejectWithValue }) => {
        try {
            return await txApi.getOne(id);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

export const createTransaction = createAsyncThunk(
    'transactions/create',
    async (payload: TransactionPayload, { rejectWithValue }) => {
        try {
            return await txApi.create(payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

export const updateTransaction = createAsyncThunk(
    'transactions/update',
    async (args: { id: number; payload: TransactionPayload }, { rejectWithValue }) => {
        try {
            return await txApi.update(args.id, args.payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

export const deleteTransaction = createAsyncThunk(
    'transactions/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await txApi.remove(id);
            return id;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

export const applyFiltersAndFetch = createAsyncThunk(
    'transactions/applyFiltersAndFetch',
    async (_: void, { getState, rejectWithValue }) => {
        const { filters } = getState() as RootState;
        const params: TransactionListParams = {
            page: filters.page,
            limit: filters.limit,
            sort: filters.sort,
        };

        if (filters.search) params.search = filters.search;
        if (filters.type) params.type = filters.type;
        if (filters.categoryId !== '') params.categoryId = filters.categoryId;
        if (filters.from) params.from = filters.from;
        if (filters.to) params.to = filters.to;

        try {
            return await txApi.list(params);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        clearMutationError(state) {
            state.mutationError = null;
        },
        clearCurrent(state) {
            state.current = null;
            state.currentStatus = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch list
            .addCase(fetchTransactions.pending, (state) => {
                state.listStatus = 'loading';
                state.listError = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.listStatus = 'succeeded';
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.listStatus = 'failed';
                state.listError = (action.payload as string) ?? 'Failed to load transactions';
            })
            .addCase(applyFiltersAndFetch.pending, (state) => {
                state.listStatus = 'loading';
                state.listError = null;
            })
            .addCase(applyFiltersAndFetch.fulfilled, (state, action) => {
                state.listStatus = 'succeeded';
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(applyFiltersAndFetch.rejected, (state, action) => {
                state.listStatus = 'failed';
                state.listError = (action.payload as string) ?? 'Failed to load transactions';
            })

            // fetch one
            .addCase(fetchTransactionById.pending, (state) => {
                state.currentStatus = 'loading';
                state.current = null;
            })
            .addCase(fetchTransactionById.fulfilled, (state, action) => {
                state.currentStatus = 'succeeded';
                state.current = action.payload;
            })
            .addCase(fetchTransactionById.rejected, (state) => {
                state.currentStatus = 'failed';
                state.current = null;
            })

            // create
            .addCase(createTransaction.pending, (state) => {
                state.mutationStatus = 'loading';
                state.mutationError = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.mutationStatus = 'succeeded';
                state.items.unshift(action.payload);
                state.total += 1;
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.mutationStatus = 'failed';
                state.mutationError = (action.payload as string) ?? 'Failed to create transaction';
            })

            // update
            .addCase(updateTransaction.pending, (state) => {
                state.mutationStatus = 'loading';
                state.mutationError = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.mutationStatus = 'succeeded';
                const idx = state.items.findIndex((t) => t.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
                state.current = action.payload;
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.mutationStatus = 'failed';
                state.mutationError = (action.payload as string) ?? 'Failed to update transaction';
            })

            // delete
            .addCase(deleteTransaction.pending, (state) => {
                state.mutationStatus = 'loading';
                state.mutationError = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.mutationStatus = 'succeeded';
                state.items = state.items.filter((t) => t.id !== action.payload);
                state.total = Math.max(0, state.total - 1);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.mutationStatus = 'failed';
                state.mutationError = (action.payload as string) ?? 'Failed to delete transaction';
            });
    },
});

export const { clearMutationError, clearCurrent } = transactionSlice.actions;
export default transactionSlice.reducer;
