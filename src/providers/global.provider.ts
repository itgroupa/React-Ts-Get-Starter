import { createContext } from 'react';

export interface GlobalProviderProps {
    setLoading: (val: boolean) => void;
}
export const GlobalProvider = createContext(null);
