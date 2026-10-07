import { axiosClient } from './axiosClient';
import type { User, RegisterPayload, LoginPayload } from '../types';

interface AuthResponse {
    user: User;
    token: string;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await axiosClient.post<AuthResponse>('/auth/register', payload);
    return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await axiosClient.post<AuthResponse>('/auth/login', payload);
    return data;
}

export async function me(): Promise<User> {
    const { data } = await axiosClient.get<{ user: User }>('/auth/me');
    return data.user;
}