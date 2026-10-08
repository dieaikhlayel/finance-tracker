import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as statsApi from '../../api/statsApi';
import { extractErrorMessage } from '../../utils/errors';
import type {
    StatsSummary,
    CategoryBreakdownItem,
    MonthlyItem,
    TransactionType,
} from '../../types';

interface StatsState {
    summary: StatsSummary | null;
    summaryStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    summaryError: string | null;

    byCategory: CategoryBreakdownItem[];
    byCategoryType: TransactionType;
    byCategoryStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    byCategoryError: string | null;

    monthly: MonthlyItem[];
    monthlyStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    monthlyError: string | null;
}

const initialState: StatsState = {
    summary: null,
    summaryStatus: 'idle',
    summaryError: null,

    byCategory: [],
    byCategoryType: 'EXPENSE',
    byCategoryStatus: 'idle',
    byCategoryError: null,

    monthly: [],
    monthlyStatus: 'idle',
    monthlyError: null,
};

export const fetchSummary = createAsyncThunk(
    'stats/fetchSummary',
    async (_: void, { rejectWithValue }) => {
        try {
            return await statsApi.getSummary();
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

export const fetchByCategory = createAsyncThunk(
    'stats/fetchByCategory',
    async (type: TransactionType, { rejectWithValue }) => {
        try {
            return await statsApi.getByCategory({ type });
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

export const fetchMonthly = createAsyncThunk(
    'stats/fetchMonthly',
    async (months: number, { rejectWithValue }) => {
        try {
            return await statsApi.getMonthly(months);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        setByCategoryType(state, action: { payload: TransactionType }) {
            state.byCategoryType = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSummary.pending, (state) => {
                state.summaryStatus = 'loading';
                state.summaryError = null;
            })
            .addCase(fetchSummary.fulfilled, (state, action) => {
                state.summaryStatus = 'succeeded';
                state.summary = action.payload;
            })
            .addCase(fetchSummary.rejected, (state, action) => {
                state.summaryStatus = 'failed';
                state.summaryError = (action.payload as string) ?? 'Failed to load summary';
            })

            .addCase(fetchByCategory.pending, (state) => {
                state.byCategoryStatus = 'loading';
                state.byCategoryError = null;
            })
            .addCase(fetchByCategory.fulfilled, (state, action) => {
                state.byCategoryStatus = 'succeeded';
                state.byCategory = action.payload;
            })
            .addCase(fetchByCategory.rejected, (state, action) => {
                state.byCategoryStatus = 'failed';
                state.byCategoryError = (action.payload as string) ?? 'Failed to load breakdown';
            })

            .addCase(fetchMonthly.pending, (state) => {
                state.monthlyStatus = 'loading';
                state.monthlyError = null;
            })
            .addCase(fetchMonthly.fulfilled, (state, action) => {
                state.monthlyStatus = 'succeeded';
                state.monthly = action.payload;
            })
            .addCase(fetchMonthly.rejected, (state, action) => {
                state.monthlyStatus = 'failed';
                state.monthlyError = (action.payload as string) ?? 'Failed to load monthly data';
            });
    },
});

export const { setByCategoryType } = statsSlice.actions;
export default statsSlice.reducer;