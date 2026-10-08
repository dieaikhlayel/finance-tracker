import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as categoryApi from '../../api/categoryApi';
import { extractErrorMessage } from '../../utils/errors';
import type { Category } from '../../types';

interface CategoryState {
    items: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CategoryState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetch',
    async (_: void, { rejectWithValue }) => {
        try {
            return await categoryApi.listCategories();
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) ?? 'Failed to load categories';
            });
    },
});

export default categorySlice.reducer;