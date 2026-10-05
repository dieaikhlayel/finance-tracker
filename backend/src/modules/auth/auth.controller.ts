import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getUserId } from '../../utils/getUserId';
import { registerUser, loginUser, getUserById } from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await registerUser(req.body);
    res.status(201).json({ user, token });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({ user, token });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const user = await getUserById(userId);
    res.status(200).json({ user });
});