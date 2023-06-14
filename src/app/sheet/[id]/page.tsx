'use client'
import { Button } from '@/components/Button';
import SuccessError from '@/components/SuccessError';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.css';

type Params = {
    params: {
        id: string
    }
}

export default function SheetView({ params: { id } }: Params) {
    const [load, setLoad] = useState(true)
    const [dataSheet, setDataSheet] = useState<SheetDetail | null>(null)
    const { user, loading, setPage } = useContext(AppContext);
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

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
        <main className={styles.main}>
            {
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
                                    <Link href={'/sheet'} >
                                        <Button title={'VOLTAR'} type={undefined} />
                                    </Link>
                                </div>
                            </>
                        )
            }
        </main >
    );
}
