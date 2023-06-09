'use client'
import { Header } from '@/components/Header';
import { Utils } from '@/utils/utils';
import { CloseOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import React, { createContext, useEffect, useState } from 'react';
import styles from './app.module.css';

type Props = {
    children: React.ReactNode;
};

interface AppContextType {
    page: string;
    setPage: (page: string) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    tokenConfirm: string;
    setTokenConfirm: (token: string) => void;
    openNotification: (title: string, message: string, type: 'error' | 'warn' | 'info' | 'success') => void;
};

const initialAppContext: AppContextType = {
    page: '',
    setPage: () => { },
    user: null,
    setUser: () => { },
    loading: false,
    tokenConfirm: '',
    setTokenConfirm: () => { },
    openNotification: () => { }
};


export const AppContext = createContext<AppContextType>(initialAppContext);

export const AppProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null);
    const [tokenConfirm, setTokenConfirm] = useState('')
    const [page, setPage] = useState('')
    const [api, contextHolder] = notification.useNotification();

    const utils = new Utils;

    const openNotification = (title: string, message: string, type: 'error' | 'warn' | 'info' | 'success') => {
        const options = {
            closeIcon: <CloseOutlined className={styles.iconClose} />,
            message: <span className={styles.title}>{title}</span>,
            description: <p>{message}</p>,
            className: styles.notification,
            style: {
                backgroundColor: '#2e3034',
                padding: '1rem 1.2rem',
                borderRadius: 'var(--border-radius)',
                transition: 'background 200ms, border 200ms',
                background: 'rgba(78, 80, 88, 0.91)',
                border: '1px solid rgba(var(--card-border-rgb), 0.15)',
                color: 'white',
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
            }

        }

        type === 'error'
            ? notification.error(options)
            : type === 'success'
                ? notification.success(options)
                : type === 'info'
                    ? notification.info(options)
                    : notification.warning(options)

    };

    useEffect(() => {
        setLoading(true)
        try {
            const userData = utils.getCookie('userData');
            if (userData) {
                setUser(JSON.parse(userData))
            } else {
                setUser(null)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        }

    }, [])

    return (
        <AppContext.Provider value={{
            page,
            setPage,
            user,
            setUser,
            loading,
            tokenConfirm,
            setTokenConfirm,
            openNotification
        }}>
            <Header />
            {contextHolder}
            {children}
        </AppContext.Provider>
    );
};
