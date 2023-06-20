'use client'
import { Button } from '@/components/Button';
import SuccessError from '@/components/SuccessError';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { Utils } from '@/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { AccountListItem } from './components/AccountsList';
import { InputNew } from './components/InputNew';
import styles from './detail.module.css';

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
    const utils = new Utils();

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

    function descriptionAlreadyExists(typedDescription: string, type: 'rec' | 'pay') {
        const data = type === 'rec'
            ? dataSheet?.accountsReceivable
            : dataSheet?.accountsPayable;

        const sheet = data?.find(({ description, id }) =>
            description.trim().toLowerCase() === typedDescription.trim().toLowerCase()
        )
        if (sheet) {
            return true
        } else {
            return false
        }
    }

    return (
        error
            ? (
                <SuccessError
                    type={'error'}
                    title={'Solicitação Inválida!'}
                    subTitle={errorMessage}
                    buttonLink='/sheet'
                    buttonTitle='VOLTAR'
                    buttonOnClick={() => {
                        setIdSheetDetail(undefined)
                        setPage('sheet')
                        router.replace(`/sheet`)
                    }}
                />
            )
            : user === null || loading || load
                ? <LoadingOutlined style={{ marginTop: '3rem', fontSize: 24 }} spin />
                : (
                    <>
                        <h2>{dataSheet?.description}</h2>

                        <p className={styles.balance}>Balanço: {utils.valueToCurrency(dataSheet?.balance)}</p>

                        <div className={styles.center}>
                            <div className={styles.section}>
                                <div className={styles.titleSection}>
                                    <h4>Entradas</h4>
                                    {utils.valueToCurrency(dataSheet?.totalAccountsReceivable)}
                                </div>
                                {<>
                                    {dataSheet?.accountsReceivable.map((account: AccountType) => (
                                        <AccountListItem
                                            refreshData={() => getDataSheet()}
                                            key={account.id}
                                            account={account}
                                            route={'/accounts-receivable'}
                                        />
                                    ))}
                                    <InputNew
                                        sheetId={dataSheet?.id || -1}
                                        route={'/accounts-receivable'}
                                        refreshData={() => getDataSheet()}
                                        validation={(value, type) => descriptionAlreadyExists(value, type)}
                                    />
                                </>}
                            </div>
                            <div className={styles.section}>
                                <div className={styles.titleSection}>
                                    <h4>Saídas</h4>
                                    {utils.valueToCurrency(dataSheet?.totalAccountsPayable)}
                                </div>
                                {<>
                                    {dataSheet?.accountsPayable.map((account: AccountType) => (
                                        <AccountListItem
                                            refreshData={() => getDataSheet()}
                                            key={account.id}
                                            account={account}
                                            route={'/accounts-payable'}
                                        />
                                    ))}
                                    <InputNew
                                        sheetId={dataSheet?.id || -1}
                                        route={'/accounts-payable'}
                                        refreshData={() => getDataSheet()}
                                        validation={(value, type) => descriptionAlreadyExists(value, type)}
                                    />
                                </>}
                            </div>
                            <Button
                                width='100%'
                                maxWidth='500px'
                                minWidth='300px'
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
