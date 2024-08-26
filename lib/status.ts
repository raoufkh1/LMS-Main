'use client';

import { createSlice } from '@reduxjs/toolkit';

export interface statusState {
    value: boolean
}

const initialState: statusState = {
    value: false
}

export const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        setOpen: (state) => { state.value = true },
        setClose: (state) => { state.value = false},
        setToggle: (state) => { state.value = !state.value},
        
    }
})

export const { setOpen, setClose, setToggle } = statusSlice.actions;

export default statusSlice.reducer ;