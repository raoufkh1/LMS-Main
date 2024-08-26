'use client';

import { configureStore } from '@reduxjs/toolkit';
import triggerReducer from './trigger';
import statusReducer from './status';

export const store = configureStore({
    reducer: {
        trigger: triggerReducer,
        status: statusReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;