'use client'
import { Logo } from '@/components/Logo';
import SuccessError from '@/components/SuccessError';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { Utils } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.css';

const _ = new Utils;

export default function AccountConfirmError() {
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<'error' | 'success' | 'info'>('error')
    const [title, setTitle] = useState('Erro ao confirmar email!')
    const [subTitle, setSubTitle] = useState('Erro interno!')

    const { tokenConfirm, setTokenConfirm, setPage } = useContext(AppContext);
    const router = useRouter();

    async function confirmationApi() {
        setLoading(true)
        try {
            if (tokenConfirm.length) {

                await api.post('/users/signup/confirm-email', null, {
                    headers: {
                        Authorization: `Bearer ${tokenConfirm}`
                    },
                })
                    .then(response => {
                        setStatus('success')
                        setTitle('Sucesso!')
                        setSubTitle('Email confirmado com sucesso.')
                    })
                    .catch(err => {
                        if (err.response.data.message === 'email already confirmed') {
                            setStatus('info')
                            setTitle('Atenção!')
                            setSubTitle('Este email já foi confirmado.')
                        } else {
                            setStatus('error')
                            setTitle('Erro!')
                            setSubTitle('Erro ao confirmar email.')
                        }
                    })
                    .finally(() => {
                        setLoading(false)
                    })

            } else {
                setStatus('error')
                setTitle('Erro!')
                setSubTitle('Erro ao confirmar email.')
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    function getToken() {
        try {
            const url = new URL(window.location.href);
            const token = url.searchParams.get('token');
            if (token?.length) {
                setTokenConfirm(token)
            } else {
                confirmationApi()
            }
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        setPage('confirm')
        getToken()
    }, [])

    useEffect(() => {
        router.push('/account/confirm');
        confirmationApi()
    }, [tokenConfirm])

    return (
        <main className={styles.main}>
            {loading
                ? <LoadingOutlined style={{ fontSize: 24 }} spin />
                : (
                    <>
                        <Logo />
                        <SuccessError type={status} title={title} subTitle={subTitle} />
                    </>
                )
            }
        </main >
    );
}
