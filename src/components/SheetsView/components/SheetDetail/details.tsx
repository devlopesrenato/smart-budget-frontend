'use client'
import { Button } from '@/components/Button';
import { DropdownMenu } from '@/components/DropdownMenu';
import SuccessError from '@/components/SuccessError';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { Utils } from '@/utils/utils';
import { LoadingOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { BsArrowDownUp } from 'react-icons/bs';
import { AccountListItem } from './components/AccountsList';
import { InputNew } from './components/InputNew';
import styles from './detail.module.css';

type Params = {
    params: {
        id: number
    }
}

type OrderType = {
    accountsPayable: {
        field: keyof AccountType,
        order: 'asc' | 'desc'
    },
    accountsReceivable: {
        field: keyof AccountType,
        order: 'asc' | 'desc'
    }
}

export default function Details({ params: { id } }: Params) {
    const [load, setLoad] = useState(true)
    const [dataSheet, setDataSheet] = useState<SheetDetail | null>(null)
    const [dataPayable, setDataPayable] = useState<AccountType[]>([])
    const [dataReceivable, setDataReceivable] = useState<AccountType[]>([])
    const [errorMessage, setErrorMessage] = useState('')
    const [error, setError] = useState(false)
    const [orders, setOrders] = useState<OrderType>({
        accountsPayable: {
            field: 'value',
            order: 'desc'
        },
        accountsReceivable: {
            field: 'value',
            order: 'desc'
        }
    })
    const { user, loading, setPage, setIdSheetDetail } = useContext(AppContext);

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

    function ordination(
        field: keyof AccountType,
        order: 'asc' | 'desc',
        a: AccountType,
        b: AccountType
    ) {
        if (order == 'asc') {
            if (typeof a[field] === 'number') {
                return Number(a[field]) - Number(b[field])
            } else {
                return String(a[field]).localeCompare(String(b[field]))
            }
        }
        if (typeof a[field] === 'number') {
            return Number(b[field]) - Number(a[field])
        } else {
            return String(b[field]).localeCompare(String(a[field]))
        }
    }

    useEffect(() => {
        if (dataSheet) {
            const field = orders.accountsPayable.field;
            const order = orders.accountsPayable.order;

            const dataSortedPayable = dataSheet.accountsPayable
            setDataPayable(dataSortedPayable.sort((a, b) =>
                ordination(field, order, a, b)
            ))

            const fieldRec = orders.accountsPayable.field;
            const orderRec = orders.accountsPayable.order;

            const dataSortedReceivable = dataSheet.accountsReceivable
            setDataReceivable(dataSortedReceivable.sort((a, b) =>
                ordination(fieldRec, orderRec, a, b)
            ))
        }
    }, [dataSheet])

    useEffect(() => {
        if (user) {
            getDataSheet()
        }
    }, [user, loading])

    useEffect(() => {
        const ordinations = utils.getCookie('orders')
        if (ordinations) {
            setOrders(JSON.parse(ordinations))
        }
    }, [])

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

    const itemsPay = [
        {
            label: 'Data - Crescente',
            key: 'minor_date',
            icon: <SortAscendingOutlined style={{ fontSize: 18 }} />,
            action: () => {
                const sortedData = [...dataPayable];
                setDataPayable(sortedData.sort((a, b) =>
                    ordination('createdAt', 'asc', a, b)
                ))
                utils.setCookie('orders', JSON.stringify({
                    ...orders,
                    accountsPayable: {
                        field: 'createdAt',
                        order: 'asc'
                    }
                }))
                setOrders((prev) => ({
                    ...prev,
                    accountsPayable: {
                        field: 'createdAt',
                        order: 'asc'
                    }
                }))
            }
        },
        {
            label: 'Data - Decrescente',
            key: 'older_date',
            icon: <SortDescendingOutlined style={{ fontSize: 18 }} />,
            action: () => {
                const sortedData = [...dataPayable];
                setDataPayable(sortedData.sort((a, b) =>
                    ordination('createdAt', 'desc', a, b)
                ))
                utils.setCookie('orders', JSON.stringify({
                    ...orders,
                    accountsPayable: {
                        field: 'createdAt',
                        order: 'desc'
                    }
                }))
                setOrders((prev) => ({
                    ...prev,
                    accountsPayable: {
                        field: 'createdAt',
                        order: 'desc'
                    }
                }))
            }
        },
        {
            label: 'Valor - Crescente',
            key: 'minor_value',
            icon: <SortAscendingOutlined style={{ fontSize: 18 }} />,
            action: () => {
                const sortedData = [...dataPayable];
                setDataPayable(sortedData.sort((a, b) =>
                    ordination('value', 'asc', a, b)
                ))
                utils.setCookie('orders', JSON.stringify({
                    ...orders,
                    accountsPayable: {
                        field: 'value',
                        order: 'asc'
                    }
                }))
                setOrders((prev) => ({
                    ...prev,
                    accountsPayable: {
                        field: 'value',
                        order: 'asc'
                    }
                }))
            }
        },
        {
            label: 'Valor - Decrescente',
            key: 'older_value',
            icon: <SortDescendingOutlined style={{ fontSize: 18 }} />,
            action: () => {
                const sortedData = [...dataPayable];
                setDataPayable(sortedData.sort((a, b) =>
                    ordination('value', 'desc', a, b)
                ))
                utils.setCookie('orders', JSON.stringify({
                    ...orders,
                    accountsPayable: {
                        field: 'value',
                        order: 'desc'
                    }
                }))
                setOrders((prev) => ({
                    ...prev,
                    accountsPayable: {
                        field: 'value',
                        order: 'desc'
                    }
                }))
            }
        }
    ]

    const itemsRec = [
        {
            label: 'Data - Crescente',
            key: 'minor_date',
            icon: <SortAscendingOutlined style={{ fontSize: 18 }} />,
            action: () => {
                const sortedData = [...dataReceivable];
                setDataReceivable(sortedData.sort((a, b) =>
                    ordination('createdAt', 'asc', a, b)
                ))
                utils.setCookie('orders', JSON.stringify({
                    ...orders,
                    accountsPayable: {
                        field: 'createdAt',
                        order: 'asc'
                    }
                }))
                setOrders((prev) => ({
                    ...prev,
                    accountsReceivable: {
                        field: 'createdAt',
                        order: 'asc'
                    }
                }))
            }
        },
        {
            label: 'Data - Decrescente',
            key: 'older_date',
            icon: <SortDescendingOutlined style={{ fontSize: 18 }} />,
            action: () => {
                const sortedData = [...dataReceivable];
                setDataReceivable(sortedData.sort((a, b) =>
                    ordination('createdAt', 'desc', a, b)
                ))
                utils.setCookie('orders', JSON.stringify({
                    ...orders,
                    accountsPayable: {
                        field: 'createdAt',
                        order: 'desc'
                    }
                }))
                setOrders((prev) => ({
                    ...prev,
                    accountsReceivable: {
                        field: 'createdAt',
                        order: 'desc'
                    }
                }))

            }
        },
        {
            label: 'Valor - Crescente',
            key: 'minor_value',
            icon: <SortAscendingOutlined style={{ fontSize: 18 }} />,
            action: () => {
                const sortedData = [...dataReceivable];
                setDataReceivable(sortedData.sort((a, b) =>
                    ordination('value', 'asc', a, b)
                ))
                utils.setCookie('orders', JSON.stringify({
                    ...orders,
                    accountsPayable: {
                        field: 'value',
                        order: 'asc'
                    }
                }))
                setOrders((prev) => ({
                    ...prev,
                    accountsReceivable: {
                        field: 'value',
                        order: 'asc'
                    }
                }))
            }
        },
        {
            label: 'Valor - Decrescente',
            key: 'older_value',
            icon: <SortDescendingOutlined style={{ fontSize: 18 }} />,
            action: () => {
                const sortedData = [...dataReceivable];
                setDataReceivable(sortedData.sort((a, b) =>
                    ordination('value', 'desc', a, b)
                ))
                utils.setCookie('orders', JSON.stringify({
                    ...orders,
                    accountsPayable: {
                        field: 'value',
                        order: 'desc'
                    }
                }))
                setOrders((prev) => ({
                    ...prev,
                    accountsReceivable: {
                        field: 'value',
                        order: 'desc'
                    }
                }))
            }
        }
    ]

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
                                    <div className={styles.titleSubSectionRight}>
                                        {utils.valueToCurrency(dataSheet?.totalAccountsReceivable)}
                                        <DropdownMenu items={itemsRec}>
                                            <BsArrowDownUp className={styles.iconMore} />
                                        </DropdownMenu>
                                    </div>
                                </div>
                                {<>
                                    <InputNew
                                        sheetId={dataSheet?.id || -1}
                                        route={'/accounts-receivable'}
                                        refreshData={() => getDataSheet()}
                                        validation={(value, type) => descriptionAlreadyExists(value, type)}
                                    />
                                    {dataReceivable.map((account: AccountType) => (
                                        <AccountListItem
                                            refreshData={() => getDataSheet()}
                                            key={account.id}
                                            account={account}
                                            route={'/accounts-receivable'}
                                        />
                                    ))}
                                </>}
                            </div>
                            <div className={styles.section}>
                                <div className={styles.titleSection}>
                                    <h4>Saídas</h4>
                                    <div className={styles.titleSubSectionRight}>
                                        {utils.valueToCurrency(dataSheet?.totalAccountsPayable)}
                                        <DropdownMenu items={itemsPay}>
                                            <BsArrowDownUp className={styles.iconMore} />
                                        </DropdownMenu>
                                    </div>
                                </div>
                                {<>
                                    <InputNew
                                        sheetId={dataSheet?.id || -1}
                                        route={'/accounts-payable'}
                                        refreshData={() => getDataSheet()}
                                        validation={(value, type) => descriptionAlreadyExists(value, type)}
                                    />
                                    {dataPayable.map((account: AccountType) => (
                                        <AccountListItem
                                            refreshData={() => getDataSheet()}
                                            key={account.id}
                                            account={account}
                                            route={'/accounts-payable'}
                                        />
                                    ))}
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
