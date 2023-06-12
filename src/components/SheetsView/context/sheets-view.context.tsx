'use client'
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

interface SheetContextType {
    data: Sheet[];
    refreshData: () => void;
    loading: boolean;
};

const initialSheetContext: SheetContextType = {
    data: [],
    refreshData: () => { },
    loading: false,
};

export const SheetContext = createContext<SheetContextType>(initialSheetContext);

export const SheetsProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<Sheet[]>([]);

    const { user } = useContext(AppContext);

    async function refreshData() {
        try {
            // setLoading(true);            
            // setData([]);
            const response = await api.get('sheets', {
                headers: {
                    Authorization: `Bearer ${user?.jwtToken}`
                }
            });
            const responseData = response.data;
            if (responseData && typeof responseData === 'object') {
                console.log(responseData)
                setData(responseData);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshData()
    }, [])

    return (
        <SheetContext.Provider value={{ data, refreshData, loading }}>
            {children}
        </SheetContext.Provider>
    );
};
