import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as authApi from '../../api/authApi';
import { extractErrorMessage } from '../../utils/errors';
import type { User, RegisterPayload, LoginPayload } from '../../types';

const TOKEN_KEY = 'auth_token';

interface AuthState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    status: 'idle',
    error: null,
};

export const register = createAsyncThunk(
    'auth/register',
    async (payload: RegisterPayload, { rejectWithValue }) => {
        try {
            return await authApi.register(payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

export const login = createAsyncThunk(
    'auth/login',
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            return await authApi.login(payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

export const loadMe = createAsyncThunk(
    'auth/loadMe',
    async (_: void, { rejectWithValue }) => {
        try {
            return await authApi.me();
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem(TOKEN_KEY);
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // register
            .addCase(register.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem(TOKEN_KEY, action.payload.token);
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) ?? 'Registration failed';
            })
            // login
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem(TOKEN_KEY, action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) ?? 'Login failed';
            })
            // loadMe
            .addCase(loadMe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadMe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loadMe.rejected, (state, action) => {
                // Token was invalid or expired — clean up
                state.status = 'failed';
                state.user = null;
                state.token = null;
                state.error = (action.payload as string) ?? 'Session expired';
                localStorage.removeItem(TOKEN_KEY);
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;