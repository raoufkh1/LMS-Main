'use client';

import { createSlice } from '@reduxjs/toolkit';

export interface TriggerState {
    value: boolean
}

const initialState: TriggerState = {
    value: false
}

export const triggerSlice = createSlice({
    name: 'trigger',
    initialState,
    reducers: {
        onOpen: (state) => { state.value = true },
        onClose: (state) => { state.value = false},
        onToggle: (state) => { state.value = !state.value},
        
    }
})

export const { onOpen, onClose, onToggle } = triggerSlice.actions;

export default triggerSlice.reducer ;