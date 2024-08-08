'use client';

import { store } from '@/lib/store';
import { Provider } from 'react-redux';


export function Providers({ children }: {children:any}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}