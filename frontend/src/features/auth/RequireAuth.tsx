import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadMe } from './authSlice';

export function RequireAuth() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { token, user, status } = useAppSelector((s) => s.auth);

    // If we have a token but no user yet, fetch the user once.
    useEffect(() => {
        if (token && !user && status === 'idle') {
            dispatch(loadMe());
        }
    }, [token, user, status, dispatch]);

    // No token at all -> go to login.
    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Token exists but user hasn't loaded yet (page refresh).
    if (!user) {
        return (
            <div className="page-loading">
                <p>Loading…</p>
            </div>
        );
    }

    return <Outlet />;
}