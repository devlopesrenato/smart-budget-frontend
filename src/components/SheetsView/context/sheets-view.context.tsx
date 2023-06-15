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
    filterData: (descriptionSearch: string) => void;
    descriptionSearch: string
};

const initialSheetContext: SheetContextType = {
    data: [],
    refreshData: () => { },
    loading: false,
    descriptionAlreadyExists: () => false,
    filterData: () => { },
    descriptionSearch: ''
};

export const SheetContext = createContext<SheetContextType>(initialSheetContext);

export const SheetsProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<Sheet[]>([]);
    const [dataFull, setDataFull] = useState<Sheet[]>([])
    const [descriptionSearch, setDescriptionSearch] = useState('')

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
                setDataFull(responseData);
                if (descriptionSearch.length) {
                    filterData(descriptionSearch)
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    function descriptionAlreadyExists(typedDescription: string, sheetId: number) {
        const sheet = data.find(({ description, id }) =>
            description.trim().toLowerCase() === typedDescription.trim().toLowerCase() && id !== sheetId
        )
        if (sheet) {
            return true
        } else {
            return false
        }
    }

    function filterData(descSearch: string) {
        setDescriptionSearch(descSearch)
        if (descSearch.length) {

            const filteredData = dataFull.filter(({ description }) =>
                (description.trim().toLowerCase())
                    .includes(
                        descSearch.trim().toLowerCase()
                    )
            )
            setData(filteredData)
        } else {
            setData(dataFull)
        }
    }

    useEffect(() => {
        setLoading(true)
        refreshData()
    }, [])

    return (
        <SheetContext.Provider
            value={{
                data,
                refreshData,
                loading,
                descriptionAlreadyExists,
                filterData,
                descriptionSearch
            }}
        >
            {children}
        </SheetContext.Provider>
    );
};
