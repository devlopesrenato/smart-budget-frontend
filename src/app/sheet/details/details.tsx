'use client'
import { Button } from '@/components/Button';
import SuccessError from '@/components/SuccessError';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import styles from './id.module.css';

type Params = {
    params: {
        id: number
    }
}

export default function Details({ params: { id } }: Params) {
    const [load, setLoad] = useState(true)
    const [dataSheet, setDataSheet] = useState<SheetDetail | null>(null)
    const { user, loading, setPage, setIdSheetDetail } = useContext(AppContext);
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const router = useRouter();

    async function getDataSheet() {
        try {
            await api.request({
                method: 'GET',
                url: `/sheets/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.jwtToken}`
                },
            })
                .then(({ data }) => {
                    const sheet: SheetDetail = data;
                    setDataSheet(sheet)
                })
                .catch((err) => {
                    if (err.response.data.error == 'Not Found') {
                        setErrorMessage('Folha não encontrada.')
                    }
                    setError(true)
                    console.log(err)
                })
        } catch (error: any) {
            setError(true)
            console.log(error)
        } finally {
            setLoad(false)
        }
    }

    useEffect(() => {
        if (user) {
            getDataSheet()
        }
    }, [user, loading])

    setPage('details')

    return (
        error
            ? (
                <SuccessError
                    type={'error'}
                    title={'Solicitação Inválida!'}
                    subTitle={errorMessage}
                    buttonLink='/sheet'
                    buttonTitle='VOLTAR'
                />
            )
            : user === null || loading || load
                ? <LoadingOutlined style={{ marginTop: '3rem', fontSize: 24 }} spin />
                : (
                    <>
                        <h2>{dataSheet?.description}</h2>

                        <p>Balanço: {dataSheet?.balance}</p>
                        <p>Contas a pagar: {dataSheet?.totalAccountsPayable}</p>
                        <p>Contas a receber: {dataSheet?.totalAccountsReceivable}</p>

                        <div className={styles.center}>
                            <Button
                                title={'VOLTAR'}
                                type={undefined}
                                onClick={() => {
                                    setIdSheetDetail(undefined)
                                    setPage('sheet')
                                    router.replace(`/sheet`)
                                }}
                            />
                        </div>
                    </>
                )
    );
}
