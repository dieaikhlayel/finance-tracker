// import axios, { AxiosError } from 'axios';
// import type { ApiErrorBody } from '../types';

// const baseURL = import.meta.env.VITE_API_BASE_URL;

// if (!baseURL) {
//     throw new Error('VITE_API_BASE_URL is not defined. Check your .env file.');
// }

// export const axiosClient = axios.create({
//     baseURL,
//     timeout: 15000,
//     headers: { 'Content-Type': 'application/json' },
// });

// // Request interceptor: attach the token if we have one.
// // Phase 9 will wire this to Redux; for now it reads from localStorage directly.
// axiosClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem('auth_token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// // Response interceptor: normalize errors into a friendly shape.
// // Phase 9 will add the 401 -> logout redirect here.
// axiosClient.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError<ApiErrorBody>) => {
//         return Promise.reject(error);
//     },
// );

// export function getApiErrorMessage(error: unknown): string {
//     if (axios.isAxiosError(error)) {
//         const body = error.response?.data as ApiErrorBody | undefined;
//         if (body?.error?.message) return body.error.message;
//         if (error.code === 'ECONNABORTED') return 'Request timed out';
//         if (!error.response) return 'Cannot reach the server';
//         return `Request failed (${error.response.status})`;
//     }
//     if (error instanceof Error) return error.message;
//     return 'Unexpected error';
// }

import axios, { AxiosError } from 'axios';
import type { ApiErrorBody } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
    throw new Error('VITE_API_BASE_URL is not defined. Check your .env file.');
}

export const axiosClient = axios.create({
    baseURL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Set by the store at bootstrap so the interceptor doesn't import the store
// (which would create a circular dependency: store -> slices -> api -> store).
let tokenGetter: () => string | null = () => null;
let onUnauthorized: (() => void) | null = null;

export function setTokenGetter(fn: () => string | null) {
    tokenGetter = fn;
}

export function setUnauthorizedHandler(fn: () => void) {
    onUnauthorized = fn;
}

axiosClient.interceptors.request.use((config) => {
    const token = tokenGetter();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorBody>) => {
        if (error.response?.status === 401 && onUnauthorized) {
            onUnauthorized();
        }
        return Promise.reject(error);
    },
);

export function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const body = error.response?.data as ApiErrorBody | undefined;
        if (body?.error?.message) return body.error.message;
        if (error.code === 'ECONNABORTED') return 'Request timed out';
        if (!error.response) return 'Cannot reach the server';
        return `Request failed (${error.response.status})`;
    }
    if (error instanceof Error) return error.message;
    return 'Unexpected error';
}