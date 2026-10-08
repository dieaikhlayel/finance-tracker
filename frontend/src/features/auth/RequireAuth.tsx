// import { useEffect } from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { loadMe } from './authSlice';

// export function RequireAuth() {
//     const dispatch = useAppDispatch();
//     const location = useLocation();
//     const { token, user, status } = useAppSelector((s) => s.auth);

//     // If we have a token but no user yet, fetch the user once.
//     useEffect(() => {
//         if (token && !user && status === 'idle') {
//             dispatch(loadMe());
//         }
//     }, [token, user, status, dispatch]);

//     // No token at all -> go to login.
//     if (!token) {
//         return <Navigate to="/login" replace state={{ from: location }} />;
//     }

//     // Token exists but user hasn't loaded yet (page refresh).
//     if (!user) {
//         return (
//             <div className="page-loading">
//                 <p>Loading…</p>
//             </div>
//         );
//     }

//     return <Outlet />;
// }

import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadMe } from './authSlice';
import { fetchCategories } from '../categories/categorySlice';

export function RequireAuth() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { token, user, status } = useAppSelector((s) => s.auth);
    const categoriesStatus = useAppSelector((s) => s.categories.status);

    useEffect(() => {
        if (token && !user && status === 'idle') {
            dispatch(loadMe());
        }
    }, [token, user, status, dispatch]);

    useEffect(() => {
        if (user && categoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [user, categoriesStatus, dispatch]);

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!user) {
        return (
            <div className="page-loading">
                <p>Loading…</p>
            </div>
        );
    }

    return <Outlet />;
}