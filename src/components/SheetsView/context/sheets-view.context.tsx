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
    descriptionAlreadyExists: (description: string, sheetId: number) => boolean;
};

const initialSheetContext: SheetContextType = {
    data: [],
    refreshData: () => { },
    loading: false,
    descriptionAlreadyExists: () => false,
};

export const SheetContext = createContext<SheetContextType>(initialSheetContext);

export const SheetsProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<Sheet[]>([]);

    const { user } = useContext(AppContext);

    async function refreshData() {
        try {            
            const response = await api.get('sheets', {
                headers: {
                    Authorization: `Bearer ${user?.jwtToken}`
                }
            });
            const responseData = response.data;
            if (responseData && typeof responseData === 'object') {
                setData(responseData);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    function descriptionAlreadyExists(typedDescription: string, sheetId: number) {
        const sheet = data.find(({ description, id }) =>
            description.trim() === typedDescription.trim() && id !== sheetId
        )
        if (sheet) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        setLoading(true)
        refreshData()
    }, [])

    return (
        <SheetContext.Provider value={{ data, refreshData, loading, descriptionAlreadyExists }}>
            {children}
        </SheetContext.Provider>
    );
};
