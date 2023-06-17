'use client'
import { Header } from '@/components/Header';
import { api } from '@/services/api';
import { Utils } from '@/utils/utils';
import { CloseOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';
import React, { createContext, useEffect, useState } from 'react';
import styles from './app.module.css';
const _ = new Utils;

type Props = {
    children: React.ReactNode;
};

interface AppContextType {
    page: string;
    setPage: (page: string) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    setLoading: (load: boolean) => void,
    tokenConfirm: string;
    setTokenConfirm: (token: string) => void;
    openNotification: (title: string, message: string, type: 'error' | 'warn' | 'info' | 'success') => void;
    userCreated: User | null;
    setUserCreated: (user: User | null) => void;
    idSheetDetail: number | undefined;
    setIdSheetDetail: (id: number | undefined) => void;
};

const initialAppContext: AppContextType = {
    page: '',
    setPage: () => { },
    user: null,
    setUser: () => { },
    loading: false,
    setLoading: () => { },
    tokenConfirm: '',
    setTokenConfirm: () => { },
    openNotification: () => { },
    userCreated: null,
    setUserCreated: () => { },
    idSheetDetail: undefined,
    setIdSheetDetail: () => { },
};


export const AppContext = createContext<AppContextType>(initialAppContext);

export const AppProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null);
    const [userCreated, setUserCreated] = useState<User | null>(null);
    const [idSheetDetail, setIdSheetDetail] = useState<number | undefined>();
    const [tokenConfirm, setTokenConfirm] = useState('')
    const [page, setPage] = useState('')
    const [, contextHolder] = notification.useNotification();
    const router = useRouter();

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
                const user: User = JSON.parse(userData)
                api.get(`/users/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${user.jwtToken}`
                    }
                })
                    .then(({ data }) => {
                        const jwtToken = user.jwtToken
                        const { id, name, email } = data;
                        const cookieExpiresInSeconds = 43200
                        utils.setCookie('userData', JSON.stringify({ id, name, email, jwtToken }), { expires: cookieExpiresInSeconds })
                        setUser({ id, name, email, jwtToken })
                    })
                    .catch(error => {
                        setUser(null)
                    })
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

    const authenticatedPages: string[] = [
        'sheet',
        'details'
    ]
    useEffect(() => {
        if (authenticatedPages.includes(page) && user === null && !loading) {
            router.push('/user/signin');
        }
    }, [user, loading])

    return (
        <AppContext.Provider value={{
            page,
            setPage,
            user,
            setUser,
            loading,
            setLoading,
            tokenConfirm,
            setTokenConfirm,
            openNotification,
            userCreated,
            setUserCreated,
            idSheetDetail,
            setIdSheetDetail
        }}>
            <Header />
            {contextHolder}
            {children}
        </AppContext.Provider>
    );
};
