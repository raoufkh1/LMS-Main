'use client';

import { configureStore } from '@reduxjs/toolkit';
import triggerReducer from './trigger';

export const store = configureStore({
    reducer: {
        trigger: triggerReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;