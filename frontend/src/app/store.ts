// import { configureStore } from '@reduxjs/toolkit';

// export const store = configureStore({
//     reducer: {
//         // Slices are added here in later phases:
//         // auth: authReducer,
//         // categories: categoryReducer,
//         // transactions: transactionReducer,
//         // filters: filterReducer,
//     },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from '../features/auth/authSlice';
import { setTokenGetter, setUnauthorizedHandler } from '../api/axiosClient';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

setTokenGetter(() => store.getState().auth.token);
setUnauthorizedHandler(() => store.dispatch(logout()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;