import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        // Slices are added here in later phases:
        // auth: authReducer,
        // categories: categoryReducer,
        // transactions: transactionReducer,
        // filters: filterReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;